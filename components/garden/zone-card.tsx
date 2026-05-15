'use client'

import { ActionPill } from '@/components/garden-ui/action-pill'
import { AppSurface } from '@/components/garden-ui/app-surface'
import { MetricChip } from '@/components/garden-ui/metric-chip'
import { PlantingChipList } from '@/components/garden/planting-chip-list'
import { ZoneConditionBadge } from '@/components/garden/zone-condition-badge'
import { cn } from '@/lib/utils'
import type { GardenZoneCard } from '@/lib/garden-os/types'
import { Droplets, Leaf, SunMedium } from 'lucide-react'

export interface ZoneCardProps {
  zone: GardenZoneCard
  selected?: boolean
  onSelect: () => void
  className?: string
}

const PREVIEW_PLANTS = 4

export function ZoneCard({ zone, selected, onSelect, className }: ZoneCardProps) {
  return (
    <AppSurface
      variant="elevated"
      padding="md"
      radius="xl"
      interactive
      role="button"
      tabIndex={0}
      aria-pressed={selected}
      aria-label={`View zone ${zone.title}`}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onSelect()
        }
      }}
      className={cn(
        selected && 'ring-2 ring-[var(--garden-primary)]/35 ring-offset-2 ring-offset-[var(--garden-bg)]',
        className,
      )}
    >
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="min-w-0 space-y-1">
            <p className="text-xs font-medium tracking-wide text-[var(--garden-text-muted)] uppercase">
              {zone.areaTypeLabel}
            </p>
            <h3 className="text-lg font-semibold leading-tight text-[var(--garden-text)]">{zone.title}</h3>
          </div>
          <ZoneConditionBadge condition={zone.condition} label={zone.conditionLabel} />
        </div>

        <div className="flex flex-wrap gap-2">
          <MetricChip
            icon={<SunMedium className="text-[var(--garden-attention)]" aria-hidden />}
            label="Light"
            value={zone.lightExposureLabel}
            tone="neutral"
            className="max-w-full sm:max-w-[14rem]"
          />
          <MetricChip
            icon={<Leaf className="text-[var(--garden-primary)]" aria-hidden />}
            label="Plants"
            value={zone.plantingCount}
            tone="green"
          />
          <MetricChip
            icon={<Droplets className="text-[var(--garden-water)]" aria-hidden />}
            label="Tasks"
            value={zone.openTaskCount}
            tone="water"
          />
        </div>

        <p className="text-xs leading-relaxed text-[var(--garden-text-muted)]">
          <span className="font-medium text-[var(--garden-text)]">Best for:</span> {zone.bestFor}
        </p>
        <p className="text-xs leading-relaxed text-[var(--garden-text-muted)]">
          <span className="font-medium text-[var(--garden-text)]">Watch for:</span> {zone.watchFor}
        </p>

        <PlantingChipList plantings={zone.plantings} maxItems={PREVIEW_PLANTS} />

        <div className="flex flex-wrap gap-2 pt-1">
          <ActionPill
            type="button"
            variant="primary"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              onSelect()
            }}
          >
            View zone
          </ActionPill>
          <ActionPill
            href="/my-garden/care"
            variant="secondary"
            size="sm"
            prefetch={false}
            onClick={(e) => e.stopPropagation()}
          >
            Care check
          </ActionPill>
        </div>
      </div>
    </AppSurface>
  )
}
