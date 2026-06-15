import { NextResponse } from 'next/server';
import Labourer from '@/lib/db/models/Labourer';
import { connectDB } from '@/lib/db/mongodb';

export async function GET() {
  try {
    await connectDB();
    const skills = await Labourer.distinct('skill', { isVerified: true });
    return NextResponse.json({ success: true, data: skills });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
