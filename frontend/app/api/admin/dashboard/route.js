import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db/mongodb'
import { getAuthenticatedUser } from '@/lib/security/auth'
import User from '@/lib/db/models/User'
import Vendor from '@/lib/db/models/Vendor'
import Labourer from '@/lib/db/models/Labourer'
import Offer from '@/lib/db/models/Offer'
import Banner from '@/lib/db/models/Banner'
import Payment from '@/lib/db/models/Payment'

export async function GET(request) {
  try {
    await connectDB()
    const adminUser = await getAuthenticatedUser(request)
    if (!adminUser || adminUser.role !== 'admin') {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    }

    const now = new Date()
    const todayStr = now.toISOString().split('T')[0]
    const todayStart = new Date(todayStr + 'T00:00:00.000Z')
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    const [
      totalUsers,
      totalVendors,
      totalLabour,
      activeOffers,
      activeBanners,
      newRegistrations,
      pendingVendors,
      pendingBanners,
      paymentsThisMonth
    ] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      Vendor.countDocuments(),
      Labourer.countDocuments(),
      Offer.countDocuments({ isActive: true, expiresAt: { $gt: now } }),
      Banner.countDocuments({ isActive: true, adminApproved: true, endDate: { $gt: now } }),
      User.countDocuments({ createdAt: { $gte: todayStart } }),
      Vendor.countDocuments({ isApproved: false }),
      Banner.countDocuments({ adminApproved: false }),
      Payment.find({ status: 'success', createdAt: { $gte: firstDayOfMonth } })
    ])

    const revenueThisMonth = paymentsThisMonth.reduce((acc, p) => acc + (Number(p.amount) || 0), 0)
    const pendingApprovals = pendingVendors + pendingBanners

    const graphData = []
    for (let i = 6; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const dayStart = new Date(d.setHours(0,0,0,0))
      const dayEnd = new Date(d.setHours(23,59,59,999))
      
      const dailyPayments = await Payment.find({
        status: 'success',
        createdAt: { $gte: dayStart, $lte: dayEnd }
      })
      const total = dailyPayments.reduce((acc, p) => acc + (Number(p.amount) || 0), 0)
      
      graphData.push({
        name: dayStart.toLocaleDateString('en-US', { weekday: 'short' }),
        revenue: total
      })
    }

    return NextResponse.json({
      success: true,
      data: {
        totalUsers,
        totalVendors,
        totalLabour,
        activeOffers,
        activeBanners,
        revenueThisMonth,
        newRegistrations,
        pendingApprovals,
        graphData
      }
    })
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}
