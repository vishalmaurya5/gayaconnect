import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db/mongodb'
import User from '@/lib/db/models/User'
import Vendor from '@/lib/db/models/Vendor'
import Offer from '@/lib/db/models/Offer'
import Banner from '@/lib/db/models/Banner'
import Payment from '@/lib/db/models/Payment'
import Blog from '@/lib/db/models/Blog'
import Labourer from '@/lib/db/models/Labourer'
import Vehicle from '@/lib/db/models/Vehicle'
import CallLog from '@/lib/db/models/CallLog'
import Job from '@/lib/db/models/Job'
import { verifyAdminRequest } from '@/lib/utils/adminAuth'

export const dynamic = 'force-dynamic'

export async function GET(request) {
  if (!verifyAdminRequest(request)) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
  }

  try {
    await connectDB()

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const sevenDaysAgo = new Date(todayStart);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

    const [
      users,
      vendors,
      offers,
      banners,
      payments,
      blogs,
      labourers,
      vehicles,
      revenueAgg,
      paymentStatusAgg,
      roleAgg,
      chartAgg,
      calls,
      jobs
    ] = await Promise.all([
      User.find().select('-password').sort({ createdAt: -1 }).lean(),
      Vendor.find().sort({ createdAt: -1 }).lean(),
      Offer.find().populate('vendorId', 'name category subCategory').sort({ createdAt: -1 }).lean(),
      Banner.find().sort({ createdAt: -1 }).lean(),
      Payment.find().sort({ createdAt: -1 }).lean(),
      Blog.find().sort({ createdAt: -1 }).lean(),
      Labourer.find().sort({ createdAt: -1 }).lean(),
      Vehicle.find().sort({ createdAt: -1 }).lean(),
      Payment.aggregate([
        { $match: { status: { $in: ['success', 'paid'] } } },
        { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } },
      ]),
      Payment.aggregate([{ $group: { _id: '$status', count: { $sum: 1 }, amount: { $sum: '$amount' } } }]),
      User.aggregate([{ $group: { _id: '$role', count: { $sum: 1 } } }]),
      Payment.aggregate([
        { 
          $match: { 
            status: { $in: ['success', 'paid'] },
            createdAt: { $gte: sevenDaysAgo }
          }
        },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            revenue: { $sum: '$amount' }
          }
        },
        { $sort: { _id: 1 } }
      ]),
      CallLog.find().sort({ createdAt: -1 }).lean(),
      Job.find().populate('vendorId', 'name').sort({ createdAt: -1 }).lean()
    ])

    // Fill in missing days for the chart
    const graphData = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(sevenDaysAgo);
      d.setDate(d.getDate() + i);
      const dateStr = d.toISOString().split('T')[0];
      const found = chartAgg.find(c => c._id === dateStr);
      graphData.push({
        name: dateStr,
        revenue: found ? found.revenue : 0
      });
    }

    const now = new Date()
    const stats = {
      users: users.length,
      vendors: vendors.length,
      approvedVendors: vendors.filter((vendor) => vendor.isApproved).length,
      pendingVendors: vendors.filter((vendor) => !vendor.isApproved).length,
      offers: offers.length,
      activeOffers: offers.filter((offer) => offer.isActive).length,
      banners: banners.length,
      activeBanners: banners.filter((banner) => banner.isActive && new Date(banner.endDate) > now).length,
      blogs: blogs.length,
      labourers: labourers.length,
      vehicles: vehicles.length,
      payments: payments.length,
      calls: calls.length,
      jobs: jobs.length,
      revenue: revenueAgg[0]?.total || 0,
      paidPayments: revenueAgg[0]?.count || 0,
    }

    return NextResponse.json({
      success: true,
      stats,
      users,
      vendors,
      offers,
      banners,
      payments,
      blogs,
      labourers,
      vehicles,
      calls,
      jobs,
      analytics: {
        paymentStatus: paymentStatusAgg,
        usersByRole: roleAgg,
        graphData
      },
    })
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}
