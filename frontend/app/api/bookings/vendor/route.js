import { NextResponse } from 'next/server'
import Booking from '@/lib/db/models/Booking'
import Vendor from '@/lib/db/models/Vendor'
import { getAuthenticatedUser } from '@/lib/security/auth'

export async function GET(request) {
  const user = await getAuthenticatedUser(request)
  if (!user) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
  if (user.role !== 'vendor' && user.role !== 'admin') {
    return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 })
  }

  const query = user.role === 'admin'
    ? {}
    : { vendor: (await Vendor.findOne({ userId: user._id }).select('_id'))?._id }

  if (user.role === 'vendor' && !query.vendor) {
    return NextResponse.json({ success: true, bookings: [] })
  }

  const bookings = await Booking.find(query)
    .populate('user', 'name phone')
    .sort({ createdAt: -1 })
    .limit(100)
    .lean()

  return NextResponse.json({ success: true, bookings })
}
