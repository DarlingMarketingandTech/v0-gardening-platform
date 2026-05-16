'use client'

import { AppSurface } from '@/components/garden-ui/app-surface'
import { SETUP_STAGES, setupStageIndex, type SetupStageId } from '@/lib/garden-setup/setup-stages'
import { cn } from '@/lib/utils'

export interface SetupProgressRailProps {
  activeStage: SetupStageId
  /** Step progress within the whole wizard (0–1). */
  overallFraction: number
  className?: string
}

export function SetupProgressRail({ activeStage, overallFraction, className }: SetupProgressRailProps) {
  const activeIdx = setupStageIndex(activeStage)
  const pct = Math.round(Math.min(1, Math.max(0, overallFraction)) * 100)

  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex gap-2">
        {SETUP_STAGES.map((s, i) => {
          const done = i < activeIdx
          const current = i === activeIdx
          return (
            <AppSurface
              key={s.id}
              variant={current ? 'elevated' : 'muted'}
              padding="sm"
              radius="lg"
              className={cn(
                'min-w-0 flex-1 border transition-colors',
                current && 'border-primary/35 ring-1 ring-primary/20',
                done && 'opacity-90',
              )}
            >
              <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{s.title}</p>
              <div
                className={cn(
                  'mt-2 h-1 rounded-(--garden-radius-pill)',
                  done || current ? 'bg-primary/80' : 'bg-(--garden-surface-muted)',
                )}
                style={{ opacity: current ? 1 : done ? 0.55 : 0.35 }}
                aria-hidden
              />
            </AppSurface>
          )
        })}
      </div>
      <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
        <span>Overall</span>
        <span className="tabular-nums font-medium text-(--garden-text)">{pct}%</span>
      </div>
      <div className="h-1 overflow-hidden rounded-(--garden-radius-pill) bg-(--garden-surface-muted)">
        <div
          className="h-full rounded-(--garden-radius-pill) bg-primary transition-[width] duration-300 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
