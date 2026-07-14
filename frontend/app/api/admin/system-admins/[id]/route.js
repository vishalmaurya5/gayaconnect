import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongodb';
import User from '@/lib/db/models/User';
import { verifyAdminRequest } from '@/lib/utils/adminAuth';

export async function DELETE(request, { params }) {
  try {
    const admin = verifyAdminRequest(request);
    if (!admin || admin.adminRole !== 'SUPER_ADMIN') {
      return NextResponse.json({ success: false, message: 'Super Admin access required' }, { status: 401 });
    }

    await connectDB();
    
    // Instead of completely deleting the user, we just revoke their adminRole
    await User.findByIdAndUpdate(params.id, { 
      adminRole: 'NONE', 
      permissions: [], 
      assignedCities: [] 
    });

    return NextResponse.json({ success: true, message: 'Admin access revoked' });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
