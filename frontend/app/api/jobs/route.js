import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongodb';
import Job from '@/lib/db/models/Job';
import Vendor from '@/lib/db/models/Vendor';
import { getAuthenticatedUser } from '@/lib/security/auth';
import { validateImageDataUrl } from '@/lib/utils/imageUpload';

export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const vendorId = searchParams.get('vendorId');

    const query = { isActive: true };
    if (type && type !== 'all') query.type = type;
    if (vendorId) query.vendorId = vendorId;

    const jobs = await Job.find(query)
      .populate('vendorId', 'name category address location')
      .sort('-createdAt');

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
