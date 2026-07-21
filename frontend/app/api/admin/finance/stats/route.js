import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongodb';
import { verifyAdminRequest } from '@/lib/utils/adminAuth';
import FinancePayment from '@/lib/db/models/FinancePayment';
import FinanceInvoice from '@/lib/db/models/FinanceInvoice';
import Payment from '@/lib/db/models/Payment';

export async function GET(request) {
  try {
    await connectDB();
    const adminUser = verifyAdminRequest(request);
    if (!adminUser) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

    // Aggregation for FinancePayment
    const totalRevenueAgg = await FinancePayment.aggregate([
      { $match: { paymentStatus: 'Paid' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    const financeRevenue = totalRevenueAgg[0]?.total || 0;

    const pendingFinance = await FinancePayment.countDocuments({ paymentStatus: 'Pending' });
    const completedFinance = await FinancePayment.countDocuments({ paymentStatus: 'Paid' });
    
    // Aggregation for General Payment (Subscriptions, Banners, Jobs, Vehicles)
    const totalGenRevenueAgg = await Payment.aggregate([
      { $match: { status: 'success' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const genRevenue = totalGenRevenueAgg[0]?.total || 0;

    const pendingGen = await Payment.countDocuments({ status: 'pending' });
    const completedGen = await Payment.countDocuments({ status: 'success' });

    const totalRevenue = financeRevenue + genRevenue;
    const pendingPayments = pendingFinance + pendingGen;
    const completedPayments = completedFinance + completedGen;
    const totalInvoices = await FinanceInvoice.countDocuments();
    
    // Recent 5 transactions from Finance
    const recentFinance = await FinancePayment.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('customerName service totalAmount paymentStatus paymentMethod createdAt')
      .lean();
      
    // Recent 5 transactions from General Payments
    const recentGen = await Payment.find()
      .populate('userId', 'name')
      .sort({ createdAt: -1 })
      .limit(5)
      .select('userId purpose amount status type createdAt')
      .lean();

    // Standardize and merge
    let combinedRecent = [
      ...recentFinance.map(tx => ({
        _id: tx._id,
        customerName: tx.customerName || 'Manual Entry',
        service: tx.service,
        totalAmount: tx.totalAmount,
        paymentStatus: tx.paymentStatus,
        paymentMethod: tx.paymentMethod || 'Manual',
        createdAt: tx.createdAt
      })),
      ...recentGen.map(tx => ({
        _id: tx._id,
        customerName: tx.userId?.name || 'Website User',
        service: tx.purpose || tx.type || 'Online Service',
        totalAmount: tx.amount,
        paymentStatus: tx.status === 'success' ? 'Paid' : tx.status === 'pending' ? 'Pending' : 'Failed',
        paymentMethod: 'Online/Razorpay',
        createdAt: tx.createdAt
      }))
    ];

    // Sort by date desc and take top 5
    combinedRecent.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const recentTransactions = combinedRecent.slice(0, 5);

    return NextResponse.json({
      success: true,
      stats: {
        totalRevenue,
        pendingPayments,
        completedPayments,
        totalInvoices,
        recentTransactions
      }
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
