import FinancePayment from '../models/FinancePayment.js';
import FinanceInvoice from '../models/FinanceInvoice.js';
import FinancePricing from '../models/FinancePricing.js';
import { asyncHandler } from '../utils/helpers.js';

// --- PAYMENTS ---

export const createPayment = asyncHandler(async (req, res) => {
  const payment = await FinancePayment.create({
    ...req.body,
    createdBy: req.user._id
  });
  res.status(201).json({ success: true, payment });
});

export const getPayments = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, status, search } = req.query;
  const filter = {};
  
  if (status) filter.paymentStatus = status;
  if (search) {
    filter.$or = [
      { customerName: { $regex: search, $options: 'i' } },
      { phone: { $regex: search, $options: 'i' } },
      { referenceNumber: { $regex: search, $options: 'i' } }
    ];
  }

  const payments = await FinancePayment.find(filter)
    .sort({ createdAt: -1 })
    .skip((Number(page) - 1) * Number(limit))
    .limit(Number(limit));

  const total = await FinancePayment.countDocuments(filter);

  res.json({
    success: true,
    payments,
    totalPages: Math.ceil(total / Number(limit)),
    currentPage: Number(page)
  });
});

export const updatePaymentStatus = asyncHandler(async (req, res) => {
  const { status, referenceNumber, receiptUrl } = req.body;
  const payment = await FinancePayment.findById(req.params.id);
  
  if (!payment) return res.status(404).json({ success: false, message: 'Payment not found' });
  
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
        generatedBy: req.user._id
      });
    }
  }

  res.json({ success: true, payment });
});

export const deletePayment = asyncHandler(async (req, res) => {
  await FinancePayment.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: 'Payment deleted' });
});

export const getPaymentById = asyncHandler(async (req, res) => {
  const payment = await FinancePayment.findById(req.params.id);
  if (!payment) return res.status(404).json({ success: false, message: 'Payment not found' });
  res.json({ success: true, payment });
});

// --- INVOICES ---

export const getInvoices = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const invoices = await FinanceInvoice.find()
    .populate('paymentId')
    .sort({ createdAt: -1 })
    .skip((Number(page) - 1) * Number(limit))
    .limit(Number(limit));

  const total = await FinanceInvoice.countDocuments();

  res.json({
    success: true,
    invoices,
    totalPages: Math.ceil(total / Number(limit)),
    currentPage: Number(page)
  });
});

export const getInvoiceById = asyncHandler(async (req, res) => {
  const invoice = await FinanceInvoice.findById(req.params.id).populate('paymentId');
  if (!invoice) return res.status(404).json({ success: false, message: 'Invoice not found' });
  res.json({ success: true, invoice });
});

// --- PRICING ---

export const getPricing = asyncHandler(async (req, res) => {
  const pricing = await FinancePricing.find().sort({ serviceName: 1 });
  res.json({ success: true, pricing });
});

export const updatePricing = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const pricing = await FinancePricing.findByIdAndUpdate(id, req.body, { new: true });
  res.json({ success: true, pricing });
});

export const createPricing = asyncHandler(async (req, res) => {
  const pricing = await FinancePricing.create(req.body);
  res.status(201).json({ success: true, pricing });
});

// --- DASHBOARD STATS ---

export const getFinanceStats = asyncHandler(async (req, res) => {
  const totalRevenue = await FinancePayment.aggregate([
    { $match: { paymentStatus: 'Paid' } },
    { $group: { _id: null, total: { $sum: '$totalAmount' } } }
  ]);
  
  const pendingPaymentsCount = await FinancePayment.countDocuments({ paymentStatus: 'Pending' });
  const completedPaymentsCount = await FinancePayment.countDocuments({ paymentStatus: 'Paid' });
  const invoicesCount = await FinanceInvoice.countDocuments();

  res.json({
    success: true,
    stats: {
      totalRevenue: totalRevenue[0]?.total || 0,
      pendingPayments: pendingPaymentsCount,
      completedPayments: completedPaymentsCount,
      invoicesGenerated: invoicesCount
    }
  });
});
