import { assembleCareViewModel } from '@/lib/garden-os/assemble/assemble-care-view-model'
import { resolveSpacesSourceForContext } from '@/lib/garden-os/data/resolve-spaces-source'
import type { CareViewModel, GardenContext } from '@/lib/garden-os/types'

export async function getCareViewModel(context: GardenContext): Promise<CareViewModel> {
  const spacesSource = resolveSpacesSourceForContext(context)
  return assembleCareViewModel(context.householdId, spacesSource)
}
