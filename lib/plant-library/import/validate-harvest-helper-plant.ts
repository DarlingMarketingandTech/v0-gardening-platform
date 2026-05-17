/**
 * Validation and quality scoring for Harvest Helper CSV plant rows.
 *
 * Mirrors the structure of validate-heydenberk-plant.ts.
 * Harvest Helper has richer text fields but no numeric harvest/spacing data,
 * so validation focuses on required text fields and sunlight normalization.
 */

import type { HarvestHelperPlantSource } from "./harvest-helper-types"
import type {
  PlantLibraryImportPreviewRow,
  PlantLibraryImportWarning,
  PlantLibrarySourceQuality,
} from "./plant-library-import-types"

// ─── Warning codes specific to Harvest Helper ─────────────────────────────

export type HarvestHelperWarningCode =
  | "missing_name"
  | "missing_description"
  | "missing_when_to_plant"
  | "missing_spacing"
  | "missing_watering"
  | "missing_harvesting"
  | "sunlight_unknown"
  | "sunlight_missing"
  | "spacing_not_parseable"
  | "storage_use_missing"
  | "watch_out_for_empty"
  | "image_missing"

// ─── Sunlight normalization ────────────────────────────────────────────────

/**
 * Normalize Harvest Helper optimal_sun to plant_library enum.
 * Source values: "Full Sun(at least 6 hours a day)", "Part Sun",
 *                "Part Shade", "Full-Part Sun"
 */
export function normalizeSunlight(
  raw: string,
): "full sun" | "part sun" | "part shade" | "full shade" | null {
  const s = raw.trim().toLowerCase()
  if (s.startsWith("full sun")) return "full sun"
  if (s.startsWith("full shade")) return "full shade"
  if (s.startsWith("part sun")) return "part sun"
  if (s.startsWith("part shade")) return "part shade"
  // "Full-Part Sun" — tolerates both; map to "part sun" (conservative)
  if (s === "full-part sun") return "part sun"
  return null
}

// ─── Spacing parsing ───────────────────────────────────────────────────────

/**
 * Attempt to parse a numeric spacing in inches from free-text spacing field.
 * Handles: "12 to 24 inches", "12-24 inches", "2-inch spacings",
 *          "6 feet", "2-3 feet", "one foot apart"
 */
export function parseSpacingInches(raw: string): number | null {
  // Range: "12 to 24 inches", "12-24 inches", "2-3-inch"
  const inchRange = raw.match(
    /(\d+(?:\.\d+)?)\s*(?:to|-)\s*(\d+(?:\.\d+)?)\s*-?\s*inch/i,
  )
  if (inchRange) {
    return Math.round((parseFloat(inchRange[1]) + parseFloat(inchRange[2])) / 2)
  }

  // Single: "12 inches", "2-inch spacings"
  const inchSingle = raw.match(/(\d+(?:\.\d+)?)\s*-?\s*inch/i)
  if (inchSingle) return Math.round(parseFloat(inchSingle[1]))

  // Feet range: "2-3 feet", "6 to 8 feet"
  const feetRange = raw.match(
    /(\d+(?:\.\d+)?)\s*(?:to|-)\s*(\d+(?:\.\d+)?)\s*feet/i,
  )
  if (feetRange) {
    return Math.round(
      ((parseFloat(feetRange[1]) + parseFloat(feetRange[2])) / 2) * 12,
    )
  }

  // Single feet: "6 feet"
  const feetSingle = raw.match(/(\d+(?:\.\d+)?)\s*feet/i)
  if (feetSingle) return Math.round(parseFloat(feetSingle[1]) * 12)

  // Text: "one foot apart"
  if (/\bone\s+foot\b/i.test(raw)) return 12

  return null
}

// ─── Category inference ────────────────────────────────────────────────────

const HERB_NAMES = new Set([
  "basil",
  "chives",
  "thyme",
  "oregano",
  "rosemary",
  "cilantro",
  "parsley",
  "mint",
  "sage",
  "tarragon",
  "dill",
])

export function inferCategory(commonName: string): "vegetable" | "herb" {
  return HERB_NAMES.has(commonName.trim().toLowerCase()) ? "herb" : "vegetable"
}

