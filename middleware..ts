// middleware.ts
import { NextResponse, type NextRequest } from 'next/server'

const ADMIN_LOGIN_TOKEN = process.env.ADMIN_LOGIN_TOKEN!

export async function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl

  if (!pathname.startsWith('/admin')) return NextResponse.next()

  const token = searchParams.get('token')

  // ── 1. Token present ──────────────────────────────────────────────────────
  if (token !== null) {
    if (token !== ADMIN_LOGIN_TOKEN) {
      console.log(token);
      console.log(ADMIN_LOGIN_TOKEN);
      return NextResponse.rewrite(new URL('/not-found', request.url))
    }

    // Valid token → strip it and redirect to clean URL
    const cleanUrl = new URL(pathname, request.url)
    searchParams.forEach((value, key) => {
      if (key !== 'token') cleanUrl.searchParams.set(key, value)
    })

    const redirectResponse = NextResponse.redirect(cleanUrl)
    redirectResponse.cookies.set('admin_access', 'true', {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 8,  // 8 hours
      path: '/admin',
    })
    return redirectResponse
  }

  // ── 2. No token — check cookie ────────────────────────────────────────────
  const adminCookie = request.cookies.get('admin_access')?.value
  if (adminCookie === 'true') {
    return NextResponse.next()
  }

  // ── 3. TODO: Replace this block with Supabase session check ───────────────
  //
  //  const supabase = createServerClient(...)
  //  const { data: { user } } = await supabase.auth.getUser()
  //  if (user && user.email === process.env.ADMIN_EMAIL) {
  //    return NextResponse.next()
  //  }
  //
  // ─────────────────────────────────────────────────────────────────────────

  // ── 4. Nothing matched → 404 ──────────────────────────────────────────────
  return NextResponse.rewrite(new URL('/not-found', request.url))
}

export const config = {
  matcher: ['/admin/:path*'],
}