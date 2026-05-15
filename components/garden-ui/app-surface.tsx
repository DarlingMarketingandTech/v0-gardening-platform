import * as React from 'react'

import { cn } from '@/lib/utils'

const paddingMap = {
  none: '',
  sm: 'p-3 sm:p-4',
  md: 'p-4 sm:p-5',
  lg: 'p-5 sm:p-6',
} as const

const radiusMap = {
  md: 'rounded-lg',
  lg: 'rounded-xl',
  xl: 'rounded-[length:var(--garden-radius-card)]',
  pill: 'rounded-[length:var(--garden-radius-pill)]',
} as const

export interface AppSurfaceProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'muted' | 'tinted' | 'glass'
  padding?: keyof typeof paddingMap
  radius?: keyof typeof radiusMap
  interactive?: boolean
}

export function AppSurface({
  className,
  variant = 'default',
  padding = 'md',
  radius = 'xl',
  interactive = false,
  ...props
}: AppSurfaceProps) {
  return (
    <div
      data-slot="garden-app-surface"
      data-variant={variant}
      className={cn(
        'border border-[color-mix(in_oklch,var(--garden-primary)_14%,var(--garden-border))]',
        radiusMap[radius],
        paddingMap[padding],
        variant === 'default' &&
          'bg-[var(--garden-surface)] shadow-[var(--garden-shadow-soft)]',
        variant === 'elevated' &&
          'bg-[var(--garden-surface-elevated)] shadow-[var(--garden-shadow-lifted)]',
        variant === 'muted' && 'bg-[var(--garden-surface-muted)] shadow-none',
        variant === 'tinted' &&
          'bg-[var(--garden-primary-soft)] shadow-[var(--garden-shadow-soft)]',
        variant === 'glass' &&
          'border-primary/15 bg-card/80 shadow-[var(--garden-shadow-soft)] backdrop-blur-md',
        interactive &&
          'cursor-pointer transition-[transform,box-shadow,opacity] hover:opacity-[0.98] active:scale-[0.99] focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50',
        className,
      )}
      {...props}
    />
  )
}
