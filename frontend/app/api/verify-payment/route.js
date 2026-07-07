import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { connectDB } from '@/lib/db/mongodb';
import Subscription from '@/lib/db/models/Subscription';
import User from '@/lib/db/models/User';
import Payment from '@/lib/db/models/Payment';

export async function POST(request) {
  try {
    await connectDB();

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await request.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ success: false, message: 'Missing payment verification details' }, { status: 400 });
    }

    // Check for Dummy Mode
    const isDummy = razorpay_order_id.startsWith('dummy_');

    if (!isDummy) {
      // Generate expected signature
      const secret = process.env.RAZORPAY_KEY_SECRET;
      const generated_signature = crypto
        .createHmac('sha256', secret)
        .update(razorpay_order_id + '|' + razorpay_payment_id)
        .digest('hex');

      if (generated_signature !== razorpay_signature) {
        return NextResponse.json({ success: false, message: 'Payment verification failed' }, { status: 400 });
      }
    } else if (razorpay_signature !== 'dummy_sig') {
      return NextResponse.json({ success: false, message: 'Dummy Payment verification failed' }, { status: 400 });
    }

    // Payment is verified, find the pending subscription
    const subscription = await Subscription.findOne({ razorpayOrderId: razorpay_order_id });
    if (!subscription) {
      return NextResponse.json({ success: false, message: 'Subscription record not found' }, { status: 404 });
    }

    // Calculate end date based on plan
    const startDate = new Date();
    const endDate = new Date(startDate);
    
    switch(subscription.planId) {
      case '1m': endDate.setMonth(endDate.getMonth() + 1); break;
      case '3m': endDate.setMonth(endDate.getMonth() + 3); break;
      case '6m': endDate.setMonth(endDate.getMonth() + 6); break;
      case '12m': endDate.setFullYear(endDate.getFullYear() + 1); break;
      default: endDate.setMonth(endDate.getMonth() + 1);
    }

    // Update Subscription
    subscription.razorpayPaymentId = razorpay_payment_id;
    subscription.status = 'active';
    subscription.startDate = startDate;
    subscription.endDate = endDate;
    await subscription.save();

    // Update User
    await User.findByIdAndUpdate(subscription.userId, {
      subscriptionActive: true,
      subscriptionPlan: subscription.planId,
      subscriptionExpiry: endDate
    });

    // Create Payment Record for History
    await Payment.create({
      userId: subscription.userId,
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      amount: subscription.amount,
      status: 'success',
      purpose: 'user_monthly',
      plan: subscription.planId,
      expiresAt: endDate
    });

    return NextResponse.json({ success: true, message: 'Payment verified successfully' });
  } catch (error) {
    console.error("Verify Payment Error:", error);
    return NextResponse.json({ success: false, message: error.message || 'Internal server error' }, { status: 500 });
  }
}
