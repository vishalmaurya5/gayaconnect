import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongodb';
import CallLog from '@/lib/db/models/CallLog';
import { getAuthenticatedUser } from '@/lib/security/auth';

export async function POST(request) {
  try {
    await connectDB();
    const user = await getAuthenticatedUser(request);

    const body = await request.json();
    const { receiverId, receiverName, receiverType, receiverPhone, actionType } = body;

    if (!receiverId || !receiverName || !receiverType || !receiverPhone || !actionType) {
      return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
    }

    const log = await CallLog.create({
      callerId: user ? user._id : null,
      callerName: user ? user.name : 'Guest',
      callerPhone: user ? user.phone : 'Unknown',
      receiverId,
      receiverName,
      receiverType,
      receiverPhone,
      actionType
    });

    return NextResponse.json({ success: true, log });
  } catch (error) {
    console.error('POST /api/calls error:', error);
    return NextResponse.json({ success: false, message: 'Failed to log call' }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    await connectDB();
    const user = await getAuthenticatedUser(request);

    if (!user) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const logs = await CallLog.find({ callerId: user._id }).sort({ createdAt: -1 }).limit(50).lean();
    return NextResponse.json({ success: true, calls: logs });
  } catch (error) {
    console.error('GET /api/calls error:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch calls' }, { status: 500 });
  }
}
