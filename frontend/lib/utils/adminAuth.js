import jwt from 'jsonwebtoken'

export const ADMIN_COOKIE = 'gc_admin_access'
const ADMIN_TOKEN_TTL = '12h'
const ADMIN_COOKIE_TTL_SECONDS = 12 * 60 * 60

export function getAdminCredentials() {
  return {
    userId: process.env.ADMIN_USER_ID || 'admin',
    password: process.env.ADMIN_PASSWORD || '',
  }
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
