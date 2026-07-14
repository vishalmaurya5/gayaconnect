import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db/mongodb'
import { verifyAdminRequest } from '@/lib/utils/adminAuth'
import Labourer from '@/lib/db/models/Labourer'
import AuditLog from '@/lib/db/models/AuditLog'

export async function PATCH(request, props) {
  try {
    const params = await props.params;
    await connectDB()
    const adminUser = verifyAdminRequest(request)
    if (!adminUser) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    }

    const updates = await request.json()
    const labour = await Labourer.findByIdAndUpdate(params.id, updates, { new: true })
    if (!labour) return NextResponse.json({ success: false, message: 'Labour not found' }, { status: 404 })

    await AuditLog.create({
      adminId: adminUser._id || 'admin',
      action: 'UPDATE_LABOUR',
      resource: 'Labour',
      resourceId: labour._id,
      details: { updates }
    })

    return NextResponse.json({ success: true, labour })
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}

export async function DELETE(request, props) {
  try {
    const params = await props.params;
    await connectDB()
    const adminUser = verifyAdminRequest(request)
    if (!adminUser || adminUser.adminRole !== 'SUPER_ADMIN') {
      return NextResponse.json({ success: false, message: 'Super Admin access required to delete records' }, { status: 401 })
    }

    const labour = await Labourer.findByIdAndDelete(params.id)
    if (!labour) return NextResponse.json({ success: false, message: 'Labour not found' }, { status: 404 })

    await AuditLog.create({
      adminId: adminUser._id || 'admin',
      action: 'DELETE_LABOUR',
      resource: 'Labour',
      resourceId: params.id,
      details: { name: labour.name }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}
