import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db/mongodb'
import Setting from '@/lib/db/models/Setting'
import { verifyAdminRequest } from '@/lib/utils/adminAuth'

export const dynamic = 'force-dynamic'

const DEFAULT_PRICING = {
  subscription: 11,
  banner: 199,
  vehicle: 200,
  vendorRegistration: 49,
  chargeVendorRegistration: false
}

export async function GET(request) {
  if (!verifyAdminRequest(request)) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
  }

  try {
    await connectDB()
    
    let pricingSetting = await Setting.findOne({ key: 'pricing' })
    if (!pricingSetting) {
      pricingSetting = await Setting.create({ key: 'pricing', value: DEFAULT_PRICING })
    }

    return NextResponse.json({
      success: true,
      pricing: pricingSetting.value
    })
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}

export async function POST(request) {
  if (!verifyAdminRequest(request)) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
  }

  try {
    await connectDB()
    const body = await request.json()
    
    if (!body.pricing) {
       return NextResponse.json({ success: false, message: 'Pricing payload missing' }, { status: 400 })
    }

    // Upsert the pricing setting
    await Setting.findOneAndUpdate(
      { key: 'pricing' },
      { value: body.pricing, updatedAt: new Date() },
      { upsert: true, new: true }
    )

    return NextResponse.json({ success: true, message: 'Settings updated successfully' })
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}
