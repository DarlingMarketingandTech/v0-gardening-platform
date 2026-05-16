import type { HeydenberkDuration, HeydenberkPlantSource } from "./heydenberk-types"
import type { PlantLibraryImportWarning } from "./plant-library-import-types"

function pushWarning(
  warnings: PlantLibraryImportWarning[],
  code: PlantLibraryImportWarning["code"],
  message: string,
  detail?: Record<string, unknown>,
) {
  warnings.push({ code, message, detail })
}

export function slugify(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export function normalizeDurationUnit(
  unit: string | undefined,
  warnings: PlantLibraryImportWarning[],
  context: string,
): string | undefined {
  if (!unit) return undefined
  const trimmed = unit.trim().toLowerCase()
  const map: Record<string, string> = {
    day: "days",
    days: "days",
    week: "weeks",
    weeks: "weeks",
    month: "months",
    months: "months",
    year: "years",
    years: "years",
  }
  const normalized = map[trimmed]
  if (!normalized) {
    pushWarning(warnings, "duration_unit_mismatch", `Unknown duration unit in ${context}.`, {
      unit,
    })
    return trimmed
  }
  if (trimmed !== normalized) {
    pushWarning(warnings, "duration_unit_normalized", `Normalized duration unit in ${context}.`, {
      from: unit,
      to: normalized,
    })
  }
  return normalized
}

export function weeksToDays(weeks: number): number {
  return Math.round(weeks * 7)
}

export function normalizeEdibleParts(
  raw: unknown,
  warnings: PlantLibraryImportWarning[],
): string[] {
  if (!Array.isArray(raw)) return []
  const out: string[] = []
  for (const part of raw) {
    if (typeof part !== "string") continue
    const p = part.trim().toLowerCase()
    if (p === "leaft") {
      pushWarning(warnings, "edible_part_typo_normalized", 'Normalized edible part typo "leaft".', {
        from: part,
        to: "leaf",
      })
      out.push("leaf")
      continue
    }
    if (p.length > 0) out.push(p)
  }
  return out
}

export function normalizeYieldFields(
  y: HeydenberkPlantSource["yield"],
  warnings: PlantLibraryImportWarning[],
): { unit: string | null; value: number | null; raw: unknown } {
  const raw = y ?? null
  if (!y) return { unit: null, value: null, raw }
  const hasUnit = typeof y.unit === "string" && y.unit.trim().length > 0
  const hasUnits = typeof y.units === "string" && y.units.trim().length > 0
  if (hasUnit && hasUnits && y.unit !== y.units) {
    pushWarning(warnings, "yield_unit_key_drift", "Yield has both unit and units with different values.", {
      unit: y.unit,
      units: y.units,
    })
  }
  if (!hasUnit && hasUnits) {
    pushWarning(warnings, "yield_units_normalized", "Yield used units instead of unit; normalized to unit.", {
      units: y.units,
    })
  }
  const unit = hasUnit ? y.unit!.trim() : hasUnits ? y.units!.trim() : null
  const value = typeof y.value === "number" && Number.isFinite(y.value) ? y.value : null
  return { unit, value, raw }
}

export function normalizeSunLabel(label: unknown): string | null {
  if (typeof label !== "string") return null
  const t = label.trim().toLowerCase()
  return t.length > 0 ? t : null
}

export function spacingToInches(size: number, unit: string | undefined): number | null {
  if (!Number.isFinite(size)) return null
  const u = (unit ?? "").trim().toLowerCase()
  if (u === "inch" || u === "inches" || u === '"') return size
  if (u === "foot" || u === "feet" || u === "'") return size * 12
  if (u === "cm" || u === "centimeter" || u === "centimeters") return size / 2.54
  if (u === "mm" || u === "millimeter" || u === "millimeters") return size / 25.4
  return null
}

export function chooseSpacingInchesFromPlantings(
  source: HeydenberkPlantSource,
  warnings: PlantLibraryImportWarning[],
): number | null {
  const plantings = source.plantings
  if (!plantings || plantings.length === 0) return null
  const candidates: number[] = []
  for (const p of plantings) {
    const size = p.spacing?.size
    const unit = p.spacing?.unit
    if (typeof size !== "number") continue
    const inches = spacingToInches(size, unit)
    if (inches === null) {
      pushWarning(warnings, "spacing_suspicious", "Planting spacing used an unknown unit.", {
        size,
        unit,
      })
      continue
    }
    if (inches > 0 && inches <= 240) candidates.push(inches)
  }
  if (candidates.length === 0) return null
  const max = Math.max(...candidates)
  if (max <= 0) {
    pushWarning(warnings, "spacing_suspicious", "Spacing resolved to non-positive values only.", {})
    return null
  }
  return Math.round(max * 10) / 10
}

export function harvestDurationToDays(
  d: HeydenberkDuration | undefined,
  warnings: PlantLibraryImportWarning[],
): { days: number | null; unitNormalized: string | undefined } {
  if (!d) return { days: null, unitNormalized: undefined }
  const unitRaw = d.unit
  const unit = normalizeDurationUnit(unitRaw, warnings, "harvest.duration")
  const min = typeof d.min === "number" ? d.min : undefined
  const max = typeof d.max === "number" ? d.max : undefined
  if (min === undefined && max === undefined) return { days: null, unitNormalized: unit }

  const hi = max ?? min!
  const lo = min ?? max!

  if (unit === "years") {
    pushWarning(warnings, "harvest_years_not_used_for_maturity", "Harvest duration in years; not used for days_to_maturity.", {
      min: lo,
      max: hi,
    })
    return { days: null, unitNormalized: unit }
  }

  if (unit === "weeks") {
    return { days: weeksToDays(hi), unitNormalized: unit }
  }
  if (unit === "days") {
    return { days: Math.round(hi), unitNormalized: unit }
  }
  if (unit === "months") {
    pushWarning(warnings, "harvest_suspicious", "Harvest duration in months; days_to_maturity is approximate.", {
      min: lo,
      max: hi,
    })
    return { days: Math.round(hi * 30), unitNormalized: unit }
  }

  return { days: null, unitNormalized: unit }
}

export function formatSunRange(minLabel: string | null, maxLabel: string | null): string | null {
  if (!minLabel && !maxLabel) return null
  if (minLabel && maxLabel && minLabel === maxLabel) return minLabel
  if (minLabel && maxLabel) return `${minLabel} to ${maxLabel}`
  return minLabel ?? maxLabel
}

function sentenceName(commonName: string): string {
  const t = commonName.trim()
  if (!t) return "This plant"
  return t.charAt(0).toUpperCase() + t.slice(1).toLowerCase()
}

function sunPreferencePhrase(minLabel: string | null, maxLabel: string | null): string {
  if (!minLabel && !maxLabel) return "sun needs are unclear in this source"
  if (minLabel === maxLabel) {
    if (maxLabel === "full sun") return "prefers full sun"
    if (maxLabel === "part sun") return "grows in part sun"
    if (maxLabel === "part shade") return "tolerates part shade"
    if (maxLabel === "full shade" || maxLabel === "shade") return "prefers shade"
    return `grows in ${maxLabel ?? minLabel}`
  }
  return `grows in ${minLabel} to ${maxLabel}`
}

export function formatCareSummary(input: {
  commonName: string
  category: string
  edible: boolean
  sunMin: string | null
  sunMax: string | null
  spacingInches: number | null
  spacingSuspicious: boolean
}): string {
  const name = sentenceName(input.commonName)
  const cat = input.category.trim().toLowerCase()
  const edibleLabel =
    input.edible && (cat === "vegetable" || cat === "herb")
      ? `an edible ${cat}`
      : cat === "vegetable" || cat === "herb"
        ? `a ${cat}`
        : `a ${cat || "plant"}`
  const sun = sunPreferencePhrase(input.sunMin, input.sunMax)

  if (input.spacingSuspicious || input.spacingInches === null) {
    return `${name} is ${edibleLabel} that ${sun}. Review spacing before import.`
  }

  const rounded = Math.round(input.spacingInches)
  return `${name} is ${edibleLabel} that ${sun}. Space plants about ${rounded} inches apart based on this source.`
}

export function formatWatchOutFor(input: {
  soilImpact?: string | null
  hasDataWarnings: boolean
  hardinessOrHarvestNotes: boolean
}): string {
  const parts: string[] = []
  const soil = (input.soilImpact ?? "").trim().toLowerCase()
  if (soil === "heavy feeder") {
    parts.push("Heavy feeder. Plan compost or richer soil support.")
  } else if (soil === "light feeder") {
    parts.push("Light feeder. Avoid over-fertilizing unless soil tests suggest it.")
  }

  if (input.hasDataWarnings) {
    parts.push("Source data needs review before import.")
  }

  if (input.hardinessOrHarvestNotes) {
    parts.push("Hardiness and harvest fields may need local adjustment.")
  }

  if (parts.length === 0) {
    return "Review hardiness, harvest timing, and spacing against your local season."
  }

  return parts.join(" ")
}

export function collectImageCandidates(node: unknown, out: string[], depth = 0) {
  if (depth > 12) return
  if (typeof node === "string") {
    const t = node.trim()
    if (/^https?:\/\//i.test(t) && /(image|photo|jpg|jpeg|png|webp|svg)/i.test(t)) {
      out.push(t)
    }
    return
  }
  if (!node || typeof node !== "object") return
  if (Array.isArray(node)) {
    for (const v of node) collectImageCandidates(v, out, depth + 1)
    return
  }
  for (const [k, v] of Object.entries(node as Record<string, unknown>)) {
    const key = k.toLowerCase()
    if (
      (key.includes("image") ||
        key.includes("photo") ||
        key.includes("picture") ||
        key.includes("thumbnail")) &&
      typeof v === "string" &&
      /^https?:\/\//i.test(v.trim())
    ) {
      out.push(v.trim())
    }
    collectImageCandidates(v, out, depth + 1)
  }
}

export function trimScientificName(
  species: string | undefined,
  warnings: PlantLibraryImportWarning[],
): string {
  if (!species) return ""
  const trimmed = species.trim()
  if (trimmed !== species) {
    pushWarning(warnings, "scientific_name_trimmed", "Trimmed trailing/leading whitespace from species.", {
      before: species,
      after: trimmed,
    })
  }
  return trimmed
}
