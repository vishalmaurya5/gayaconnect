import { NextResponse } from 'next/server'
import { clearAdminCookie, getAdminCredentials, setAdminCookie, verifyAdminPassword, verifyAdminRequest } from '@/lib/utils/adminAuth'
import { enforceRateLimit } from '@/lib/security/rateLimit'

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

  const ok = await verifyAdminPassword(userId, password)
  if (!ok) {
    return NextResponse.json({ success: false, message: 'Invalid admin credentials' }, { status: 401 })
  }

  const { userId: adminUserId } = getAdminCredentials()
  return setAdminCookie(NextResponse.json({
    success: true,
    admin: { userId: adminUserId, role: 'admin' },
  }))
}

export async function DELETE() {
  return clearAdminCookie(NextResponse.json({ success: true }))
}
