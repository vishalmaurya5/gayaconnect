import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongodb';
import User from '@/lib/db/models/User';
import { verifyAdminRequest } from '@/lib/utils/adminAuth';

export async function DELETE(request, { params }) {
  try {
    const admin = verifyAdminRequest(request);
    if (!admin) {
      return NextResponse.json({ success: false, message: 'Admin access required' }, { status: 401 });
    }

    // Next.js 15 params promise handling
    const resolvedParams = await params;
    const targetId = resolvedParams?.id;

    if (!targetId) {
      return NextResponse.json({ success: false, message: 'Invalid Admin ID' }, { status: 400 });
    }

    if (String(admin.id) === String(targetId)) {
      return NextResponse.json({ 
        success: false, 
        message: 'You cannot delete your own logged-in admin account.' 
      }, { status: 400 });
    }

    await connectDB();
    
    // Completely remove admin user or revoke role
    const deletedUser = await User.findByIdAndDelete(targetId);
    
    if (!deletedUser) {
      // Fallback: try finding by string ID or update role if soft delete
      await User.findByIdAndUpdate(targetId, { 
        role: 'user',
        adminRole: 'NONE', 
        permissions: [], 
        assignedCities: [] 
      });
    }

    return NextResponse.json({ success: true, message: 'Admin deleted successfully' });
  } catch (error) {
    console.error('Delete Admin error:', error);
    return NextResponse.json({ success: false, message: error.message || 'Server error' }, { status: 500 });
  }
}
