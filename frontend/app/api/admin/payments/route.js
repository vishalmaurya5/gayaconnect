import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db/mongodb'
import { verifyAdminRequest } from '@/lib/utils/adminAuth'
import Payment from '@/lib/db/models/Payment'

export async function GET(request) {
  try {
    await connectDB()
    const adminUser = verifyAdminRequest(request)
    if (!adminUser) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const filter = searchParams.get('filter') || 'all'

    const query = {}
    if (filter !== 'all') {
      query.$or = [
        { purpose: filter },
        { type: filter },
        { planType: filter }
      ]
    }

    const payments = await Payment.find(query).populate('userId', 'name email').sort('-createdAt')
    return NextResponse.json({ success: true, payments })
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}
