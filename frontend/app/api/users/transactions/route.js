import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongodb';
import Payment from '@/lib/db/models/Payment';

export async function GET(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ success: false, message: 'User ID is required' }, { status: 400 });
    }

    // Fetch all successful payments for this user, sorted by latest
    const transactions = await Payment.find({ userId, status: 'success' })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ success: true, transactions });
  } catch (error) {
    console.error('Fetch Transactions Error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
