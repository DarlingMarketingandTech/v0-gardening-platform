import * as React from 'react'

import { cn } from '@/lib/utils'

export type MetricChipTone = 'neutral' | 'green' | 'water' | 'attention' | 'danger'

const toneClass: Record<MetricChipTone, string> = {
  neutral:
    'border-[var(--garden-border)] bg-[var(--garden-surface-muted)] text-[var(--garden-text)]',
  green:
    'border-[color-mix(in_oklch,var(--garden-primary)_28%,var(--garden-border))] bg-[var(--garden-primary-soft)] text-[var(--garden-primary-dark)]',
  water:
    'border-[color-mix(in_oklch,var(--garden-water)_35%,var(--garden-border))] bg-[color-mix(in_oklch,var(--garden-water)_14%,var(--garden-surface))] text-[var(--garden-text)]',
  attention:
    'border-[color-mix(in_oklch,var(--garden-attention)_38%,var(--garden-border))] bg-[color-mix(in_oklch,var(--garden-attention)_16%,var(--garden-surface))] text-[var(--garden-text)]',
  danger:
    'border-[color-mix(in_oklch,var(--garden-danger)_35%,var(--garden-border))] bg-[color-mix(in_oklch,var(--garden-danger)_12%,var(--garden-surface))] text-[var(--garden-danger)]',
}

export interface MetricChipProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string
  value?: string | number
  icon?: React.ReactNode
  tone?: MetricChipTone
}

export function MetricChip({
  label,
  value,
  icon,
  tone = 'neutral',
  className,
  ...props
}: MetricChipProps) {
  return (
    <div
      data-slot="garden-metric-chip"
      role="group"
      aria-label={value !== undefined ? `${label}: ${value}` : label}
      className={cn(
        'inline-flex max-w-full items-center gap-2 rounded-xl border px-3 py-2 text-sm shadow-none',
        toneClass[tone],
        className,
      )}
      {...props}
    >
      {icon ? (
        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[var(--garden-surface)]/80 [&_svg]:size-4">
          {icon}
        </span>
      ) : null}
      <span className="min-w-0">
        <span className="block text-xs font-medium text-[var(--garden-text-muted)]">{label}</span>
        {value !== undefined ? (
          <span className="block truncate font-semibold tabular-nums text-[var(--garden-text)]">{value}</span>
        ) : null}
      </span>
    </div>
  )
}
