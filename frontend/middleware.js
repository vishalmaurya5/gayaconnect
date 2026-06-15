import { NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

// Admin pages use the separate gc_admin_access cookie and verify it through
// /api/admin/auth. This middleware protects normal user and vendor pages only.
export const config = {
  matcher: ['/vendor/:path*', '/profile/:path*'],
}

export async function middleware(request) {
  const token = request.cookies.get('gc_token')?.value
  
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET)
    const { payload } = await jwtVerify(token, secret)

    // Vendor routes protection
    if (request.nextUrl.pathname.startsWith('/vendor/dashboard') && payload.role !== 'vendor' && payload.role !== 'admin') {
      return NextResponse.redirect(new URL('/profile', request.url))
    }

    return NextResponse.next()
  } catch (error) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
}
