'use client'

import { cn } from '@/lib/utils'
import type { SetupSpaceDraft } from '@/lib/garden-setup/types'
import { getZoneTemplateMeta } from '@/lib/garden-setup/zone-templates'

export interface ZoneTemplateCardProps {
  draft: SetupSpaceDraft
  selected: boolean
  onToggle: () => void
}

export function ZoneTemplateCard({ draft, selected, onToggle }: ZoneTemplateCardProps) {
  const meta = getZoneTemplateMeta(draft)
  const Icon = meta.icon

  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        'flex w-full flex-col rounded-(--garden-radius-card) border p-4 text-left transition-colors',
        selected
          ? 'border-primary bg-(--garden-primary-soft) shadow-(--garden-shadow-soft) ring-1 ring-primary/25'
          : 'border-(--garden-border) bg-(--garden-surface-muted) hover:bg-(--garden-surface-elevated)',
      )}
    >
      <div className="flex items-start gap-3">
        <span
          className={cn(
            'flex size-10 shrink-0 items-center justify-center rounded-xl bg-(--garden-surface) text-primary [&_svg]:size-5',
            selected && 'bg-(--garden-surface)/90',
          )}
          aria-hidden
        >
          <Icon />
        </span>
        <div className="min-w-0 flex-1 space-y-1">
          <p className="text-sm font-semibold text-(--garden-text)">{draft.title}</p>
          <p className="text-xs leading-relaxed text-muted-foreground">{meta.description}</p>
          <p className="text-[11px] leading-relaxed text-(--garden-text-muted)">
            <span className="font-medium text-(--garden-text)">Best for: </span>
            {meta.bestFor}
          </p>
        </div>
      </div>
      {selected ? (
        <p className="mt-3 text-[11px] font-medium uppercase tracking-wide text-primary">Selected</p>
      ) : (
        <p className="mt-3 text-[11px] text-muted-foreground">Tap to include this space</p>
      )}
    </button>
  )
}
