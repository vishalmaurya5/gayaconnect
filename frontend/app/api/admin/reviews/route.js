import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongodb';
import Vendor from '@/lib/db/models/Vendor';
import Labourer from '@/lib/db/models/Labourer';
import Job from '@/lib/db/models/Job';
import Offer from '@/lib/db/models/Offer';
import { checkAdmin } from '@/lib/security/adminAuth';

export async function GET(request) {
  try {
    const auth = await checkAdmin(request);
    if (!auth.success) return NextResponse.json(auth, { status: 401 });

    const { searchParams } = new URL(request.url);
    const city = searchParams.get('city');

    await connectDB();

    // Base query for pending items
    const vendorQuery = { status: 'PENDING' };
    const labourQuery = { status: 'PENDING' };
    
    // If a limited admin is assigned to a specific city, or super admin filters by city
    if (city) {
      vendorQuery.address = { $regex: city, $options: 'i' };
      labourQuery.$or = [
        { district: { $regex: city, $options: 'i' } },
        { address: { $regex: city, $options: 'i' } }
      ];
    }

    const [pendingVendors, pendingLabour, pendingJobs, pendingOffers] = await Promise.all([
      Vendor.find(vendorQuery).lean(),
      Labourer.find(labourQuery).lean(),
      Job.find({ status: 'PENDING' }).populate('vendorId', 'name address').lean(),
      Offer.find({ status: 'PENDING' }).populate('vendorId', 'name').lean()
    ]);

    return NextResponse.json({
      success: true,
      data: {
        vendors: pendingVendors,
        labourers: pendingLabour,
        jobs: pendingJobs,
        offers: pendingOffers
      }
    });
  } catch (error) {
    console.error('Review Queue error:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const auth = await checkAdmin(request);
    if (!auth.success) return NextResponse.json(auth, { status: 401 });

    const body = await request.json();
    const { id, type, action } = body; // action is 'APPROVE' or 'REJECT'
    const newStatus = action === 'APPROVE' ? 'APPROVED' : 'REJECTED';

    await connectDB();
    
    // Auto-generate IDs on approval if it doesn't exist
    let updatePayload = { status: newStatus };

    if (newStatus === 'APPROVED') {
      if (type === 'vendor') {
        const vendor = await Vendor.findById(id);
        if (vendor && !vendor.vendorId) {
          const count = await Vendor.countDocuments({ vendorId: { $exists: true } });
          updatePayload.vendorId = `GS-VEN-${String(count + 1).padStart(6, '0')}`;
        }
      } else if (type === 'labour') {
        const labour = await Labourer.findById(id);
        if (labour && !labour.lwfId) {
          const count = await Labourer.countDocuments({ lwfId: { $exists: true } });
          updatePayload.lwfId = `GS-LWF-${String(count + 1).padStart(6, '0')}`;
        }
      }
    }

    let result;
    if (type === 'vendor') result = await Vendor.findByIdAndUpdate(id, updatePayload);
    else if (type === 'labour') result = await Labourer.findByIdAndUpdate(id, updatePayload);
    else if (type === 'job') result = await Job.findByIdAndUpdate(id, updatePayload);
    else if (type === 'offer') result = await Offer.findByIdAndUpdate(id, updatePayload);

    if (!result) return NextResponse.json({ success: false, message: 'Record not found' }, { status: 404 });
    return NextResponse.json({ success: true, message: `Successfully updated status to ${newStatus}` });
  } catch (err) {
    console.error('Review Action Error:', err);
    return NextResponse.json({ success: false, message: 'Failed to update record' }, { status: 500 });
  }
}
