import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { connectDB } from '@/lib/db/mongodb';
import Subscription from '@/lib/db/models/Subscription';
import User from '@/lib/db/models/User';

export async function POST(request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get('x-razorpay-signature');
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!secret) {
      console.warn("RAZORPAY_WEBHOOK_SECRET is not defined. Webhook verification skipped.");
      // In production, you must return 400 here if secret is missing
    } else {
      const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(rawBody)
        .digest('hex');

      if (expectedSignature !== signature) {
        return NextResponse.json({ success: false, message: 'Invalid webhook signature' }, { status: 400 });
      }
    }

    const payload = JSON.parse(rawBody);
    await connectDB();

    if (payload.event === 'payment.captured' || payload.event === 'order.paid') {
      const paymentEntity = payload.payload.payment.entity;
      const orderId = paymentEntity.order_id;
      const paymentId = paymentEntity.id;

      const subscription = await Subscription.findOne({ razorpayOrderId: orderId });
      
      // If subscription exists and is still pending, activate it
      if (subscription && subscription.status === 'pending') {
        const startDate = new Date();
        const endDate = new Date(startDate);
        
        switch(subscription.planId) {
          case '1m': endDate.setMonth(endDate.getMonth() + 1); break;
          case '3m': endDate.setMonth(endDate.getMonth() + 3); break;
          case '6m': endDate.setMonth(endDate.getMonth() + 6); break;
          case '12m': endDate.setFullYear(endDate.getFullYear() + 1); break;
          default: endDate.setMonth(endDate.getMonth() + 1);
        }

        subscription.razorpayPaymentId = paymentId;
        subscription.status = 'active';
        subscription.startDate = startDate;
        subscription.endDate = endDate;
        await subscription.save();

        await User.findByIdAndUpdate(subscription.userId, {
          subscriptionActive: true,
          subscriptionPlan: subscription.planId,
          subscriptionExpiry: endDate
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Webhook Error:", error);
    return NextResponse.json({ success: false, message: 'Webhook processing failed' }, { status: 500 });
  }
}
