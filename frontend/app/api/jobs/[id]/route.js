import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongodb';
import Job from '@/lib/db/models/Job';
import Vendor from '@/lib/db/models/Vendor';
import { getAuthenticatedUser } from '@/lib/security/auth';

export async function DELETE(request, { params }) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const { id } = await params;

    const job = await Job.findById(id);
    if (!job) {
      return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 });
    }

    // Admins can delete any job.
    // Vendors can only delete their own jobs.
    if (user.role === 'vendor') {
      const vendor = await Vendor.findOne({ userId: user._id });
      if (!vendor || job.vendorId?.toString() !== vendor._id.toString()) {
        return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
      }
    } else if (user.role !== 'admin') {
      return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
    }

    await Job.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: 'Deleted successfully' });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
