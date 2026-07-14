import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongodb';
import Job from '@/lib/db/models/Job';
import Vendor from '@/lib/db/models/Vendor';
import { getAuthenticatedUser } from '@/lib/security/auth';
import { validateImageDataUrl } from '@/lib/utils/imageUpload';
import { isValidJobSaleCategory, DEFAULT_JOB_SALE_CATEGORY } from '@/lib/utils/jobSaleCategories';

export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const vendorId = searchParams.get('vendorId');
    const location = searchParams.get('location');
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const sort = searchParams.get('sort') || 'newest';

    const query = { isActive: true };
    if (type && type !== 'all') query.type = type;
    if (vendorId) query.vendorId = vendorId;
    if (location) query.location = { $regex: location, $options: 'i' };
    if (category && category !== 'all') query.category = category;
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } }
      ];
    }
    
    let sortOptions = {};
    switch(sort) {
      case 'price_asc':
        sortOptions = { salaryOrPrice: 1 };
        break;
      case 'price_desc':
        sortOptions = { salaryOrPrice: -1 };
        break;
      case 'oldest':
        sortOptions = { createdAt: 1 };
        break;
      case 'newest':
      default:
        sortOptions = { createdAt: -1 };
        break;
    }

    const jobs = await Job.find(query)
      .populate('vendorId', 'name category address location')
      .sort(sortOptions);

    return NextResponse.json({ success: true, jobs });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user || (user.role !== 'vendor' && user.role !== 'admin')) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const body = await request.json();

    let vendorId = null;
    if (user.role === 'vendor') {
      const vendor = await Vendor.findOne({ userId: user._id });
      if (!vendor) {
        return NextResponse.json({ success: false, message: 'Vendor profile not found' }, { status: 404 });
      }
      vendorId = vendor._id;
    }

    const job = new Job({
      title: body.title,
      description: body.description,
      type: body.type, // 'job' or 'sale'
      category: isValidJobSaleCategory(body.category) ? body.category : DEFAULT_JOB_SALE_CATEGORY,
      salaryOrPrice: body.salaryOrPrice,
      location: body.location,
      vendorId: vendorId,
      postedByAdmin: user.role === 'admin',
      isActive: true,
      image: body.image ? validateImageDataUrl(body.image, 'Sale image', 100 * 1024, '100 KB') : undefined
    });
    
    await job.save();
    return NextResponse.json({ success: true, job });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
