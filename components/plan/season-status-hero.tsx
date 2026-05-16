import { AppSurface, MetricChip, ProgressMeter, StatusSurface } from '@/components/garden-ui'
import type { PlanSeasonSummary } from '@/lib/garden-os/types'
import { CalendarRange, Leaf, MapPin } from 'lucide-react'
import { planConfidenceBadge } from '@/components/plan/plan-confidence-badge'

interface SeasonStatusHeroProps {
  season: PlanSeasonSummary
}

export function SeasonStatusHero({ season }: SeasonStatusHeroProps) {
  return (
    <StatusSurface
      status="stable"
      className="overflow-hidden border-[color-mix(in_oklch,var(--garden-primary)_16%,var(--garden-border))] bg-linear-to-br from-[color-mix(in_oklch,var(--garden-primary)_10%,var(--garden-surface))] via-[var(--garden-surface)] to-[color-mix(in_oklch,var(--garden-primary)_6%,var(--garden-surface-muted))]"
      icon={<Leaf className="text-[var(--garden-primary)]" aria-hidden />}
      title={season.headline}
      description={season.explanation}
      action={planConfidenceBadge(season.confidence)}
    >
      <div className="space-y-4 pt-1">
        <p className="text-xs font-medium tracking-wide text-[var(--garden-primary)] uppercase">{season.seasonEyebrow}</p>

        <div className="flex flex-wrap gap-2">
          <MetricChip
            tone="green"
            label="Growing mode"
            value={season.growingModeLabel}
            icon={<Leaf className="size-3.5" aria-hidden />}
          />
          {season.locationLabel ? (
            <MetricChip
              tone="neutral"
              label="Place context"
              value={season.locationLabel}
              icon={<MapPin className="size-3.5" aria-hidden />}
            />
          ) : null}
          <MetricChip
            tone="water"
            label="Next planning focus"
            value={season.nextFocus}
            icon={<CalendarRange className="size-3.5" aria-hidden />}
          />
        </div>

        <AppSurface variant="muted" padding="sm" radius="lg" className="border-dashed border-[color-mix(in_oklch,var(--garden-primary)_22%,var(--garden-border))]">
          <ProgressMeter
            value={season.rhythmPercent}
            max={100}
            label="Year rhythm (soft guide)"
            tone="green"
            showValue
          />
          <p className="mt-2 text-[11px] leading-relaxed text-[var(--garden-text-muted)]">
            Not a forecast — just a gentle sense of where we sit in the year while you sketch plans.
          </p>
        </AppSurface>
      </div>
    </StatusSurface>
  )
}
