import crypto from 'crypto'
import { NextResponse } from 'next/server'
import { clearAdminCookie, getAdminCredentials, setAdminCookie, verifyAdminRequest } from '@/lib/utils/adminAuth'
import { enforceRateLimit } from '@/lib/security/rateLimit'

function equalText(left, right) {
  const a = Buffer.from(String(left))
  const b = Buffer.from(String(right))
  return a.length === b.length && crypto.timingSafeEqual(a, b)
}

export async function GET(request) {
  const admin = verifyAdminRequest(request)
  if (!admin) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
  }

  return NextResponse.json({ success: true, admin: { userId: admin.sub, role: 'admin' } })
}

export async function POST(request) {
  const limited = enforceRateLimit(request, 'admin-login', { limit: 5, windowMs: 15 * 60 * 1000 })
  if (limited) return limited

  const { userId = '', password = '' } = await request.json().catch(() => ({}))
  const credentials = getAdminCredentials()

  if (!credentials.password || !equalText(userId, credentials.userId) || !equalText(password, credentials.password)) {
    return NextResponse.json({ success: false, message: 'Invalid admin credentials' }, { status: 401 })
  }

  return setAdminCookie(NextResponse.json({
    success: true,
    admin: { userId: credentials.userId, role: 'admin' },
  }))
}

export async function DELETE() {
  return clearAdminCookie(NextResponse.json({ success: true }))
}
