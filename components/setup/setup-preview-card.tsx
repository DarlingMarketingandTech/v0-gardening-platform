'use client'

import { AppSurface } from '@/components/garden-ui/app-surface'
import { MetricChip } from '@/components/garden-ui/metric-chip'
import { StatusSurface } from '@/components/garden-ui/status-surface'
import type { SetupAnswers } from '@/lib/garden-setup/questions'
import type { SunLevel } from '@/lib/garden-setup/types'
import { Home, Leaf, Sprout } from 'lucide-react'

function growingModeLabel(answers: SetupAnswers): string {
  if (answers.growsOutdoor && answers.growsIndoor) return 'Mixed indoor & outdoor'
  if (answers.growsOutdoor) return 'Mostly outdoor'
  if (answers.growsIndoor) return 'Mostly indoor'
  return 'Pick a space to start'
}

function sunLabel(level: SunLevel): string {
  const map: Record<SunLevel, string> = {
    low: 'Low light',
    'bright-indirect': 'Bright indirect',
    mid: 'Part sun',
    high: 'Full sun',
  }
  return map[level]
}

function lightSummary(answers: SetupAnswers): string {
  const outdoor = answers.outdoorDrafts
    .map((s) => answers.outdoorSun[s.id])
    .filter(Boolean) as SunLevel[]
  const indoor = answers.indoorDrafts
    .map((s) => answers.indoorLight[s.id])
    .filter(Boolean) as SunLevel[]
  const parts: string[] = []
  if (outdoor.length) parts.push(`Outdoor: ${[...new Set(outdoor.map(sunLabel))].join(', ')}`)
  if (indoor.length) parts.push(`Indoor: ${[...new Set(indoor.map(sunLabel))].join(', ')}`)
  if (!parts.length) return 'Light per space — answer a few steps to fill this in.'
  return parts.join(' · ')
}

function rhythmSummary(answers: SetupAnswers): string {
  if (!answers.notifyFrequency) return 'Reminder rhythm — pick a pace in Garden Rhythm.'
  const freq =
    answers.notifyFrequency === 'daily'
      ? 'Daily digest'
      : answers.notifyFrequency === 'weekly'
        ? 'Weekly roundup'
        : 'Important only'
  const topics = answers.notifyTopics.length ? answers.notifyTopics.join(', ') : 'topics you choose'
  return `${freq} · ${topics}`
}

function payoffLines(answers: SetupAnswers): string[] {
  const lines: string[] = []
  if (answers.growsIndoor && answers.indoorDrafts.some((d) => d.id === 'kitchen-window')) {
    lines.push('Kitchen herbs will show up as an indoor zone.')
  }
  if (answers.growsOutdoor && answers.outdoorDrafts.some((d) => d.id === 'patio' || d.templateId === 'patio')) {
    lines.push('Patio pots may get heat and watering reminders when summer kicks in.')
  }
  if (
    [...Object.values(answers.indoorLight), ...Object.values(answers.outdoorSun)].includes('bright-indirect')
  ) {
    lines.push('Bright indirect spaces are great for herbs and foliage plants.')
  }
  if (answers.notifyFrequency === 'important') {
    lines.push('Important-only reminders will keep Today calmer.')
  }
  if (answers.notifyFrequency === 'daily') {
    lines.push('A daily digest gives Momma D one gentle check-in each morning.')
  }
  if (!lines.length) {
    lines.push('Finish a few steps and we will tailor Today, Garden, and Care to your real spaces.')
  }
  return lines.slice(0, 4)
}

export interface SetupPreviewCardProps {
  answers: SetupAnswers
  className?: string
}

export function SetupPreviewCard({ answers, className }: SetupPreviewCardProps) {
  const spaceTitles = [...answers.outdoorDrafts, ...answers.indoorDrafts].map((s) => s.title)
  const spaceLine =
    spaceTitles.length > 0 ? spaceTitles.slice(0, 4).join(' · ') + (spaceTitles.length > 4 ? '…' : '') : 'Spaces you pick will land here.'

  return (
    <StatusSurface
      status="stable"
      className={className}
      title="Your garden preview"
      description="This updates as you go — nothing is saved until you finish."
      icon={<Sprout className="size-5" aria-hidden />}
    >
      <div className="flex flex-wrap gap-2">
        <MetricChip label="Growing" value={growingModeLabel(answers)} tone="green" icon={<Home className="size-4" aria-hidden />} />
        <MetricChip
          label="Spaces"
          value={spaceTitles.length ? `${spaceTitles.length} picked` : '—'}
          tone="water"
          icon={<Leaf className="size-4" aria-hidden />}
        />
      </div>
      <AppSurface variant="muted" padding="sm" radius="lg" className="mt-3 border-dashed border-(--garden-border)">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Spaces in your map</p>
        <p className="mt-1 text-sm leading-relaxed text-(--garden-text)">{spaceLine}</p>
      </AppSurface>
      <AppSurface variant="muted" padding="sm" radius="lg" className="mt-2 border-dashed border-(--garden-border)">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Light snapshot</p>
        <p className="mt-1 text-sm leading-relaxed text-(--garden-text)">{lightSummary(answers)}</p>
      </AppSurface>
      <AppSurface variant="muted" padding="sm" radius="lg" className="mt-2 border-dashed border-(--garden-border)">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Reminder rhythm</p>
        <p className="mt-1 text-sm leading-relaxed text-(--garden-text)">{rhythmSummary(answers)}</p>
      </AppSurface>
      <ul className="mt-3 space-y-1.5 text-sm leading-relaxed text-(--garden-text-muted)">
        {payoffLines(answers).map((line, i) => (
          <li key={`${i}-${line.slice(0, 24)}`} className="flex gap-2">
            <span className="text-primary" aria-hidden>
              ·
            </span>
            <span>{line}</span>
          </li>
        ))}
      </ul>
    </StatusSurface>
  )
}
