import { DEMO_HOUSEHOLD_ID } from '@/lib/demo-garden'
import { hasPublicSupabaseEnv } from '@/lib/env/supabase-public'

export type GardenDataMode = 'demo' | 'local' | 'supabase'

/** Which backing store powers the current session (UI shapes stay the same). */
export function getGardenDataMode(householdId: string | null | undefined): GardenDataMode {
  if (!householdId || householdId === DEMO_HOUSEHOLD_ID) return 'demo'
  if (!hasPublicSupabaseEnv()) return 'local'
  return 'local'
}

export function isDemoHousehold(householdId: string | null | undefined): boolean {
  return !householdId || householdId === DEMO_HOUSEHOLD_ID
}
