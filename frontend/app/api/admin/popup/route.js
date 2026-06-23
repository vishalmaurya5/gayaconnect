import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongodb';
import Setting from '@/lib/db/models/Setting';
import { verifyAdminRequest } from '@/lib/utils/adminAuth';

export async function GET(request) {
  try {
    await connectDB();
    const setting = await Setting.findOne({ key: 'popupAd' }).lean();
    
    // Default values if setting doesn't exist
    if (!setting) {
      return NextResponse.json({ success: true, data: { isActive: false, imageUrl: '' } });
    }

    return NextResponse.json({ success: true, data: setting.value });
  } catch (error) {
    console.error('GET /api/admin/popup error:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch popup settings' }, { status: 500 });
  }
}

export async function POST(request) {
  // Only Admins can update the popup ad
  if (!verifyAdminRequest(request)) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectDB();
    const body = await request.json();
    const { isActive, imageUrl } = body;

    // Validate inputs
    if (typeof isActive !== 'boolean') {
      return NextResponse.json({ success: false, message: 'isActive must be a boolean' }, { status: 400 });
    }

    const newValue = { isActive, imageUrl: imageUrl || '' };

    // Upsert the setting
    const setting = await Setting.findOneAndUpdate(
      { key: 'popupAd' },
      { key: 'popupAd', value: newValue, updatedAt: Date.now() },
      { new: true, upsert: true }
    );

    return NextResponse.json({ success: true, message: 'Popup advertisement updated', data: setting.value });
  } catch (error) {
    console.error('POST /api/admin/popup error:', error);
    return NextResponse.json({ success: false, message: 'Failed to update popup settings' }, { status: 500 });
  }
}
