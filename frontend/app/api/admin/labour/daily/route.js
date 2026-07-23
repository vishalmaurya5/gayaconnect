import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongodb';
import { verifyAdminRequest } from '@/lib/utils/adminAuth';
import LabourShift from '@/lib/db/models/LabourShift';
import Labourer from '@/lib/db/models/Labourer';

export async function GET(request) {
  try {
    await connectDB();
    const adminUser = verifyAdminRequest(request);
    if (!adminUser) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');

    let shifts = await LabourShift.find().populate('labourId', 'name phone photo role category district location').sort('-createdAt');

    if (search) {
      const lower = search.toLowerCase();
      shifts = shifts.filter(s => 
        s.labourId?.name?.toLowerCase().includes(lower) ||
        s.siteName?.toLowerCase().includes(lower) ||
        s.location?.toLowerCase().includes(lower)
      );
    }

    return NextResponse.json({ success: true, shifts });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const adminUser = verifyAdminRequest(request);
    if (!adminUser) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { labourId, siteName, clientName, location, date, shiftType, dailyRate, notes } = body;

    if (!labourId || !siteName || !location || !dailyRate) {
      return NextResponse.json({ success: false, message: 'Worker, site, location, and daily rate are required.' }, { status: 400 });
    }

    const newShift = new LabourShift({
      labourId,
      siteName,
      clientName: clientName || '',
      location,
      date: date || new Date().toISOString().split('T')[0],
      shiftType: shiftType || 'Full Shift',
      dailyRate: Number(dailyRate),
      status: 'SCHEDULED',
      notes: notes || ''
    });

    await newShift.save();
    const populated = await LabourShift.findById(newShift._id).populate('labourId', 'name phone photo role category district location');

    return NextResponse.json({ success: true, shift: populated });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
