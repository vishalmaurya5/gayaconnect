import { NextResponse } from 'next/server'
export const dynamic = 'force-dynamic';
import { connectDB } from '@/lib/db/mongodb'
import Vendor from '@/lib/db/models/Vendor'
import { verifyAdminRequest, buildCityQuery } from '@/lib/utils/adminAuth'

export async function GET(request) {
  try {
    await connectDB()
    const adminData = verifyAdminRequest(request);
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const subCategory = searchParams.get('subCategory')
    const search = searchParams.get('search')
    const area = searchParams.get('area')
    const sort = searchParams.get('sort') || 'newest'
    const limit = parseInt(searchParams.get('limit')) || 20
    const page = parseInt(searchParams.get('page')) || 1
    const skip = (page - 1) * limit

    const query = { isDeleted: false, isApproved: true } // Assuming we only want approved vendors to show up
    
    // Allow seeing unapproved vendors if requested from admin dashboard (this is basic, but we'll stick to isDeleted for now or allow a status filter)
    const status = searchParams.get('status')
    if (status === 'all') {
      delete query.isApproved
    } else if (status) {
      query.status = status 
      delete query.isApproved 
    }

    // Apply Admin City Isolation
    if (adminData && adminData.role !== 'SUPER_ADMIN') {
      const cityQuery = buildCityQuery(adminData, null, 'address.city');
      if (cityQuery['address.city']) {
        query['address.city'] = cityQuery['address.city'];
      }
    }

    if (category) query.category = category
    if (subCategory) query.subCategory = subCategory
    
    if (area) {
      query.$or = [
        ...(query.$or || []),
        { 'address.city': { $regex: area, $options: 'i' } },
        { 'address.state': { $regex: area, $options: 'i' } },
        { 'address.addressLine': { $regex: area, $options: 'i' } }
      ]
    }

    if (search) {
      const searchRegex = { $regex: search, $options: 'i' }
      const searchConditions = [
        { name: searchRegex },
        { description: searchRegex },
        { 'address.addressLine': searchRegex },
        { 'address.city': searchRegex },
        { category: searchRegex },
        { subCategory: searchRegex },
      ]
      
      if (query.$or) {
        query.$and = [{ $or: query.$or }, { $or: searchConditions }]
        delete query.$or
      } else {
        query.$or = searchConditions
      }
    }

    let sortOptions = {}
    switch(sort) {
      case 'rating_desc':
        sortOptions = { rating: -1, createdAt: -1 }
        break
      case 'name_asc':
        sortOptions = { name: 1 }
        break
      case 'name_desc':
        sortOptions = { name: -1 }
        break
      case 'newest':
      default:
        sortOptions = { createdAt: -1 }
        break
    }

    const [vendors, total] = await Promise.all([
      Vendor.find(query)
        .populate('userId', 'name email phone')
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .lean(),
      Vendor.countDocuments(query)
    ])

    return NextResponse.json({ 
      success: true, 
      vendors,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    await connectDB()
    const body = await request.json()
    const adminData = verifyAdminRequest(request);
    
    // Auto-assign city if created by City Admin
    if (adminData && adminData.role !== 'SUPER_ADMIN' && adminData.assignedCities?.length > 0) {
      if (!body.address) body.address = {};
      body.address.city = adminData.assignedCities[0];
    }

    const vendor = new Vendor({
      ...body,
      isApproved: false,
    })
    await vendor.save()

    return NextResponse.json({ success: true, vendor })
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}
