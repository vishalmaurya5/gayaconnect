import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db/mongodb'
import { verifyAdminRequest, buildCityQuery } from '@/lib/utils/adminAuth'
import Vendor from '@/lib/db/models/Vendor'
import User from '@/lib/db/models/User'
import AuditLog from '@/lib/db/models/AuditLog'

export async function GET(request) {
  try {
    await connectDB()
    const adminUser = verifyAdminRequest(request)
    if (!adminUser) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const selectedCity = searchParams.get('city')

    let query = {}

    const cityQuery = buildCityQuery(adminUser, selectedCity, 'address');
    if (cityQuery['address']) {
      query['address'] = cityQuery['address'];
    }

    if (search) {
      const searchRegex = { $regex: search, $options: 'i' }
      
      // First find matching users
      const matchingUsers = await User.find({
        $or: [
          { name: searchRegex },
          { email: searchRegex },
          { phone: searchRegex }
        ]
      }).select('_id')
      
      const userIds = matchingUsers.map(u => u._id)

      query.$or = [
        { name: searchRegex },
        { businessName: searchRegex },
        { category: searchRegex },
        { address: searchRegex },
        { vendorId: searchRegex },
        { userId: { $in: userIds } }
      ]
    }

    const vendors = await Vendor.find(query).populate('userId', 'email phone name').sort('-createdAt')
    return NextResponse.json({ success: true, vendors })
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    await connectDB()
    const adminUser = verifyAdminRequest(request)
    if (!adminUser) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const user = new User({
      name: body.name,
      email: body.email,
      phone: body.phone,
      role: 'vendor',
      password: body.password || 'GayaSeva@123'
    })
    await user.save()

    let finalAddress = body.address;
    if (adminUser.role !== 'SUPER_ADMIN' && adminUser.assignedCities?.length > 0) {
      finalAddress = `${body.address ? body.address + ', ' : ''}${adminUser.assignedCities[0]}`;
    }

    const vendor = new Vendor({
      userId: user._id,
      name: body.businessName || body.name,
      category: body.category,
      address: finalAddress,
      description: body.description,
      isApproved: true,
      isActive: true
    })
    await vendor.save()

    await AuditLog.create({
      adminId: adminUser._id || 'admin',
      action: 'CREATE_VENDOR',
      resource: 'Vendor',
      resourceId: vendor._id,
      details: { businessName: vendor.name }
    })

    return NextResponse.json({ success: true, vendor })
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}
