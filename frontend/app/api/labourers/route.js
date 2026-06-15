import { NextResponse } from 'next/server';
import Labourer from '@/lib/db/models/Labourer';
import { connectDB } from '@/lib/db/mongodb';
import { getAuthenticatedUser } from '@/lib/security/auth';

export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const skill = searchParams.get('skill');
    const search = searchParams.get('search');
    
    const query = { isVerified: true, isAvailable: true };
    if (skill) query.skill = skill;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { skill: { $regex: search, $options: 'i' } },
        { address: { $regex: search, $options: 'i' } }
      ];
    }

    const labourers = await Labourer.find(query).sort('-rating');
    return NextResponse.json({ success: true, data: labourers });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const user = await getAuthenticatedUser(request);
    
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const labourer = await Labourer.create({
      ...body,
      userId: user._id,
      isVerified: false 
    });

    return NextResponse.json({ success: true, data: labourer }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
