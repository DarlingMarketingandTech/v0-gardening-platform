'use client'

import { MetricChip } from '@/components/garden-ui/metric-chip'
import type { GardenOverviewSummary } from '@/lib/garden-os/types'
import { HeartHandshake, Leaf, ListTodo, MapPinned } from 'lucide-react'

export interface ZoneOverviewHeaderProps {
  overview: GardenOverviewSummary
  /** When `overview.gardenLabel` is null, UI falls back to location or this title. */
  locationLabel?: string | null
  isPersonalized?: boolean
}

export function ZoneOverviewHeader({
  overview,
  locationLabel,
  isPersonalized = false,
}: ZoneOverviewHeaderProps) {
  const title =
    overview.gardenLabel ??
    (locationLabel ? `Garden near ${locationLabel}` : null) ??
    'Your garden'

  const subtitle = isPersonalized
    ? locationLabel
      ? `Zones and plants around ${locationLabel}. Tap a zone for details.`
      : 'Your zones and plants — tap a zone for details.'
    : 'Demo zones — calm overview of spaces and plantings.'

  return (
    <header className="space-y-4">
      <div className="space-y-1">
        <p className="text-xs font-medium tracking-wide text-primary uppercase">Garden</p>
        <h2 className="text-xl font-bold leading-tight text-[var(--garden-text)] md:text-2xl">{title}</h2>
        <p className="text-sm leading-relaxed text-[var(--garden-text-muted)]">{subtitle}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <MetricChip
          icon={<MapPinned className="text-[var(--garden-primary)]" aria-hidden />}
          label="Zones"
          value={overview.zoneCount}
          tone="green"
        />
        <MetricChip
          icon={<Leaf className="text-[var(--garden-primary)]" aria-hidden />}
          label="Plants"
          value={overview.plantingCount}
          tone="green"
        />
        <MetricChip
          icon={<ListTodo className="text-[var(--garden-water)]" aria-hidden />}
          label="Tasks"
          value={overview.openTaskCount}
          tone="water"
        />
        <MetricChip
          icon={<HeartHandshake className="text-[var(--garden-attention)]" aria-hidden />}
          label="Care checks"
          value={overview.activeCareCaseCount}
          tone="attention"
        />
      </div>

      <p className="text-sm leading-relaxed text-[var(--garden-text)]">{overview.summaryLine}</p>
    </header>
  )
}
