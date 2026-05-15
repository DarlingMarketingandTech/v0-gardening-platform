'use client'

import { PlantImageFrame } from '@/components/garden-ui/plant-image-frame'
import { cn } from '@/lib/utils'
import type { GardenZoneCardPlanting } from '@/lib/garden-os/types'

function plantingInitial(name: string) {
  const t = name.trim()
  return t ? t[0]!.toUpperCase() : '?'
}

export interface PlantingChipListProps {
  plantings: GardenZoneCardPlanting[]
  /** Omit for full list (detail panel). */
  maxItems?: number
  className?: string
}

export function PlantingChipList({ plantings, maxItems, className }: PlantingChipListProps) {
  const slice = maxItems === undefined ? plantings : plantings.slice(0, maxItems)
  const overflow =
    maxItems === undefined ? 0 : Math.max(0, plantings.length - slice.length)

  if (plantings.length === 0) {
    return (
      <p className="text-sm text-[var(--garden-text-muted)]">No plants in this zone yet.</p>
    )
  }

  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {slice.map((p) => (
        <div
          key={p.id}
          className="flex min-w-0 max-w-[11rem] items-center gap-2 rounded-xl border border-[color-mix(in_oklch,var(--garden-primary)_14%,var(--garden-border))] bg-[var(--garden-surface-muted)] px-2 py-1.5 pr-3"
        >
          <PlantImageFrame
            src={p.imageUrl}
            alt={p.name}
            size="sm"
            className="size-10 shrink-0 shadow-none"
            fallback={
              <span className="text-xs font-semibold text-[var(--garden-primary-dark)]" aria-hidden>
                {plantingInitial(p.name)}
              </span>
            }
          />
          <div className="min-w-0">
            <p className="truncate text-xs font-medium text-[var(--garden-text)]">{p.name}</p>
            <p className="truncate text-[11px] text-[var(--garden-text-muted)]">{p.statusLabel}</p>
          </div>
        </div>
      ))}
      {overflow > 0 ? (
        <span className="inline-flex items-center rounded-xl border border-dashed border-[var(--garden-border)] px-3 py-2 text-xs text-[var(--garden-text-muted)]">
          +{overflow} more
        </span>
      ) : null}
    </div>
  )
}
