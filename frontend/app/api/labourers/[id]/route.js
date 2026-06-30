import { NextResponse } from 'next/server';
import Labourer from '@/lib/db/models/Labourer';
import { connectDB } from '@/lib/db/mongodb';
import { getAuthenticatedUser } from '@/lib/security/auth';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const labourer = await Labourer.findById(id);
    
    if (!labourer) return NextResponse.json({ error: 'Labourer not found' }, { status: 404 });
    return NextResponse.json({ success: true, data: labourer });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    await connectDB();
    const user = await getAuthenticatedUser(request);
    
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const labourer = await Labourer.findById(id);
    if (!labourer) return NextResponse.json({ error: 'Labourer not found' }, { status: 404 });

    if (user.role !== 'admin' && String(labourer.userId) !== String(user._id)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();

    if (user.role !== 'admin') delete body.isVerified;

    const updatedLabourer = await Labourer.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    return NextResponse.json({ success: true, data: updatedLabourer });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const user = await getAuthenticatedUser(request);
    
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 401 });
    }

    const { id } = await params;
    const deletedLabourer = await Labourer.findByIdAndDelete(id);
    if (!deletedLabourer) return NextResponse.json({ error: 'Labourer not found' }, { status: 404 });

    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
