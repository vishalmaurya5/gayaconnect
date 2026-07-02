import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongodb';
import Vehicle from '@/lib/db/models/Vehicle';

export async function GET(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const ownerId = searchParams.get('ownerId');
    const categoryId = searchParams.get('categoryId');
    const location = searchParams.get('location');
    const vehicleName = searchParams.get('vehicleName');
    const matchMode = searchParams.get('match_mode') || 'all'; // 'all' (AND) or 'any' (OR)

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

    // Remove DB-level category/vehicleName filters to avoid missing location-only matches in OR mode.
    // We will do all search filtering in JS since location requires a populated field.
    // Sort by newest first and populate owner details (for location/address)
    let vehicles = await Vehicle.find(query)
      .populate('ownerId', 'name phone address')
      .populate('categoryId', 'name')
      .sort({ createdAt: -1 });

    // JS Filtering approach to handle populated fields properly
    if (categoryId || vehicleName || location) {
       vehicles = vehicles.filter(v => {
         const matchCat = categoryId ? (v.categoryId?._id?.toString() === categoryId) : false;
         const matchName = vehicleName ? (v.vehicleName?.toLowerCase().includes(vehicleName.toLowerCase())) : false;
         const matchLoc = location ? (v.ownerId?.address?.toLowerCase().includes(location.toLowerCase())) : false;

         if (matchMode === 'any') {
           // Match ANY provided filters
           return (categoryId && matchCat) || (vehicleName && matchName) || (location && matchLoc);
         } else {
           // Match ALL provided filters
           if (categoryId && !matchCat) return false;
           if (vehicleName && !matchName) return false;
           if (location && !matchLoc) return false;
           return true;
         }
       });
    }

    return NextResponse.json({ success: true, vehicles });
  } catch (error) {
    console.error('Fetch Vehicles Error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
