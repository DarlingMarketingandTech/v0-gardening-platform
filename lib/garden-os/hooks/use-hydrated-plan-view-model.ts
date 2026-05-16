'use client'

import { useMemo } from 'react'
import { buildPlanViewModel } from '@/lib/garden-os/engines/plan-engine'
import {
  spacesSourceChanged,
  useHydratedSpacesSource,
} from '@/lib/garden-os/hooks/use-hydrated-spaces-source'
import type { GardenContext, PlanViewModel } from '@/lib/garden-os/types'
import type { GardenSpacesSource } from '@/lib/garden-setup/types'

export function useHydratedPlanViewModel(
  context: GardenContext,
  serverViewModel: PlanViewModel,
  serverSpacesSource: GardenSpacesSource,
): PlanViewModel {
  const spacesSource = useHydratedSpacesSource(context, serverSpacesSource)

  return useMemo(() => {
    if (!context.householdId || !spacesSourceChanged(serverSpacesSource, spacesSource)) {
      return serverViewModel
    }
    return buildPlanViewModel(spacesSource)
  }, [context.householdId, context.isDemo, serverViewModel, serverSpacesSource, spacesSource])
}
