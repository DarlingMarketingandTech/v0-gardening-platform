import { createClient } from '@/lib/supabase/server'
import { claimCurrentUserInvite } from '@/lib/actions/household'
import { NextRequest, NextResponse } from 'next/server'

function getSafeNextPath(next: string | null) {
  if (!next || !next.startsWith('/') || next.startsWith('//')) {
    return '/my-garden'
  }

  return next
}

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl
  const code = searchParams.get('code')
  const next = getSafeNextPath(searchParams.get('next'))

  if (!code) {
    return NextResponse.redirect(`${origin}/auth/error?error=missing_code`)
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    return NextResponse.redirect(`${origin}/auth/error?error=callback_exchange_failed`)
  }

  const membership = await claimCurrentUserInvite()

  if (!membership.success) {
    await supabase.auth.signOut()

    const url = new URL('/auth/error', origin)
    url.searchParams.set('error', 'household_claim_failed')
    url.searchParams.set('message', membership.error ?? 'Could not connect your account to the garden.')
    return NextResponse.redirect(url)
  }

  return NextResponse.redirect(new URL(next, origin))
}
