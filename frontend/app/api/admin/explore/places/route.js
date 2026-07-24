import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongodb';
import ExplorePlace from '@/lib/db/models/ExplorePlace';
import { verifyAdminRequest } from '@/lib/utils/adminAuth';

export async function GET(request) {
  try {
    const auth = verifyAdminRequest(request);
    if (!auth) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const places = await ExplorePlace.find({}).sort({ displayOrder: 1, createdAt: -1 });
    return NextResponse.json({ success: true, places });
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
    const { cityId, region, title, category, desc, longDesc, image, location, googleMapsUrl, isFeaturedHomepage } = body;

    if (!cityId || !title || !desc || !image || !location) {
      return NextResponse.json({ success: false, message: 'Required fields missing' }, { status: 400 });
    }

    const newPlace = await ExplorePlace.create({
      cityId,
      region: region || 'city',
      title,
      category: category || 'historical',
      desc,
      longDesc: longDesc || desc,
      image,
      location,
      googleMapsUrl: googleMapsUrl || '',
      isFeaturedHomepage: isFeaturedHomepage || false
    });

    return NextResponse.json({ success: true, place: newPlace });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
