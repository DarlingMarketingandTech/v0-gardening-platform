import * as React from 'react'

import { cn } from '@/lib/utils'

export interface SectionCardProps extends React.HTMLAttributes<HTMLDivElement> {
  eyebrow?: string
  title?: string
  description?: string
  action?: React.ReactNode
  children: React.ReactNode
}

export function SectionCard({
  eyebrow,
  title,
  description,
  action,
  className,
  children,
  ...props
}: SectionCardProps) {
  const hasHeading = eyebrow || title || description || action

  return (
    <div
      data-slot="garden-section-card"
      className={cn('flex flex-col gap-4', className)}
      {...props}
    >
      {hasHeading ? (
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0 flex-1 space-y-1">
            {eyebrow ? (
              <p className="text-xs font-medium tracking-wide text-primary uppercase">{eyebrow}</p>
            ) : null}
            {title ? <h2 className="text-lg font-semibold text-[var(--garden-text)]">{title}</h2> : null}
            {description ? (
              <p className="text-sm leading-relaxed text-[var(--garden-text-muted)]">{description}</p>
            ) : null}
          </div>
          {action ? <div className="shrink-0">{action}</div> : null}
        </div>
      ) : null}
      <div className="min-w-0">{children}</div>
    </div>
  )
}
