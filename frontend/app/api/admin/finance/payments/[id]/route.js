import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongodb';
import { verifyAdminRequest } from '@/lib/utils/adminAuth';
import FinancePayment from '@/lib/db/models/FinancePayment';
import FinanceInvoice from '@/lib/db/models/FinanceInvoice';

export async function PUT(request, { params }) {
  try {
    await connectDB();
    const adminUser = verifyAdminRequest(request);
    if (!adminUser) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const body = await request.json();
    const { status, referenceNumber, receiptUrl } = body;

    const payment = await FinancePayment.findById(id);
    if (!payment) return NextResponse.json({ success: false, message: 'Payment not found' }, { status: 404 });

    payment.paymentStatus = status || payment.paymentStatus;
    if (referenceNumber) payment.referenceNumber = referenceNumber;
    if (receiptUrl) payment.receiptUrl = receiptUrl;
    
    await payment.save();

    // Generate invoice automatically if status is Paid and doesn't exist
    if (status === 'Paid') {
      const existingInvoice = await FinanceInvoice.findOne({ paymentId: payment._id });
      if (!existingInvoice) {
        const count = await FinanceInvoice.countDocuments();
        const invoiceNumber = `GSINV-${new Date().getFullYear()}-${String(count + 1).padStart(6, '0')}`;
        
        await FinanceInvoice.create({
          invoiceNumber,
          paymentId: payment._id,
          customerDetails: {
            name: payment.customerName,
            phone: payment.phone,
            email: payment.email,
            businessName: payment.businessName,
            address: payment.address
          },
          serviceDetails: {
            service: payment.service,
            description: payment.description,
            amount: payment.amount,
            discount: payment.discount,
            gst: payment.gst,
            total: payment.totalAmount
          },
          paymentMethod: payment.paymentMethod,
          referenceNumber: payment.referenceNumber,
          generatedBy: adminUser.id || null
        });
      }
    }

    return NextResponse.json({ success: true, payment });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function GET(request, { params }) {
  try {
    await connectDB();
    const adminUser = verifyAdminRequest(request);
    if (!adminUser) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const payment = await FinancePayment.findById(id);
    if (!payment) return NextResponse.json({ success: false, message: 'Payment not found' }, { status: 404 });
    
    return NextResponse.json({ success: true, payment });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
