import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongodb';
import ExploreCity from '@/lib/db/models/ExploreCity';
import { verifyAdminRequest } from '@/lib/utils/adminAuth';

export async function PUT(request, { params }) {
  try {
    const auth = verifyAdminRequest(request);
    if (!auth) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    await connectDB();
    const body = await request.json();

    const updatedCity = await ExploreCity.findByIdAndUpdate(
      id,
      { ...body, updatedAt: new Date() },
      { new: true }
    );

    if (!updatedCity) {
      return NextResponse.json({ success: false, message: 'City not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, city: updatedCity });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const auth = verifyAdminRequest(request);
    if (!auth) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    await connectDB();

    const deletedCity = await ExploreCity.findByIdAndDelete(id);
    if (!deletedCity) {
      return NextResponse.json({ success: false, message: 'City not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'City deleted successfully' });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
