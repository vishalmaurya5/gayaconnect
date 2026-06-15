import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db/mongodb'
import Vendor from '@/lib/db/models/Vendor'

export async function GET(request) {
  try {
    await connectDB()
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')

    const query = { isApproved: true }
    if (category) query.category = category
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ]
    }

    const vendors = await Vendor.find(query)
      .populate('userId', 'name email phone')
      .sort('-createdAt')

    return NextResponse.json({ success: true, vendors })
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    await connectDB()
    const body = await request.json()
    // Need auth for real usage, assuming client provides userId
    const vendor = new Vendor({
      ...body,
      isApproved: false,
    })
    await vendor.save()

    return NextResponse.json({ success: true, vendor })
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}
