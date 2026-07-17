import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db/mongodb'
import Banner from '@/lib/db/models/Banner'
import Vendor from '@/lib/db/models/Vendor' // Required for populate

export async function GET(request) {
  try {
    await connectDB()
    const { searchParams } = new URL(request.url)
    const position = searchParams.get('position')

    const query = { isActive: true, adminApproved: true, endDate: { $gte: new Date() } }
    if (position) query.position = position

    const banners = await Banner.find(query)
      .populate('vendorId', 'name')
      .sort('-createdAt')
    return NextResponse.json({ success: true, banners })
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    await connectDB()
    const body = await request.json()
    const bannerData = { ...body }
    if (!bannerData.endDate) {
      bannerData.endDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 1 week default
    }
    const banner = new Banner(bannerData)
    await banner.save()

    return NextResponse.json({ success: true, banner })
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}
