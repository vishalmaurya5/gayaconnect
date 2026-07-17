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

export async function POST(request) {
  try {
    await connectDB()
    const adminUser = verifyAdminRequest(request)
    
    if (!adminUser || adminUser.role !== 'admin') {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { title, imageUrl, link, position, endDate } = body

    if (!title || !imageUrl) {
      return NextResponse.json({ success: false, message: 'Title and Image are required' }, { status: 400 })
    }

    const banner = await Banner.create({
      title,
      imageUrl,
      link,
      position,
      endDate: endDate ? new Date(endDate) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Default 7 days
      adminApproved: true,
      isActive: true
    })

    return NextResponse.json({ success: true, banner })
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}
