import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db/mongodb'
import User from '@/lib/db/models/User'
import { clearUserSession, getRefreshSession } from '@/lib/security/auth'

export async function POST(request) {
  const refresh = getRefreshSession(request)
  if (refresh?.decoded?.id) {
    await connectDB()
    await User.findByIdAndUpdate(refresh.decoded.id, {
      $unset: { refreshTokenHash: 1, refreshTokenExpiresAt: 1 },
    })
  }
  return clearUserSession(NextResponse.json({ success: true, message: 'Logged out' }))
}
