import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { connectDB } from '@/lib/db/mongodb';
import Vehicle from '@/lib/db/models/Vehicle';
import Payment from '@/lib/db/models/Payment';

export async function POST(request) {
  try {
    await connectDB();

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, vehicleId } = await request.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !vehicleId) {
      return NextResponse.json({ success: false, message: 'Missing payment verification details' }, { status: 400 });
    }

    // Generate expected signature
    const secret = process.env.RAZORPAY_KEY_SECRET;
    const generated_signature = crypto
      .createHmac('sha256', secret)
      .update(razorpay_order_id + '|' + razorpay_payment_id)
      .digest('hex');

    if (generated_signature !== razorpay_signature) {
      return NextResponse.json({ success: false, message: 'Payment verification failed' }, { status: 400 });
    }

    // Payment is verified
    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) {
      return NextResponse.json({ success: false, message: 'Vehicle record not found' }, { status: 404 });
    }

    vehicle.razorpayPaymentId = razorpay_payment_id;
    vehicle.paymentStatus = 'completed';
    // Note: status remains 'pending' for admin approval!
    await vehicle.save();

    // Log the transaction
    await Payment.create({
      userId: vehicle.ownerId,
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      amount: 200,
      status: 'success',
      purpose: 'vehicle_listing',
      metadata: { vehicleId: vehicle._id, vehicleNumber: vehicle.vehicleNumber }
    });

    return NextResponse.json({ success: true, message: 'Payment verified and vehicle sent for approval' });
  } catch (error) {
    console.error("Vehicle Verify Payment Error:", error);
    return NextResponse.json({ success: false, message: error.message || 'Internal server error' }, { status: 500 });
  }
}
