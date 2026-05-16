import { AppSurface, MetricChip } from '@/components/garden-ui'
import type { PlanTimelineRow } from '@/lib/garden-os/types'
import { planConfidenceBadge } from '@/components/plan/plan-confidence-badge'

interface TimelineRowProps {
  row: PlanTimelineRow
}

export function TimelineRow({ row }: TimelineRowProps) {
  return (
    <AppSurface variant="default" padding="md" radius="lg" className="border-[color-mix(in_oklch,var(--garden-primary)_12%,var(--garden-border))]">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <p className="text-sm font-semibold text-[var(--garden-text)]">{row.windowLabel}</p>
        {planConfidenceBadge(row.confidence)}
      </div>
      <p className="mt-2 text-sm leading-relaxed text-[var(--garden-text)]">{row.recommendedAction}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <MetricChip tone="neutral" label="Space type" value={row.spaceTypeHint} />
      </div>
      <p className="mt-2 text-xs text-[var(--garden-text-muted)]">{row.whyNow}</p>
    </AppSurface>
  )
}
