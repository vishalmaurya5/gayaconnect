import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongodb';
import Feedback from '@/lib/db/models/Feedback';
import Vendor from '@/lib/db/models/Vendor';

export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const vendorId = searchParams.get('vendorId');
    const limit = parseInt(searchParams.get('limit')) || 20;

    const query = {};
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
    const { type, vendorId, name, phone, rating, comment } = body;

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

    // Auto approve vendor customer feedback for real-time display
    const feedback = await Feedback.create({
      type,
      vendorId: vendorId || null,
      name,
      phone: phone || '',
      rating: Number(rating),
      comment,
      status: 'approved'
    });

    // Update vendor rating and total reviews in DB
    if (type === 'vendor' && vendorId) {
      try {
        const allReviews = await Feedback.find({ vendorId, type: 'vendor', status: 'approved' });
        const count = allReviews.length;
        const avg = count > 0 ? (allReviews.reduce((sum, r) => sum + r.rating, 0) / count) : Number(rating);
        await Vendor.findByIdAndUpdate(vendorId, {
          rating: Number(avg.toFixed(1)),
          totalReviews: count
        });
      } catch (err) {
        console.error('Error updating vendor aggregate rating:', err);
      }
    }

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
