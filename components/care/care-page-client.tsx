'use client'

import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { PestLookup } from '@/components/dashboard/pest-lookup'
import { GuideArticlesPanel } from '@/components/guide/guide-articles-panel'
import { KnowledgeSnippetsPanel } from '@/components/guide/knowledge-snippets-panel'
import { PlacementHelperPanel } from '@/components/guide/placement-helper-panel'
import { PlantIdentifyPanel } from '@/components/guide/plant-identify-panel'
import { useHydratedCareViewModel } from '@/lib/garden-os/hooks/use-hydrated-care-view-model'
import type { CareToolId, CareViewModel, GardenContext } from '@/lib/garden-os/types'
import type { GardenSpacesSource } from '@/lib/garden-setup/types'

interface CarePageClientProps {
  context: GardenContext
  viewModel: CareViewModel
  spacesSource: GardenSpacesSource
}

function CareToolPanel({
  toolId,
  spaces,
}: {
  toolId: CareToolId
  spaces: CareViewModel['spaces']
}) {
  switch (toolId) {
    case 'plant-check':
      return <PlacementHelperPanel spaces={spaces} />
    case 'symptom-check':
      return <KnowledgeSnippetsPanel />
    case 'pest-lookup':
      return <PestLookup />
    case 'plant-identify':
      return <PlantIdentifyPanel />
    default:
      return null
  }
}

export function CarePageClient({ context, viewModel, spacesSource }: CarePageClientProps) {
  const hydratedViewModel = useHydratedCareViewModel(context, viewModel, spacesSource)

  return (
    <div className="space-y-4">
      <Card className="rounded-2xl border-primary/10">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">{hydratedViewModel.headline}</CardTitle>
          <p className="text-sm text-muted-foreground">{hydratedViewModel.summary}</p>
        </CardHeader>
      </Card>

      {hydratedViewModel.tools.map((tool) => (
        <section key={tool.id} aria-label={tool.label}>
          <CareToolPanel toolId={tool.id} spaces={hydratedViewModel.spaces} />
        </section>
      ))}

      <GuideArticlesPanel />
    </div>
  )
}
