import crypto from 'crypto'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { connectDB } from '@/lib/db/mongodb'
import Setting from '@/lib/db/models/Setting'

export const ADMIN_COOKIE = 'gc_admin_access'
const ADMIN_TOKEN_TTL = '12h'
const ADMIN_COOKIE_TTL_SECONDS = 12 * 60 * 60
const ADMIN_PW_SETTING_KEY = 'admin_password_hash'

export function getAdminCredentials() {
  return {
    userId: process.env.ADMIN_USER_ID || 'admin',
    password: process.env.ADMIN_PASSWORD || '',
  }
}

// Constant-time string comparison to avoid timing attacks.
function equalText(left, right) {
  const a = Buffer.from(String(left))
  const b = Buffer.from(String(right))
  return a.length === b.length && crypto.timingSafeEqual(a, b)
}

// Verify admin login. Prefers a DB-stored password hash (set via "change password");
// falls back to the ADMIN_PASSWORD env value if no hash has been saved yet.
export async function verifyAdminPassword(userId, password) {
  const creds = getAdminCredentials()
  if (!equalText(userId, creds.userId)) return false

  try {
    await connectDB()
    const setting = await Setting.findOne({ key: ADMIN_PW_SETTING_KEY })
    if (setting && setting.value) {
      return await bcrypt.compare(String(password), String(setting.value))
    }
  } catch (e) {
    console.error('Admin password DB check failed, falling back to env:', e?.message)
  }

  if (!creds.password) return false
  return equalText(password, creds.password)
}

// Persist a new admin password (hashed) in the DB. Overrides the env password from then on.
export async function saveAdminPassword(newPassword) {
  await connectDB()
  const hash = await bcrypt.hash(String(newPassword), 10)
  await Setting.findOneAndUpdate(
    { key: ADMIN_PW_SETTING_KEY },
    { key: ADMIN_PW_SETTING_KEY, value: hash, updatedAt: new Date() },
    { upsert: true, new: true }
  )
}

export function createAdminToken() {
  const { userId } = getAdminCredentials()
  if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET is required')
  return jwt.sign(
    { sub: userId, role: 'admin', scope: 'admin-panel' },
    process.env.JWT_SECRET,
    { expiresIn: ADMIN_TOKEN_TTL }
  )
}

export function setAdminCookie(response) {
  response.cookies.set(ADMIN_COOKIE, createAdminToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/api/admin',
    maxAge: ADMIN_COOKIE_TTL_SECONDS,
  })
  return response
}

export function clearAdminCookie(response) {
  response.cookies.set(ADMIN_COOKIE, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/api/admin',
    maxAge: 0,
  })
  return response
}

export function verifyAdminRequest(request) {
  const token = request.cookies.get(ADMIN_COOKIE)?.value
  if (!token) return null

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const { userId } = getAdminCredentials()
    if (decoded.role !== 'admin' || decoded.scope !== 'admin-panel' || decoded.sub !== userId) {
      return null
    }
    return decoded
  } catch {
    return null
  }
}
