// Generic Razorpay Standard Checkout — verify payment signature.
// POST /api/razorpay/verify  { razorpay_order_id, razorpay_payment_id, razorpay_signature }
// Signature = HMAC_SHA256(order_id + "|" + payment_id, KEY_SECRET)
import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      await request.json().catch(() => ({}));

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { success: false, message: 'Missing payment verification fields' },
        { status: 400 }
      );
    }

    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      return NextResponse.json(
        { success: false, message: 'Razorpay secret not configured on the server' },
        { status: 500 }
      );
    }

    const expected = crypto
      .createHmac('sha256', secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    // Constant-time comparison to avoid timing attacks.
    const a = Buffer.from(expected);
    const b = Buffer.from(String(razorpay_signature));
    const valid = a.length === b.length && crypto.timingSafeEqual(a, b);

    if (!valid) {
      // Signature mismatch — do NOT treat the payment as successful.
      return NextResponse.json(
        { success: false, message: 'Invalid payment signature' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Payment verified',
      razorpay_order_id,
      razorpay_payment_id,
    });
  } catch (error) {
    console.error('Razorpay verify error:', error);
    return NextResponse.json({ success: false, message: 'Verification error' }, { status: 500 });
  }
}
