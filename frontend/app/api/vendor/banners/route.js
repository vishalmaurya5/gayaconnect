import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongodb';
import Vendor from '@/lib/db/models/Vendor';
import Banner from '@/lib/db/models/Banner';
import { getAuthenticatedUser } from '@/lib/security/auth';

export async function POST(request) {
  try {
    await connectDB();
    const user = await getAuthenticatedUser(request);
    
    if (!user) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }
    
    const vendor = await Vendor.findOne({ userId: user._id });
    if (!vendor) {
      return NextResponse.json({ success: false, message: 'Vendor profile not found' }, { status: 404 });
    }
    
    if (vendor.bannerStatus !== 'approved') {
      return NextResponse.json({ success: false, message: 'You must have an approved banner request to post a banner' }, { status: 403 });
    }
    
    const body = await request.json();
    const { title, imageUrl, link } = body;
    
    if (!title || !imageUrl) {
      return NextResponse.json({ success: false, message: 'Title and Image URL are required' }, { status: 400 });
    }
    
    // Create the active banner
    const newBanner = await Banner.create({
      vendorId: vendor._id,
      title,
      imageUrl,
      link,
      isActive: true,
      adminApproved: true,
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days active
    });
    
    // Reset banner status to none after posting
    await Vendor.findByIdAndUpdate(vendor._id, { bannerStatus: 'none' });
    
    return NextResponse.json({ success: true, message: 'Banner posted successfully', banner: newBanner });
    
  } catch (error) {
    console.error('Vendor banner post error:', error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}
