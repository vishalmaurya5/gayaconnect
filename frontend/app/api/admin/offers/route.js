import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db/mongodb'
import { verifyAdminRequest } from '@/lib/utils/adminAuth'
import Offer from '@/lib/db/models/Offer'
import AuditLog from '@/lib/db/models/AuditLog'

export async function GET(request) {
  try {
    await connectDB()
    const adminUser = verifyAdminRequest(request)
    if (!adminUser) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    let query = {}

    if (search) {
      const searchRegex = { $regex: search, $options: 'i' }
      query.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { discountText: searchRegex }
      ]
    }

    const offers = await Offer.find(query).populate('vendorId', 'name category').sort('-createdAt')
    return NextResponse.json({ success: true, offers })
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    await connectDB()
    const adminUser = verifyAdminRequest(request)
    if (!adminUser) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { vendorId, title, description, discountText, validUntil } = body

    if (!vendorId || !title) {
      return NextResponse.json({ success: false, message: 'Vendor and Title are required' }, { status: 400 })
    }

    const offer = new Offer({
      vendorId,
      title,
      description,
      discountText,
      validUntil: validUntil ? new Date(validUntil) : undefined,
      isActive: true
    })
    
    await offer.save()
    
    await AuditLog.create({
      adminId: adminUser._id || 'admin',
      action: 'CREATE_OFFER',
      resource: 'Offer',
      details: { offerId: offer._id, title }
    })

    return NextResponse.json({ success: true, offer })
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}

export async function DELETE(request) {
  try {
    await connectDB()
    const adminUser = verifyAdminRequest(request)
    if (!adminUser) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')

    if (action === 'delete-expired') {
      const result = await Offer.deleteMany({ expiresAt: { $lt: new Date() } })
      
      await AuditLog.create({
        adminId: adminUser._id || 'admin',
        action: 'DELETE_EXPIRED_OFFERS',
        resource: 'Offer',
        details: { count: result.deletedCount }
      })

      return NextResponse.json({ success: true, count: result.deletedCount })
    }

    return NextResponse.json({ success: false, message: 'Invalid action' }, { status: 400 })
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}
