import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db/mongodb'
import User from '@/lib/db/models/User'
import { verifyAdminRequest } from '@/lib/utils/adminAuth'

export async function PATCH(request, { params }) {
  try {
    await connectDB()
    const adminUser = verifyAdminRequest(request)
    
    // Check if user is admin
    if (!adminUser) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    }

    const { hasAccess } = await request.json()
    
    let updateData = {}
    if (hasAccess) {
      updateData.bannerPostPurchasedAt = new Date()
      // Give 7 days access
      updateData.bannerPostExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    } else {
      updateData.bannerPostExpiresAt = null
    }

    const user = await User.findByIdAndUpdate(
      params.id,
      updateData,
      { new: true }
    )

    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, user })
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}
