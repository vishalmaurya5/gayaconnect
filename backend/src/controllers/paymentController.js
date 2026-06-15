import crypto from 'crypto';
import razorpay from '../config/razorpay.js';
import Payment from '../models/Payment.js';
import User from '../models/User.js';
import Vendor from '../models/Vendor.js';
import Booking from '../models/Booking.js';
import { asyncHandler } from '../utils/helpers.js';
import { CONTACT_ACCESS_AMOUNT, getContactAccessExpiry, toAuthUser } from '../utils/contactAccess.js';

const processSuccessfulPayment = async (payment) => {
  if (payment.status === 'paid') return; // Already processed

  payment.status = 'paid';
  await payment.save();

  if (payment.purpose === 'subscription' && payment.vendor) {
    const duration = payment.packageName?.toLowerCase().includes('year') ? 365 : 30;
    await Vendor.findByIdAndUpdate(payment.vendor, {
      isPremium: true,
      premiumExpiresAt: new Date(Date.now() + duration * 24 * 60 * 60 * 1000),
    });
  } else if (payment.purpose === 'lead_credit' && payment.vendor) {
    const credits = payment.packageName?.toLowerCase().includes('pro') ? 100 : 50;
    await Vendor.findByIdAndUpdate(payment.vendor, { $inc: { leadCredits: credits } });
  } else if (payment.purpose === 'booking' && payment.booking) {
    await Booking.findByIdAndUpdate(payment.booking, { paymentStatus: 'paid' });
  } else if (payment.purpose === 'contact_access') {
    const user = await User.findById(payment.user);
    if (user) {
      user.contactAccessPurchasedAt = new Date();
      user.contactAccessExpiresAt = getContactAccessExpiry(user.contactAccessExpiresAt);
      await user.save();
    }
  }
};

export const createOrder = asyncHandler(async (req, res) => {
  const { amount, purpose, packageName, vendorId, bookingId } = req.body;
  const finalAmount = purpose === 'contact_access' ? CONTACT_ACCESS_AMOUNT : Number(amount);

  if (purpose === 'contact_access' && req.user.role !== 'user') {
    return res.status(403).json({ message: 'Contact access is only for normal users' });
  }

  const order = await razorpay.orders.create({ amount: Math.round(finalAmount * 100), currency: 'INR', receipt: `rcpt_${Date.now()}` });

  const payment = await Payment.create({
    user: req.user._id,
    vendor: vendorId || undefined,
    booking: bookingId || undefined,
    amount: finalAmount,
    purpose,
    packageName: purpose === 'contact_access' ? 'Vendor Contact Access - 1 Year' : packageName,
    razorpayOrderId: order.id,
  });

  res.status(201).json({ order, paymentId: payment._id });
});

export const verifyPayment = asyncHandler(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const expected = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');

  if (expected !== razorpay_signature) return res.status(400).json({ message: 'Invalid payment signature' });

  const payment = await Payment.findOne({ razorpayOrderId: razorpay_order_id });
  if (!payment) return res.status(404).json({ message: 'Payment record not found' });

  payment.razorpayPaymentId = razorpay_payment_id;
  payment.razorpaySignature = razorpay_signature;
  
  await processSuccessfulPayment(payment);

  const user = await User.findById(payment.user);
  res.json({ success: true, payment, user: user ? toAuthUser(user) : undefined });
});

export const webhookHandler = asyncHandler(async (req, res) => {
  const signature = req.headers['x-razorpay-signature'];
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET)
    .update(JSON.stringify(req.body))
    .digest('hex');

  if (signature !== expectedSignature) return res.status(400).json({ message: 'Invalid webhook signature' });

  const { event, payload } = req.body;
  if (event === 'payment.captured') {
    const orderId = payload.payment.entity.order_id;
    const payment = await Payment.findOne({ razorpayOrderId: orderId });
    if (payment) {
      payment.razorpayPaymentId = payload.payment.entity.id;
      await processSuccessfulPayment(payment);
    }
  }

  res.status(200).json({ received: true });
});

export const paymentHistory = asyncHandler(async (req, res) => {
  const query = req.user.role === 'admin' ? {} : { user: req.user._id };
  const payments = await Payment.find(query).sort('-createdAt');
  res.json(payments);
});
