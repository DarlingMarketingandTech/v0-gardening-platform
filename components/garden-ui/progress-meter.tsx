import * as React from 'react'

import { cn } from '@/lib/utils'

export type ProgressMeterTone = 'green' | 'water' | 'attention' | 'neutral'

const fillVar: Record<ProgressMeterTone, string> = {
  green: 'var(--garden-primary)',
  water: 'var(--garden-water)',
  attention: 'var(--garden-attention)',
  neutral: 'color-mix(in oklch, var(--garden-text-muted) 55%, var(--garden-text))',
}

function clamp(n: number, min: number, max: number) {
  return Math.min(Math.max(n, min), max)
}

export interface ProgressMeterProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  value: number
  max?: number
  label?: string
  tone?: ProgressMeterTone
  showValue?: boolean
}

export function ProgressMeter({
  value,
  max = 100,
  label,
  tone = 'green',
  showValue = false,
  className,
  id,
  ...props
}: ProgressMeterProps) {
  const safeMax = max > 0 ? max : 100
  const pct = clamp((value / safeMax) * 100, 0, 100)
  const meterId = React.useId()
  const labelId = label ? `${meterId}-label` : undefined

  return (
    <div className={cn('w-full space-y-2', className)} {...props}>
      {(label || showValue) && (
        <div className="flex items-center justify-between gap-2 text-sm">
          {label ? (
            <span id={labelId} className="font-medium text-[var(--garden-text)]">
              {label}
            </span>
          ) : (
            <span />
          )}
          {showValue ? (
            <span className="tabular-nums text-[var(--garden-text-muted)]">{Math.round(pct)}%</span>
          ) : null}
        </div>
      )}
      <div
        role="progressbar"
        id={id ?? meterId}
        aria-valuemin={0}
        aria-valuemax={safeMax}
        aria-valuenow={clamp(value, 0, safeMax)}
        {...(label ? { 'aria-labelledby': labelId } : { 'aria-label': label ?? 'Progress' })}
        className="h-[3px] w-full overflow-hidden rounded-[length:var(--garden-radius-pill)] bg-[var(--garden-surface-muted)]"
      >
        <div
          className="h-full rounded-[length:var(--garden-radius-pill)] transition-[width] duration-300 ease-out"
          style={{
            width: `${pct}%`,
            backgroundColor: fillVar[tone],
          }}
        />
      </div>
    </div>
  )
}
