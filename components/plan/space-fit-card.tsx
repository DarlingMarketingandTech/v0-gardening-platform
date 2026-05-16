import { AppSurface, MetricChip, StateBadge } from '@/components/garden-ui'
import type { PlanSpaceFit } from '@/lib/garden-os/types'
import { Home, Sun } from 'lucide-react'

interface SpaceFitCardProps {
  fit: PlanSpaceFit
}

export function SpaceFitCard({ fit }: SpaceFitCardProps) {
  return (
    <AppSurface variant="muted" padding="md" radius="lg" className="h-full">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0 space-y-1">
          <p className="text-sm font-semibold text-[var(--garden-text)]">{fit.spaceTitle}</p>
          <p className="text-xs text-[var(--garden-text-muted)]">{fit.areaTypeLabel}</p>
        </div>
        <StateBadge tone={fit.group === 'outdoor' ? 'stable' : 'neutral'} size="md">
          {fit.group === 'outdoor' ? (
            <span className="inline-flex items-center gap-1">
              <Sun className="size-3.5" aria-hidden />
              Outdoor
            </span>
          ) : (
            <span className="inline-flex items-center gap-1">
              <Home className="size-3.5" aria-hidden />
              Indoor
            </span>
          )}
        </StateBadge>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <MetricChip tone="green" label="Light" value={fit.lightExposureLabel} />
      </div>

      <div className="mt-4 space-y-2 text-xs leading-relaxed">
        <p>
          <span className="font-medium text-[var(--garden-text)]">Best for: </span>
          <span className="text-[var(--garden-text-muted)]">{fit.bestFor}</span>
        </p>
        <p>
          <span className="font-medium text-[var(--garden-text)]">Watch for: </span>
          <span className="text-[var(--garden-text-muted)]">{fit.watchFor}</span>
        </p>
        <AppSurface variant="tinted" padding="sm" radius="md" className="mt-2">
          <p className="text-[var(--garden-text)]">
            <span className="font-medium">Planning suggestion: </span>
            {fit.planningSuggestion}
          </p>
        </AppSurface>
      </div>
    </AppSurface>
  )
}
