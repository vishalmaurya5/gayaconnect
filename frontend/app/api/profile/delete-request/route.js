import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongodb';
import User from '@/lib/db/models/User';
import Vendor from '@/lib/db/models/Vendor';
import Labourer from '@/lib/db/models/Labourer';
import { getAuthenticatedUser, clearUserSession } from '@/lib/security/auth';

export async function POST(request) {
  try {
    await connectDB();
    const user = await getAuthenticatedUser(request);
    
    if (!user) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    user.isDeleted = true;
    await user.save();

    if (user.role === 'vendor') {
      await Vendor.updateMany({ userId: user._id }, { isDeleted: true });
    }
    
    // In case they are also registered as labourer
    await Labourer.updateMany({ userId: user._id }, { isDeleted: true });

    const response = NextResponse.json({ success: true, message: 'Account deleted from the website successfully.' });
    return clearUserSession(response);
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message || 'Internal server error' }, { status: 500 });
  }
}
