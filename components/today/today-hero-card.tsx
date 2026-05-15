'use client'

import { todayBriefIcons } from '@/components/today/today-brief-parts'
import { ActionPill, AppSurface, StateBadge, StatusSurface } from '@/components/garden-ui'
import type { GardenStatusKind } from '@/components/garden-ui/status-surface'
import type { TodayBriefItemKind } from '@/lib/today-brief'
import type { TodayViewModel } from '@/lib/garden-os/types'

function kindToStatus(kind: TodayBriefItemKind): GardenStatusKind {
  switch (kind) {
    case 'water':
      return 'needs_water'
    case 'support':
    case 'tidy':
    case 'indoor':
    case 'weather':
      return 'attention'
    default:
      return 'stable'
  }
}

function kindToUrgencyLabel(kind: TodayBriefItemKind): string {
  switch (kind) {
    case 'water':
      return 'Needs water'
    case 'harvest':
    case 'bloom':
      return 'Looking good'
    case 'support':
    case 'tidy':
    case 'indoor':
      return 'Needs attention'
    case 'weather':
      return 'Watch this space'
    default:
      return 'Stable'
  }
}

function kindToBadgeTone(kind: TodayBriefItemKind): 'water' | 'attention' | 'stable' {
  if (kind === 'water') return 'water'
  if (kind === 'harvest' || kind === 'bloom') return 'stable'
  return 'attention'
}

export function TodayHeroCard({ viewModel }: { viewModel: TodayViewModel }) {
  const { brief } = viewModel
  const item = brief.bestAction
  const Icon = todayBriefIcons[item.kind]

  return (
    <StatusSurface
      status={kindToStatus(item.kind)}
      icon={<Icon aria-hidden />}
      title={item.title}
      description={item.body}
      action={<StateBadge tone={kindToBadgeTone(item.kind)}>{kindToUrgencyLabel(item.kind)}</StateBadge>}
    >
      <div className="space-y-4">
        <p className="text-xs leading-snug text-[var(--garden-text-muted)]">{brief.contextLabel}</p>
        <AppSurface variant="muted" padding="sm">
          <p className="text-[11px] font-medium uppercase tracking-wide text-[var(--garden-text-muted)]">
            Why this matters
          </p>
          <p className="mt-1 text-sm leading-relaxed text-[var(--garden-text)]">{brief.whyThisMatters}</p>
        </AppSurface>
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          <ActionPill type="button" variant="primary" disabled>
            Next step (soon)
          </ActionPill>
          <ActionPill href="/my-garden/care" variant="secondary">
            Start Care check
          </ActionPill>
        </div>
      </div>
    </StatusSurface>
  )
}
