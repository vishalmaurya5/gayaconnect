import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db/mongodb'
import Setting from '@/lib/db/models/Setting'

export const dynamic = 'force-dynamic'

const DEFAULT_PRICING = {
  subscription: 11,
  banner: 199,
  vehicle: 200,
  vendorRegistration: 49,
  chargeVendorRegistration: false,
  offer7Days: 39,
  offer30Days: 199,
  offer365Days: 399
}

export async function GET() {
  try {
    await connectDB()
    
    let pricingSetting = await Setting.findOne({ key: 'pricing' })
    if (!pricingSetting) {
      pricingSetting = await Setting.create({ key: 'pricing', value: DEFAULT_PRICING })
    }

    return NextResponse.json({
      success: true,
      pricing: { ...DEFAULT_PRICING, ...pricingSetting.value }
    })
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}
