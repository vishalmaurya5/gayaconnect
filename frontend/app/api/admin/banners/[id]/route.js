import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db/mongodb'
import Banner from '@/lib/db/models/Banner'
import { verifyAdminRequest } from '@/lib/utils/adminAuth'

export async function PATCH(request, { params }) {
  try {
    await connectDB()
    const adminUser = verifyAdminRequest(request)
    
    if (!adminUser || adminUser.role !== 'admin') {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    }

    const { isActive, adminApproved } = await request.json()
    
    const banner = await Banner.findById(params.id)
    if (!banner) {
      return NextResponse.json({ success: false, message: 'Banner not found' }, { status: 404 })
    }

    if (isActive !== undefined) banner.isActive = isActive
    if (adminApproved !== undefined) banner.adminApproved = adminApproved

    await banner.save()

    return NextResponse.json({ success: true, banner })
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}
