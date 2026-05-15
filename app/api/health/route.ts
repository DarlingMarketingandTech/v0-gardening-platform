import { NextResponse } from 'next/server'
import { hasPublicSupabaseEnv } from '@/lib/env/supabase-public'

/**
 * Safe deployment/config probe. No secrets.
 */
export function GET() {
  return NextResponse.json({
    ok: true,
    supabasePublicEnv: hasPublicSupabaseEnv(),
    nodeEnv: process.env.NODE_ENV,
  })
}
