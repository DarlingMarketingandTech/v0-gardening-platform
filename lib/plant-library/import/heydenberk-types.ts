/**
 * Tolerant structural types for heydenberk/gardening-data plant JSON.
 * Designed for source drift: optional fields, unknown strings, alternate keys.
 */

export type HeydenberkJsonPrimitive =
  | string
  | number
  | boolean
  | null
  | undefined

export type HeydenberkJsonValue =
  | HeydenberkJsonPrimitive
  | HeydenberkJsonValue[]
  | { [key: string]: HeydenberkJsonValue }

/** Nutrition and other keyed numeric maps under `content`. */
export type HeydenberkContentMap = Record<
  string,
  | {
      value?: number
      unit?: string
    }
  | HeydenberkJsonValue
  | undefined
>

export interface HeydenberkMeasurement {
  size?: number
  unit?: string
}

export interface HeydenberkDuration {
  min?: number
  max?: number
  /** Singular or plural drift tolerated at runtime. */
  unit?: string
}

export interface HeydenberkGermination {
  duration?: HeydenberkDuration
  rate?: number
}

export interface HeydenberkHardinessZone {
  min?: number
  max?: number
}

export interface HeydenberkHarvest {
  duration?: HeydenberkDuration
}

export interface HeydenberkSun {
  min?: string
  max?: string
}

export interface HeydenberkPlanting {
  depth?: HeydenberkMeasurement
  duration?: HeydenberkDuration
  spacing?: HeydenberkMeasurement
}

/** Yield may use `unit` or `units` depending on file age / drift. */
export interface HeydenberkYield {
  value?: number
  unit?: string
  units?: string
}

export interface HeydenberkPlantSource {
  content?: HeydenberkContentMap
  cultivationCategory?: string
  edibleParts?: unknown
  germination?: HeydenberkGermination
  hardinessZone?: HeydenberkHardinessZone
  harvest?: HeydenberkHarvest
  name?: string
  plantingSeasons?: unknown
  plantings?: HeydenberkPlanting[]
  soilImpact?: string
  species?: string
  sun?: HeydenberkSun
  yield?: HeydenberkYield
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

export function asHeydenberkPlantSource(raw: unknown): HeydenberkPlantSource {
  if (!isRecord(raw)) return {}
  const yieldRaw = raw["yield"]
  const yieldObj: HeydenberkYield | undefined = isRecord(yieldRaw)
    ? {
        value: typeof yieldRaw["value"] === "number" ? yieldRaw["value"] : undefined,
        unit: typeof yieldRaw["unit"] === "string" ? yieldRaw["unit"] : undefined,
        units: typeof yieldRaw["units"] === "string" ? yieldRaw["units"] : undefined,
      }
    : undefined

  const sunRaw = raw["sun"]
  const sun: HeydenberkSun | undefined = isRecord(sunRaw)
    ? {
        min: typeof sunRaw["min"] === "string" ? sunRaw["min"] : undefined,
        max: typeof sunRaw["max"] === "string" ? sunRaw["max"] : undefined,
      }
    : undefined

  const hzRaw = raw["hardinessZone"]
  const hardinessZone: HeydenberkHardinessZone | undefined = isRecord(hzRaw)
    ? {
        min: typeof hzRaw["min"] === "number" ? hzRaw["min"] : undefined,
        max: typeof hzRaw["max"] === "number" ? hzRaw["max"] : undefined,
      }
    : undefined

  const harvestRaw = raw["harvest"]
  const harvest: HeydenberkHarvest | undefined = isRecord(harvestRaw)
    ? {
        duration: isRecord(harvestRaw["duration"])
          ? {
              min:
                typeof harvestRaw["duration"]["min"] === "number"
                  ? harvestRaw["duration"]["min"]
                  : undefined,
              max:
                typeof harvestRaw["duration"]["max"] === "number"
                  ? harvestRaw["duration"]["max"]
                  : undefined,
              unit:
                typeof harvestRaw["duration"]["unit"] === "string"
                  ? harvestRaw["duration"]["unit"]
                  : undefined,
            }
          : undefined,
      }
    : undefined

  const germRaw = raw["germination"]
  const germination: HeydenberkGermination | undefined = isRecord(germRaw)
    ? {
        rate: typeof germRaw["rate"] === "number" ? germRaw["rate"] : undefined,
        duration: isRecord(germRaw["duration"])
          ? {
              min:
                typeof germRaw["duration"]["min"] === "number"
                  ? germRaw["duration"]["min"]
                  : undefined,
              max:
                typeof germRaw["duration"]["max"] === "number"
                  ? germRaw["duration"]["max"]
                  : undefined,
              unit:
                typeof germRaw["duration"]["unit"] === "string"
                  ? germRaw["duration"]["unit"]
                  : undefined,
            }
          : undefined,
      }
    : undefined

  const plantingsRaw = raw["plantings"]
  const plantings: HeydenberkPlanting[] | undefined = Array.isArray(plantingsRaw)
    ? plantingsRaw
        .filter(isRecord)
        .map((p) => ({
          depth: isRecord(p["depth"])
            ? {
                size: typeof p["depth"]["size"] === "number" ? p["depth"]["size"] : undefined,
                unit: typeof p["depth"]["unit"] === "string" ? p["depth"]["unit"] : undefined,
              }
            : undefined,
          duration: isRecord(p["duration"])
            ? {
                min:
                  typeof p["duration"]["min"] === "number" ? p["duration"]["min"] : undefined,
                max:
                  typeof p["duration"]["max"] === "number" ? p["duration"]["max"] : undefined,
                unit:
                  typeof p["duration"]["unit"] === "string" ? p["duration"]["unit"] : undefined,
              }
            : undefined,
          spacing: isRecord(p["spacing"])
            ? {
                size: typeof p["spacing"]["size"] === "number" ? p["spacing"]["size"] : undefined,
                unit: typeof p["spacing"]["unit"] === "string" ? p["spacing"]["unit"] : undefined,
              }
            : undefined,
        }))
    : undefined

  const content = raw["content"]
  const contentMap: HeydenberkContentMap | undefined = isRecord(content)
    ? (content as HeydenberkContentMap)
    : undefined

  return {
    content: contentMap,
    cultivationCategory:
      typeof raw["cultivationCategory"] === "string" ? raw["cultivationCategory"] : undefined,
    edibleParts: raw["edibleParts"],
    germination,
    hardinessZone,
    harvest,
    name: typeof raw["name"] === "string" ? raw["name"] : undefined,
    plantingSeasons: raw["plantingSeasons"],
    plantings,
    soilImpact: typeof raw["soilImpact"] === "string" ? raw["soilImpact"] : undefined,
    species: typeof raw["species"] === "string" ? raw["species"] : undefined,
    sun,
    yield: yieldObj,
  }
}
