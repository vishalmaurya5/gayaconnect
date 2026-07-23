import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db/mongodb";
import User from "@/lib/db/models/User";
import { createUserSession } from "@/lib/security/auth";
import { toAuthUser } from "@/lib/utils/contactAccess";
import { setAdminCookie } from "@/lib/utils/adminAuth";

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

    // Role check (allow admin and employee to login from main portal)
    if (role && user.role !== role && user.role !== "admin" && user.role !== "employee") {
      return NextResponse.json({ error: `Account exists but not registered as a ${role}` }, { status: 403 });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Generate JWT
    const token = jwt.sign(
      { 
        userId: user._id, 
        role: user.role, 
        adminRole: user.adminRole || (user.role === 'admin' ? 'SUPER_ADMIN' : 'NONE'),
        assignedCities: user.assignedCities || []
      },
      process.env.JWT_SECRET || "fallback_secret_key",
      { expiresIn: "7d" }
    );

    // Return standardized user object
    const userObj = toAuthUser(user);

    const response = NextResponse.json({ success: true, user: userObj, token });

    // Set HTTP-only cookies for Server Components
    await createUserSession(response, user, true);
    
    // Automatically grant admin dashboard access if the user is an admin or sub-admin
    if (user.role === "admin" || user.adminRole !== "NONE") {
      const actualAdminRole = user.adminRole && user.adminRole !== 'NONE' ? user.adminRole : 'SUPER_ADMIN';
      setAdminCookie(response, user._id.toString(), actualAdminRole, user.assignedCities || [], user.email, user.name);
    }

    return response;

  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json({ error: "Server error during login" }, { status: 500 });
  }
}
