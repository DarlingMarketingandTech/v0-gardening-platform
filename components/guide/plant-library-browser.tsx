'use client'

import { useMemo, useState } from 'react'
import type { PlantLibraryEntry, PlantSunlight } from '@/lib/plant-library/get-plant-library'
import { PlantLibraryCard } from '@/components/guide/plant-library-card'
import { PlantDetailSheet } from '@/components/guide/plant-detail-sheet'
import { Input } from '@/components/ui/input'
import { Search, SlidersHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils'

type SunFilter = PlantSunlight | 'all'

const sunFilterOptions: { value: SunFilter; label: string }[] = [
  { value: 'all', label: 'All light' },
  { value: 'full sun', label: '☀️ Full sun' },
  { value: 'part sun', label: '🌤️ Part sun' },
  { value: 'part shade', label: '⛅ Part shade' },
]

interface PlantLibraryBrowserProps {
  plants: PlantLibraryEntry[]
}

export function PlantLibraryBrowser({ plants }: PlantLibraryBrowserProps) {
  const [query, setQuery] = useState('')
  const [sunFilter, setSunFilter] = useState<SunFilter>('all')
  const [selectedPlant, setSelectedPlant] = useState<PlantLibraryEntry | null>(null)
  const [showFilters, setShowFilters] = useState(false)

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim()
    return plants.filter((p) => {
      const matchesQuery =
        !q ||
        p.commonName.toLowerCase().includes(q) ||
        p.careSummary.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)

      const matchesSun =
        sunFilter === 'all' || p.sunlight === sunFilter

      return matchesQuery && matchesSun
    })
  }, [plants, query, sunFilter])

  return (
    <>
      {/* ── Search + filter bar ── */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              type="search"
              placeholder="Search plants…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-9 h-10 text-sm rounded-xl border-border/60 bg-background"
            />
          </div>
          <button
            type="button"
            onClick={() => setShowFilters((v) => !v)}
            aria-label="Toggle filters"
            className={cn(
              'shrink-0 flex items-center justify-center size-10 rounded-xl border transition-colors',
              showFilters
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border/60 bg-background text-muted-foreground hover:border-primary/30 hover:text-foreground',
            )}
          >
            <SlidersHorizontal className="h-4 w-4" />
          </button>
        </div>

        {/* Sunlight filter chips */}
        {showFilters ? (
          <div className="flex flex-wrap gap-2">
            {sunFilterOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setSunFilter(opt.value)}
                className={cn(
                  'rounded-full px-3 py-1.5 text-xs font-medium border transition-colors',
                  sunFilter === opt.value
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-background border-border/60 text-muted-foreground hover:border-primary/30 hover:text-foreground',
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        ) : null}
      </div>

      {/* ── Result count ── */}
      <p className="text-xs text-muted-foreground px-0.5">
        {filtered.length === plants.length
          ? `${plants.length} plants`
          : `${filtered.length} of ${plants.length} plants`}
      </p>

      {/* ── Plant grid ── */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {filtered.map((plant) => (
            <PlantLibraryCard
              key={plant.sourceKey}
              plant={plant}
              onClick={setSelectedPlant}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2 py-12 text-center">
          <span className="text-4xl">🔍</span>
          <p className="text-sm font-medium text-[var(--garden-text)]">No plants match</p>
          <p className="text-xs text-muted-foreground">
            Try a different name or clear the filter.
          </p>
          <button
            type="button"
            onClick={() => { setQuery(''); setSunFilter('all') }}
            className="mt-2 text-xs font-medium text-primary hover:underline"
          >
            Clear search
          </button>
        </div>
      )}

      {/* ── Detail sheet ── */}
      <PlantDetailSheet
        plant={selectedPlant}
        onClose={() => setSelectedPlant(null)}
      />
    </>
  )
}
