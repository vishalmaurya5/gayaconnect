import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db/mongodb'
import { verifyAdminRequest } from '@/lib/utils/adminAuth'
import Vendor from '@/lib/db/models/Vendor'
import AuditLog from '@/lib/db/models/AuditLog'

export async function PATCH(request, { params }) {
  try {
    await connectDB()
    const adminUser = verifyAdminRequest(request)
    if (!adminUser) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    }

    const updates = await request.json()
    const { id } = await params;
    const vendor = await Vendor.findByIdAndUpdate(id, updates, { new: true })
    if (!vendor) return NextResponse.json({ success: false, message: 'Vendor not found' }, { status: 404 })

    await AuditLog.create({
      adminId: adminUser._id || 'admin',
      action: 'UPDATE_VENDOR',
      resource: 'Vendor',
      resourceId: vendor._id,
      details: { updates }
    })

    return NextResponse.json({ success: true, vendor })
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB()
    const adminUser = verifyAdminRequest(request)
    if (!adminUser || adminUser.adminRole !== 'SUPER_ADMIN') {
      return NextResponse.json({ success: false, message: 'Super Admin access required to delete records' }, { status: 401 })
    }

    const { id } = await params;
    const vendor = await Vendor.findByIdAndDelete(id)
    if (!vendor) return NextResponse.json({ success: false, message: 'Vendor not found' }, { status: 404 })

    await AuditLog.create({
      adminId: adminUser._id || 'admin',
      action: 'DELETE_VENDOR',
      resource: 'Vendor',
      resourceId: id,
      details: { businessName: vendor.name }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}
