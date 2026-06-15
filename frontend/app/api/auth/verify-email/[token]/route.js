import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db/mongodb'
import User from '@/lib/db/models/User'
import { digestToken } from '@/lib/security/auth'

export async function GET(request, { params }) {
  await connectDB()
  const user = await User.findOne({
    emailVerificationTokenHash: digestToken(params.token),
    emailVerificationExpiresAt: { $gt: new Date() },
  }).select('+emailVerificationTokenHash +emailVerificationExpiresAt')

  const loginUrl = new URL('/login', request.url)
  if (!user) {
    loginUrl.searchParams.set('verification', 'invalid')
    return NextResponse.redirect(loginUrl)
  }

  user.isVerified = true
  user.emailVerificationTokenHash = undefined
  user.emailVerificationExpiresAt = undefined
  await user.save()

  loginUrl.searchParams.set('verification', 'success')
  return NextResponse.redirect(loginUrl)
}
