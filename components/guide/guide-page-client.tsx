'use client'

import { PlantLibraryBrowser } from '@/components/guide/plant-library-browser'
import { GuideArticlesPanel } from '@/components/guide/guide-articles-panel'
import { AppSurface } from '@/components/garden-ui/app-surface'
import type { PlantLibraryEntry } from '@/lib/plant-library/get-plant-library'

interface GuidePageClientProps {
  plants: PlantLibraryEntry[]
}

export function GuidePageClient({ plants }: GuidePageClientProps) {
  return (
    <div className="space-y-8 pb-6">
      {/* ── Header ── */}
      <header className="space-y-2">
        <h2 className="text-xl font-bold leading-tight text-(--garden-text) md:text-2xl">
          Plant guide
        </h2>
        <p className="text-sm leading-relaxed text-(--garden-text-muted)">
          {plants.length} vegetables and herbs — tap any plant for full care details.
        </p>
      </header>

      {/* ── Plant library browser ── */}
      <section className="space-y-4" aria-label="Plant library">
        <PlantLibraryBrowser plants={plants} />
      </section>

      {/* ── Reading room ── */}
      <AppSurface
        variant="muted"
        padding="md"
        radius="xl"
        className="border-dashed border-(--garden-border) opacity-[0.97]"
      >
        <p className="mb-3 text-xs font-medium tracking-wide text-muted-foreground uppercase">
          Reading room
        </p>
        <GuideArticlesPanel />
      </AppSurface>
    </div>
  )
}
