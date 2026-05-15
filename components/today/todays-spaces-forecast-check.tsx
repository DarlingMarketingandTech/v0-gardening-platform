import { MapPin } from 'lucide-react'
import { AppSurface, SectionCard, StateBadge } from '@/components/garden-ui'
import type { TodayForecastSpaceCheck, TodayForecastSpaceTone } from '@/lib/garden-os/types'

function toneToBadgeTone(tone: TodayForecastSpaceTone): 'stable' | 'water' | 'attention' | 'neutral' {
  switch (tone) {
    case 'water':
      return 'water'
    case 'attention':
    case 'watch':
      return 'attention'
    case 'stable':
    default:
      return 'stable'
  }
}

function toneToShortLabel(tone: TodayForecastSpaceTone, condition: string): string {
  if (tone === 'watch') return 'Watch this space'
  if (tone === 'water') return 'Needs water'
  if (tone === 'attention') return 'Needs attention'
  if (condition === 'Stable') return 'Looking good'
  return condition
}

export interface TodaysSpacesForecastCheckProps {
  spaces: TodayForecastSpaceCheck[]
}

export function TodaysSpacesForecastCheck({ spaces }: TodaysSpacesForecastCheckProps) {
  if (!spaces.length) {
    return (
      <p className="text-sm text-[var(--garden-text-muted)]">
        Add a space in Garden to see forecast-aware checks here.
      </p>
    )
  }

  return (
    <SectionCard eyebrow="Spaces to watch">
      <ul className="space-y-2">
        {spaces.map((space) => (
          <li key={space.id}>
            <AppSurface variant="muted" padding="sm" className="border-dashed border-[var(--garden-border)]">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="flex min-w-0 items-start gap-2">
                  <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-[var(--garden-primary-soft)] text-[var(--garden-primary)]">
                    <MapPin className="size-4" aria-hidden />
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold text-[var(--garden-text)]">{space.name}</p>
                      <StateBadge tone={toneToBadgeTone(space.tone)} size="sm">
                        {toneToShortLabel(space.tone, space.condition)}
                      </StateBadge>
                    </div>
                    <p className="mt-0.5 text-xs text-[var(--garden-text-muted)]">{space.areaTypeLabel}</p>
                  </div>
                </div>
                {(space.openTaskCount ?? 0) > 0 || (space.plantCount ?? 0) > 0 ? (
                  <p className="text-[11px] text-[var(--garden-text-muted)] tabular-nums">
                    {space.plantCount != null ? `${space.plantCount} plants` : null}
                    {space.plantCount != null && space.openTaskCount != null ? ' · ' : null}
                    {space.openTaskCount != null ? `${space.openTaskCount} open checks` : null}
                  </p>
                ) : null}
              </div>
              <p className="mt-2 text-xs font-medium text-[var(--garden-text)]">{space.impactLabel}</p>
              <p className="mt-1 text-sm leading-relaxed text-[var(--garden-text-muted)]">{space.recommendation}</p>
            </AppSurface>
          </li>
        ))}
      </ul>
    </SectionCard>
  )
}
