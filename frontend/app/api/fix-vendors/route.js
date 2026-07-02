import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongodb';
import User from '@/lib/db/models/User';
import Vendor from '@/lib/db/models/Vendor';

export async function GET() {
  try {
    await connectDB();
    
    // Find all users with role 'vendor'
    const vendorUsers = await User.find({ role: 'vendor' }).lean();
    let count = 0;
    
    for (const u of vendorUsers) {
      // Check if Vendor document exists for this user
      const existing = await Vendor.findOne({ userId: u._id });
      
      if (!existing) {
        // Create missing Vendor document
        await Vendor.create({
          userId: u._id,
          regCode: u.regCode || '',
          name: u.businessName || u.name || 'Vendor',
          category: u.category || 'Other',
          subCategory: u.subCategory || '',
          address: u.address || '',
          description: u.description || '',
          isApproved: true
        });
        count++;
      }
    }
    
    // Mass update all vendors just to be 100% sure none are hidden
    const updateResult = await Vendor.updateMany({}, { $set: { isApproved: true, isDeleted: false } });
    
    return NextResponse.json({ 
      success: true, 
      message: `Created ${count} missing vendor profiles. Updated ${updateResult.modifiedCount} existing profiles to approved status.` 
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
