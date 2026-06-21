import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongodb';
import Vehicle from '@/lib/db/models/Vehicle';

export async function GET(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const ownerId = searchParams.get('ownerId');

    let query = {};
    
    if (status) {
      query.status = status;
    } else {
      // By default, only return approved vehicles for public listing
      query.status = 'approved';
    }

    if (ownerId) {
      query.ownerId = ownerId;
      // If asking for a specific owner's vehicles, they might want to see pending ones too
      if (!status) delete query.status; 
    }

    // Sort by newest first
    const vehicles = await Vehicle.find(query).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, vehicles });
  } catch (error) {
    console.error('Fetch Vehicles Error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
