import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongodb';
import Employee from '@/lib/db/models/Employee';
import User from '@/lib/db/models/User';
import bcrypt from 'bcryptjs';

export async function GET(request) {
  try {
    await connectDB();
    const employees = await Employee.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, employees });
  } catch (error) {
    console.error('Error fetching employees:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const { 
      name, email, phone, aadharNumber, department, designation, 
      joiningDate, salary, bloodGroup, address, photo, customPassword 
    } = body;

    if (!name || !email || !phone || !aadharNumber) {
      return NextResponse.json(
        { success: false, message: 'Name, Email, Phone, and Aadhar Number are required' },
        { status: 400 }
      );
    }

    // Generate unique Employee ID e.g. GS-EMP-0001
    const count = await Employee.countDocuments();
    const empId = `GS-EMP-${String(count + 1).padStart(4, '0')}`;

    // Auto-generate password if not provided
    const rawPassword = customPassword || `Emp@${Math.floor(1000 + Math.random() * 9000)}`;
    const hashedPassword = await bcrypt.hash(rawPassword, 10);

    // Create or find User account for login
    let user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      user = await User.create({
        name,
        email: email.toLowerCase(),
        phone,
        password: hashedPassword,
        role: 'employee',
        verified: true
      });
    }

    // Create Employee record
    const employee = await Employee.create({
      empId,
      userId: user._id,
      name,
      email: email.toLowerCase(),
      phone,
      aadharNumber,
      department: department || 'General',
      designation: designation || 'Staff',
      joiningDate: joiningDate ? new Date(joiningDate) : new Date(),
      salary: salary ? Number(salary) : 25000,
      bloodGroup: bloodGroup || 'O+',
      address: address || 'Gaya, Bihar, India',
      status: 'ACTIVE',
      photo: photo || '',
      password: rawPassword
    });

    return NextResponse.json({
      success: true,
      message: 'Employee created successfully!',
      employee,
      credentials: {
        empId,
        email: email.toLowerCase(),
        phone,
        password: rawPassword,
        aadharNumber
      }
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating employee:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
