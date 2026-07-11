import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongodb';
import Feedback from '@/lib/db/models/Feedback';
import Vendor from '@/lib/db/models/Vendor';

async function recalculateVendorRating(vendorId) {
  if (!vendorId) return;
  const feedbacks = await Feedback.find({ vendorId, type: 'vendor', status: 'approved' });
  
  if (feedbacks.length === 0) {
    await Vendor.findByIdAndUpdate(vendorId, { rating: 4.5, totalReviews: 0 });
    return;
  }
  
  const total = feedbacks.reduce((sum, f) => sum + f.rating, 0);
  const avg = (total / feedbacks.length).toFixed(1);
  
  await Vendor.findByIdAndUpdate(vendorId, { 
    rating: parseFloat(avg), 
    totalReviews: feedbacks.length 
  });
}

export async function PATCH(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    if (!status || !['pending', 'approved', 'rejected'].includes(status)) {
      return NextResponse.json(
        { success: false, message: 'Invalid status' },
        { status: 400 }
      );
    }

    const feedback = await Feedback.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!feedback) {
      return NextResponse.json(
        { success: false, message: 'Feedback not found' },
        { status: 404 }
      );
    }

    if (feedback.type === 'vendor' && feedback.vendorId) {
      await recalculateVendorRating(feedback.vendorId);
    }

    return NextResponse.json({ success: true, data: feedback });
  } catch (error) {
    console.error('Error updating feedback status:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update feedback status' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    const feedback = await Feedback.findByIdAndDelete(id);

    if (!feedback) {
      return NextResponse.json(
        { success: false, message: 'Feedback not found' },
        { status: 404 }
      );
    }

    if (feedback.type === 'vendor' && feedback.vendorId) {
      await recalculateVendorRating(feedback.vendorId);
    }

    return NextResponse.json({ success: true, message: 'Feedback deleted successfully' });
  } catch (error) {
    console.error('Error deleting feedback:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete feedback' },
      { status: 500 }
    );
  }
}
