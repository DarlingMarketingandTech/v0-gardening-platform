import { assembleGardenViewModel } from '@/lib/garden-os/assemble/assemble-garden-view-model'
import { resolveSpacesSourceForContext } from '@/lib/garden-os/data/resolve-spaces-source'
import type { GardenContext, GardenViewModel } from '@/lib/garden-os/types'

export async function getGardenViewModel(context: GardenContext): Promise<GardenViewModel> {
  const spacesSource = resolveSpacesSourceForContext(context)
  return assembleGardenViewModel(context.householdId, spacesSource)
}
