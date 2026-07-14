import crypto from 'crypto'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { connectDB } from '@/lib/db/mongodb'
import Setting from '@/lib/db/models/Setting'
import User from '@/lib/db/models/User'

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
  
  // 1. Check if trying to login as Master/Super Admin via env credentials
  if (equalText(userId, creds.userId)) {
    try {
      await connectDB()
      const setting = await Setting.findOne({ key: ADMIN_PW_SETTING_KEY })
      if (setting && setting.value) {
        const ok = await bcrypt.compare(String(password), String(setting.value))
        if (ok) return { success: true, role: 'SUPER_ADMIN', userId: creds.userId }
      }
    } catch (e) {
      console.error('Admin password DB check failed, falling back to env:', e?.message)
    }

    if (creds.password && equalText(password, creds.password)) {
      return { success: true, role: 'SUPER_ADMIN', userId: creds.userId }
    }
  }

  // 2. Check if trying to login as a Sub-Admin stored in the User collection
  try {
    await connectDB()
    const user = await User.findOne({ 
      $or: [{ email: userId }, { phone: userId }],
      adminRole: { $in: ['SUPER_ADMIN', 'ADMIN'] } 
    }).select('+password')

    if (user && await bcrypt.compare(String(password), user.password)) {
      return { success: true, role: user.adminRole, userId: user._id.toString() }
    }
  } catch (error) {
    console.error('Sub-admin DB check failed:', error)
  }

  return { success: false }
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

export function createAdminToken(userId, role = 'SUPER_ADMIN') {
  if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET is required')
  return jwt.sign(
    { sub: userId, role: 'admin', adminRole: role, scope: 'admin-panel' },
    process.env.JWT_SECRET,
    { expiresIn: ADMIN_TOKEN_TTL }
  )
}

export function setAdminCookie(response, userId, role = 'SUPER_ADMIN') {
  response.cookies.set(ADMIN_COOKIE, createAdminToken(userId, role), {
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
    if (decoded.role !== 'admin' || decoded.scope !== 'admin-panel') {
      return null
    }
    return decoded // Contains { sub, role, adminRole, scope }
  } catch {
    return null
  }
}
