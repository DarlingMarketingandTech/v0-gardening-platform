import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { hasPublicSupabaseEnv } from '@/lib/env/supabase-public'

/**
 * Demo-first guardrails
 *
 * The app is currently being shaped with harmless demo data.
 * Mom should be able to open /my-garden and browse /plants without signing in.
 *
 * Keep truly account-specific areas protected until auth/persistence is reintroduced.
 */
const protectedRoutes = ['/gardens', '/garden-areas', '/settings']

/** Routes that must not instantiate Supabase in middleware (preview without env). */
function isPublicDemoPath(pathname: string): boolean {
  if (pathname === '/') return true
  if (pathname === '/api/health' || pathname.startsWith('/api/health/')) return true

  const prefixes = [
    '/my-garden',
    '/plants',
    '/auth/login',
    '/auth/sign-up',
    '/auth/sign-up-success',
    '/auth/check-email',
    '/auth/update-password',
    '/auth/confirm',
    '/auth/signout',
    '/auth/error',
    '/not-allowed',
    '/pending-approval',
    '/admin/access-requests',
    '/setup',
    '/profile',
  ]

  if (prefixes.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
    return true
  }

  return false
}

export async function updateSession(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Redirect /dashboard to /my-garden without touching Supabase
  if (pathname === '/dashboard') {
    const url = request.nextUrl.clone()
    url.pathname = '/my-garden'
    return NextResponse.redirect(url)
  }

  if (isPublicDemoPath(pathname)) {
    return NextResponse.next({ request })
  }

  if (!hasPublicSupabaseEnv()) {
    const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))

    if (pathname.startsWith('/auth/callback')) {
      return NextResponse.json(
        { error: 'Supabase is not configured on this deployment.' },
        { status: 503 },
      )
    }

    if (isProtectedRoute) {
      const url = request.nextUrl.clone()
      url.pathname = '/auth/login'
      url.searchParams.set('error', 'configuration')
      return NextResponse.redirect(url)
    }

    return NextResponse.next({ request })
  }

  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
        supabaseResponse = NextResponse.next({
          request,
        })
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options),
        )
      },
    },
  })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))

  if (isProtectedRoute && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/auth/login'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
