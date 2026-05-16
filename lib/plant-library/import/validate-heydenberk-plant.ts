import type { HeydenberkPlantSource } from "./heydenberk-types"
import { isRecord } from "./heydenberk-types"
import { formatWatchOutFor, normalizeDurationUnit } from "./normalize-heydenberk-plant"
import type {
  PlantLibraryImportPreviewRow,
  PlantLibraryImportWarning,
  PlantLibrarySourceQuality,
} from "./plant-library-import-types"

const KNOWN_SUN = new Set([
  "full sun",
  "part sun",
  "part shade",
  "full shade",
  "shade",
])

const KNOWN_SOIL = new Set(["light feeder", "heavy feeder", "neutral"])

function perennialWhereYearPlantingIsPlausible(commonName: string): boolean {
  const n = commonName.trim().toLowerCase()
  return (
    n.includes("artichoke") ||
    n.includes("asparagus") ||
    n.includes("rhubarb") ||
    n.includes("horseradish")
  )
}

function push(
  warnings: PlantLibraryImportWarning[],
  code: PlantLibraryImportWarning["code"],
  message: string,
  detail?: Record<string, unknown>,
) {
  warnings.push({ code, message, detail })
}

function suspiciousSpeciesForName(commonName: string, species: string): boolean {
  const n = commonName.trim().toLowerCase()
  const s = species.trim().toLowerCase()

  if (n === "beet" && (s.includes("cynara") || s.includes("scolymus"))) return true
  if (n.includes("beet") && s.includes("cynara")) return true

  return false
}

function scoreQuality(warnings: PlantLibraryImportWarning[]): PlantLibrarySourceQuality {
  const codes = new Set(warnings.map((w) => w.code))
  if (
    codes.has("species_name_suspicious") ||
    codes.has("cultivation_category_not_veg_herb") ||
    (codes.has("planting_duration_suspicious") && !codes.has("planting_duration_years_perennial"))
  ) {
    return "needs_review"
  }

  const severe =
    warnings.filter(
      (w) =>
        w.code === "missing_name" ||
        w.code === "missing_species" ||
        w.code === "harvest_missing" ||
        w.code === "plantings_missing" ||
        w.code === "sun_missing",
    ).length > 0

  if (severe) return "needs_review"

  if (
    codes.has("harvest_suspicious") ||
    codes.has("spacing_suspicious") ||
    codes.has("cultivation_category_unknown") ||
    codes.has("soil_impact_unknown") ||
    codes.has("sun_unknown")
  ) {
    return "low"
  }

  if (
    warnings.length === 0 ||
    warnings.every(
      (w) =>
        w.code === "scientific_name_trimmed" ||
        w.code === "duration_unit_normalized" ||
        w.code === "yield_units_normalized" ||
        w.code === "yield_unit_key_drift" ||
        w.code === "planting_duration_years_perennial",
    )
  ) {
    return warnings.length === 0 ? "high" : "medium"
  }

  if (warnings.length <= 3) return "medium"
  return "low"
}

export interface ValidateHeydenberkContext {
  source: HeydenberkPlantSource
  raw: Record<string, unknown>
  normalizedCommonName: string
  normalizedSpecies: string
  normalizedCategory: string
  ediblePartsNormalized: string[]
  sunMin: string | null
  sunMax: string | null
  spacingInches: number | null
  harvestDays: number | null
}

