import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db/mongodb'
import { verifyAdminRequest } from '@/lib/utils/adminAuth'
import User from '@/lib/db/models/User'
import AuditLog from '@/lib/db/models/AuditLog'

export async function GET(request) {
  try {
    await connectDB()
    const adminUser = verifyAdminRequest(request)
    if (!adminUser) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const filter = searchParams.get('filter') || 'all'
    const search = searchParams.get('search')

    const query = {
      $or: [{ role: 'user' }, { role: { $exists: false } }]
    }
    
    if (filter === 'deleted') {
      query.isDeleted = true
    } else {
      query.isDeleted = { $ne: true } // Hide deleted from all other views
      
      if (filter === 'subscribed') {
        query.subscriptionActive = true
        query.subscriptionExpiry = { $gt: new Date() }
      } else if (filter === 'unsubscribed') {
        // Here we can use $and if we need to combine with search later, but let's just construct the final query properly
        query.$and = [
          {
            $or: [
              { subscriptionActive: false },
              { subscriptionExpiry: { $lte: new Date() } },
              { subscriptionExpiry: null }
            ]
          }
        ]
      }
    }

    if (search) {
      const searchCondition = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { phone: { $regex: search, $options: 'i' } },
          { aadhaarNumber: { $regex: search, $options: 'i' } }
        ]
      }
      
      if (query.$and) {
        query.$and.push(searchCondition)
      } else {
        query.$and = [searchCondition]
      }
    }

    const users = await User.find(query).sort('-createdAt')
    return NextResponse.json({ success: true, users })
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}
