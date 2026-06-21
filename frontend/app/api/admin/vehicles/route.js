import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongodb';
import Vehicle from '@/lib/db/models/Vehicle';
import User from '@/lib/db/models/User';

export async function POST(request) {
  try {
    await connectDB();
    
    const data = await request.json();
    const { ownerId, ownerName, phone, vehicleName, vehicleModel, vehicleNumber, dlNumber } = data;

    // Optional: Can assign to an existing user or admin's own ID
    let finalOwnerId = ownerId;
    if (!finalOwnerId) {
      // Find an admin user to assign as owner if none provided
      const adminUser = await User.findOne({ role: 'admin' });
      if (adminUser) finalOwnerId = adminUser._id;
      else return NextResponse.json({ success: false, message: 'No admin user found to assign ownership' }, { status: 400 });
    }

    const vehicle = await Vehicle.create({
      ownerId: finalOwnerId,
      ownerName: ownerName || 'Admin',
      phone: phone || 'N/A',
      vehicleName,
      vehicleModel,
      vehicleNumber,
      dlNumber: dlNumber || 'N/A',
      isCommercial: true,
      liabilityAccepted: true,
      status: 'approved', // Admin bypasses pending status
      paymentStatus: 'completed' // Admin bypasses payment
    });

    return NextResponse.json({ success: true, message: 'Vehicle added directly by Admin', vehicle });
  } catch (error) {
    console.error('Admin Create Vehicle Error:', error);
    return NextResponse.json({ success: false, message: error.message || 'Internal server error' }, { status: 500 });
  }
}
