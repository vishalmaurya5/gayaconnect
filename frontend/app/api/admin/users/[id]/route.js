import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db/mongodb'
import { verifyAdminRequest } from '@/lib/utils/adminAuth'
import User from '@/lib/db/models/User'
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
    const user = await User.findById(params.id)
    if (!user) return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 })

    if (updates.extendSubscriptionDays) {
      const days = parseInt(updates.extendSubscriptionDays, 10)
      const currentExpiry = user.subscriptionExpiry && new Date(user.subscriptionExpiry) > new Date() 
        ? new Date(user.subscriptionExpiry) 
        : new Date()
      
      user.subscriptionActive = true
      user.subscriptionExpiry = new Date(currentExpiry.getTime() + days * 24 * 60 * 60 * 1000)
      user.subscriptionPlan = 'monthly'
      
      await AuditLog.create({
        adminId: adminUser._id || 'admin',
        action: 'EXTEND_SUBSCRIPTION',
        resource: 'User',
        resourceId: user._id,
        details: { days }
      })
    } else {
      if (updates.name) user.name = updates.name
      if (updates.email) user.email = updates.email
      if (updates.phone) user.phone = updates.phone
      if (updates.isDeleted !== undefined) user.isDeleted = updates.isDeleted
      
      await AuditLog.create({
        adminId: adminUser._id || 'admin',
        action: 'UPDATE_USER',
        resource: 'User',
        resourceId: user._id,
        details: { updates }
      })
    }

    await user.save()
    return NextResponse.json({ success: true, user })
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}

export async function DELETE(request, props) {
  try {
    const params = await props.params;
    await connectDB()
    const adminUser = verifyAdminRequest(request)
    if (!adminUser) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    }

    const user = await User.findByIdAndDelete(params.id)
    if (!user) return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 })

    await AuditLog.create({
      adminId: adminUser._id || 'admin',
      action: 'DELETE_USER',
      resource: 'User',
      resourceId: params.id,
      details: { email: user.email }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}
