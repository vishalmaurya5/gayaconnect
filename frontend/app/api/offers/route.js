import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db/mongodb'
import Offer from '@/lib/db/models/Offer'
import Vendor from '@/lib/db/models/Vendor'
import Payment from '@/lib/db/models/Payment'
import { getAuthenticatedUser } from '@/lib/security/auth'

const OFFER_PLAN_DAYS = { '7days': 7, '30days': 30, '365days': 365 }

function paymentExpiry(payment) {
  if (!payment) return null
  const storedExpiry = payment.expiresAt && new Date(payment.expiresAt)
  if (storedExpiry && !Number.isNaN(storedExpiry.getTime())) return storedExpiry

  const duration = payment.plan || payment.metadata?.duration || payment.meta?.duration
  let days = OFFER_PLAN_DAYS[duration]
  if (!days) days = ({ 39: 7, 199: 30, 399: 365 })[Number(payment.amount)]
  if (!days || !payment.createdAt) return null

  const derivedExpiry = new Date(payment.createdAt)
  derivedExpiry.setDate(derivedExpiry.getDate() + days)
  return derivedExpiry
}

async function resolveVendor(id) {
  if (!id) return null
  return Vendor.findOne({ $or: [{ _id: id }, { userId: id }] })
}

export async function GET(request) {
  try {
    await connectDB()
    const { searchParams } = new URL(request.url)
    const vendorId = searchParams.get('vendorId')
    const includeAll = searchParams.get('all') === 'true'
    const search = searchParams.get('search')
    const category = searchParams.get('category')
    const sort = searchParams.get('sort') || 'newest'

    const query = includeAll
      ? {}
      : {
          isActive: true,
          $or: [
            { validUntil: { $gt: new Date() } },
            { expiresAt: { $gt: new Date() } },
            { validUntil: { $exists: false }, expiresAt: { $exists: false } },
          ],
        }

    if (category && category !== 'all') {
      query.category = category
    }

    if (search) {
      query.$or = [
        ...(query.$or || []),
      ]
      
      const searchConditions = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { discountText: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } }
      ]

      if (query.$or && query.$or.length > 0 && !includeAll) {
        // If we already have the validUntil $or condition, we need an $and
        query.$and = [{ $or: query.$or }, { $or: searchConditions }]
        delete query.$or
      } else {
        query.$or = searchConditions
      }
    }

    if (vendorId) {
      const vendor = await resolveVendor(vendorId)
      query.vendorId = { $in: [vendorId, vendor?._id].filter(Boolean) }
    }

    let sortOptions = { createdAt: -1 }
    switch (sort) {
      case 'oldest':
        sortOptions = { createdAt: 1 }
        break;
      case 'newest':
      default:
        sortOptions = { createdAt: -1 }
        break;
    }

    const offers = await Offer.find(query).sort(sortOptions).lean()
    const ownerIds = offers.map((offer) => offer.vendorId).filter(Boolean)
    const vendors = await Vendor.find({
      $or: [{ _id: { $in: ownerIds } }, { userId: { $in: ownerIds } }],
    })
      .populate('userId', 'phone')
      .lean()

    const vendorById = new Map()
    for (const vendor of vendors) {
      vendorById.set(String(vendor._id), vendor)
      vendorById.set(String(vendor.userId?._id || vendor.userId), vendor)
    }

    const offerIds = offers.map((offer) => offer._id)
    const paymentIds = offers.map((offer) => offer.paymentId).filter(Boolean)
    const paymentOwnerIds = [
      ...ownerIds,
      ...vendors.map((vendor) => vendor.userId?._id || vendor.userId).filter(Boolean),
    ]
    const payments = await Payment.find({
      purpose: 'offer_post',
      status: 'success',
      $or: [
        { userId: { $in: paymentOwnerIds } },
        { paymentId: { $in: paymentIds } },
        { 'metadata.offerId': { $in: offerIds } },
        { 'meta.offerId': { $in: offerIds } },
      ],
    }).sort('-createdAt').lean()

    const paymentById = new Map(payments.map((payment) => [String(payment.paymentId), payment]))
    const paymentByOffer = new Map()
    for (const payment of payments) {
      const linkedOfferId = payment.metadata?.offerId || payment.meta?.offerId
      if (linkedOfferId) paymentByOffer.set(String(linkedOfferId), payment)
    }

    const hydratedOffers = offers.map((offer) => {
      const vendor = vendorById.get(String(offer.vendorId)) || null
      const vendorUserId = String(vendor?.userId?._id || vendor?.userId || offer.vendorId)
      const matchingPayment = paymentByOffer.get(String(offer._id))
        || paymentById.get(String(offer.paymentId))
        || payments
          .filter((payment) => String(payment.userId) === vendorUserId)
          .sort((a, b) => Math.abs(new Date(a.createdAt) - new Date(offer.createdAt)) - Math.abs(new Date(b.createdAt) - new Date(offer.createdAt)))[0]
      const validUntil = offer.validUntil || offer.expiresAt || paymentExpiry(matchingPayment)

      return {
        ...offer,
        validUntil,
        validitySource: offer.validUntil || offer.expiresAt ? 'offer' : matchingPayment ? 'payment' : null,
        vendorId: vendor,
      }
    })

    const visibleOffers = includeAll
      ? hydratedOffers
      : hydratedOffers.filter((offer) => !offer.validUntil || new Date(offer.validUntil) > new Date())

    return NextResponse.json({ success: true, offers: visibleOffers })
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    await connectDB()
    const body = await request.json()
    const user = await getAuthenticatedUser(request)
    if (!user || !['vendor', 'admin'].includes(user.role)) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    }

    const vendor = user.role === 'vendor'
      ? await Vendor.findOne({ userId: user._id })
      : await resolveVendor(body.vendorId)
    if (!vendor) {
      return NextResponse.json({ success: false, message: 'Vendor profile not found' }, { status: 404 })
    }

    const offer = new Offer({
      vendorId: vendor._id,
      title: body.title,
      description: body.description,
      discountText: body.discountText || body.discount,
      category: body.category || vendor.category,
      terms: body.terms,
      validUntil: body.validUntil || body.expiresAt,
      isActive: true
    })
    
    await offer.save()
    return NextResponse.json({ success: true, offer })
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}
