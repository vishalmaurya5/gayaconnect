import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db/mongodb'
import { verifyAdminRequest } from '@/lib/utils/adminAuth'
import Offer from '@/lib/db/models/Offer'
import AuditLog from '@/lib/db/models/AuditLog'

export async function PATCH(request, { params }) {
  try {
    await connectDB()
    const adminUser = verifyAdminRequest(request)
    if (!adminUser) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    }

    const updates = await request.json()
    const offer = await Offer.findByIdAndUpdate(params.id, updates, { new: true })
    if (!offer) return NextResponse.json({ success: false, message: 'Offer not found' }, { status: 404 })

    await AuditLog.create({
      adminId: adminUser._id || 'admin',
      action: 'UPDATE_OFFER',
      resource: 'Offer',
      resourceId: offer._id,
      details: { updates }
    })

    return NextResponse.json({ success: true, offer })
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB()
    const adminUser = verifyAdminRequest(request)
    if (!adminUser) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    }

    const offer = await Offer.findByIdAndDelete(params.id)
    if (!offer) return NextResponse.json({ success: false, message: 'Offer not found' }, { status: 404 })

    await AuditLog.create({
      adminId: adminUser._id || 'admin',
      action: 'DELETE_OFFER',
      resource: 'Offer',
      resourceId: params.id,
      details: { title: offer.title }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}
