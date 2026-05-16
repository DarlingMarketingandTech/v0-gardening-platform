'use client'

import { AppSurface } from '@/components/garden-ui/app-surface'
import { cn } from '@/lib/utils'

export interface SetupQuestionCardProps {
  children: React.ReactNode
  className?: string
}

/** Wraps the active question body in a Garden V2 surface. */
export function SetupQuestionCard({ children, className }: SetupQuestionCardProps) {
  return (
    <AppSurface variant="elevated" padding="md" radius="xl" className={cn('shadow-(--garden-shadow-soft)', className)}>
      {children}
    </AppSurface>
  )
}
