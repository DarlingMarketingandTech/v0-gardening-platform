'use client'

import { useMemo } from 'react'
import { assembleCareViewModel } from '@/lib/garden-os/assemble/assemble-care-view-model'
import {
  spacesSourceChanged,
  useHydratedSpacesSource,
} from '@/lib/garden-os/hooks/use-hydrated-spaces-source'
import type { CareViewModel, GardenContext } from '@/lib/garden-os/types'
import type { GardenSpacesSource } from '@/lib/garden-setup/types'

export function useHydratedCareViewModel(
  context: GardenContext,
  serverViewModel: CareViewModel,
  serverSpacesSource: GardenSpacesSource,
): CareViewModel {
  const spacesSource = useHydratedSpacesSource(context, serverSpacesSource)

  return useMemo(() => {
    if (!context.householdId || !spacesSourceChanged(serverSpacesSource, spacesSource)) {
      return serverViewModel
    }

    return assembleCareViewModel(context.householdId, spacesSource)
  }, [context.householdId, serverViewModel, serverSpacesSource, spacesSource])
}
