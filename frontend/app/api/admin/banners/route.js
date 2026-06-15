import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db/mongodb'
import Banner from '@/lib/db/models/Banner'
import { verifyAdminRequest } from '@/lib/utils/adminAuth'

export async function GET(request) {
  try {
    await connectDB()
    const adminUser = verifyAdminRequest(request)
    
    if (!adminUser || adminUser.role !== 'admin') {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    }

    const banners = await Banner.find({})
      .populate('vendorId', 'name email phone')
      .sort('-createdAt')

    return NextResponse.json({ success: true, banners })
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}
