'use client'

import { useMemo } from 'react'
import { assembleGardenViewModel } from '@/lib/garden-os/assemble/assemble-garden-view-model'
import {
  spacesSourceChanged,
  useHydratedSpacesSource,
} from '@/lib/garden-os/hooks/use-hydrated-spaces-source'
import type { GardenContext, GardenViewModel } from '@/lib/garden-os/types'
import type { GardenSpacesSource } from '@/lib/garden-setup/types'

export function useHydratedGardenViewModel(
  context: GardenContext,
  serverViewModel: GardenViewModel,
  serverSpacesSource: GardenSpacesSource,
): GardenViewModel {
  const spacesSource = useHydratedSpacesSource(context, serverSpacesSource)

  return useMemo(() => {
    if (!context.householdId || !spacesSourceChanged(serverSpacesSource, spacesSource)) {
      return serverViewModel
    }

    return assembleGardenViewModel(context.householdId, spacesSource)
  }, [context.householdId, serverViewModel, serverSpacesSource, spacesSource])
}
