import { NextResponse } from 'next/server'
import { verifyAdminRequest, verifyAdminPassword, saveAdminPassword } from '@/lib/utils/adminAuth'
import { enforceRateLimit } from '@/lib/security/rateLimit'

export async function POST(request) {
  const limited = enforceRateLimit(request, 'admin-change-password', { limit: 5, windowMs: 15 * 60 * 1000 })
  if (limited) return limited

  // Only a logged-in admin can change the admin password.
  const admin = verifyAdminRequest(request)
  if (!admin) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
  }

  const { currentPassword = '', newPassword = '' } = await request.json().catch(() => ({}))

  if (String(newPassword).length < 8) {
    return NextResponse.json({ success: false, message: 'New password must be at least 8 characters' }, { status: 400 })
  }

  const ok = await verifyAdminPassword(admin.sub, currentPassword)
  if (!ok) {
    return NextResponse.json({ success: false, message: 'Current password is incorrect' }, { status: 401 })
  }

  try {
    await saveAdminPassword(newPassword)
  } catch (e) {
    console.error('Save admin password failed:', e)
    return NextResponse.json({ success: false, message: 'Could not update password' }, { status: 500 })
  }

  return NextResponse.json({ success: true, message: 'Admin password updated successfully' })
}
