'use client'

import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import type { PlantLibraryEntry } from '@/lib/plant-library/get-plant-library'
import { SunIcon, Droplets, Ruler } from 'lucide-react'

interface PlantLibraryCardProps {
  plant: PlantLibraryEntry
  onClick: (plant: PlantLibraryEntry) => void
}

const sunlightLabel: Record<string, string> = {
  'full sun': 'Full sun',
  'part sun': 'Part sun',
  'part shade': 'Part shade',
  shade: 'Shade',
}

const sunlightColor: Record<string, string> = {
  'full sun': 'text-amber-500',
  'part sun': 'text-amber-400',
  'part shade': 'text-sky-400',
  shade: 'text-slate-400',
}

export function PlantLibraryCard({ plant, onClick }: PlantLibraryCardProps) {
  return (
    <button
      type="button"
      onClick={() => onClick(plant)}
      className={cn(
        'group w-full rounded-2xl border border-border/60 bg-card text-left',
        'transition-all duration-150',
        'hover:border-primary/30 hover:shadow-md hover:shadow-primary/5',
        'active:scale-[0.98]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
        'p-4',
      )}
    >
      {/* Header row: emoji / name / category badge */}
      <div className="flex items-start gap-3">
        {/* Placeholder avatar — swap with real image when images are served */}
        <div className="shrink-0 size-12 rounded-xl bg-primary/8 border border-primary/12 flex items-center justify-center text-2xl select-none">
          🌿
        </div>

        <div className="min-w-0 flex-1 space-y-1">
          <p className="text-sm font-semibold leading-tight text-[var(--garden-text)] group-hover:text-primary transition-colors truncate">
            {plant.commonName}
          </p>
          <span className="inline-block rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
            {plant.category}
          </span>
        </div>
      </div>

      {/* Summary — clamp to 2 lines */}
      <p className="mt-3 text-xs leading-relaxed text-muted-foreground line-clamp-2">
        {plant.careSummary}
      </p>

      {/* Stat row */}
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
        {plant.sunlight ? (
          <StatChip
            icon={<SunIcon className={cn('h-3 w-3 shrink-0', sunlightColor[plant.sunlight])} />}
            label={sunlightLabel[plant.sunlight] ?? plant.sunlight}
          />
        ) : null}
        {plant.water ? (
          <StatChip
            icon={<Droplets className="h-3 w-3 shrink-0 text-sky-400" />}
            label="Water guide"
          />
        ) : null}
        {plant.spacingInches ? (
          <StatChip
            icon={<Ruler className="h-3 w-3 shrink-0 text-muted-foreground" />}
            label={`${plant.spacingInches}" apart`}
          />
        ) : null}
      </div>
    </button>
  )
}

function StatChip({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
      {icon}
      {label}
    </span>
  )
}
