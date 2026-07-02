import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongodb';
import Category from '@/lib/db/models/Category';

export async function PATCH(request, props) {
  try {
    await connectDB();
    const params = await props.params;
    const { id } = params;
    const body = await request.json();
    
    // Updates can include { approved: true/false, name: 'New Name' }
    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true }
    );

    if (!updatedCategory) {
      return NextResponse.json({ success: false, message: 'Category not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, category: updatedCategory });
  } catch (error) {
    console.error('Update Category Error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request, props) {
  try {
    await connectDB();
    const params = await props.params;
    const { id } = params;

    const category = await Category.findById(id);
    if (!category) {
      return NextResponse.json({ success: false, message: 'Category not found' }, { status: 404 });
    }

    if (category.is_default) {
      return NextResponse.json({ success: false, message: 'Cannot delete default category' }, { status: 400 });
    }

    await Category.findByIdAndDelete(id);

    return NextResponse.json({ success: true, message: 'Category deleted' });
  } catch (error) {
    console.error('Delete Category Error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
