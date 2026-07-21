import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongodb';
import { verifyAdminRequest } from '@/lib/utils/adminAuth';
import FinanceInvoice from '@/lib/db/models/FinanceInvoice';
import FinancePayment from '@/lib/db/models/FinancePayment';

export async function GET(request, { params }) {
  try {
    await connectDB();
    const adminUser = verifyAdminRequest(request);
    if (!adminUser) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const invoice = await FinanceInvoice.findById(id).populate('paymentId');
    if (!invoice) return NextResponse.json({ success: false, message: 'Invoice not found' }, { status: 404 });
    
    return NextResponse.json({ success: true, invoice });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
