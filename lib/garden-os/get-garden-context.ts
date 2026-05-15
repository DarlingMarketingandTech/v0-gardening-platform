import { redirect } from 'next/navigation'
import { claimPrivateBetaHousehold, getMyHouseholdMembership } from '@/lib/access/private-beta'
import { DEMO_HOUSEHOLD_ID, demoPlants } from '@/lib/demo-garden'
import { hasPublicSupabaseEnv } from '@/lib/env/supabase-public'
import { createClient } from '@/lib/supabase/server'
import type { GardenContext } from '@/lib/garden-os/types'

/**
 * Resolves household + demo mode for Garden V2 routes.
 * Demo fallback when Supabase env or auth session is unavailable.
 * Signed-in users without a household are claimed or sent to /not-allowed.
 */
export async function getGardenContext(): Promise<GardenContext> {
  if (!hasPublicSupabaseEnv()) {
    return {
      householdId: null,
      isDemo: true,
      plants: demoPlants,
    }
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return {
      householdId: null,
      isDemo: true,
      plants: demoPlants,
    }
  }

  let { householdId } = await getMyHouseholdMembership(supabase)

  if (!householdId) {
    const claim = await claimPrivateBetaHousehold(supabase)
    if (claim.householdId) {
      householdId = claim.householdId
    } else {
      redirect('/not-allowed')
    }
  }

  return {
    householdId,
    isDemo: householdId === DEMO_HOUSEHOLD_ID,
    plants: demoPlants,
  }
}
