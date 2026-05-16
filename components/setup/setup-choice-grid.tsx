'use client'

import { cn } from '@/lib/utils'

export interface SetupChoiceOption {
  value: string
  label: string
  sub?: string
}

export interface SetupChoiceGridProps {
  options: SetupChoiceOption[]
  mode: 'single' | 'multi'
  selected: string | string[] | null
  onToggle: (value: string) => void
  columns?: '1' | '2'
  className?: string
}

export function SetupChoiceGrid({
  options,
  mode,
  selected,
  onToggle,
  columns = '1',
  className,
}: SetupChoiceGridProps) {
  const isSelected = (value: string) => {
    if (mode === 'single') return selected === value
    return Array.isArray(selected) && selected.includes(value)
  }

  return (
    <div
      className={cn(
        'grid gap-2',
        columns === '2' ? 'sm:grid-cols-2' : 'grid-cols-1',
        className,
      )}
    >
      {options.map((opt) => {
        const active = isSelected(opt.value)
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onToggle(opt.value)}
            className={cn(
              'rounded-(--garden-radius-card) border px-4 py-3 text-left transition-colors',
              active
                ? 'border-primary bg-(--garden-primary-soft) shadow-(--garden-shadow-soft)'
                : 'border-(--garden-border) bg-(--garden-surface-muted) hover:bg-(--garden-surface-elevated)',
            )}
          >
            <p className="text-sm font-semibold text-(--garden-text)">{opt.label}</p>
            {opt.sub ? <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{opt.sub}</p> : null}
          </button>
        )
      })}
    </div>
  )
}
