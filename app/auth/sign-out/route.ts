import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

async function signOutAndRedirect(request: NextRequest, status?: number) {
  const supabase = await createClient()
  await supabase.auth.signOut()
  return NextResponse.redirect(new URL('/auth/login', request.url), status)
}

export async function POST(request: NextRequest) {
  return signOutAndRedirect(request, 303)
}

export async function GET(request: NextRequest) {
  return signOutAndRedirect(request)
}
