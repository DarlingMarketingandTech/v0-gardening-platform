/**
 * Tolerant structural types for the Harvest Helper garden_vegetables.csv source.
 * All fields are optional strings matching raw CSV column names.
 * Designed for source drift: blank fields, missing columns, alternate whitespace.
 */

/** Raw CSV row as parsed by a CSV reader (all values are strings or empty string). */
export interface HarvestHelperCsvRow {
  id?: string
  name?: string
  description?: string
  optimal_sun?: string
  optimal_soil?: string
  planting_considerations?: string
  when_to_plant?: string
  growing_from_seed?: string
  transplanting?: string
  spacing?: string
  watering?: string
  feeding?: string
  other_care?: string
  diseases?: string
  pests?: string
  harvesting?: string
  storage_use?: string
}

/** Validated, trimmed representation used internally during mapping. */
export interface HarvestHelperPlantSource {
  id: number
  name: string
  description: string
  optimal_sun: string
  optimal_soil: string
  planting_considerations: string | null
  when_to_plant: string
  growing_from_seed: string | null
  transplanting: string | null
  spacing: string
  watering: string
  feeding: string | null
  other_care: string | null
  diseases: string | null
  pests: string | null
  harvesting: string
  storage_use: string | null
}

/** Result of parsing and trimming a raw CSV row. */
export function asHarvestHelperPlantSource(
  raw: HarvestHelperCsvRow,
): HarvestHelperPlantSource | null {
  const id = parseInt(raw.id ?? "", 10)
  if (isNaN(id)) return null

  const name = (raw.name ?? "").trim()
  if (!name) return null

  return {
    id,
    name,
    description: (raw.description ?? "").trim(),
    optimal_sun: (raw.optimal_sun ?? "").trim(),
    optimal_soil: (raw.optimal_soil ?? "").trim(),
    planting_considerations: trim_or_null(raw.planting_considerations),
    when_to_plant: (raw.when_to_plant ?? "").trim(),
    growing_from_seed: trim_or_null(raw.growing_from_seed),
    transplanting: trim_or_null(raw.transplanting),
    spacing: (raw.spacing ?? "").trim(),
    watering: (raw.watering ?? "").trim(),
    feeding: trim_or_null(raw.feeding),
    other_care: trim_or_null(raw.other_care),
    diseases: trim_or_null(raw.diseases),
    pests: trim_or_null(raw.pests),
    harvesting: (raw.harvesting ?? "").trim(),
    storage_use: trim_or_null(raw.storage_use),
  }
}

function trim_or_null(v: string | undefined): string | null {
  const s = (v ?? "").trim()
  return s.length > 0 ? s : null
}
