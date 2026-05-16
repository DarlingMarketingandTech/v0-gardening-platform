/**
 * Shared types for local plant_library import / audit pipelines.
 * Not used by production UI paths in Phase 9A.
 */

export const HEYDENBERK_SOURCE = "heydenberk/gardening-data" as const

export type PlantLibrarySourceQuality =
  | "high"
  | "medium"
  | "low"
  | "needs_review"

export type PlantLibraryImportWarningCode =
  | "missing_name"
  | "missing_species"
  | "species_name_suspicious"
  | "scientific_name_trimmed"
  | "duration_unit_normalized"
  | "duration_unit_mismatch"
  | "yield_unit_key_drift"
  | "yield_units_normalized"
  | "edible_part_typo_normalized"
  | "edible_parts_empty"
  | "harvest_suspicious"
  | "harvest_missing"
  | "harvest_years_not_used_for_maturity"
  | "planting_duration_suspicious"
  | "planting_duration_years_perennial"
  | "plantings_missing"
  | "spacing_suspicious"
  | "spacing_missing"
  | "hardiness_zone_inverted"
  | "sun_unknown"
  | "sun_missing"
  | "cultivation_category_unknown"
  | "cultivation_category_not_veg_herb"
  | "soil_impact_unknown"
  | "germination_unit_unknown"
  | "image_candidate_unaudited"
  | "metadata_note"

export interface PlantLibraryImportWarning {
  code: PlantLibraryImportWarningCode | string
  message: string
  detail?: Record<string, unknown>
}

/**
 * Columns compatible with plant_library insert/upsert (excluding id, timestamps).
 */
export interface PlantLibraryImportRow {
  source: typeof HEYDENBERK_SOURCE
  source_key: string
  common_name: string
  scientific_name: string
  category: string
  edible: boolean
  sunlight: string | null
  water: string | null
  spacing_inches: number | null
  days_to_maturity: number | null
  care_summary: string
  watch_out_for: string
  metadata: PlantLibraryImportMetadata
}

export interface PlantLibraryImportMetadata {
  sourceName: string
  sourceSlug: string
  sourceImageCandidates?: string[]
  /** Original JSON object as parsed (structured clone via JSON round-trip safe subset). */
  raw: Record<string, unknown>
  nutritionContent?: Record<string, unknown>
  ediblePartsRaw?: unknown
  ediblePartsNormalized?: string[]
  germination?: unknown
  hardinessZone?: unknown
  harvest?: unknown
  plantingSeasons?: unknown
  plantings?: unknown
  soilImpact?: unknown
  yieldRaw?: unknown
  yieldNormalized?: {
    unit: string | null
    value: number | null
  }
  normalizedFields: Record<string, unknown>
  importWarnings: PlantLibraryImportWarning[]
  sourceQuality: PlantLibrarySourceQuality
}

export interface PlantLibraryImportPreviewRow {
  sourceFile: string
  sourceSlug: string
  row: PlantLibraryImportRow
  importWarnings: PlantLibraryImportWarning[]
  sourceQuality: PlantLibrarySourceQuality
  /** True when human review is required before any Supabase upsert. */
  blockedFromImport: boolean
  /** True when acceptable for a gated preview-branch seed after Phase 9B checks. */
  safeForPreviewBranchImport: boolean
}

export interface PlantLibraryImportAuditSummary {
  totalFilesFound: number
  totalJsonPlantFilesParsed: number
  rowsMapped: number
  parseFailures: number
  qualityCounts: Record<PlantLibrarySourceQuality, number>
  recommendation: string
  /** Explicit audit contract: Phase 9A never writes to Supabase. */
  noSupabaseWrites: true
}
