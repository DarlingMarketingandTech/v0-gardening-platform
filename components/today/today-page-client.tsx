'use client'

import { useHydratedTodayViewModel } from '@/lib/garden-os/hooks/use-hydrated-today-view-model'
import type { GardenContext, TodayViewModel } from '@/lib/garden-os/types'
import type { GardenSpacesSource } from '@/lib/garden-setup/types'
import { TodayBriefCard } from './today-brief-card'

interface TodayPageClientProps {
  context: GardenContext
  viewModel: TodayViewModel
  spacesSource: GardenSpacesSource
}

export function TodayPageClient({ context, viewModel, spacesSource }: TodayPageClientProps) {
  const hydratedViewModel = useHydratedTodayViewModel(context, viewModel, spacesSource)

  return (
    <div className="space-y-4">
      <div className="mb-1">
        <h2 className="text-xl font-bold leading-tight md:text-2xl">My Garden</h2>
        <p className="text-sm text-muted-foreground">{hydratedViewModel.greeting}</p>
      </div>
      <TodayBriefCard viewModel={hydratedViewModel} />
    </div>
  )
}
