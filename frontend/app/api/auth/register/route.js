import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import Razorpay from "razorpay";
import { connectDB } from "@/lib/db/mongodb";
import User from "@/lib/db/models/User";
import Setting from "@/lib/db/models/Setting";

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const { name, email, phone, password, role, businessName, category, address, gstNumber, description } = body;

    if (!name || !email || !phone || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Check existing
    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
      return NextResponse.json({ error: "Email or Phone is already registered" }, { status: 400 });
    }

    // Hash password with bcrypt before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userData = {
      name,
      email,
      phone,
      password: hashedPassword,
      role: role === "vendor" ? "vendor" : "user",
    };

    if (role === "vendor") {
      userData.businessName = businessName;
      userData.category = category;
      userData.address = address;
      userData.gstNumber = gstNumber;
      userData.description = description;
      userData.verified = false;

      // Check for vendor registration fee
      let chargeVendorRegistration = false;
      let vendorRegistrationFee = 49;
      try {
        const setting = await Setting.findOne({ key: 'pricing' });
        if (setting && setting.value) {
          if (setting.value.chargeVendorRegistration) chargeVendorRegistration = true;
          if (setting.value.vendorRegistration) vendorRegistrationFee = setting.value.vendorRegistration;
        }
      } catch (e) {
        console.error('Settings error', e);
      }

      if (chargeVendorRegistration) {
        // Create Razorpay Order
        const razorpay = new Razorpay({
          key_id: process.env.RAZORPAY_KEY_ID,
          key_secret: process.env.RAZORPAY_KEY_SECRET,
        });

        const order = await razorpay.orders.create({
          amount: vendorRegistrationFee * 100, // in paise
          currency: "INR",
          receipt: `rcpt_vreg_${Date.now()}`,
        });

        return NextResponse.json({
          success: false,
          paymentRequired: true,
          orderId: order.id,
          amount: order.amount,
          currency: order.currency,
          keyId: process.env.RAZORPAY_KEY_ID,
          userData // Return user data so frontend can pass it to verify endpoint
        });
      }
    }

    await User.create(userData);

    return NextResponse.json({ 
      success: true, 
      message: "Registration successful. Please login." 
    }, { status: 201 });

  } catch (error) {
    console.error("Register Error:", error);
    return NextResponse.json({ error: "Server error during registration" }, { status: 500 });
  }
}
