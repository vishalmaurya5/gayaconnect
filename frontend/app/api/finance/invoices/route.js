import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongodb';
import { verifyAdminRequest } from '@/lib/utils/adminAuth';
import FinanceInvoice from '@/lib/db/models/FinanceInvoice';
import FinancePayment from '@/lib/db/models/FinancePayment'; // Needed for population

export async function GET(request) {
  try {
    await connectDB();
    const adminUser = verifyAdminRequest(request);
    if (!adminUser) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 20;

    const invoices = await FinanceInvoice.find()
      .populate('paymentId')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await FinanceInvoice.countDocuments();

    return NextResponse.json({
      success: true,
      invoices,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
