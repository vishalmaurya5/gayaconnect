import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db/mongodb'
import User from '@/lib/db/models/User'
import { createUserSession } from '@/lib/security/auth'
import { enforceRateLimit } from '@/lib/security/rateLimit'
import { loginSchema, validationError } from '@/lib/security/validation'
import { toAuthUser } from '@/lib/utils/contactAccess'

const MAX_FAILED_ATTEMPTS = 5
const LOCK_DURATION_MS = 15 * 60 * 1000

export async function POST(request) {
  const limited = enforceRateLimit(request, 'auth-login', { limit: 10, windowMs: 15 * 60 * 1000 })
  if (limited) return limited

  try {
    const parsed = loginSchema.safeParse(await request.json())
    if (!parsed.success) {
      return NextResponse.json({ success: false, message: validationError(parsed.error) }, { status: 400 })
    }

    await connectDB()
    const { phone, password, rememberMe } = parsed.data
    const user = await User.findOne({ phone }).select('+failedLoginAttempts +lockedUntil')

    if (!user) {
      return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 })
    }

    if (user.isLoginLocked()) {
      return NextResponse.json(
        { success: false, message: 'Account temporarily locked. Try again after 15 minutes.' },
        { status: 423 }
      )
    }

    if (!(await user.comparePassword(password))) {
      user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1
      if (user.failedLoginAttempts >= MAX_FAILED_ATTEMPTS) {
        user.lockedUntil = new Date(Date.now() + LOCK_DURATION_MS)
        user.failedLoginAttempts = 0
      }
      await user.save()
      return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 })
    }

    user.failedLoginAttempts = 0
    user.lockedUntil = undefined

    if (user.subscriptionActive && user.subscriptionExpiry && new Date(user.subscriptionExpiry).getTime() < Date.now()) {
      user.subscriptionActive = false
    }

    const response = NextResponse.json({
      success: true,
      user: toAuthUser(user),
      message: 'Login successful',
    })
    await createUserSession(response, user, rememberMe)
    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ success: false, message: 'Login failed' }, { status: 500 })
  }
}
