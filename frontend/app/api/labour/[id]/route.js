import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongodb';
import Labourer from '@/lib/db/models/Labourer';
import LabourReview from '@/lib/db/models/LabourReview';

export async function GET(request, props) {
  try {
    const params = await props.params;
    await connectDB();

    const labour = await Labourer.findById(params.id);
    if (!labour) {
      return NextResponse.json({ success: false, message: 'Labourer profile not found' }, { status: 404 });
    }

    const reviews = await LabourReview.find({ labourId: params.id, status: 'APPROVED' }).sort('-createdAt');

    return NextResponse.json({ 
      success: true, 
      labour,
      reviews
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
