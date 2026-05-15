import { mapGuideToolsToCareViewModel } from '@/lib/garden-os/mappers/map-guide-tools-to-care-view-model'
import type { CareViewModel } from '@/lib/garden-os/types'
import type { GardenSpacesSource } from '@/lib/garden-setup/types'

export function assembleCareViewModel(
  householdId: string | null,
  spacesSource: GardenSpacesSource,
): CareViewModel {
  return mapGuideToolsToCareViewModel(householdId, spacesSource.spaces)
}
