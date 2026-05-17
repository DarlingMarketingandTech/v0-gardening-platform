/**
 * Maps a single Harvest Helper CSV row to a PlantLibraryImportPreviewRow.
 *
 * Mirrors the structure of map-heydenberk-plant.ts.
 * - Source: garden_vegetables.csv (17 text columns)
 * - Target: plant_library-compatible row + metadata
 * - No Supabase writes, no network calls.
 */

import { asHarvestHelperPlantSource, type HarvestHelperCsvRow } from "./harvest-helper-types"
import { matchHarvestHelperImage, type buildImageIndex } from "./match-harvest-helper-image"
import {
  HARVEST_HELPER_SOURCE,
  type HarvestHelperImportMetadata,
  type PlantLibraryImportPreviewRow,
  type PlantLibraryImportRow,
  type PlantLibraryImportWarning,
} from "./plant-library-import-types"
import {
  applyHarvestHelperValidationToPreview,
  inferCategory,
  normalizeSunlight,
  parseSpacingInches,
  validateHarvestHelperPlant,
} from "./validate-harvest-helper-plant"

// ─── watch_out_for helper ─────────────────────────────────────────────────

function buildWatchOutFor(diseases: string | null, pests: string | null): string {
  const parts: string[] = []
  if (diseases) parts.push(`Diseases: ${diseases}`)
  if (pests) parts.push(`Pests: ${pests}`)
  return parts.join(" | ")
}

// ─── Slug helper ──────────────────────────────────────────────────────────

function slugify(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

// ─── Main mapper ─────────────────────────────────────────────────────────

export function mapHarvestHelperPlant(input: {
  raw: HarvestHelperCsvRow
  imageIndex: ReturnType<typeof buildImageIndex>
}): PlantLibraryImportPreviewRow {
  const warnings: PlantLibraryImportWarning[] = []

  const source = asHarvestHelperPlantSource(input.raw)
  if (!source) {
    // Unparseable row — return a blocked preview with minimal data
    const fallbackSlug = slugify((input.raw.name ?? "") || `row-${input.raw.id ?? "unknown"}`)
    const fallbackRow: PlantLibraryImportRow = {
      source: HARVEST_HELPER_SOURCE,
      source_key: `hh-${fallbackSlug}`,
      common_name: (input.raw.name ?? "").trim(),
      scientific_name: "",
      category: "vegetable",
      edible: true,
      sunlight: null,
      water: null,
      spacing_inches: null,
      days_to_maturity: null,
      care_summary: "",
      watch_out_for: "",
      metadata: {
        sourceName: (input.raw.name ?? "").trim(),
        sourceSlug: fallbackSlug,
        raw: input.raw as unknown as Record<string, unknown>,
        normalizedFields: {},
        importWarnings: [{ code: "missing_name", message: "Row could not be parsed (missing id or name)." }],
        sourceQuality: "needs_review",
      },
    }
    return {
      sourceFile: "garden_vegetables.csv",
      sourceSlug: fallbackSlug,
      row: fallbackRow,
      importWarnings: fallbackRow.metadata.importWarnings,
      sourceQuality: "needs_review",
      blockedFromImport: true,
      safeForPreviewBranchImport: false,
    }
  }

  // ── Derived fields ────────────────────────────────────────────────────
  const sourceSlug = `hh-${slugify(source.name)}`
  const category = inferCategory(source.name)
  const sunlight = normalizeSunlight(source.optimal_sun)
  const spacingInches = parseSpacingInches(source.spacing)
  const imageFilename = matchHarvestHelperImage(source.id, input.imageIndex)
  const watchOutFor = buildWatchOutFor(source.diseases, source.pests)

  // ── Metadata ─────────────────────────────────────────────────────────
  const metadata: HarvestHelperImportMetadata = {
    sourceName: source.name,
    sourceSlug,
    raw: source as unknown as Record<string, unknown>,
    normalizedFields: {
      sunlight,
      spacingInches,
      category,
      imageFilename,
    },
    importWarnings: warnings,
    sourceQuality: "medium", // will be overwritten by validation
    // HH-specific knowledge section fields
    when_to_plant: source.when_to_plant || undefined,
    growing_from_seed: source.growing_from_seed,
    transplanting: source.transplanting,
    feeding: source.feeding,
    other_care: source.other_care,
    planting_considerations: source.planting_considerations,
    harvesting: source.harvesting || undefined,
    storage_use: source.storage_use,
    image: imageFilename,
  }

  if (imageFilename) {
    metadata.sourceImageCandidates = [imageFilename]
  }

  // ── Row ───────────────────────────────────────────────────────────────
  const row: PlantLibraryImportRow = {
    source: HARVEST_HELPER_SOURCE,
    source_key: sourceSlug,
    common_name: source.name,
    scientific_name: "", // HH CSV does not include scientific names
    category,
    edible: true, // All 45 HH plants are edible food crops
    sunlight,
    water: source.watering || null,
    spacing_inches: spacingInches,
    days_to_maturity: null, // HH CSV does not include days-to-maturity
    care_summary: source.description,
    watch_out_for: watchOutFor,
    metadata,
  }

  let preview: PlantLibraryImportPreviewRow = {
    sourceFile: "garden_vegetables.csv",
    sourceSlug,
    row,
    importWarnings: warnings,
    sourceQuality: "medium",
    blockedFromImport: false,
    safeForPreviewBranchImport: false,
  }

  // ── Validate + score ──────────────────────────────────────────────────
  const validated = validateHarvestHelperPlant(
    { source, sunlight, spacingInches, imageFilename },
    warnings,
  )

  preview = applyHarvestHelperValidationToPreview(preview, validated.sourceQuality, validated.warnings)
  return preview
}
