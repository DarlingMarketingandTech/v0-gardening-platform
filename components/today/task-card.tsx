'use client'

import { BookOpen, CheckCircle2, Clock3 } from 'lucide-react'
import { ActionPill, AppSurface, StateBadge } from '@/components/garden-ui'
import type { TodayBriefItem, TodayBriefItemKind } from '@/lib/today-brief'
import { todayBriefIcons } from '@/components/today/today-brief-parts'

function kindToTone(kind: TodayBriefItemKind): 'water' | 'attention' | 'stable' {
  if (kind === 'water') return 'water'
  if (kind === 'harvest' || kind === 'bloom') return 'stable'
  return 'attention'
}

export function TaskCard({ task }: { task: TodayBriefItem }) {
  const Icon = todayBriefIcons[task.kind]

  return (
    <AppSurface
      variant="default"
      padding="sm"
      className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"
    >
      <div className="flex min-w-0 gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[var(--garden-primary-soft)] text-[var(--garden-primary)]">
          <Icon className="size-5" aria-hidden />
        </div>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-semibold text-[var(--garden-text)]">{task.title}</p>
            <StateBadge tone={kindToTone(task.kind)} size="sm">
              Follow-up
            </StateBadge>
          </div>
          <p className="mt-1 text-sm leading-relaxed text-[var(--garden-text-muted)]">{task.body}</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <ActionPill type="button" size="sm" variant="secondary" disabled icon={<CheckCircle2 className="size-3.5" />}>
          Done soon
        </ActionPill>
        <ActionPill type="button" size="sm" variant="ghost" disabled icon={<Clock3 className="size-3.5" />}>
          Snooze soon
        </ActionPill>
        <ActionPill href="/my-garden/care" size="sm" variant="ghost" icon={<BookOpen className="size-3.5" />}>
          Learn why
        </ActionPill>
      </div>
    </AppSurface>
  )
}
