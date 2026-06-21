import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db/mongodb'
import Offer from '@/lib/db/models/Offer'
import Vendor from '@/lib/db/models/Vendor'

export async function GET(request) {
  try {
    await connectDB()
    const { searchParams } = new URL(request.url)
    const vendorId = searchParams.get('vendorId')

    const query = { isActive: true, validUntil: { $gt: new Date() } }
    if (vendorId) query.vendorId = vendorId

    const offers = await Offer.find(query)
      .populate('vendorId', 'name category address location')
      .sort('-createdAt')

    return NextResponse.json({ success: true, offers })
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    await connectDB()
    const body = await request.json()
    
    // In a real app, verify the user is the vendor or admin
    // For now we assume the client provides a valid vendorId

    const offer = new Offer({
      vendorId: body.vendorId,
      title: body.title,
      description: body.description,
      discountText: body.discountText,
      validUntil: body.validUntil,
      isActive: true
    })
    
    await offer.save()
    return NextResponse.json({ success: true, offer })
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}
