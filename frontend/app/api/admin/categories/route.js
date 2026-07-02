import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongodb';
import Category from '@/lib/db/models/Category';

export async function GET(request) {
  try {
    await connectDB();

    // Fetch all categories, sorted by pending first, then by name
    const categories = await Category.find().sort({ approved: 1, name: 1 });
    
    return NextResponse.json({ success: true, categories });
  } catch (error) {
    console.error('Admin Fetch Categories Error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
