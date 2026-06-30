import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db/mongodb'
import Vendor from '@/lib/db/models/Vendor'
import { getAuthenticatedUser } from '@/lib/security/auth'

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const vendor = await Vendor.findById(id).populate('userId', 'name email phone')
    if (!vendor) {
      return NextResponse.json({ success: false, message: 'Vendor not found' }, { status: 404 })
    }

    // Increment views
    vendor.views += 1
    await vendor.save()

    return NextResponse.json({ success: true, vendor })
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}

export async function PUT(request, { params }) {
  try {
    await connectDB()
    const user = await getAuthenticatedUser(request)
    if (!user) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })

    const { id } = await params;
    const vendor = await Vendor.findById(id)
    if (!vendor) return NextResponse.json({ success: false, message: 'Vendor not found' }, { status: 404 })

    if (user.role !== 'admin' && String(vendor.userId) !== String(user._id)) {
      return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 })
    }

    const updates = await request.json()
    const updatedVendor = await Vendor.findByIdAndUpdate(id, updates, { new: true })

    return NextResponse.json({ success: true, vendor: updatedVendor, message: 'Vendor updated successfully' })
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB()
    const user = await getAuthenticatedUser(request)
    if (!user || user.role !== 'admin') return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })

    const { id } = await params;
    await Vendor.findByIdAndDelete(id)
    return NextResponse.json({ success: true, message: 'Vendor deleted successfully' })
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}
