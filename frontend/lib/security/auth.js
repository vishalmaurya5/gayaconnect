import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import { connectDB } from '@/lib/db/mongodb'
import User from '@/lib/db/models/User'

export const ACCESS_COOKIE = 'gc_access'
export const REFRESH_COOKIE = 'gc_refresh'
const ACCESS_TTL_SECONDS = 24 * 60 * 60
const REFRESH_TTL_SECONDS = 7 * 24 * 60 * 60

function requiredSecret(name) {
  const value = process.env[name]
  if (!value) throw new Error(`${name} is required`)
  return value
}

function cookieOptions(maxAge, path = '/') {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path,
    maxAge,
  }
}

export function digestToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex')
}

export function createEmailVerificationToken() {
  const token = crypto.randomBytes(32).toString('hex')
  return {
    token,
    hash: digestToken(token),
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
  }
}

export async function createUserSession(response, user, rememberMe = false) {
  const refreshTtl = rememberMe ? 30 * 24 * 60 * 60 : REFRESH_TTL_SECONDS
  const payload = { id: String(user._id), email: user.email, role: user.role }
  const accessToken = jwt.sign(payload, requiredSecret('JWT_SECRET'), { expiresIn: ACCESS_TTL_SECONDS })
  const refreshToken = jwt.sign(
    { id: String(user._id), type: 'refresh', nonce: crypto.randomBytes(16).toString('hex') },
    requiredSecret('JWT_REFRESH_SECRET'),
    { expiresIn: refreshTtl }
  )

  user.refreshTokenHash = digestToken(refreshToken)
  user.refreshTokenExpiresAt = new Date(Date.now() + refreshTtl * 1000)
  await user.save()

  response.cookies.set(ACCESS_COOKIE, accessToken, cookieOptions(ACCESS_TTL_SECONDS))
  response.cookies.set(REFRESH_COOKIE, refreshToken, cookieOptions(refreshTtl, '/api/auth'))
  return response
}

export function clearUserSession(response) {
  response.cookies.set(ACCESS_COOKIE, '', cookieOptions(0))
  response.cookies.set(REFRESH_COOKIE, '', cookieOptions(0, '/api/auth'))
  return response
}

export function verifyAccessCookie(request) {
  const token = request.cookies.get(ACCESS_COOKIE)?.value
  if (!token) return null

  try {
    return jwt.verify(token, requiredSecret('JWT_SECRET'))
  } catch {
    return null
  }
}

export async function getAuthenticatedUser(request) {
  const session = verifyAccessCookie(request)
  if (!session?.id) return null
  await connectDB()
  const user = await User.findById(session.id)
  if (!user) return null
  // if (!user.isVerified && user.role !== 'user') return null
  return user
}

export async function getOptionalUser(request) {
  try {
    return await getAuthenticatedUser(request)
  } catch {
    return null
  }
}

export function getRefreshSession(request) {
  const token = request.cookies.get(REFRESH_COOKIE)?.value
  if (!token) return null

  try {
    const decoded = jwt.verify(token, requiredSecret('JWT_REFRESH_SECRET'))
    return decoded.type === 'refresh' ? { token, decoded } : null
  } catch {
    return null
  }
}
