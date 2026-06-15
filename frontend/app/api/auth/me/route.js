import { NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/security/auth'
import { toAuthUser } from '@/lib/utils/contactAccess'

export async function GET(request) {
  const user = await getAuthenticatedUser(request)
  if (!user) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
  }

  return NextResponse.json({ success: true, user: toAuthUser(user) })
}
