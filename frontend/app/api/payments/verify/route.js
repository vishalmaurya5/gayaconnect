// app/api/payments/verify/route.js — Payment verification for all plans
import { NextResponse } from "next/server";
import crypto           from "crypto";
import { connectDB } from "@/lib/db/mongodb";
import User             from "@/lib/db/models/User";
import Offer            from "@/lib/db/models/Offer";
import Payment          from "@/lib/db/models/Payment";
import Vendor           from "@/lib/db/models/Vendor";
import { getAuthenticatedUser as getLoggedInUser } from "@/lib/security/auth";

const PLAN_DURATIONS = {
  user_monthly: 30,
  offer_7days:  7,
  offer_30days: 30,
  offer_365days:365,
  banner:       30,
};

export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      plan,        // "user_monthly" | "offer_post" | "banner"
      duration,    // "7days" | "30days" | "365days" (for offer_post)
      offerData,   // { title, description, discount, category, terms }
      isDummy,
    } = body;

    const user = await getLoggedInUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ── Dummy payment (dev mode) ──────────────────────────────────────────────
    if (isDummy || process.env.DUMMY_RAZORPAY === "true") {
      return handlePlanActivation({ plan, duration, offerData, user, paymentId: "dummy_" + Date.now() });
    }

    // ── Verify Razorpay signature ─────────────────────────────────────────────
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json({ error: "Payment verification failed — invalid signature" }, { status: 400 });
    }

    return handlePlanActivation({ plan, duration, offerData, user, paymentId: razorpay_payment_id, orderId: razorpay_order_id });
  } catch (err) {
    console.error("Payment verify error:", err);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}

// ── Activate the appropriate plan after payment ───────────────────────────────
async function handlePlanActivation({ plan, duration, offerData, user, paymentId, orderId }) {
  const now = new Date();

  // ── 1. USER MONTHLY SUBSCRIPTION ─────────────────────────────────────────
  if (plan === "user_monthly") {
    const expiryDate = user.subscriptionActive && user.subscriptionExpiry && new Date(user.subscriptionExpiry) > now 
      ? new Date(user.subscriptionExpiry) 
      : new Date(now);
    expiryDate.setDate(expiryDate.getDate() + 30);

    await User.findByIdAndUpdate(user._id, {
      subscriptionActive: true,
      subscriptionExpiry: expiryDate,
      subscriptionPlan:   "monthly",
    });

    await Payment.create({
      userId:    user._id,
      purpose:   "user_subscription",
      type:      "user_subscription",
      plan:      "monthly",
      amount:    11,
      currency:  "INR",
      paymentId,
      orderId:   orderId || paymentId,
      status:    "success",
      expiresAt: expiryDate,
    });

    return NextResponse.json({
      success:  true,
      message:  "Subscription activated! You now have full access for 30 days.",
      redirect: "/",
    });
  }

  // ── 2. OFFER POSTING ─────────────────────────────────────────────────────
  if (plan === "offer_post" && offerData) {
    const planKey    = `offer_${duration}`;
    const days       = PLAN_DURATIONS[planKey] || 7;
    const price      = { "7days":39, "30days":199, "365days":399 }[duration] || 39;
    const expiresAt  = new Date(now);
    expiresAt.setDate(expiresAt.getDate() + days);

    let vendor = await Vendor.findOne({ userId: user._id });
    if (!vendor && user.businessName && user.category) {
      vendor = await Vendor.create({
        userId: user._id,
        regCode: user.regCode || '',
        name: user.businessName,
        category: user.category,
        subCategory: user.subCategory,
        description: user.description,
        address: user.address,
        isApproved: false,
      });
    }
    if (!vendor) {
      return NextResponse.json({ error: "Complete your vendor profile before posting an offer." }, { status: 400 });
    }

    // Include old records that used the user id as vendorId.
    const activeCount = await Offer.countDocuments({
      vendorId:  { $in: [vendor._id, user._id] },
      isActive:  true,
      $or: [{ validUntil: { $gt: now } }, { expiresAt: { $gt: now } }],
    });
    if (activeCount >= 5) {
      return NextResponse.json({ error: "You have reached the maximum of 5 active offers." }, { status: 400 });
    }

    const offer = await Offer.create({
      vendorId:    vendor._id,
      title:       offerData.title,
      description: offerData.description,
      discountText:offerData.discount,
      category:    offerData.category,
      terms:       offerData.terms || "",
      planType:    duration,
      isActive:    true,
      validUntil:  expiresAt,
      paymentId,
    });

    await Payment.create({
      userId:    user._id,
      purpose:   "offer_post",
      type:      "offer_post",
      plan:      duration,
      amount:    price,
      currency:  "INR",
      paymentId,
      orderId:   orderId || paymentId,
      status:    "success",
      expiresAt,
      meta:      { offerId: offer._id, duration },
      metadata:  { offerId: offer._id, duration },
    });

    return NextResponse.json({
      success:  true,
      message:  `Offer posted successfully! It will be visible for ${days} days.`,
      offerId:  offer._id,
      redirect: "/vendor/dashboard?tab=offers&success=1",
    });
  }

  // ── 3. BANNER ACCESS FEE ─────────────────────────────────────────────────
  if (plan === "banner" || plan === "banner_post_monthly") {
    // Record payment; admin activates the slot separately
    await Payment.create({
      userId:    user._id,
      purpose:   "banner_fee",
      type:      "banner_fee",
      plan:      "banner_post_monthly",
      amount:    199,
      currency:  "INR",
      paymentId,
      orderId:   orderId || paymentId,
      status:    "success",
      meta:      { bannerPaid: true },
    });

    // Flag vendor as having paid for banner — admin toggle activates posting
    await User.findByIdAndUpdate(user._id, { bannerFeePaid: true, bannerPaymentId: paymentId });
    await Vendor.findOneAndUpdate({ userId: user._id }, { bannerStatus: 'pending' });

    return NextResponse.json({
      success:  true,
      message:  "Banner fee received! Your request is pending admin approval.",
      redirect: `/vendor/dashboard?tab=banner&paid=1`,
    });
  }

  return NextResponse.json({ error: "Unknown plan" }, { status: 400 });
}
