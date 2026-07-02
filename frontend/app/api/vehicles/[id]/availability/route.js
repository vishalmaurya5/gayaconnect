import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongodb';
import Vehicle from '@/lib/db/models/Vehicle';

export async function PATCH(request, props) {
  try {
    await connectDB();
    const params = await props.params;
    const { id } = params;
    const { availability_status } = await request.json();

    if (!['available', 'booked'].includes(availability_status)) {
      return NextResponse.json({ success: false, message: 'Invalid availability status' }, { status: 400 });
    }

    const vehicle = await Vehicle.findByIdAndUpdate(
      id,
      { $set: { availability_status } },
      { new: true }
    );

    if (!vehicle) {
      return NextResponse.json({ success: false, message: 'Vehicle not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, vehicle });
  } catch (error) {
    console.error('Update Vehicle Availability Error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
