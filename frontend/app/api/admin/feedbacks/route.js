import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongodb';
import Feedback from '@/lib/db/models/Feedback';

export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const status = searchParams.get('status');
    const vendorId = searchParams.get('vendorId');

    const query = {};
    if (type) query.type = type;
    if (status) query.status = status;
    if (vendorId) query.vendorId = vendorId;

    const feedbacks = await Feedback.find(query)
      .populate('vendorId', 'name')
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: feedbacks });
  } catch (error) {
    console.error('Error fetching admin feedbacks:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch feedbacks' },
      { status: 500 }
    );
  }
}
