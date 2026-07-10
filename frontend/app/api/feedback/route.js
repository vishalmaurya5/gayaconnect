import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongodb';
import Feedback from '@/lib/db/models/Feedback';

export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const vendorId = searchParams.get('vendorId');
    const status = searchParams.get('status') || 'approved'; // Default to approved for public queries
    const limit = parseInt(searchParams.get('limit')) || 10;

    const query = { status };
    if (type) query.type = type;
    if (vendorId) query.vendorId = vendorId;

    const feedbacks = await Feedback.find(query)
      .sort({ createdAt: -1 })
      .limit(limit);

    return NextResponse.json({ success: true, data: feedbacks });
  } catch (error) {
    console.error('Error fetching feedbacks:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch feedbacks' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const { type, vendorId, name, rating, comment } = body;

    if (!type || !name || !rating || !comment) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (type === 'vendor' && !vendorId) {
      return NextResponse.json(
        { success: false, message: 'Vendor ID is required for vendor feedback' },
        { status: 400 }
      );
    }

    const feedback = await Feedback.create({
      type,
      vendorId,
      name,
      rating,
      comment,
      status: 'pending' // Force pending state for new submissions
    });

    return NextResponse.json(
      { success: true, message: 'Feedback submitted successfully', data: feedback },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error submitting feedback:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to submit feedback' },
      { status: 500 }
    );
  }
}
