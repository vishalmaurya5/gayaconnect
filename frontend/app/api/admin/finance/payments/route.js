import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongodb';
import { verifyAdminRequest, buildCityQuery } from '@/lib/utils/adminAuth';
import FinancePayment from '@/lib/db/models/FinancePayment';
import FinanceInvoice from '@/lib/db/models/FinanceInvoice';
import Payment from '@/lib/db/models/Payment';

export async function POST(request) {
  try {
    await connectDB();
    const adminUser = verifyAdminRequest(request);
    if (!adminUser) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const payment = await FinancePayment.create({
      ...body,
      createdBy: adminUser.id || null
    });

    let invoiceId = null;

    if (payment.paymentStatus === 'Paid') {
      const count = await FinanceInvoice.countDocuments();
      const invoiceNumber = `GSINV-${new Date().getFullYear()}-${String(count + 1).padStart(6, '0')}`;
      
      const invoice = await FinanceInvoice.create({
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
        status: 'Generated',
        generatedBy: adminUser.id || null
      });
      invoiceId = invoice._id;
    }

    return NextResponse.json({ success: true, payment, invoiceId }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    await connectDB();
    const adminUser = verifyAdminRequest(request);
    if (!adminUser) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 20;
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const city = searchParams.get('city');

    const finFilter = {};
    const genFilter = {};
    
    // Apply city filters
    const cityQueryFin = buildCityQuery(adminUser, city, 'city');
    if (Object.keys(cityQueryFin).length > 0) {
      finFilter['city'] = cityQueryFin['city'];
      
      // For general payments, filter by matching users
      const User = (await import('@/lib/db/models/User')).default;
      const cityQueryUser = buildCityQuery(adminUser, city, 'address');
      const matchingUsers = await User.find(cityQueryUser).select('_id');
      genFilter.userId = { $in: matchingUsers.map(u => u._id) };
    }

    if (status) {
      finFilter.paymentStatus = status;
      if (status === 'Paid') genFilter.status = 'success';
      else if (status === 'Pending') genFilter.status = 'pending';
      else if (status === 'Failed') genFilter.status = 'failed';
      else genFilter.status = status; // Might not match
    }
    
    if (search) {
      finFilter.$or = [
        { customerName: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { referenceNumber: { $regex: search, $options: 'i' } }
      ];
      
      genFilter.$or = [
        { orderId: { $regex: search, $options: 'i' } },
        { purpose: { $regex: search, $options: 'i' } },
        { paymentId: { $regex: search, $options: 'i' } }
      ];
    }

    const finPayments = await FinancePayment.find(finFilter).lean();
    const genPayments = await Payment.find(genFilter).populate('userId', 'name phone').lean();

    const formattedFin = finPayments.map(tx => ({
      ...tx,
      _id: tx._id,
      customerName: tx.customerName || 'Manual Entry',
      service: tx.service,
      totalAmount: tx.totalAmount,
      paymentStatus: tx.paymentStatus,
      paymentMethod: tx.paymentMethod || 'Manual',
      referenceNumber: tx.referenceNumber,
      createdAt: tx.createdAt
    }));

    const formattedGen = genPayments.map(tx => ({
      _id: tx._id,
      customerName: tx.userId?.name || 'Website User',
      phone: tx.userId?.phone || '',
      service: tx.purpose || tx.type || 'Online Service',
      totalAmount: tx.amount,
      paymentStatus: tx.status === 'success' ? 'Paid' : tx.status === 'pending' ? 'Pending' : 'Failed',
      paymentMethod: 'Online/Razorpay',
      referenceNumber: tx.paymentId || tx.orderId,
      createdAt: tx.createdAt
    }));

    const allPayments = [...formattedFin, ...formattedGen];
    
    // Sort descending by date
    allPayments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const total = allPayments.length;
    
    // Paginate
    const paginatedPayments = allPayments.slice((page - 1) * limit, page * limit);

    return NextResponse.json({
      success: true,
      payments: paginatedPayments,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
