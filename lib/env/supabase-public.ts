/**
 * Whether public Supabase client env is present (safe to call createClient / SSR helpers).
 * Never log secret values; booleans only.
 */
export function hasPublicSupabaseEnv(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()
  return Boolean(url && key)
}
