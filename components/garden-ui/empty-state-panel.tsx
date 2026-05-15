import * as React from 'react'

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { cn } from '@/lib/utils'

export interface EmptyStatePanelProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  description?: string
  icon?: React.ReactNode
  action?: React.ReactNode
}

export function EmptyStatePanel({
  title,
  description,
  icon,
  action,
  className,
  children,
  ...props
}: EmptyStatePanelProps) {
  return (
    <Empty
      data-slot="garden-empty-state-panel"
      className={cn(
        'rounded-[length:var(--garden-radius-card)] border-solid border-[var(--garden-border)] bg-[var(--garden-surface-muted)] py-10 md:py-12',
        className,
      )}
      {...props}
    >
      <EmptyHeader>
        {icon ? <EmptyMedia variant="icon">{icon}</EmptyMedia> : null}
        <EmptyTitle className="text-[var(--garden-text)]">{title}</EmptyTitle>
        {description ? (
          <EmptyDescription className="text-[var(--garden-text-muted)]">{description}</EmptyDescription>
        ) : null}
      </EmptyHeader>
      {action || children ? (
        <EmptyContent>
          {action}
          {children}
        </EmptyContent>
      ) : null}
    </Empty>
  )
}
