import { demoGardenSpaces } from '@/lib/demo-garden'
import type { GardenContext } from '@/lib/garden-os/types'
import type { GardenSpacesSource } from '@/lib/garden-setup/types'

/**
 * Server-safe spaces resolver for Garden OS view models.
 * Personalized setup profiles live in localStorage until Supabase garden_areas ship.
 */
export function resolveSpacesSourceForContext(context: GardenContext): GardenSpacesSource {
  if (!context.householdId) {
    return { spaces: demoGardenSpaces, isPersonalized: false, profile: null }
  }

  // TODO(supabase): load garden_areas + plantings for context.householdId
  return { spaces: demoGardenSpaces, isPersonalized: false, profile: null }
}
