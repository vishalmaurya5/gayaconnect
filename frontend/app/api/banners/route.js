import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db/mongodb'
import Banner from '@/lib/db/models/Banner'

export async function GET(request) {
  try {
    await connectDB()
    const { searchParams } = new URL(request.url)
    const position = searchParams.get('position')

    const query = { isActive: true, adminApproved: true }
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
    // Need auth for real usage
    const banner = new Banner(body)
    await banner.save()

    return NextResponse.json({ success: true, banner })
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}
