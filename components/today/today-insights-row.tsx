'use client'

import { AlertTriangle, CalendarDays, Sprout } from 'lucide-react'
import { AppSurface } from '@/components/garden-ui'
import type { TodayInsightsRowModel } from '@/lib/garden-os/types'

export function TodayInsightsRow({ insights }: { insights: TodayInsightsRowModel }) {
  const cards = [
    { ...insights.watch, Icon: AlertTriangle },
    { ...insights.progress, Icon: Sprout },
    { ...insights.upcoming, Icon: CalendarDays },
  ]

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {cards.map(({ label, title, body, Icon }) => (
        <AppSurface key={`${label}-${title}`} variant="muted" padding="sm" className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-[11px] font-medium tracking-wide text-[var(--garden-text-muted)] uppercase">
            <Icon className="size-3.5 shrink-0 text-[var(--garden-primary)]" aria-hidden />
            {label}
          </div>
          <p className="text-sm font-medium leading-snug text-[var(--garden-text)]">{title}</p>
          <p className="text-xs leading-relaxed text-[var(--garden-text-muted)]">{body}</p>
        </AppSurface>
      ))}
    </div>
  )
}