export function validateHeydenberkPlant(
  ctx: ValidateHeydenberkContext,
  existingWarnings: PlantLibraryImportWarning[],
): { warnings: PlantLibraryImportWarning[]; sourceQuality: PlantLibrarySourceQuality } {
  const warnings = [...existingWarnings]

  if (!ctx.normalizedCommonName) {
    push(warnings, "missing_name", "Missing plant name.")
  }

  if (!ctx.normalizedSpecies) {
    push(warnings, "missing_species", "Missing species.")
  } else if (suspiciousSpeciesForName(ctx.normalizedCommonName, ctx.normalizedSpecies)) {
    push(warnings, "species_name_suspicious", "Species does not look consistent with common name.", {
      name: ctx.normalizedCommonName,
      species: ctx.normalizedSpecies,
    })
  }

  const cat = ctx.normalizedCategory.trim().toLowerCase()
  if (!ctx.normalizedCategory) {
    push(warnings, "cultivation_category_unknown", "Missing cultivationCategory.")
  } else if (cat !== "vegetable" && cat !== "herb") {
    push(warnings, "cultivation_category_not_veg_herb", "cultivationCategory is not vegetable or herb.", {
      category: ctx.normalizedCategory,
    })
  }

  const soil = (ctx.source.soilImpact ?? "").trim().toLowerCase()
  if (!ctx.source.soilImpact || !ctx.source.soilImpact.trim()) {
    push(warnings, "soil_impact_unknown", "Missing soilImpact.")
  } else if (!KNOWN_SOIL.has(soil)) {
    push(warnings, "soil_impact_unknown", "Unknown soilImpact label.", { soilImpact: ctx.source.soilImpact })
  }

  if (!ctx.source.sun || (!ctx.sunMin && !ctx.sunMax)) {
    push(warnings, "sun_missing", "Missing sun min/max.")
  } else {
    if (ctx.sunMin && !KNOWN_SUN.has(ctx.sunMin)) {
      push(warnings, "sun_unknown", "Unknown sun min label.", { min: ctx.sunMin })
    }
    if (ctx.sunMax && !KNOWN_SUN.has(ctx.sunMax)) {
      push(warnings, "sun_unknown", "Unknown sun max label.", { max: ctx.sunMax })
    }
  }

  const hz = ctx.source.hardinessZone
  if (hz && typeof hz.min === "number" && typeof hz.max === "number" && hz.min > hz.max) {
    push(warnings, "hardiness_zone_inverted", "hardinessZone min is greater than max.", { hz })
  }

  if (!ctx.source.harvest || !isRecord(ctx.source.harvest) || !isRecord(ctx.source.harvest["duration"])) {
    push(warnings, "harvest_missing", "Missing harvest.duration.")
  } else {
    const d = ctx.source.harvest.duration as { min?: number; max?: number; unit?: string } | undefined
    const unit = normalizeDurationUnit(d?.unit, [], "harvest.duration(validate)")
    const min = d?.min
    const max = d?.max
    if (typeof min === "number" && typeof max === "number") {
      if (min > max) {
        push(warnings, "harvest_suspicious", "Harvest duration min exceeds max.", { min, max })
      }
      if (unit === "weeks" && max <= 2 && ctx.normalizedCommonName.toLowerCase().includes("tomato")) {
        push(warnings, "harvest_suspicious", "Tomato harvest window may be unrealistically short in this source.", {
          min,
          max,
          unit,
        })
      }
    }
  }

  if (!ctx.source.plantings || ctx.source.plantings.length === 0) {
    push(warnings, "plantings_missing", "Missing plantings array or empty.")
  }

  if (ctx.spacingInches !== null && ctx.spacingInches <= 0) {
    push(warnings, "spacing_suspicious", "spacing_inches is zero or negative.", {
      spacing_inches: ctx.spacingInches,
    })
  }

  if (ctx.spacingInches !== null && ctx.spacingInches > 0 && ctx.spacingInches < 0.25) {
    push(warnings, "spacing_suspicious", "spacing_inches is extremely small.", {
      spacing_inches: ctx.spacingInches,
    })
  }

  const plantings = ctx.source.plantings ?? []
  for (const p of plantings) {
    const du = p.duration?.unit
    if (typeof du === "string") {
      const u = du.trim().toLowerCase()
      if (u === "year" || u === "years") {
        if (perennialWhereYearPlantingIsPlausible(ctx.normalizedCommonName)) {
          push(
            warnings,
            "planting_duration_years_perennial",
            "Planting stage duration uses years; plausible for a perennial in this source but verify locally.",
            { duration: p.duration },
          )
        } else {
          push(warnings, "planting_duration_suspicious", "Planting stage duration uses years; verify perennial vs crop data.", {
            duration: p.duration,
          })
        }
      }
    }
  }

  if (ctx.ediblePartsNormalized.length === 0) {
    push(warnings, "edible_parts_empty", "No edible parts after normalization.")
  }

  if (ctx.harvestDays !== null && ctx.harvestDays < 14 && cat === "vegetable") {
    const name = ctx.normalizedCommonName.toLowerCase()
    if (name.includes("tomato") || name.includes("pepper") || name.includes("squash")) {
      push(warnings, "harvest_suspicious", "Derived days_to_maturity from harvest is very short for this crop.", {
        harvestDays: ctx.harvestDays,
      })
    }
  }

  const sourceQuality = scoreQuality(warnings)
  return { warnings, sourceQuality }
}

export function applyValidationToPreview(
  preview: PlantLibraryImportPreviewRow,
  sourceQuality: PlantLibrarySourceQuality,
  warnings: PlantLibraryImportWarning[],
): PlantLibraryImportPreviewRow {
  const mergedWarnings = warnings
  const blockedFromImport = sourceQuality === "needs_review"
  const safeForPreviewBranchImport =
    sourceQuality === "high" || sourceQuality === "medium"

  preview.importWarnings = mergedWarnings
  preview.sourceQuality = sourceQuality
  preview.row.metadata.importWarnings = mergedWarnings
  preview.row.metadata.sourceQuality = sourceQuality
  preview.blockedFromImport = blockedFromImport
  preview.safeForPreviewBranchImport = safeForPreviewBranchImport

  const hasDataWarnings = mergedWarnings.some(
    (w) =>
      w.code !== "scientific_name_trimmed" &&
      w.code !== "duration_unit_normalized" &&
      w.code !== "yield_units_normalized",
  )
  const hardinessOrHarvestNotes = mergedWarnings.some(
    (w) =>
      w.code === "harvest_suspicious" ||
      w.code === "harvest_missing" ||
      w.code === "hardiness_zone_inverted" ||
      w.code === "harvest_years_not_used_for_maturity",
  )

  preview.row.watch_out_for = formatWatchOutFor({
    soilImpact: preview.row.metadata.soilImpact as string | undefined,
    hasDataWarnings,
    hardinessOrHarvestNotes,
  })

  return preview
}