// ─── Validation ────────────────────────────────────────────────────────────

function push(
  warnings: PlantLibraryImportWarning[],
  code: HarvestHelperWarningCode,
  message: string,
  detail?: Record<string, unknown>,
) {
  warnings.push({ code, message, detail })
}

function scoreQuality(
  warnings: PlantLibraryImportWarning[],
): PlantLibrarySourceQuality {
  const codes = new Set(warnings.map((w) => w.code))

  // Severe: any required field missing
  if (
    codes.has("missing_name") ||
    codes.has("missing_description") ||
    codes.has("missing_when_to_plant") ||
    codes.has("missing_spacing") ||
    codes.has("missing_watering") ||
    codes.has("missing_harvesting") ||
    codes.has("sunlight_missing")
  ) {
    return "needs_review"
  }

  // Medium: spacing unparseable or sunlight unknown
  if (codes.has("spacing_not_parseable") || codes.has("sunlight_unknown")) {
    return "medium"
  }

  // Optional gaps only → high if that's all there is
  const nonOptional = warnings.filter(
    (w) =>
      w.code !== "storage_use_missing" &&
      w.code !== "watch_out_for_empty" &&
      w.code !== "image_missing",
  )
  if (nonOptional.length === 0) return "high"

  return warnings.length <= 3 ? "medium" : "low"
}

export interface ValidateHarvestHelperContext {
  source: HarvestHelperPlantSource
  sunlight: "full sun" | "part sun" | "part shade" | "full shade" | null
  spacingInches: number | null
  imageFilename: string | null
}

export function validateHarvestHelperPlant(
  ctx: ValidateHarvestHelperContext,
  existingWarnings: PlantLibraryImportWarning[],
): {
  warnings: PlantLibraryImportWarning[]
  sourceQuality: PlantLibrarySourceQuality
} {
  const warnings = [...existingWarnings]
  const { source } = ctx

  if (!source.name) push(warnings, "missing_name", "Missing plant name.")
  if (!source.description)
    push(warnings, "missing_description", "Missing description.")
  if (!source.when_to_plant)
    push(warnings, "missing_when_to_plant", "Missing when_to_plant.")
  if (!source.spacing) push(warnings, "missing_spacing", "Missing spacing.")
  if (!source.watering) push(warnings, "missing_watering", "Missing watering.")
  if (!source.harvesting)
    push(warnings, "missing_harvesting", "Missing harvesting.")

  if (!source.optimal_sun) {
    push(warnings, "sunlight_missing", "Missing optimal_sun field.")
  } else if (ctx.sunlight === null) {
    push(
      warnings,
      "sunlight_unknown",
      "Could not normalize optimal_sun to known enum.",
      { optimal_sun: source.optimal_sun },
    )
  }

  if (source.spacing && ctx.spacingInches === null) {
    push(
      warnings,
      "spacing_not_parseable",
      "Could not parse numeric spacing from spacing field.",
      { spacing: source.spacing },
    )
  }

  if (!source.storage_use) {
    push(
      warnings,
      "storage_use_missing",
      "storage_use is empty (optional — enrichable later).",
    )
  }

  if (!source.diseases && !source.pests) {
    push(
      warnings,
      "watch_out_for_empty",
      "Both diseases and pests are empty; watch_out_for will be blank.",
    )
  }

  if (!ctx.imageFilename) {
    push(warnings, "image_missing", "No matching photo found.")
  }

  return { warnings, sourceQuality: scoreQuality(warnings) }
}

export function applyHarvestHelperValidationToPreview(
  preview: PlantLibraryImportPreviewRow,
  sourceQuality: PlantLibrarySourceQuality,
  warnings: PlantLibraryImportWarning[],
): PlantLibraryImportPreviewRow {
  preview.importWarnings = warnings
  preview.sourceQuality = sourceQuality
  preview.row.metadata.importWarnings = warnings
  preview.row.metadata.sourceQuality = sourceQuality
  preview.blockedFromImport = sourceQuality === "needs_review"
  preview.safeForPreviewBranchImport =
    sourceQuality === "high" || sourceQuality === "medium"
  return preview
}
