'use client'

import { GardenSpaces } from '@/components/dashboard/garden-spaces'
import { useHydratedGardenViewModel } from '@/lib/garden-os/hooks/use-hydrated-garden-view-model'
import type { GardenContext, GardenViewModel } from '@/lib/garden-os/types'
import type { GardenSpacesSource } from '@/lib/garden-setup/types'

interface GardenPageClientProps {
  context: GardenContext
  viewModel: GardenViewModel
  spacesSource: GardenSpacesSource
}

export function GardenPageClient({ context, viewModel, spacesSource }: GardenPageClientProps) {
  const hydratedViewModel = useHydratedGardenViewModel(context, viewModel, spacesSource)
  const { spacesSource: hydratedSpaces } = hydratedViewModel

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold leading-tight md:text-2xl">Garden</h2>
        <p className="text-sm text-muted-foreground">Your spaces, zones, and plantings.</p>
      </div>
      <GardenSpaces
        spaces={hydratedSpaces.spaces}
        isPersonalized={hydratedSpaces.isPersonalized}
        locationLabel={hydratedSpaces.profile?.locationLabel ?? hydratedViewModel.locationLabel}
        householdId={hydratedViewModel.householdId}
      />
    </div>
  )
}
