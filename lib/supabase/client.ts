import { createBrowserClient } from '@supabase/ssr'
import { getPublicSupabaseEnv } from '@/lib/env/supabase-public'

const FALLBACK_SUPABASE_URL = 'https://example.com'
const FALLBACK_SUPABASE_ANON_KEY = 'public-anon-key'

export function createClient() {
  const env = getPublicSupabaseEnv()

  return createBrowserClient(
    env?.url ?? FALLBACK_SUPABASE_URL,
    env?.anonKey ?? FALLBACK_SUPABASE_ANON_KEY,
  )
}
