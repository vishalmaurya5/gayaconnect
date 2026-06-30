import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db/mongodb";
import User from "@/lib/db/models/User";
import Vendor from "@/lib/db/models/Vendor";
import Labourer from "@/lib/db/models/Labourer";
import { verifyAdminRequest } from "@/lib/utils/adminAuth";

export async function POST(request) {
  if (!verifyAdminRequest(request)) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectDB();
    const body = await request.json();
    const { type, name, email, phone, password, businessName, category, address, skill, dailyRate } = body;

    if (type === "labourer") {
      if (!name || !phone || !skill) {
        return NextResponse.json({ success: false, message: "Name, phone, and skill are required for labourers" }, { status: 400 });
      }

      const existingLabourer = await Labourer.findOne({ phone });
      if (existingLabourer) {
        return NextResponse.json({ success: false, message: "A worker with this phone number is already registered" }, { status: 400 });
      }

      let userId = null;
      try {
        const existingUser = await User.findOne({ phone });
        if (existingUser) userId = existingUser._id;
      } catch (e) {}

      const newLabourer = await Labourer.create({
        userId,
        name,
        phone,
        whatsapp: phone,
        role: skill,
        category: skill,
        area: address,
        dailyRate: dailyRate ? Number(dailyRate) : 0,
        isApproved: true,
        rating: 0,
        reviewCount: 0
      });

      return NextResponse.json({ 
        success: true, 
        message: "Labourer profile created successfully.",
        user: newLabourer
      }, { status: 201 });
    }

    if (!type || !name || !email || !phone || !password) {
      return NextResponse.json({ success: false, message: "Missing required core fields (name, email, phone, password)" }, { status: 400 });
    }

    // Check existing User
    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
      return NextResponse.json({ success: false, message: "Email or Phone is already registered" }, { status: 400 });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let role = "user";
    if (type === "vendor") role = "vendor";
    if (type === "labourer") role = "user"; // Labourers use 'user' role for login, unless we added a labourer role.

    const userData = {
      name,
      email,
      phone,
      password: hashedPassword,
      role: role,
      verified: true, // Auto-verified since admin is creating
    };

    if (type === "vendor") {
      if (!businessName || !category) {
         return NextResponse.json({ success: false, message: "Business Name and Category are required for vendors" }, { status: 400 });
      }
      userData.businessName = businessName;
      userData.category = category;
      userData.address = address;
      
      const regCode = 'GAYA-VND-' + Math.random().toString(36).substr(2, 6).toUpperCase();
      userData.regCode = regCode;
    }

    const newUser = await User.create(userData);

    if (type === "vendor") {
      await Vendor.create({
        userId: newUser._id,
        regCode: userData.regCode,
        name: businessName,
        category: category,
        address: address,
        isApproved: true, // Auto-approved
      });
    }

    return NextResponse.json({ 
      success: true, 
      message: `${type.charAt(0).toUpperCase() + type.slice(1)} account created successfully.`,
      user: newUser
    }, { status: 201 });

  } catch (error) {
    console.error("Admin Create Account Error:", error);
    return NextResponse.json({ success: false, message: error.message || "Server error during account creation" }, { status: 500 });
  }
}
