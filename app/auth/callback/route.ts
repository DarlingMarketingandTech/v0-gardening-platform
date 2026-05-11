import { createClient } from '@/lib/supabase/server'
import { claimCurrentUserInvite } from '@/lib/actions/household'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/my-garden'

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
    const url = new URL('/auth/error', origin)
    url.searchParams.set('error', 'household_claim_failed')
    url.searchParams.set('message', membership.error ?? 'Could not connect your account to the garden.')
    return NextResponse.redirect(url)
  }

  return NextResponse.redirect(`${origin}${next}`)
}
