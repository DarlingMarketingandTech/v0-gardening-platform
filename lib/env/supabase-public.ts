/**
 * Whether public Supabase client env is present (safe to call createClient / SSR helpers).
 * Never log secret values; booleans only.
 */
function isValidHttpUrl(value: string): boolean {
  try {
    const parsed = new URL(value)
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
  } catch {
    return false
  }
}

export function getPublicSupabaseEnv():
  | { url: string; anonKey: string }
  | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()

  if (!url || !anonKey) return null
  if (!isValidHttpUrl(url)) return null

  return { url, anonKey }
}

export function hasPublicSupabaseEnv(): boolean {
  return getPublicSupabaseEnv() !== null
}
