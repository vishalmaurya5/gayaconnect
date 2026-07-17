import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db/mongodb'
import { verifyAdminRequest } from '@/lib/utils/adminAuth'
import Labourer from '@/lib/db/models/Labourer'
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
    let query = {}

    if (search) {
      const searchRegex = { $regex: search, $options: 'i' }
      query.$or = [
        { name: searchRegex },
        { phone: searchRegex },
        { profession: searchRegex },
        { location: searchRegex },
        { category: searchRegex },
        { lwfId: searchRegex },
        { aadhaarNumber: searchRegex }
      ]
    }

    const labourers = await Labourer.find(query).populate('userId', 'email phone name').sort('-createdAt')
    return NextResponse.json({ success: true, labourers })
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
    const count = await Labourer.countDocuments({ lwfId: { $exists: true } });
    const lwfId = `GS-LWF-${String(count + 1).padStart(6, '0')}`;

    const labour = new Labourer({
      name: body.name,
      profession: body.profession,
      location: body.location,
      phone: body.phone,
      experience: body.experience,
      aadhaarNumber: body.aadhaarNumber,
      bloodGroup: body.bloodGroup,
      state: body.state,
      district: body.district,
      isApproved: true,
      status: 'APPROVED',
      lwfId
    })
    await labour.save()

    await AuditLog.create({
      adminId: adminUser._id || 'admin',
      action: 'CREATE_LABOUR',
      resource: 'Labour',
      resourceId: labour._id,
      details: { name: labour.name }
    })

    return NextResponse.json({ success: true, labour })
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}
