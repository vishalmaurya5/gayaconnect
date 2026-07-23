import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongodb';
import { verifyAdminRequest } from '@/lib/utils/adminAuth';
import LabourPayment from '@/lib/db/models/LabourPayment';
import Labourer from '@/lib/db/models/Labourer';

export async function GET(request) {
  try {
    await connectDB();
    const adminUser = verifyAdminRequest(request);
    if (!adminUser) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');

    let payments = await LabourPayment.find().populate('labourId', 'name phone photo role category district lwfId').sort('-createdAt');

    if (search) {
      const lower = search.toLowerCase();
      payments = payments.filter(p => 
        p.labourId?.name?.toLowerCase().includes(lower) ||
        p.transactionId?.toLowerCase().includes(lower) ||
        p.paymentMethod?.toLowerCase().includes(lower)
      );
    }

    const totalPaid = payments.filter(p => p.status === 'PAID').reduce((acc, curr) => acc + (curr.amount || 0), 0);
    const totalPending = payments.filter(p => p.status === 'PENDING').reduce((acc, curr) => acc + (curr.amount || 0), 0);

    return NextResponse.json({ 
      success: true, 
      payments, 
      stats: { totalPaid, totalPending, count: payments.length } 
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const adminUser = verifyAdminRequest(request);
    if (!adminUser) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { labourId, amount, paymentMethod, period, notes, status } = body;

    if (!labourId || !amount) {
      return NextResponse.json({ success: false, message: 'Worker ID and amount are required.' }, { status: 400 });
    }

    const count = await LabourPayment.countDocuments();
    const transactionId = `TXN-LWF-${Date.now().toString().slice(-6)}-${count + 1}`;

    const payment = new LabourPayment({
      labourId,
      transactionId,
      amount: Number(amount),
      paymentMethod: paymentMethod || 'UPI',
      period: period || 'Daily Wage Payout',
      status: status || 'PAID',
      notes: notes || ''
    });

    await payment.save();
    const populated = await LabourPayment.findById(payment._id).populate('labourId', 'name phone photo role category district lwfId');

    return NextResponse.json({ success: true, payment: populated });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
