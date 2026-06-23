// app/api/payments/create-order/route.js — Create Razorpay / dummy order
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongodb";
import { getAuthenticatedUser as getLoggedInUser } from "@/lib/security/auth";
import Setting from "@/lib/db/models/Setting";

const FALLBACK_PRICES = {
  user_monthly:  1100,  // ₹11 in paise
  offer_7days:   3900,  // ₹39
  offer_30days:  19900, // ₹199
  offer_365days: 39900, // ₹399
  banner:        99900, // ₹999
};

export async function POST(request) {
  try {
    await connectDB();

    const user = await getLoggedInUser(request);
    if (!user) {
      return NextResponse.json({ error: "Please login to continue" }, { status: 401 });
    }

    const body     = await request.json();
    const { plan, duration, offerData } = body;

    // Determine plan key and amount
    const planKey = plan === "offer_post"
      ? `offer_${duration}`
      : plan;

    // Fetch dynamic pricing
    let dynamicPricing = {};
    try {
      const setting = await Setting.findOne({ key: 'pricing' });
      if (setting && setting.value) {
        dynamicPricing = setting.value;
      }
    } catch (e) {
      console.error('Failed to fetch pricing settings', e);
    }

    let baseAmount = FALLBACK_PRICES[planKey];
    if (planKey === 'user_monthly' && dynamicPricing.subscription) {
      baseAmount = dynamicPricing.subscription * 100;
    } else if (planKey === 'banner' && dynamicPricing.banner) {
      baseAmount = dynamicPricing.banner * 100;
    } else if (planKey === 'offer_7days' && dynamicPricing.offer7Days) {
      baseAmount = dynamicPricing.offer7Days * 100;
    } else if (planKey === 'offer_30days' && dynamicPricing.offer30Days) {
      baseAmount = dynamicPricing.offer30Days * 100;
    } else if (planKey === 'offer_365days' && dynamicPricing.offer365Days) {
      baseAmount = dynamicPricing.offer365Days * 100;
    }

    const amountPaise = baseAmount;
    if (!amountPaise) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    // ── DUMMY MODE (dev / testing) ────────────────────────────────────────────
    if (process.env.DUMMY_RAZORPAY === "true" || process.env.NEXT_PUBLIC_USE_REAL_RAZORPAY === "false") {
      return NextResponse.json({
        isDummy:  true,
        orderId:  `dummy_order_${Date.now()}`,
        amount:   amountPaise,
        currency: "INR",
        plan,
        duration,
        offerData,
      });
    }

    // ── REAL RAZORPAY ORDER ───────────────────────────────────────────────────
    const Razorpay = (await import("razorpay")).default;
    const razorpay = new Razorpay({
      key_id:     process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const planLabels = {
      user_monthly:  "GayaConnect — Monthly subscription",
      offer_7days:   "GayaConnect — Offer post (7 days)",
      offer_30days:  "GayaConnect — Offer post (30 days)",
      offer_365days: "GayaConnect — Offer post (1 year)",
      banner:        "GayaConnect — Banner advertisement",
    };

    const order = await razorpay.orders.create({
      amount:   amountPaise,
      currency: "INR",
      receipt:  `gc_${planKey}_${user._id}_${Date.now()}`,
      notes: {
        userId:   user._id.toString(),
        userEmail:user.email,
        plan:     planKey,
        duration: duration || "",
      },
    });

    return NextResponse.json({
      isDummy:  false,
      orderId:  order.id,
      amount:   order.amount,
      currency: order.currency,
      plan,
      duration,
      description: planLabels[planKey] || "GayaConnect payment",
    });
  } catch (err) {
    console.error("create-order error:", err);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
