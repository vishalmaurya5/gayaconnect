import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db/mongodb'
import Vendor from '@/lib/db/models/Vendor'
import { checkSubscription } from '@/lib/security/subscription'

export async function GET(request, { params }) {
  try {
    const { user, error, status } = await checkSubscription(request)
    if (error) {
      return NextResponse.json({ success: false, message: error, locked: true }, { status })
    }

    await connectDB()
    const { id } = params
    
    const vendor = await Vendor.findById(id).populate('userId', 'phone').select('phone contactNumber userId')
    if (!vendor) {
      return NextResponse.json(
        { success: false, message: 'Vendor not found' },
        { status: 404 }
      )
    }

    const phone = vendor.userId?.phone || vendor.phone || vendor.contactNumber

    return NextResponse.json({
      success: true,
      phone
    })
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    )
  }
}
