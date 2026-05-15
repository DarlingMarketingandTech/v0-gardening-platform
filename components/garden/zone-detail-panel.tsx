'use client'

import { ActionPill } from '@/components/garden-ui/action-pill'
import { AppSurface } from '@/components/garden-ui/app-surface'
import { ProgressMeter } from '@/components/garden-ui/progress-meter'
import { SectionCard } from '@/components/garden-ui/section-card'
import { StatusSurface } from '@/components/garden-ui/status-surface'
import { PlantingChipList } from '@/components/garden/planting-chip-list'
import { ZoneConditionBadge } from '@/components/garden/zone-condition-badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { GardenZoneCard } from '@/lib/garden-os/types'
import { ArrowLeft, Camera, ChevronRight, Droplets, Info } from 'lucide-react'

export interface ZoneDetailPanelProps {
  zone: GardenZoneCard | null
  onBack?: () => void
  showBack?: boolean
  className?: string
}

function rhythmMax(zone: GardenZoneCard) {
  return Math.max(zone.openTaskCount, zone.plantingCount + 1, 6)
}

export function ZoneDetailPanel({ zone, onBack, showBack, className }: ZoneDetailPanelProps) {
  if (!zone) {
    return (
      <AppSurface variant="muted" padding="lg" radius="xl" className={cn('text-center', className)}>
        <p className="text-sm text-[var(--garden-text-muted)]">Select a zone to see plants and care notes.</p>
      </AppSurface>
    )
  }

  const status = zone.condition

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      {showBack && onBack ? (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="-ml-2 w-fit gap-1 text-[var(--garden-text)] md:hidden"
          onClick={onBack}
        >
          <ArrowLeft className="size-4" aria-hidden />
          Back to zones
        </Button>
      ) : null}

      <SectionCard
        eyebrow={zone.areaTypeLabel}
        title={zone.title}
        description={zone.description}
        action={<ZoneConditionBadge condition={zone.condition} label={zone.conditionLabel} />}
      >
        <StatusSurface
          status={status}
          title="Zone status"
          description={`Light: ${zone.lightExposureLabel}`}
          icon={<Droplets className="opacity-90" aria-hidden />}
        />

        <div className="space-y-2 pt-2">
          <p className="text-xs font-semibold tracking-wide text-[var(--garden-text-muted)] uppercase">
            Plants in this zone
          </p>
          <PlantingChipList plantings={zone.plantings} />
        </div>

        <AppSurface variant="tinted" padding="sm" radius="lg" className="border-primary/15">
          <div className="flex gap-2">
            <Info className="mt-0.5 size-4 shrink-0 text-[var(--garden-primary)]" aria-hidden />
            <div className="space-y-1">
              <p className="text-xs font-semibold text-[var(--garden-text)]">Tip for this week</p>
              <p className="text-sm leading-relaxed text-[var(--garden-text-muted)]">{zone.weeklyAction}</p>
            </div>
          </div>
        </AppSurface>

        <div className="space-y-2">
          <p className="text-xs font-semibold text-[var(--garden-text-muted)] uppercase">This week&apos;s rhythm</p>
          <ProgressMeter
            label="Open checks vs capacity"
            value={zone.openTaskCount}
            max={rhythmMax(zone)}
            tone="green"
            showValue
          />
        </div>

        <div className="flex flex-col gap-2 border-t border-[var(--garden-border)] pt-4 sm:flex-row sm:flex-wrap">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            disabled
            className="justify-start gap-2 opacity-80"
            title="Coming soon — add plantings from your library."
          >
            <Camera className="size-4 shrink-0 opacity-70" aria-hidden />
            Add plant (soon)
          </Button>
          <ActionPill
            href="/my-garden/care"
            variant="primary"
            size="md"
            prefetch={false}
            icon={<ChevronRight className="size-4" aria-hidden />}
          >
            Start Care check
          </ActionPill>
        </div>

        <div className="grid gap-2 text-xs text-[var(--garden-text-muted)] sm:grid-cols-2">
          <p>
            <span className="font-medium text-[var(--garden-text)]">Best for:</span> {zone.bestFor}
          </p>
          <p>
            <span className="font-medium text-[var(--garden-text)]">Watch for:</span> {zone.watchFor}
          </p>
        </div>
      </SectionCard>
    </div>
  )
}
