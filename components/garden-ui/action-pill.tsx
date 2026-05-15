import * as React from 'react'
import Link from 'next/link'

import { cn } from '@/lib/utils'

const variantClass = {
  primary:
    'bg-[var(--garden-primary)] text-primary-foreground shadow-[var(--garden-shadow-soft)] hover:bg-[var(--garden-primary-dark)]',
  secondary:
    'border border-[var(--garden-border)] bg-[var(--garden-surface-muted)] text-[var(--garden-text)] hover:bg-[var(--garden-surface-elevated)]',
  ghost:
    'bg-transparent text-[var(--garden-text)] hover:bg-[var(--garden-surface-muted)]',
  attention:
    'bg-[color-mix(in_oklch,var(--garden-attention)_22%,var(--card))] text-[var(--garden-text)] shadow-[var(--garden-shadow-soft)] hover:bg-[color-mix(in_oklch,var(--garden-attention)_30%,var(--card))]',
} as const

const sizeClass = {
  sm: 'min-h-8 gap-1.5 px-3 py-1.5 text-xs [&_svg]:size-3.5',
  md: 'min-h-9 gap-2 px-4 py-2 text-sm [&_svg]:size-4',
  lg: 'min-h-11 gap-2 px-5 py-2.5 text-sm [&_svg]:size-4',
} as const

const baseClass =
  'inline-flex items-center justify-center rounded-[length:var(--garden-radius-pill)] font-semibold transition-[background-color,box-shadow,opacity,transform] focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.99]'

export interface ActionPillProps {
  children: React.ReactNode
  icon?: React.ReactNode
  variant?: keyof typeof variantClass
  size?: keyof typeof sizeClass
  disabled?: boolean
  className?: string
  /** When set, renders an anchor via Next.js `Link`. */
  href?: string
  prefetch?: boolean
  /** Used only when `href` is omitted. */
  type?: 'button' | 'submit' | 'reset'
  onClick?: React.MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>
}

export function ActionPill({
  children,
  icon,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className,
  href,
  prefetch,
  type = 'button',
  onClick,
}: ActionPillProps) {
  const content = (
    <>
      {icon ? <span aria-hidden>{icon}</span> : null}
      <span className="truncate">{children}</span>
    </>
  )

  const pillClass = cn(baseClass, variantClass[variant], sizeClass[size], className)

  if (href && !disabled) {
    return (
      <Link href={href} prefetch={prefetch} className={pillClass} onClick={onClick}>
        {content}
      </Link>
    )
  }

  return (
    <button type={type} disabled={disabled} className={pillClass} onClick={onClick}>
      {content}
    </button>
  )
}
