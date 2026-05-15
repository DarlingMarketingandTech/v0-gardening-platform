'use client'

import { useMemo } from 'react'
import { assembleTodayViewModel } from '@/lib/garden-os/assemble/assemble-today-view-model'
import {
  spacesSourceChanged,
  useHydratedSpacesSource,
} from '@/lib/garden-os/hooks/use-hydrated-spaces-source'
import type { GardenContext, TodayViewModel } from '@/lib/garden-os/types'
import type { GardenSpacesSource } from '@/lib/garden-setup/types'

export function useHydratedTodayViewModel(
  context: GardenContext,
  serverViewModel: TodayViewModel,
  serverSpacesSource: GardenSpacesSource,
): TodayViewModel {
  const spacesSource = useHydratedSpacesSource(context, serverSpacesSource)

  return useMemo(() => {
    if (!context.householdId || !spacesSourceChanged(serverSpacesSource, spacesSource)) {
      return serverViewModel
    }

    return assembleTodayViewModel(spacesSource, serverViewModel.weatherState)
  }, [context.householdId, serverViewModel, serverSpacesSource, spacesSource])
}
