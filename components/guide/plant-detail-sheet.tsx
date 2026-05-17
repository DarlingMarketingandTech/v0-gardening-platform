'use client'

import type { ReactNode } from 'react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import type { PlantLibraryEntry } from '@/lib/plant-library/get-plant-library'
import { Droplets, Ruler, Sun, AlertTriangle, Sprout, Scissors, Archive, Shovel, Leaf } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PlantDetailSheetProps {
  plant: PlantLibraryEntry | null
  onClose: () => void
}

const sunlightIcon: Record<string, string> = {
  'full sun': '☀️',
  'part sun': '🌤️',
  'part shade': '⛅',
  shade: '🌥️',
}

export function PlantDetailSheet({ plant, onClose }: PlantDetailSheetProps) {
  return (
    <Sheet open={plant !== null} onOpenChange={(open) => { if (!open) onClose() }}>
      <SheetContent
        side="bottom"
        className={cn(
          'max-h-[92dvh] overflow-y-auto rounded-t-3xl',
          'px-0 pb-[max(2rem,env(safe-area-inset-bottom))]',
        )}
      >
        {plant ? <PlantDetailBody plant={plant} /> : null}
      </SheetContent>
    </Sheet>
  )
}

function PlantDetailBody({ plant }: { plant: PlantLibraryEntry }) {
  const hasDetail = Object.values(plant.detail).some(Boolean)

  return (
    <div className="flex flex-col gap-0">
      {/* ── Header ── */}
      <SheetHeader className="px-5 pt-2 pb-4">
        <div className="flex items-center gap-3">
          <div className="shrink-0 size-14 rounded-2xl bg-primary/8 border border-primary/12 flex items-center justify-center text-3xl select-none">
            🌿
          </div>
          <div className="min-w-0 space-y-1">
            <SheetTitle className="text-xl font-bold leading-tight">
              {plant.commonName}
            </SheetTitle>
            <SheetDescription asChild>
              <span className="inline-block rounded-full bg-muted px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                {plant.category}
              </span>
            </SheetDescription>
          </div>
        </div>
      </SheetHeader>

      {/* ── Quick stats bar ── */}
      <div className="mx-5 mb-5 flex flex-wrap gap-2">
        {plant.sunlight ? (
          <Pill label={`${sunlightIcon[plant.sunlight] ?? '☀️'} ${plant.sunlight}`} />
        ) : null}
        {plant.spacingInches ? (
          <Pill label={`📏 ${plant.spacingInches}" spacing`} />
        ) : null}
        {plant.edible ? <Pill label="🥦 Edible" /> : null}
      </div>

      <div className="divide-y divide-border/50 px-5 space-y-0">
        {/* About */}
        {plant.careSummary ? (
          <Section icon={<Leaf className="h-4 w-4" />} heading="About">
            <p className="text-sm leading-relaxed text-[var(--garden-text-muted)]">
              {plant.careSummary}
            </p>
          </Section>
        ) : null}

        {/* Watering */}
        {plant.water ? (
          <Section icon={<Droplets className="h-4 w-4 text-sky-400" />} heading="Watering">
            <p className="text-sm leading-relaxed text-[var(--garden-text-muted)]">{plant.water}</p>
          </Section>
        ) : null}

        {/* When to plant */}
        {plant.detail.whenToPlant ? (
          <Section icon={<Sprout className="h-4 w-4 text-green-500" />} heading="When to plant">
            <p className="text-sm leading-relaxed text-[var(--garden-text-muted)]">
              {plant.detail.whenToPlant}
            </p>
          </Section>
        ) : null}

        {/* Planting considerations */}
        {plant.detail.plantingConsiderations ? (
          <Section icon={<Shovel className="h-4 w-4 text-amber-600" />} heading="Planting tips">
            <p className="text-sm leading-relaxed text-[var(--garden-text-muted)]">
              {plant.detail.plantingConsiderations}
            </p>
          </Section>
        ) : null}

        {/* Soil */}
        {plant.detail.optimalSoil ? (
          <Section icon={<span className="text-base leading-none">🪴</span>} heading="Optimal soil">
            <p className="text-sm leading-relaxed text-[var(--garden-text-muted)]">
              {plant.detail.optimalSoil}
            </p>
          </Section>
        ) : null}

        {/* Spacing */}
        {(plant.spacingInches || plant.detail.transplanting) ? (
          <Section icon={<Ruler className="h-4 w-4 text-muted-foreground" />} heading="Spacing & transplanting">
            {plant.spacingInches ? (
              <p className="text-sm text-[var(--garden-text-muted)]">
                Space plants <strong>{plant.spacingInches} inches</strong> apart in all directions.
              </p>
            ) : null}
            {plant.detail.transplanting ? (
              <p className="mt-1 text-sm leading-relaxed text-[var(--garden-text-muted)]">
                {plant.detail.transplanting}
              </p>
            ) : null}
          </Section>
        ) : null}

        {/* Feeding */}
        {plant.detail.feeding ? (
          <Section icon={<span className="text-base leading-none">🌱</span>} heading="Feeding">
            <p className="text-sm leading-relaxed text-[var(--garden-text-muted)]">
              {plant.detail.feeding}
            </p>
          </Section>
        ) : null}

        {/* Other care */}
        {plant.detail.otherCare ? (
          <Section icon={<Sun className="h-4 w-4 text-amber-400" />} heading="Other care">
            <p className="text-sm leading-relaxed text-[var(--garden-text-muted)]">
              {plant.detail.otherCare}
            </p>
          </Section>
        ) : null}

        {/* Harvesting */}
        {plant.detail.harvesting ? (
          <Section icon={<Scissors className="h-4 w-4 text-primary" />} heading="Harvesting">
            <p className="text-sm leading-relaxed text-[var(--garden-text-muted)]">
              {plant.detail.harvesting}
            </p>
          </Section>
        ) : null}

        {/* Storage */}
        {plant.detail.storageUse ? (
          <Section icon={<Archive className="h-4 w-4 text-muted-foreground" />} heading="Storage & use">
            <p className="text-sm leading-relaxed text-[var(--garden-text-muted)]">
              {plant.detail.storageUse}
            </p>
          </Section>
        ) : null}

        {/* Watch out for */}
        {plant.watchOutFor ? (
          <Section icon={<AlertTriangle className="h-4 w-4 text-amber-500" />} heading="Watch out for">
            {plant.watchOutFor.split(' | ').map((chunk, i) => (
              <p key={i} className="mt-1 text-sm leading-relaxed text-[var(--garden-text-muted)]">
                {chunk}
              </p>
            ))}
          </Section>
        ) : null}

        {!hasDetail && !plant.careSummary ? (
          <p className="py-6 text-sm text-center text-muted-foreground">
            No additional details available for this plant.
          </p>
        ) : null}
      </div>
    </div>
  )
}

function Section({
  icon,
  heading,
  children,
}: {
  icon: ReactNode
  heading: string
  children: ReactNode
}) {
  return (
    <div className="py-4 first:pt-0">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-[var(--garden-primary)]">{icon}</span>
        <h3 className="text-xs font-semibold uppercase tracking-wide text-[var(--garden-text-muted)]">
          {heading}
        </h3>
      </div>
      <div className="pl-6">{children}</div>
    </div>
  )
}

function Pill({ label }: { label: string }) {
  return (
    <span className="rounded-full border border-border/60 bg-muted/60 px-3 py-1 text-xs font-medium text-[var(--garden-text)]">
      {label}
    </span>
  )
}
