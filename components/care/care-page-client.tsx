'use client'

import { useCallback, useRef, useState, type RefObject } from 'react'
import { CameraOverlayShell } from '@/components/care/camera-overlay-shell'
import { CareScanEntryCard } from '@/components/care/care-scan-entry-card'
import { CareToolGrid } from '@/components/care/care-tool-grid'
import { PlantIssueGuide } from '@/components/care/plant-issue-guide'
import { PestLookup } from '@/components/dashboard/pest-lookup'
import { AppSurface } from '@/components/garden-ui/app-surface'
import { GuideArticlesPanel } from '@/components/guide/guide-articles-panel'
import { KnowledgeSnippetsPanel } from '@/components/guide/knowledge-snippets-panel'
import { PlacementHelperPanel } from '@/components/guide/placement-helper-panel'
import {
  PlantIdentifyPanel,
  type PlantIdentifyPanelHandle,
} from '@/components/guide/plant-identify-panel'
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
  identifyPanelRef,
  pendingIdentifyImage,
  onConsumedIdentifyImage,
}: {
  toolId: CareToolId
  spaces: CareViewModel['spaces']
  identifyPanelRef: RefObject<PlantIdentifyPanelHandle | null>
  pendingIdentifyImage: string | null
  onConsumedIdentifyImage: () => void
}) {
  switch (toolId) {
    case 'plant-check':
      return <PlacementHelperPanel spaces={spaces} />
    case 'symptom-check':
      return <KnowledgeSnippetsPanel />
    case 'pest-lookup':
      return <PestLookup />
    case 'plant-identify':
      return (
        <PlantIdentifyPanel
          ref={identifyPanelRef}
          initialImageDataUrl={pendingIdentifyImage}
          onConsumedInitialImage={onConsumedIdentifyImage}
        />
      )
    default:
      return null
  }
}

export function CarePageClient({ context, viewModel, spacesSource }: CarePageClientProps) {
  const hydratedViewModel = useHydratedCareViewModel(context, viewModel, spacesSource)
  const [overlayOpen, setOverlayOpen] = useState(false)
  const [pendingIdentifyImage, setPendingIdentifyImage] = useState<string | null>(null)
  const identifyPanelRef = useRef<PlantIdentifyPanelHandle>(null)

  const scrollToTool = useCallback((toolId: CareToolId) => {
    document.getElementById(`care-tool-${toolId}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  const openIdentifyUpload = useCallback(() => {
    scrollToTool('plant-identify')
    queueMicrotask(() => identifyPanelRef.current?.openFilePicker())
  }, [scrollToTool])

  const clearPendingImage = useCallback(() => setPendingIdentifyImage(null), [])

  return (
    <div className="space-y-8 pb-6">
      <header className="space-y-2">
        <h2 className="text-xl font-bold leading-tight text-(--garden-text) md:text-2xl">
          {hydratedViewModel.headline}
        </h2>
        <p className="text-sm leading-relaxed text-(--garden-text-muted)">{hydratedViewModel.summary}</p>
      </header>

      <CareScanEntryCard
        onIdentifyClick={() => setOverlayOpen(true)}
        onUploadClick={openIdentifyUpload}
      />

      <CareToolGrid tools={hydratedViewModel.tools} onOpenTool={(id) => scrollToTool(id)} />

      <PlantIssueGuide />

      <div className="space-y-8">
        {hydratedViewModel.tools.map((tool) => (
          <section
            key={tool.id}
            id={`care-tool-${tool.id}`}
            aria-label={tool.label}
            className="scroll-mt-6"
          >
            <CareToolPanel
              toolId={tool.id}
              spaces={hydratedViewModel.spaces}
              identifyPanelRef={identifyPanelRef}
              pendingIdentifyImage={tool.id === 'plant-identify' ? pendingIdentifyImage : null}
              onConsumedIdentifyImage={clearPendingImage}
            />
          </section>
        ))}
      </div>

      <AppSurface variant="muted" padding="md" radius="xl" className="border-dashed border-(--garden-border) opacity-[0.97]">
        <p className="mb-3 text-xs font-medium tracking-wide text-muted-foreground uppercase">
          Reading room
        </p>
        <GuideArticlesPanel />
      </AppSurface>

      <CameraOverlayShell
        open={overlayOpen}
        onClose={() => setOverlayOpen(false)}
        onCapturedImage={(dataUrl) => {
          setPendingIdentifyImage(dataUrl)
          scrollToTool('plant-identify')
        }}
        onFallbackUpload={openIdentifyUpload}
      />
    </div>
  )
}
