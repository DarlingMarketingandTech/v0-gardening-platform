import { createClient } from '@/lib/supabase/server'
import { type EmailOtpType } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

function safeNextPath(raw: string | null): string {
  const fallback = '/my-garden'
  if (!raw || !raw.startsWith('/')) return fallback
  if (raw.startsWith('//')) return fallback
  return raw
}

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl
  const code = searchParams.get('code')
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const next = safeNextPath(searchParams.get('next'))

  const supabase = await createClient()

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (error) {
      return NextResponse.redirect(new URL('/auth/error', origin))
    }
    return NextResponse.redirect(new URL(next, origin))
  }

  if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    })
    if (error) {
      return NextResponse.redirect(new URL('/auth/error', origin))
    }
    return NextResponse.redirect(new URL(next, origin))
  }

  return NextResponse.redirect(new URL('/auth/error', origin))
}
