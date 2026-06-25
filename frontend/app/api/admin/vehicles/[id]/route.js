import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongodb';
import Vehicle from '@/lib/db/models/Vehicle';

export async function PATCH(request, props) {
  try {
    const params = await props.params;
    await connectDB();
    const { id } = params;
    const { status } = await request.json();

    if (!['approved', 'rejected', 'pending'].includes(status)) {
      return NextResponse.json({ success: false, message: 'Invalid status' }, { status: 400 });
    }

    const vehicle = await Vehicle.findByIdAndUpdate(id, { status }, { new: true });
    
    if (!vehicle) {
      return NextResponse.json({ success: false, message: 'Vehicle not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: `Vehicle ${status} successfully`, vehicle });
  } catch (error) {
    console.error('Update Vehicle Status Error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request, props) {
  try {
    const params = await props.params;
    await connectDB();
    const { id } = params;

    const vehicle = await Vehicle.findByIdAndDelete(id);
    
    if (!vehicle) {
      return NextResponse.json({ success: false, message: 'Vehicle not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Vehicle request deleted' });
  } catch (error) {
    console.error('Delete Vehicle Error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
