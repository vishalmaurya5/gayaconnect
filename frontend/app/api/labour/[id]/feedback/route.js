import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongodb';
import Labourer from '@/lib/db/models/Labourer';
import LabourReview from '@/lib/db/models/LabourReview';

export async function POST(request, props) {
  try {
    const params = await props.params;
    await connectDB();

    const { customerName, customerPhone, rating, comment } = await request.json();

    if (!customerName || !rating || !comment) {
      return NextResponse.json({ success: false, message: 'Name, rating and feedback comment are required.' }, { status: 400 });
    }

    const labour = await Labourer.findById(params.id);
    if (!labour) {
      return NextResponse.json({ success: false, message: 'Labourer profile not found' }, { status: 404 });
    }

    const newReview = new LabourReview({
      labourId: params.id,
      customerName: customerName.trim(),
      customerPhone: customerPhone ? customerPhone.trim() : '',
      rating: Number(rating),
      comment: comment.trim(),
      status: 'APPROVED'
    });

    await newReview.save();

    // Recalculate rating
    const allReviews = await LabourReview.find({ labourId: params.id, status: 'APPROVED' });
    const count = allReviews.length;
    const avg = allReviews.reduce((sum, r) => sum + r.rating, 0) / count;

    labour.rating = Number(avg.toFixed(1));
    labour.reviewCount = count;
    await labour.save();

    return NextResponse.json({ 
      success: true, 
      message: 'Feedback submitted successfully!',
      review: newReview,
      rating: labour.rating,
      reviewCount: labour.reviewCount
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
