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

    const offers = await Offer.find().populate('vendorId', 'name category').sort('-createdAt')
    return NextResponse.json({ success: true, offers })
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
