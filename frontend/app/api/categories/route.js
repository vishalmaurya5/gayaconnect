import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongodb';
import Category from '@/lib/db/models/Category';

const defaultCategories = [
  'Car', 'Bike', 'Bus', 'Truck', 'Pickup', 'Tractor', 
  'Auto Rickshaw', 'Van', 'Taxi', 'Ambulance', 'Tempo', 
  'Construction Equipment', 'Others'
];

export async function GET(request) {
  try {
    await connectDB();

    // Check if we need to seed default categories
    const count = await Category.countDocuments({ is_default: true });
    if (count === 0) {
      const seedData = defaultCategories.map(name => ({
        name,
        is_default: true,
        approved: true,
        created_by_role: 'admin'
      }));
      await Category.insertMany(seedData);
    }

    // Fetch approved categories (defaults + approved customs)
    const categories = await Category.find({ approved: true }).sort({ name: 1 });
    
    return NextResponse.json({ success: true, categories });
  } catch (error) {
    console.error('Fetch Categories Error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const { name, created_by, created_by_role } = body;

    if (!name || name.trim() === '') {
      return NextResponse.json({ success: false, message: 'Category name is required' }, { status: 400 });
    }

    const trimmedName = name.trim();
    
    // Check for duplicate (case-insensitive)
    const existing = await Category.findOne({ name: new RegExp(`^${trimmedName}$`, 'i') });
    
    if (existing) {
      return NextResponse.json({ 
        success: true, 
        message: 'Category already exists', 
        category: existing 
      });
    }

    // Create new custom category (pending approval)
    const newCategory = await Category.create({
      name: trimmedName,
      is_default: false,
      approved: false, // Default to false for pending review
      created_by,
      created_by_role
    });

    return NextResponse.json({ success: true, category: newCategory }, { status: 201 });
  } catch (error) {
    console.error('Create Category Error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
