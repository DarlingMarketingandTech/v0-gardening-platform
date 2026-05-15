import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

export interface WeatherImpactChipProps {
  children: ReactNode
  /** Visual emphasis for forecast tags */
  variant?: 'default' | 'soft'
  className?: string
}

export function WeatherImpactChip({ children, variant = 'default', className }: WeatherImpactChipProps) {
  return (
    <span
      className={cn(
        'inline-flex max-w-full items-center rounded-full border px-2.5 py-1 text-[11px] font-medium whitespace-nowrap',
        variant === 'default' &&
          'border-[color-mix(in_oklch,var(--garden-primary)_22%,var(--garden-border))] bg-[var(--garden-primary-soft)] text-[var(--garden-primary-dark)]',
        variant === 'soft' &&
          'border-[var(--garden-border)] bg-[var(--garden-surface-muted)] text-[var(--garden-text-muted)]',
        className,
      )}
    >
      {children}
    </span>
  )
}
