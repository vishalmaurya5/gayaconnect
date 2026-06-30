import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db/mongodb'
import PopupAd from '@/lib/db/models/PopupAd'
import { verifyAdminRequest } from '@/lib/utils/adminAuth'

export async function GET(request) {
  try {
    await connectDB()
    const popups = await PopupAd.find({}).sort('-createdAt')
    return NextResponse.json({ success: true, popups })
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
    const { title, imageUrl, link } = body

    if (!title || !imageUrl) {
      return NextResponse.json({ success: false, message: 'Title and Image are required' }, { status: 400 })
    }

    const popup = await PopupAd.create({
      title,
      imageUrl,
      link,
      isActive: true
    })

    return NextResponse.json({ success: true, popup })
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}
