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
    const vendor = await Vendor.findById(id)
    if (!vendor) return NextResponse.json({ success: false, message: 'Vendor not found' }, { status: 404 })

    // If there are user updates and the vendor is linked to a user
    if (vendor.userId && (updates.name || updates.email || updates.phone)) {
      const User = (await import('@/lib/db/models/User')).default
      const userUpdates = {}
      // In the edit form, 'name' is Owner Name
      if (updates.name) userUpdates.name = updates.name
      if (updates.email) userUpdates.email = updates.email
      if (updates.phone) userUpdates.phone = updates.phone
      
      await User.findByIdAndUpdate(vendor.userId, userUpdates)
    }

    // Vendor updates
    const vendorUpdates = { ...updates }
    // Clean up non-vendor fields before updating vendor
    delete vendorUpdates.phone
    
    // In edit form, businessName is the actual vendor name
    if (vendorUpdates.businessName) {
      vendorUpdates.name = vendorUpdates.businessName
      delete vendorUpdates.businessName
    } else if (updates.name && !vendorUpdates.name) {
      // If businessName was empty but they passed name, keep it
      // though typically they shouldn't conflict.
    } else if (updates.name && updates.businessName) {
        vendorUpdates.name = updates.businessName
    }

    const updatedVendor = await Vendor.findByIdAndUpdate(id, vendorUpdates, { new: true }).populate('userId', 'email phone name')

    await AuditLog.create({
      adminId: adminUser._id || 'admin',
      action: 'UPDATE_VENDOR',
      resource: 'Vendor',
      resourceId: updatedVendor._id,
      details: { updates }
    })

    return NextResponse.json({ success: true, vendor: updatedVendor })
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

export async function GET(request, { params }) {
  try {
    await connectDB()
    const adminUser = verifyAdminRequest(request)
    if (!adminUser) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params;
    const vendor = await Vendor.findById(id).populate('userId', 'name email phone')
    if (!vendor) return NextResponse.json({ success: false, message: 'Vendor not found' }, { status: 404 })

    return NextResponse.json({ success: true, vendor })
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}
