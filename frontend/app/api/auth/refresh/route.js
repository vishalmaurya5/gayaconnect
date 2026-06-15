import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db/mongodb'
import User from '@/lib/db/models/User'
import { clearUserSession, createUserSession, digestToken, getRefreshSession } from '@/lib/security/auth'
import { enforceRateLimit } from '@/lib/security/rateLimit'
import { toAuthUser } from '@/lib/utils/contactAccess'

export async function POST(request) {
  const limited = enforceRateLimit(request, 'auth-refresh', { limit: 30, windowMs: 15 * 60 * 1000 })
  if (limited) return limited

  const session = getRefreshSession(request)
  if (!session) {
    return clearUserSession(NextResponse.json({ success: false, message: 'Session expired' }, { status: 401 }))
  }

  await connectDB()
  const user = await User.findById(session.decoded.id).select('+refreshTokenHash +refreshTokenExpiresAt')
  const validStoredToken = user?.refreshTokenHash === digestToken(session.token)
    && user.refreshTokenExpiresAt?.getTime() > Date.now()

  if (!user || !validStoredToken) {
    return clearUserSession(NextResponse.json({ success: false, message: 'Session expired' }, { status: 401 }))
  }

  const response = NextResponse.json({ success: true, user: toAuthUser(user) })
  await createUserSession(response, user)
  return response
}
