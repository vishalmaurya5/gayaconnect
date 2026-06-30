import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db/mongodb'
import PopupAd from '@/lib/db/models/PopupAd'
import { verifyAdminRequest } from '@/lib/utils/adminAuth'

export async function PATCH(request, { params }) {
  try {
    await connectDB()
    const adminUser = verifyAdminRequest(request)
    
    if (!adminUser || adminUser.role !== 'admin') {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    }

    const { isActive } = await request.json()
    
    const { id } = await params;
    const popup = await PopupAd.findById(id)
    if (!popup) {
      return NextResponse.json({ success: false, message: 'Popup not found' }, { status: 404 })
    }

    if (isActive !== undefined) popup.isActive = isActive
    await popup.save()

    return NextResponse.json({ success: true, popup })
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB()
    const adminUser = verifyAdminRequest(request)
    
    if (!adminUser || adminUser.role !== 'admin') {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params;
    const popup = await PopupAd.findByIdAndDelete(id)
    if (!popup) {
      return NextResponse.json({ success: false, message: 'Popup not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: 'Popup deleted' })
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}
