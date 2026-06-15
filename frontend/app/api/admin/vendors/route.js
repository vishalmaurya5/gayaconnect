import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db/mongodb'
import { verifyAdminRequest } from '@/lib/utils/adminAuth'
import Vendor from '@/lib/db/models/Vendor'
import User from '@/lib/db/models/User'
import AuditLog from '@/lib/db/models/AuditLog'

export async function GET(request) {
  try {
    await connectDB()
    const adminUser = verifyAdminRequest(request)
    if (!adminUser) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    }

    const vendors = await Vendor.find().populate('userId', 'email phone name').sort('-createdAt')
    return NextResponse.json({ success: true, vendors })
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
    const user = new User({
      name: body.name,
      email: body.email,
      phone: body.phone,
      role: 'vendor',
      password: body.password || 'GayaConnect@123'
    })
    await user.save()

    const vendor = new Vendor({
      userId: user._id,
      name: body.businessName || body.name,
      category: body.category,
      address: body.address,
      description: body.description,
      isApproved: true,
      isActive: true
    })
    await vendor.save()

    await AuditLog.create({
      adminId: adminUser._id || 'admin',
      action: 'CREATE_VENDOR',
      resource: 'Vendor',
      resourceId: vendor._id,
      details: { businessName: vendor.name }
    })

    return NextResponse.json({ success: true, vendor })
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}
