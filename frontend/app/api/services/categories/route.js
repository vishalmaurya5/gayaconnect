import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db/mongodb'
import Vendor from '@/lib/db/models/Vendor'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    await connectDB()

    const vendors = await Vendor.find({ isApproved: true })
      .select('category subCategory')
      .lean()

    const categories = new Map()

    for (const vendor of vendors) {
      const category = String(vendor.category || '').trim()
      const subCategory = String(vendor.subCategory || '').trim()
      if (!category) continue

      const key = category.toLowerCase()
      const existing = categories.get(key) || { name: category, subcategories: [] }

      if (subCategory && !existing.subcategories.some((item) => item.toLowerCase() === subCategory.toLowerCase())) {
        existing.subcategories.push(subCategory)
      }

      categories.set(key, existing)
    }

    return NextResponse.json({
      success: true,
      categories: Array.from(categories.values()).sort((a, b) => a.name.localeCompare(b.name)),
    })
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}
