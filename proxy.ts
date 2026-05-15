import type { NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

/**
 * Next.js 16 proxy — only run on routes that need session checks or redirects.
 * Avoid a catch-all matcher: in dev it can 404 valid app routes (Next 16.2.x).
 */
export async function proxy(request: NextRequest) {
  return updateSession(request)
}

export const config = {
  matcher: [
    '/dashboard',
    '/gardens/:path*',
    '/garden-areas/:path*',
    '/settings/:path*',
    '/auth/callback',
    '/admin/access-requests/:path*',
  ],
}
