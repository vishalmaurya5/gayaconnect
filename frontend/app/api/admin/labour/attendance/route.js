import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongodb';
import { verifyAdminRequest } from '@/lib/utils/adminAuth';
import LabourAttendance from '@/lib/db/models/LabourAttendance';
import Labourer from '@/lib/db/models/Labourer';

export async function GET(request) {
  try {
    await connectDB();
    const adminUser = verifyAdminRequest(request);
    if (!adminUser) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date') || new Date().toISOString().split('T')[0];
    const search = searchParams.get('search') || '';

    // Fetch all labourers
    let labourers = await Labourer.find({ isApproved: true }).select('name phone photo role category district lwfId');

    if (search) {
      const s = search.toLowerCase();
      labourers = labourers.filter(l => l.name?.toLowerCase().includes(s) || l.phone?.includes(s) || l.lwfId?.toLowerCase().includes(s));
    }

    // Fetch existing attendance logs for this date
    const logs = await LabourAttendance.find({ date });
    const logMap = {};
    logs.forEach(l => {
      logMap[String(l.labourId)] = l;
    });

    const result = labourers.map(labour => ({
      labour,
      attendance: logMap[String(labour._id)] || null
    }));

    return NextResponse.json({ success: true, date, records: result });
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
    const { labourId, date, status, checkInTime, checkOutTime, notes } = body;

    if (!labourId || !status) {
      return NextResponse.json({ success: false, message: 'Worker ID and status are required.' }, { status: 400 });
    }

    const targetDate = date || new Date().toISOString().split('T')[0];

    const attendance = await LabourAttendance.findOneAndUpdate(
      { labourId, date: targetDate },
      { 
        status,
        checkInTime: checkInTime || '09:00 AM',
        checkOutTime: checkOutTime || '06:00 PM',
        notes: notes || '',
        recordedBy: adminUser.name || 'Admin'
      },
      { upsert: true, new: true }
    );

    return NextResponse.json({ success: true, attendance });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
