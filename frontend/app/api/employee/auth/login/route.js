import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db/mongodb";
import User from "@/lib/db/models/User";
import Employee from "@/lib/db/models/Employee";
import { createUserSession } from "@/lib/security/auth";

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const { email, password } = body;
    const loginId = email?.trim();

    if (!loginId || !password) {
      return NextResponse.json({ success: false, message: "User ID/Email and password are required" }, { status: 400 });
    }

    // Search Employee record by email or empId
    let employee = await Employee.findOne({
      $or: [
        { email: loginId.toLowerCase() },
        { empId: loginId.toUpperCase() },
        { phone: loginId }
      ]
    });

    // Search User record by email or phone
    const user = await User.findOne({
      $or: [
        { email: loginId.toLowerCase() },
        { phone: loginId }
      ]
    }).select("+password");

    if (!user && !employee) {
      return NextResponse.json({ success: false, message: "Invalid Employee credentials" }, { status: 401 });
    }

    let isMatch = false;
    if (user && user.password) {
      isMatch = await bcrypt.compare(password, user.password);
    }
    
    // Fallback comparison with Employee.password plaintext field if user bcrypt password match failed
    if (!isMatch && employee && employee.password) {
      isMatch = (password === employee.password);
    }

    if (!isMatch) {
      return NextResponse.json({ success: false, message: "Invalid User ID or Password" }, { status: 401 });
    }

    // Find linked employee record if not found earlier
    if (!employee && user) {
      employee = await Employee.findOne({ $or: [{ userId: user._id }, { email: user.email }] });
    }

    const token = jwt.sign(
      { 
        userId: user?._id || employee?._id, 
        empId: employee?.empId,
        role: 'employee',
        email: user?.email || employee?.email,
        name: user?.name || employee?.name
      },
      process.env.JWT_SECRET || "fallback_secret_key",
      { expiresIn: "7d" }
    );

    const response = NextResponse.json({ 
      success: true, 
      message: "Employee Login Successful",
      token,
      employee: employee || {
        name: user.name,
        email: user.email,
        empId: 'GS-EMP-0001',
        department: 'General',
        designation: 'Staff'
      }
    });

    if (user) {
      await createUserSession(response, user, true);
    }

    return response;

  } catch (error) {
    console.error("Employee Login Error:", error);
    return NextResponse.json({ success: false, message: "Server error during login" }, { status: 500 });
  }
}
