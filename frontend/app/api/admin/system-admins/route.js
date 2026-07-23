import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongodb';
import User from '@/lib/db/models/User';
import bcrypt from 'bcryptjs';
import { verifyAdminRequest } from '@/lib/utils/adminAuth';

export async function GET(request) {
  try {
    const admin = verifyAdminRequest(request);
    if (!admin) {
      return NextResponse.json({ success: false, message: 'Admin access required' }, { status: 401 });
    }

    await connectDB();
    const admins = await User.find({ adminRole: { $in: ['SUPER_ADMIN', 'ADMIN'] } })
      .select('-password -resetPasswordToken -resetPasswordExpire')
      .lean();

    return NextResponse.json({ success: true, admins });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const admin = verifyAdminRequest(request);
    if (!admin) {
      return NextResponse.json({ success: false, message: 'Admin access required' }, { status: 401 });
    }

    const { name, email, phone, password, role, assignedCity } = await request.json();
    if (!name || !email || !password || !role) {
      return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
    }

    await connectDB();
    const existing = await User.findOne({ $or: [{ email }, { phone }] });
    if (existing) {
      return NextResponse.json({ success: false, message: 'User with this email/phone already exists' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      role: 'admin',
      adminRole: role, // 'SUPER_ADMIN' or 'ADMIN'
      assignedCities: assignedCity ? [assignedCity] : [],
      permissions: role === 'ADMIN' ? ['APPROVE_RECORDS', 'VIEW_REPORTS'] : ['ALL']
    });

    return NextResponse.json({ success: true, message: 'Admin created' });
  } catch (error) {
    console.error('Create Admin error:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
