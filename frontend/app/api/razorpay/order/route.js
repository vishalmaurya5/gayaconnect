// Generic Razorpay Standard Checkout — create order.
// POST /api/razorpay/order  { amount (paise), currency?, receipt?, notes? }
// Returns { success, orderId, amount, currency, keyId }
import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const amount = Number(body.amount);
    const currency = body.currency || 'INR';
    const receipt = body.receipt || `rcpt_${Date.now()}`;
    const notes = body.notes && typeof body.notes === 'object' ? body.notes : {};

    // Amount must be an integer number of paise, minimum 100 (₹1).
    if (!Number.isFinite(amount) || amount < 100) {
      return NextResponse.json(
        { success: false, message: 'amount must be an integer >= 100 (paise)' },
        { status: 400 }
      );
    }

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keyId || !keySecret) {
      return NextResponse.json(
        { success: false, message: 'Razorpay keys are not configured on the server' },
        { status: 500 }
      );
    }

    const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });

    const order = await razorpay.orders.create({
      amount: Math.round(amount),
      currency,
      receipt: String(receipt).substring(0, 40),
      notes,
    });

    return NextResponse.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId, // public Key ID is safe to expose to the checkout modal
    });
  } catch (error) {
    // Razorpay auth failures (bad keys) surface as statusCode 401.
    const isAuth = error?.statusCode === 401;
    console.error('Razorpay create-order error:', error?.error || error?.message || error);
    return NextResponse.json(
      { success: false, message: isAuth ? 'Razorpay authentication failed' : 'Could not create order' },
      { status: isAuth ? 401 : 500 }
    );
  }
}
