import { mapSpacesToZoneCards } from '@/lib/garden-os/mappers/map-space-to-zone-card'
import type { GardenViewModel } from '@/lib/garden-os/types'
import type { GardenSpacesSource } from '@/lib/garden-setup/types'

export function assembleGardenViewModel(
  householdId: string | null,
  spacesSource: GardenSpacesSource,
): GardenViewModel {
  return {
    householdId,
    spacesSource,
    zoneCards: mapSpacesToZoneCards(spacesSource.spaces),
    locationLabel: spacesSource.profile?.locationLabel ?? null,
    isPersonalized: spacesSource.isPersonalized,
  }
}
