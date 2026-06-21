import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db/mongodb'
import User from '@/lib/db/models/User'
import Vendor from '@/lib/db/models/Vendor'
import Offer from '@/lib/db/models/Offer'
import Banner from '@/lib/db/models/Banner'
import Payment from '@/lib/db/models/Payment'
import Blog from '@/lib/db/models/Blog'
import Labourer from '@/lib/db/models/Labourer'
import AuditLog from '@/lib/db/models/AuditLog'
import { verifyAdminRequest } from '@/lib/utils/adminAuth'
import { VENDOR_BANNER_POST_LIMIT } from '@/lib/utils/contactAccess'
import { validateImageDataUrl } from '@/lib/utils/imageUpload'

export const dynamic = 'force-dynamic'

const models = {
  users: User,
  vendors: Vendor,
  offers: Offer,
  banners: Banner,
  payments: Payment,
  blogs: Blog,
  labourers: Labourer,
}

function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function cleanPayload(resource, payload) {
  const next = { ...payload }
  delete next._id
  delete next.__v
  delete next.password

  if (resource === 'blogs') {
    next.slug = slugify(next.slug || next.title)
    if (!next.slug) next.slug = `blog-${Date.now()}`
  }

  if (resource === 'banners') {
    if (!next.vendorId) delete next.vendorId
    if (next.endDate) next.endDate = new Date(next.endDate)
    if (next.startDate) next.startDate = new Date(next.startDate)
    if (String(next.imageUrl || '').startsWith('data:image/')) {
      next.imageUrl = validateImageDataUrl(next.imageUrl, 'Banner image')
    }
  }

  if (resource === 'offers' && next.validUntil) {
    next.validUntil = new Date(next.validUntil)
  }

  return next
}

function adminAction(method, resource, payload = {}) {
  if (method === 'PATCH' && resource === 'vendors' && payload.isApproved === true) return 'approve_vendor'
  if (method === 'DELETE' && resource === 'banners') return 'delete_banner'
  return `${method.toLowerCase()}_${resource}`
}

export async function POST(request) {
  const admin = verifyAdminRequest(request)
  if (!admin) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
  }

  try {
    await connectDB()
    const { resource, payload = {} } = await request.json()
    const Model = models[resource]
    if (!Model) return NextResponse.json({ success: false, message: 'Unknown resource' }, { status: 400 })

    if (resource === 'banners' && payload.vendorId) {
      const activeBannerCount = await Banner.countDocuments({
        vendorId: payload.vendorId,
        isActive: true,
        endDate: { $gt: new Date() },
      })

      if (activeBannerCount >= VENDOR_BANNER_POST_LIMIT) {
        return NextResponse.json(
          { success: false, message: `A vendor can post only ${VENDOR_BANNER_POST_LIMIT} active banners at a time.` },
          { status: 403 }
        )
      }
    }

    const doc = await Model.create(cleanPayload(resource, payload))
    await AuditLog.create({ adminId: admin.sub, action: adminAction('POST', resource, payload), targetType: resource, targetId: String(doc._id) })
    return NextResponse.json({ success: true, item: doc, message: 'Created successfully' }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 })
  }
}

export async function PATCH(request) {
  const admin = verifyAdminRequest(request)
  if (!admin) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
  }

  try {
    await connectDB()
    const { resource, id, payload = {} } = await request.json()
    const Model = models[resource]
    if (!Model || !id) return NextResponse.json({ success: false, message: 'Invalid update request' }, { status: 400 })

    const item = await Model.findByIdAndUpdate(id, cleanPayload(resource, payload), { new: true, runValidators: true })
    if (!item) return NextResponse.json({ success: false, message: 'Item not found' }, { status: 404 })

    await AuditLog.create({ adminId: admin.sub, action: adminAction('PATCH', resource, payload), targetType: resource, targetId: String(id) })
    return NextResponse.json({ success: true, item, message: 'Updated successfully' })
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 })
  }
}

export async function DELETE(request) {
  const admin = verifyAdminRequest(request)
  if (!admin) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
  }

  try {
    await connectDB()
    const { searchParams } = new URL(request.url)
    const resource = searchParams.get('resource')
    const id = searchParams.get('id')
    const Model = models[resource]
    if (!Model || !id) return NextResponse.json({ success: false, message: 'Invalid delete request' }, { status: 400 })

    const item = await Model.findByIdAndDelete(id)
    if (!item) return NextResponse.json({ success: false, message: 'Item not found' }, { status: 404 })

    if (resource === 'users') {
      await Vendor.deleteOne({ userId: id });
    }

    await AuditLog.create({ adminId: admin.sub, action: adminAction('DELETE', resource), targetType: resource, targetId: String(id) })
    return NextResponse.json({ success: true, message: 'Deleted successfully' })
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 })
  }
}
