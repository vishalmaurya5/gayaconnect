import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { connectDB } from '@/lib/db/mongodb';
import Subscription from '@/lib/db/models/Subscription';
import User from '@/lib/db/models/User';
import { getAuthenticatedUser } from '@/lib/security/auth';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST(request) {
  try {
    await connectDB();

    // Verify authentication
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const userId = user._id;

    // Parse request body
    const { amount, planId, planName } = await request.json();

    if (!amount || !planId) {
      return NextResponse.json({ success: false, message: 'Amount and planId are required' }, { status: 400 });
    }

    // Verification complete, proceed with order creation

    // Create Razorpay Order
    let order;
    const isDummy = process.env.DUMMY_RAZORPAY === "true" || process.env.NEXT_PUBLIC_USE_REAL_RAZORPAY === "false";
    
    if (isDummy) {
      order = {
        id: `dummy_order_${Date.now()}`,
        amount: amount,
        currency: "INR"
      };
    } else {
      const options = {
        amount: amount, // amount in the smallest currency unit (paise)
        currency: "INR",
        receipt: `rcpt_${userId.toString().slice(-8)}_${Date.now()}`
      };
      order = await razorpay.orders.create(options);
    }

    // Save pending subscription in DB
    const subscription = new Subscription({
      userId: user._id,
      planId,
      amount: amount / 100, // store in rupees
      razorpayOrderId: order.id,
      status: 'pending'
    });
    
    await subscription.save();

    return NextResponse.json({ success: true, orderId: order.id, amount: order.amount, currency: order.currency, isDummy });
  } catch (error) {
    console.error("Create Order Error:", error);
    const errorMessage = error?.error?.description || error?.message || 'Internal server error';
    return NextResponse.json({ success: false, message: errorMessage }, { status: 500 });
  }
}
