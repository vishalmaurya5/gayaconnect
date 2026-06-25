import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db/mongodb";
import User from "@/lib/db/models/User";
import { createUserSession } from "@/lib/security/auth";
import { toAuthUser } from "@/lib/utils/contactAccess";

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const { email, identifier, password, role } = body;
    const loginId = (identifier || email)?.trim();

    if (!loginId || !password) {
      return NextResponse.json({ error: "Email/Mobile and password are required" }, { status: 400 });
    }

    // Find user by email or phone and explicitly select password
    const user = await User.findOne({
      $or: [
        { email: loginId.toLowerCase() },
        { phone: loginId }
      ]
    }).select("+password");
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Block deleted accounts
    if (user.isDeleted) {
      return NextResponse.json({ error: "Account has been deleted" }, { status: 403 });
    }

    // Role check (allow admin to login from anywhere)
    if (role && user.role !== role && user.role !== "admin") {
      return NextResponse.json({ error: `Account exists but not registered as a ${role}` }, { status: 403 });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET || "fallback_secret_key",
      { expiresIn: "7d" }
    );

    // Return standardized user object
    const userObj = toAuthUser(user);

    const response = NextResponse.json({ success: true, user: userObj, token });

    // Set HTTP-only cookies for Server Components
    await createUserSession(response, user, true);

    return response;

  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json({ error: "Server error during login" }, { status: 500 });
  }
}
