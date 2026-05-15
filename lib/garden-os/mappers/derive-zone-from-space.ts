import type { DemoGardenSpace } from '@/lib/demo-garden'
import type { GardenZoneCondition } from '@/lib/garden-os/types'

const SUN_LEVEL_LABELS: Record<string, string> = {
  low: 'Mostly gentle light',
  mid: 'Mostly bright light',
  high: 'Mostly strong light',
}

/** Parses setup wizard descriptions from buildSpacesFromProfile. */
export function inferLightExposureLabel(space: DemoGardenSpace): string {
  const desc = space.description
  const sunMatch = desc.match(/Sun is mostly (low|mid|high)/i)
  if (sunMatch?.[1]) {
    const key = sunMatch[1].toLowerCase()
    return space.group === 'outdoor' ? `${SUN_LEVEL_LABELS[key]} · outdoor` : SUN_LEVEL_LABELS[key] ?? 'Outdoor light'
  }
  const lightMatch = desc.match(/Light is mostly (low|mid|high)/i)
  if (lightMatch?.[1]) {
    const key = lightMatch[1].toLowerCase()
    return `${SUN_LEVEL_LABELS[key]} · indoor`
  }

  const blob = `${desc} ${space.title} ${space.watchFor}`.toLowerCase()
  if (space.group === 'outdoor') {
    if (/sunny|sun|concrete|kitchen.*out/i.test(blob)) return 'Bright sun · outdoor'
    if (/native soil|in-ground|deeper root/i.test(blob)) return 'Mixed sun · in-ground'
    if (/raised|well-drained|vertical/i.test(blob)) return 'Warm sun · raised bed'
    if (/pollinator|blooming edge|border/i.test(blob)) return 'Mixed sun · border'
    return 'Outdoor · varies by season'
  }
  if (/bright morning|bright.*window/i.test(blob)) return 'Bright morning light'
  if (/filtered|indirect|shelf|steady/i.test(blob)) return 'Bright indirect light'
  if (/humid|bathroom|moisture/i.test(blob)) return 'Soft humid light'
  if (/windowsill|bedroom/i.test(blob)) return 'Gentle indoor light'
  return 'Indoor · cozy light'
}

export function areaTypeLabelFromGroup(group: DemoGardenSpace['group']): string {
  return group === 'outdoor' ? 'Outdoor zone' : 'Indoor zone'
}

export function deriveZoneCondition(space: DemoGardenSpace): GardenZoneCondition {
  const combined = `${space.watchFor} ${space.weeklyAction} ${space.title} ${space.description}`.toLowerCase()
  const id = String(space.id).toLowerCase()

  const readySoon = space.plantings.filter((p) => p.status === 'ready-soon').length
  const gettingStarted = space.plantings.filter((p) => p.status === 'getting-started').length

  if (
    space.group === 'indoor' &&
    /dry|dryness|crispy|parched/i.test(space.watchFor) &&
    readySoon >= 1 &&
    gettingStarted >= 1
  ) {
    return 'critical'
  }

  const containerCue =
    /patio|pot|container|kitchen-window/i.test(id) ||
    /container|pots|drying out|dry soil|water at the base|soak until water/i.test(combined)

  if (space.group === 'outdoor' && containerCue) {
    return 'needs_water'
  }
  if (/drying out|dry soil|feel hollow|soak it/i.test(combined)) {
    return 'needs_water'
  }

  if (readySoon > 0) return 'attention'
  if (space.plantings.length > 0 && gettingStarted >= Math.ceil(space.plantings.length / 2)) {
    return 'attention'
  }
  if (/spread|crowding|weed|vine growth|wind bends/i.test(space.watchFor)) {
    return 'attention'
  }

  return 'stable'
}

export function conditionLabelFor(kind: GardenZoneCondition): string {
  switch (kind) {
    case 'stable':
      return 'Stable'
    case 'needs_water':
      return 'Needs water'
    case 'attention':
      return 'Needs attention'
    case 'critical':
      return 'Needs urgent care'
  }
}

/** Plantings that still want regular checks; blooming counts lighter. */
export function computeOpenTaskCount(space: DemoGardenSpace): number {
  const plantingChecks = space.plantings.filter((p) => p.status !== 'blooming').length
  const rhythm = space.weeklyAction.trim().length > 0 ? 1 : 0
  return plantingChecks + rhythm
}

export function aggregatePlantingCount(spaces: DemoGardenSpace[]): number {
  return spaces.reduce((acc, s) => acc + s.plantings.length, 0)
}
