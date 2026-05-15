'use client'

import * as React from 'react'

import { AppSurface } from '@/components/garden-ui/app-surface'
import type { CareLocale } from '@/lib/care/care-copy'
import { getCareCopy } from '@/lib/care/care-copy'
import { cn } from '@/lib/utils'

export interface TreatmentChecklistProps {
  steps: string[]
  /** BCP-47 or short locale hint — English default */
  locale?: CareLocale | string | null
  className?: string
}

export function TreatmentChecklist({ steps, locale, className }: TreatmentChecklistProps) {
  const copy = getCareCopy(locale)
  const [done, setDone] = React.useState<Record<string, boolean>>({})

  const toggle = React.useCallback((id: string) => {
    setDone((prev) => ({ ...prev, [id]: !prev[id] }))
  }, [])

  if (!steps.length) return null

  const headingId = React.useId()

  return (
    <div className={cn('space-y-3', className)}>
      <div>
        <p id={headingId} className="text-sm font-semibold text-[var(--garden-text)]">
          {copy.sections.treatmentChecklist}
        </p>
        <p className="mt-1 text-xs leading-relaxed text-[var(--garden-text-muted)]">{copy.sections.checklistHint}</p>
      </div>
      <AppSurface variant="muted" padding="sm" radius="lg" className="border border-[var(--garden-border)]">
        <ul className="space-y-2" role="group" aria-labelledby={headingId}>
          {steps.map((step, index) => {
            const id = `care-step-${index}`
            const checked = Boolean(done[id])
            return (
              <li key={id}>
                <label
                  className={cn(
                    'flex cursor-pointer items-start gap-3 rounded-lg p-2 transition-colors',
                    'hover:bg-[var(--garden-surface-elevated)]/80',
                    checked && 'opacity-80',
                  )}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggle(id)}
                    className={cn(
                      'mt-1 size-4 shrink-0 rounded border-[var(--garden-border)]',
                      'text-[var(--garden-primary)] focus-visible:ring-2 focus-visible:ring-ring/40',
                    )}
                  />
                  <span
                    className={cn(
                      'text-sm leading-relaxed text-[var(--garden-text)]',
                      checked && 'line-through decoration-[var(--garden-text-muted)]',
                    )}
                  >
                    {step}
                  </span>
                </label>
              </li>
            )
          })}
        </ul>
      </AppSurface>
    </div>
  )
}
