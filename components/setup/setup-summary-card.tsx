'use client'

import { AppSurface } from '@/components/garden-ui/app-surface'
import { MetricChip } from '@/components/garden-ui/metric-chip'
import { SectionCard } from '@/components/garden-ui/section-card'
import { StatusSurface } from '@/components/garden-ui/status-surface'
import type { SetupAnswers } from '@/lib/garden-setup/questions'
import type { NotifyFrequency } from '@/lib/garden-setup/types'
import { cn } from '@/lib/utils'
import { CalendarDays, Home, Leaf } from 'lucide-react'

function freqLabel(f: NotifyFrequency | null): string {
  if (f === 'daily') return 'Daily digest'
  if (f === 'weekly') return 'Weekly roundup'
  if (f === 'important') return 'Important only'
  return '—'
}

export interface SetupSummaryCardProps {
  answers: SetupAnswers
  /** Primary finish control (e.g. full-width ActionPill or Button). */
  finishAction: React.ReactNode
  className?: string
}

export function SetupSummaryCard({ answers, finishAction, className }: SetupSummaryCardProps) {
  const allSpaces = [...answers.outdoorDrafts, ...answers.indoorDrafts]
  const spaceList = allSpaces.map((s) => s.title).join(' · ') || 'We will remember the spaces you add next time.'

  return (
    <div className={cn('space-y-4', className)}>
      <SectionCard
        eyebrow="Almost home"
        title="Your garden map is ready."
        description="Today will start with weather, spaces to watch, and the best next step."
      >
        <StatusSurface status="stable" title="What we will remember" icon={<Home className="size-5" aria-hidden />}>
          <div className="flex flex-wrap gap-2">
            <MetricChip label="Location" value={answers.locationLabel.trim() || 'My garden'} tone="neutral" />
            <MetricChip label="Spaces" value={`${allSpaces.length} zones`} tone="green" icon={<Leaf className="size-4" aria-hidden />} />
            <MetricChip label="Reminders" value={freqLabel(answers.notifyFrequency)} tone="water" icon={<CalendarDays className="size-4" aria-hidden />} />
          </div>
          <AppSurface variant="muted" padding="sm" radius="lg" className="mt-3">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Spaces & zones</p>
            <p className="mt-1 text-sm leading-relaxed text-(--garden-text)">{spaceList}</p>
          </AppSurface>
          <AppSurface variant="muted" padding="sm" radius="lg" className="mt-2">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Care nudges</p>
            <p className="mt-1 text-sm text-(--garden-text)">
              {answers.notifyTopics.length ? answers.notifyTopics.join(', ') : 'Pick topics'} via{' '}
              {answers.notifyChannels.length ? answers.notifyChannels.join(', ') : 'in-app'} on a {freqLabel(answers.notifyFrequency).toLowerCase()} cadence.
            </p>
          </AppSurface>
        </StatusSurface>
      </SectionCard>
      <div className="pt-1">{finishAction}</div>
    </div>
  )
}
