/**
 * Plant library data loader — reads from the Harvest Helper preview JSON.
 * No Supabase. No auth. Safe to call in any server component or route.
 *
 * When the Supabase seed is live (Phase 9C.3+), swap the implementation
 * here to read from plant_library table and the API stays the same.
 */

import previewData from '@/docs/data/plant-library/harvest-helper-plant-library-preview.json'

// ─── Types ────────────────────────────────────────────────────────────────────

export type PlantSunlight = 'full sun' | 'part sun' | 'part shade' | 'shade'

export interface PlantLibraryEntry {
  /** e.g. "hh-tomatoes" */
  sourceKey: string
  commonName: string
  category: string
  edible: boolean
  sunlight: PlantSunlight | null
  /** Spacing in inches, or null if unparseable (e.g. mint) */
  spacingInches: number | null
  /** Rich paragraph description used as care summary */
  careSummary: string
  water: string
  watchOutFor: string
  /** Extended raw fields from Harvest Helper */
  detail: {
    optimalSoil: string
    plantingConsiderations: string
    whenToPlant: string
    growingFromSeed: string
    transplanting: string
    feeding: string
    otherCare: string
    harvesting: string
    storageUse: string
  }
  /** Filename only — e.g. "01_tomato.jpg". No images served in prototype. */
  imageFilename: string | null
  sourceQuality: 'high' | 'medium' | 'low'
}

// ─── Loader ───────────────────────────────────────────────────────────────────

let _cache: PlantLibraryEntry[] | null = null

export function getPlantLibrary(): PlantLibraryEntry[] {
  if (_cache) return _cache

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const entries: PlantLibraryEntry[] = (previewData as any).rows.map((item: any): PlantLibraryEntry => {
    const row = item.row
    const meta = row.metadata
    const raw = meta.raw

    return {
      sourceKey: row.source_key,
      commonName: row.common_name,
      category: row.category ?? 'vegetable',
      edible: row.edible ?? true,
      sunlight: (row.sunlight as PlantSunlight) ?? null,
      spacingInches: row.spacing_inches ?? null,
      careSummary: row.care_summary ?? '',
      water: row.water ?? '',
      watchOutFor: row.watch_out_for ?? '',
      detail: {
        optimalSoil: raw.optimal_soil ?? '',
        plantingConsiderations: raw.planting_considerations ?? '',
        whenToPlant: meta.when_to_plant ?? raw.when_to_plant ?? '',
        growingFromSeed: meta.growing_from_seed ?? raw.growing_from_seed ?? '',
        transplanting: meta.transplanting ?? raw.transplanting ?? '',
        feeding: meta.feeding ?? raw.feeding ?? '',
        otherCare: meta.other_care ?? raw.other_care ?? '',
        harvesting: meta.harvesting ?? raw.harvesting ?? '',
        storageUse: meta.storage_use ?? raw.storage_use ?? '',
      },
      imageFilename: meta.normalizedFields?.imageFilename ?? null,
      sourceQuality: item.sourceQuality ?? 'high',
    }
  })

  _cache = entries
  return entries
}

export function getPlantByKey(sourceKey: string): PlantLibraryEntry | undefined {
  return getPlantLibrary().find((p) => p.sourceKey === sourceKey)
}

/** All unique categories present in the library */
export function getPlantCategories(): string[] {
  const cats = new Set(getPlantLibrary().map((p) => p.category))
  return Array.from(cats).sort()
}

/** All unique sunlight values present in the library */
export function getPlantSunlightValues(): PlantSunlight[] {
  const vals = new Set(
    getPlantLibrary()
      .map((p) => p.sunlight)
      .filter((s): s is PlantSunlight => s !== null),
  )
  return Array.from(vals)
}
