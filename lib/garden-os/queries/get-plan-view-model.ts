import { demoPlants } from '@/lib/demo-garden'
import { buildPlanViewModel } from '@/lib/garden-os/engines/plan-engine'
import { resolveSpacesSourceForContext } from '@/lib/garden-os/data/resolve-spaces-source'
import type { GardenContext, PlanViewModel } from '@/lib/garden-os/types'

/** @deprecated Prefer `buildPlanViewModel` with spaces source — kept for any legacy imports. */
export function buildPlanPlaceholderViewModel(): PlanViewModel {
  return buildPlanViewModel(
    resolveSpacesSourceForContext({ householdId: null, isDemo: true, plants: demoPlants }),
  )
}

export async function getPlanViewModel(context: GardenContext): Promise<PlanViewModel> {
  const spacesSource = resolveSpacesSourceForContext(context)
  return buildPlanViewModel(spacesSource)
}
