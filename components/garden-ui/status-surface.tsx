import * as React from 'react'

import { cn } from '@/lib/utils'

export type GardenStatusKind = 'stable' | 'needs_water' | 'attention' | 'critical'

const statusAccent: Record<GardenStatusKind, string> = {
  stable: '',
  needs_water: 'border-l-4 border-l-[var(--garden-water)]',
  attention: 'border-l-4 border-l-[var(--garden-attention)]',
  critical: 'border-l-4 border-l-[var(--garden-danger)]',
}

export interface StatusSurfaceProps extends React.HTMLAttributes<HTMLElement> {
  status?: GardenStatusKind
  title?: string
  description?: string
  icon?: React.ReactNode
  action?: React.ReactNode
}

export function StatusSurface({
  status = 'stable',
  title,
  description,
  icon,
  action,
  className,
  children,
  ...props
}: StatusSurfaceProps) {
  const hasHeader = title || description || icon || action

  return (
    <section
      data-slot="garden-status-surface"
      data-status={status}
      className={cn(
        'rounded-[length:var(--garden-radius-card)] border border-[var(--garden-border)] bg-[var(--garden-surface)] p-4 shadow-[var(--garden-shadow-soft)] sm:p-5',
        statusAccent[status],
        className,
      )}
      {...props}
    >
      {hasHeader ? (
        <div className="flex flex-wrap items-start gap-3">
          {icon ? (
            <div
              className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[var(--garden-surface-muted)] text-[var(--garden-primary)] [&_svg]:size-5"
              aria-hidden
            >
              {icon}
            </div>
          ) : null}
          <div className="min-w-0 flex-1 space-y-1">
            {title ? (
              <h3 className="text-base font-semibold text-[var(--garden-text)]">{title}</h3>
            ) : null}
            {description ? (
              <p className="text-sm leading-relaxed text-[var(--garden-text-muted)]">{description}</p>
            ) : null}
          </div>
          {action ? <div className="shrink-0">{action}</div> : null}
        </div>
      ) : null}
      {children ? (
        <div className={cn(hasHeader && 'mt-4 border-t border-[var(--garden-border)] pt-4')}>{children}</div>
      ) : null}
    </section>
  )
}
