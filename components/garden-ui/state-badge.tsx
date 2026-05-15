import * as React from 'react'

import { cn } from '@/lib/utils'

export type StateBadgeTone = 'neutral' | 'stable' | 'water' | 'attention' | 'critical'

const toneClass: Record<StateBadgeTone, string> = {
  neutral: 'border-[var(--garden-border)] bg-[var(--garden-surface-muted)] text-[var(--garden-text)]',
  stable:
    'border-[color-mix(in_oklch,var(--garden-primary)_22%,var(--garden-border))] bg-[var(--garden-primary-soft)] text-[var(--garden-primary-dark)]',
  water:
    'border-[color-mix(in_oklch,var(--garden-water)_35%,var(--garden-border))] bg-[color-mix(in_oklch,var(--garden-water)_14%,var(--garden-surface))] text-[var(--garden-text)]',
  attention:
    'border-[color-mix(in_oklch,var(--garden-attention)_38%,var(--garden-border))] bg-[color-mix(in_oklch,var(--garden-attention)_14%,var(--garden-surface))] text-[var(--garden-text)]',
  critical:
    'border-[color-mix(in_oklch,var(--garden-danger)_45%,var(--garden-border))] bg-[color-mix(in_oklch,var(--garden-danger)_12%,var(--garden-surface))] text-[var(--garden-danger)]',
}

const sizeClass = {
  sm: 'gap-1 px-2 py-0.5 text-[11px] [&_svg]:size-3',
  md: 'gap-1 px-2.5 py-1 text-xs [&_svg]:size-3.5',
} as const

export interface StateBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: StateBadgeTone
  size?: keyof typeof sizeClass
}

export function StateBadge({
  tone = 'neutral',
  size = 'sm',
  className,
  ...props
}: StateBadgeProps) {
  return (
    <span
      data-slot="garden-state-badge"
      className={cn(
        'inline-flex w-fit max-w-full shrink-0 items-center rounded-[length:var(--garden-radius-pill)] border font-medium whitespace-nowrap',
        toneClass[tone],
        sizeClass[size],
        className,
      )}
      {...props}
    />
  )
}
