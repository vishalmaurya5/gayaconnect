import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongodb';
import ExploreCity from '@/lib/db/models/ExploreCity';
import { verifyAdminRequest } from '@/lib/utils/adminAuth';

export async function GET(request) {
  try {
    const auth = verifyAdminRequest(request);
    if (!auth) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const cities = await ExploreCity.find({}).sort({ displayOrder: 1, createdAt: 1 });
    return NextResponse.json({ success: true, cities });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const auth = verifyAdminRequest(request);
    if (!auth) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const body = await request.json();
    const { name, state, desc, isActive } = body;

    if (!name) {
      return NextResponse.json({ success: false, message: 'City name is required' }, { status: 400 });
    }

    const cityId = name.toLowerCase().replace(/[^a-z0-9]/g, '');

    const newCity = await ExploreCity.create({
      cityId,
      name,
      state: state || 'Bihar',
      desc: desc || '',
      isActive: isActive !== undefined ? isActive : true
    });

    return NextResponse.json({ success: true, city: newCity });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
