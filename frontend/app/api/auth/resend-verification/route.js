import { NextResponse } from 'next/server'
import { z } from 'zod'
import { connectDB } from '@/lib/db/mongodb'
import User from '@/lib/db/models/User'
import { createEmailVerificationToken } from '@/lib/security/auth'
import { enforceRateLimit } from '@/lib/security/rateLimit'
import { sendVerificationEmail } from '@/lib/services/email'

const schema = z.object({ email: z.string().trim().email().toLowerCase() }).strict()

export async function POST(request) {
  const limited = enforceRateLimit(request, 'auth-resend', { limit: 3, windowMs: 60 * 60 * 1000 })
  if (limited) return limited

  const parsed = schema.safeParse(await request.json().catch(() => ({})))
  if (!parsed.success) {
    return NextResponse.json({ success: false, message: 'Enter a valid email address' }, { status: 400 })
  }

  await connectDB()
  const user = await User.findOne({ email: parsed.data.email })
  if (user && !user.isVerified) {
    const verification = createEmailVerificationToken()
    user.emailVerificationTokenHash = verification.hash
    user.emailVerificationExpiresAt = verification.expiresAt
    await user.save()
    await sendVerificationEmail(user, verification.token)
  }

  return NextResponse.json({
    success: true,
    message: 'If an unverified account exists, a verification email has been sent.',
  })
}
