import { NextResponse } from "next/server";
import crypto from "crypto";
import { connectDB } from "@/lib/db/mongodb";
import User from "@/lib/db/models/User";
import Payment from "@/lib/db/models/Payment";

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, userData } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !userData) {
      return NextResponse.json({ error: "Missing required verification data" }, { status: 400 });
    }

    // Verify signature
    const text = `${razorpay_order_id}|${razorpay_payment_id}`;
    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(text)
      .digest("hex");

    if (generated_signature !== razorpay_signature) {
      return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
    }

    // Ensure role is strictly vendor and password is not overridden in transit maliciously
    // (In a perfect system we'd use a signed JWT for userData, but this works for now)
    const sanitizedUserData = {
      ...userData,
      role: 'vendor',
      verified: false
    };

    // Create user
    const newUser = await User.create(sanitizedUserData);

    // Record Payment
    await Payment.create({
      userId: newUser._id,
      amount: 49, // Will record the nominal fee, though ideally we'd fetch the exact amount charged
      currency: "INR",
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      signature: razorpay_signature,
      status: "success",
      purpose: "vendor_registration",
      metadata: { businessName: newUser.businessName }
    });

    return NextResponse.json({ 
      success: true, 
      message: "Registration and payment successful. Please login." 
    }, { status: 201 });

  } catch (error) {
    console.error("Verify Registration Error:", error);
    return NextResponse.json({ error: "Server error during verification" }, { status: 500 });
  }
}
