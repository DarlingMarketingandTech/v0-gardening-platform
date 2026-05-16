import { asHeydenberkPlantSource, isRecord } from "./heydenberk-types"
import {
  chooseSpacingInchesFromPlantings,
  collectImageCandidates,
  formatCareSummary,
  formatSunRange,
  formatWatchOutFor,
  harvestDurationToDays,
  normalizeEdibleParts,
  normalizeSunLabel,
  normalizeYieldFields,
  slugify,
  trimScientificName,
} from "./normalize-heydenberk-plant"
import {
  HEYDENBERK_SOURCE,
  type PlantLibraryImportMetadata,
  type PlantLibraryImportPreviewRow,
  type PlantLibraryImportRow,
  type PlantLibraryImportWarning,
} from "./plant-library-import-types"
import { applyValidationToPreview, validateHeydenberkPlant } from "./validate-heydenberk-plant"

function cloneJsonSafe(obj: unknown): Record<string, unknown> {
  try {
    return JSON.parse(JSON.stringify(obj)) as Record<string, unknown>
  } catch {
    return isRecord(obj) ? { ...obj } : {}
  }
}

function sourceKeyFromInput(sourceFileBasename: string, commonName: string): string {
  const base = sourceFileBasename.replace(/\.json$/i, "").trim()
  const fromFile = slugify(base)
  if (fromFile.length > 0) return fromFile
  return slugify(commonName) || "unknown-plant"
}

export function mapHeydenberkPlant(input: {
  sourceFileBasename: string
  raw: unknown
}): PlantLibraryImportPreviewRow {
  const warnings: PlantLibraryImportWarning[] = []
  const rawRecord = isRecord(input.raw) ? input.raw : {}
  const source = asHeydenberkPlantSource(input.raw)

  const commonName = (source.name ?? "").trim()
  const speciesTrimmed = trimScientificName(source.species, warnings)
  const category = (source.cultivationCategory ?? "").trim()

  const ediblePartsNormalized = normalizeEdibleParts(source.edibleParts, warnings)
  const edible = ediblePartsNormalized.length > 0

  const sunMin = normalizeSunLabel(source.sun?.min)
  const sunMax = normalizeSunLabel(source.sun?.max)
  const sunlight = formatSunRange(sunMin, sunMax)

  const spacingInches = chooseSpacingInchesFromPlantings(source, warnings)
  const spacingSuspicious =
    spacingInches === null ||
    spacingInches < 1 ||
    (spacingInches > 0 && spacingInches < 2 && commonName.toLowerCase() === "parsley")

  const harvest = source.harvest?.duration
  const { days: harvestDays } = harvestDurationToDays(harvest, warnings)

  const days_to_maturity = harvestDays

  const yieldNorm = normalizeYieldFields(source.yield, warnings)

  const imageCandidates: string[] = []
  collectImageCandidates(input.raw, imageCandidates)
  if (imageCandidates.length > 0) {
    warnings.push({
      code: "image_candidate_unaudited",
      message:
        "Discovered image-like URL fields in source JSON. Preserved in metadata.sourceImageCandidates only; not audited in Phase 9A.",
      detail: { count: imageCandidates.length },
    })
  }

  const care_summary = formatCareSummary({
    commonName,
    category,
    edible,
    sunMin,
    sunMax,
    spacingInches,
    spacingSuspicious,
  })

  const hasEarlyWarnings = warnings.some(
    (w) =>
      w.code !== "scientific_name_trimmed" &&
      w.code !== "duration_unit_normalized" &&
      w.code !== "yield_units_normalized" &&
      w.code !== "yield_unit_key_drift",
  )
  const hardinessOrHarvestNotesEarly = warnings.some(
    (w) =>
      w.code === "harvest_suspicious" ||
      w.code === "harvest_years_not_used_for_maturity",
  )

  const watch_out_for = formatWatchOutFor({
    soilImpact: source.soilImpact,
    hasDataWarnings: hasEarlyWarnings,
    hardinessOrHarvestNotes: hardinessOrHarvestNotesEarly,
  })

  const sourceSlug = sourceKeyFromInput(input.sourceFileBasename, commonName)

  const normalizedFields: Record<string, unknown> = {
    ediblePartsNormalized,
    scientificName: speciesTrimmed,
    yield: yieldNorm,
    spacingInches,
    daysToMaturity: days_to_maturity,
    sunMin,
    sunMax,
  }

  const metadata: PlantLibraryImportMetadata = {
    sourceName: commonName,
    sourceSlug,
    raw: cloneJsonSafe(input.raw),
    nutritionContent: source.content as Record<string, unknown> | undefined,
    ediblePartsRaw: source.edibleParts,
    ediblePartsNormalized,
    germination: source.germination,
    hardinessZone: source.hardinessZone,
    harvest: source.harvest,
    plantingSeasons: source.plantingSeasons,
    plantings: source.plantings,
    soilImpact: source.soilImpact,
    yieldRaw: yieldNorm.raw,
    yieldNormalized: { unit: yieldNorm.unit, value: yieldNorm.value },
    normalizedFields,
    importWarnings: warnings,
    sourceQuality: "medium",
  }

  if (imageCandidates.length > 0) {
    metadata.sourceImageCandidates = Array.from(new Set(imageCandidates))
  }

  const row: PlantLibraryImportRow = {
    source: HEYDENBERK_SOURCE,
    source_key: sourceSlug,
    common_name: commonName,
    scientific_name: speciesTrimmed,
    category,
    edible,
    sunlight,
    water: null,
    spacing_inches: spacingInches,
    days_to_maturity,
    care_summary,
    watch_out_for,
    metadata,
  }

  let preview: PlantLibraryImportPreviewRow = {
    sourceFile: input.sourceFileBasename,
    sourceSlug,
    row,
    importWarnings: warnings,
    sourceQuality: "medium",
    blockedFromImport: false,
    safeForPreviewBranchImport: false,
  }

  const validated = validateHeydenberkPlant(
    {
      source,
      raw: rawRecord,
      normalizedCommonName: commonName,
      normalizedSpecies: speciesTrimmed,
      normalizedCategory: category,
      ediblePartsNormalized,
      sunMin,
      sunMax,
      spacingInches,
      harvestDays: days_to_maturity,
    },
    warnings,
  )

  preview = applyValidationToPreview(preview, validated.sourceQuality, validated.warnings)
  return preview
}
