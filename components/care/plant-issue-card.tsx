'use client'

import { ChevronRight } from 'lucide-react'

import { AppSurface, StateBadge } from '@/components/garden-ui'
import type { CareCopy } from '@/lib/care/care-copy'
import type { CareIssueGuideEntry, CareIssueType } from '@/lib/care/care-issue-guide'
import { cn } from '@/lib/utils'

function typeTone(type: CareIssueType): 'neutral' | 'attention' | 'stable' | 'water' {
  if (type === 'bacterial') return 'attention'
  if (type === 'pest') return 'stable'
  if (type === 'environmental') return 'water'
  return 'neutral'
}

export interface PlantIssueCardProps {
  entry: CareIssueGuideEntry
  copy: CareCopy
  onOpen: () => void
  className?: string
}

export function PlantIssueCard({ entry, copy, onOpen, className }: PlantIssueCardProps) {
  const typeLabel = copy.issueGuide.types[entry.type]

  return (
    <button
      type="button"
      onClick={onOpen}
      className={cn(
        'group w-full rounded-(--garden-radius-card) text-left transition-transform',
        'focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50',
        'active:scale-[0.99]',
        className,
      )}
    >
      <AppSurface
        variant="muted"
        padding="sm"
        radius="lg"
        className="border border-(--garden-border) hover:border-primary/25 hover:bg-(--garden-surface-elevated)/60"
      >
        <div className="flex items-start gap-3">
          <div className="min-w-0 flex-1 space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm font-semibold text-(--garden-text)">{entry.name}</p>
              <StateBadge tone={typeTone(entry.type)} size="sm">
                {typeLabel}
              </StateBadge>
            </div>
            <p className="line-clamp-2 text-xs leading-relaxed text-(--garden-text-muted)">{entry.beginnerSummary}</p>
          </div>
          <span className="flex shrink-0 items-center gap-1 text-xs font-medium text-primary">
            <span className="hidden sm:inline">{copy.issueGuide.openDetails}</span>
            <ChevronRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
          </span>
        </div>
      </AppSurface>
    </button>
  )
}
