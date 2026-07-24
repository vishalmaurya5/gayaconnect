import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongodb';
import ExplorePlace from '@/lib/db/models/ExplorePlace';
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

    const updatedPlace = await ExplorePlace.findByIdAndUpdate(
      id,
      { ...body, updatedAt: new Date() },
      { new: true }
    );

    if (!updatedPlace) {
      return NextResponse.json({ success: false, message: 'Place not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, place: updatedPlace });
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

    const deletedPlace = await ExplorePlace.findByIdAndDelete(id);
    if (!deletedPlace) {
      return NextResponse.json({ success: false, message: 'Place not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Place deleted successfully' });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
