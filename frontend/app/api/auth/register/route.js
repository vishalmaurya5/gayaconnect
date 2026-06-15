import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db/mongodb'
import User from '@/lib/db/models/User'
import Vendor from '@/lib/db/models/Vendor'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export async function POST(request) {
  try {
    await connectDB()
    const body = await request.json()
    const { name, phone, email, password, role, ...vendorData } = body

    let user = await User.findOne({ $or: [{ phone }, { email }] })
    if (user) {
      return NextResponse.json({ success: false, message: 'User already exists with this phone or email' }, { status: 400 })
    }

    user = new User({
      name,
      phone,
      email,
      password,
      role: role || 'user'
    })
    await user.save()

    if (user.role === 'vendor') {
      const vendor = new Vendor({
        userId: user._id,
        name: vendorData.businessName || name,
        category: vendorData.category,
        address: vendorData.address,
        isApproved: false
      })
      await vendor.save()
    }

    const token = jwt.sign(
      { id: user._id, role: user.role, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    )

    return NextResponse.json({ success: true, token, user })
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}
