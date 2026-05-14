import type { DemoGardenPlanting, DemoGardenSpace } from '@/lib/demo-garden'

export type TodayBriefItemKind =
  | 'water'
  | 'support'
  | 'harvest'
  | 'bloom'
  | 'indoor'
  | 'weather'
  | 'tidy'

export interface TodayBriefWeather {
  temperature: number
  weatherCode: number
  humidity: number
  precipitation: number
  windSpeed: number
  uvIndex: number
  daily: Array<{
    tempMax: number
    tempMin: number
    precipitationSum: number
    weatherCode: number
  }>
}

export interface TodayBriefItem {
  id: string
  title: string
  body: string
  reason: string
  kind: TodayBriefItemKind
  spaceTitle?: string
  plantingName?: string
}

export interface TodayBrief {
  bestAction: TodayBriefItem
  secondaryTasks: TodayBriefItem[]
  watchOut: TodayBriefItem
  milestone: TodayBriefItem
  whyThisMatters: string
  contextLabel: string
}

interface BuildTodayBriefInput {
  spaces: DemoGardenSpace[]
  weather?: TodayBriefWeather | null
  date?: Date
}

interface WeatherFlags {
  hot: boolean
  dry: boolean
  rainy: boolean
  windy: boolean
  cold: boolean
  lowIndoorHumidity: boolean
  warmSeason: boolean
}

interface ScoredBriefItem extends TodayBriefItem {
  priority: number
}

export function buildTodayBrief({
  spaces,
  weather,
  date = new Date(),
}: BuildTodayBriefInput): TodayBrief {
  const flags = getWeatherFlags(weather, date)
  const candidates = [
    containerWaterRule(spaces, flags),
    trellisSupportRule(spaces, flags),
    readySoonHarvestRule(spaces, flags),
    pollinatorBloomRule(spaces),
    indoorMoistureRule(spaces, flags),
    bedEdgeTidyRule(spaces, flags),
  ]
    .filter(isScoredBriefItem)
    .sort((a, b) => b.priority - a.priority)

  const bestAction = candidates[0] ?? fallbackAction(spaces)
  const secondaryTasks = candidates
    .filter((item) => item.id !== bestAction.id)
    .slice(0, 2)
    .map(stripPriority)

  return {
    bestAction: stripPriority(bestAction),
    secondaryTasks,
    watchOut: buildWatchOut(spaces, flags),
    milestone: buildMilestone(spaces, flags),
    whyThisMatters: bestAction.reason,
    contextLabel: weather
      ? `${spaces.length} spaces, checked against today's forecast`
      : `${spaces.length} demo spaces, using the garden rhythm until weather loads`,
  }
}

function getWeatherFlags(weather: TodayBriefWeather | null | undefined, date: Date): WeatherFlags {
  const today = weather?.daily[0]
  const highTemp = Math.max(weather?.temperature ?? 72, today?.tempMax ?? 72)
  const precipitation = Math.max(weather?.precipitation ?? 0, today?.precipitationSum ?? 0)
  const weatherCode = today?.weatherCode ?? weather?.weatherCode ?? 0
  const month = date.getMonth()

  return {
    hot: highTemp >= 86 || (weather?.uvIndex ?? 0) >= 8,
    dry: precipitation < 0.2 && (weather?.humidity ?? 55) <= 60,
    rainy: precipitation >= 1 || isRainCode(weatherCode),
    windy: (weather?.windSpeed ?? 0) >= 18,
    cold: Math.min(weather?.temperature ?? 60, today?.tempMin ?? 60) <= 40,
    lowIndoorHumidity: (weather?.humidity ?? 55) < 45,
    warmSeason: month >= 4 && month <= 8,
  }
}

function containerWaterRule(spaces: DemoGardenSpace[], flags: WeatherFlags): ScoredBriefItem | null {
  const space = spaces.find((item) => item.id === 'patio-pots')
  if (!space || flags.rainy) return null

  const planting = space.plantings.find((item) => item.status === 'ready-soon') ?? space.plantings[0]

  return {
    id: 'container-water',
    priority: flags.hot && flags.dry ? 100 : flags.dry ? 76 : 55,
    title: 'Check the patio pots before dinner',
    body: 'Lift the lightest basil or pepper pot. Water only if it feels light or the top inch is dry.',
    reason: 'Containers dry out faster than beds, and steady moisture helps herbs and peppers keep growing without stress.',
    kind: 'water',
    spaceTitle: space.title,
    plantingName: planting?.name,
  }
}

function trellisSupportRule(spaces: DemoGardenSpace[], flags: WeatherFlags): ScoredBriefItem | null {
  const space = spaces.find((item) => item.id === 'raised-bed-trellis')
  if (!space) return null

  const planting = space.plantings.find((item) => item.status === 'growing') ?? space.plantings[0]

  return {
    id: 'trellis-support',
    priority: flags.windy ? 86 : flags.warmSeason ? 70 : 52,
    title: 'Tuck one vine onto the trellis',
    body: 'Guide the cucumber or bean runners upward while the stems are still flexible.',
    reason: 'A quick tie or tuck now keeps vining crops supported before wind and weight bend them sideways.',
    kind: 'support',
    spaceTitle: space.title,
    plantingName: planting?.name,
  }
}

function readySoonHarvestRule(spaces: DemoGardenSpace[], flags: WeatherFlags): ScoredBriefItem | null {
  const match = findPlanting(spaces, (planting) => planting.status === 'ready-soon')
  if (!match) return null

  const harvestName = match.planting.variety ?? match.planting.name

  return {
    id: 'ready-soon-harvest',
    priority: flags.warmSeason ? 74 : 58,
    title: `Check ${harvestName} for harvest size`,
    body: 'Look for full size, firm fruit, and any color change so the plant keeps producing.',
    reason: 'Harvesting close-to-ready crops at the right moment rewards the garden and encourages more growth.',
    kind: 'harvest',
    spaceTitle: match.space.title,
    plantingName: match.planting.name,
  }
}

function pollinatorBloomRule(spaces: DemoGardenSpace[]): ScoredBriefItem | null {
  const match = findPlanting(spaces, (planting) => planting.status === 'blooming')
  if (!match) return null

  return {
    id: 'pollinator-bloom',
    priority: 50,
    title: 'Deadhead a short stretch of blooms',
    body: 'Clip a few spent flowers in the pollinator border and leave the fresh blooms for bees.',
    reason: 'A small deadheading pass keeps flowers coming without turning the border into a chore.',
    kind: 'bloom',
    spaceTitle: match.space.title,
    plantingName: match.planting.name,
  }
}

function indoorMoistureRule(spaces: DemoGardenSpace[], flags: WeatherFlags): ScoredBriefItem | null {
  const space = spaces.find((item) => item.id === 'bathroom-fern-corner')
  const planting = space?.plantings[0]
  if (!space || !planting) return null

  return {
    id: 'indoor-moisture',
    priority: flags.lowIndoorHumidity ? 66 : 44,
    title: 'Give the fern a fingertip moisture check',
    body: 'Keep it lightly damp, then pour off any water resting in the saucer.',
    reason: 'Humidity-loving indoor plants want steady moisture, but sitting in stale water can still bother roots.',
    kind: 'indoor',
    spaceTitle: space.title,
    plantingName: planting.name,
  }
}

function bedEdgeTidyRule(spaces: DemoGardenSpace[], flags: WeatherFlags): ScoredBriefItem | null {
  const space = spaces.find((item) => item.id === 'in-ground-bed')
  if (!space) return null

  return {
    id: 'bed-edge-tidy',
    priority: flags.rainy ? 68 : 38,
    title: 'Pull the obvious weeds along one bed edge',
    body: 'Do one slow pass around the in-ground bed and stop there.',
    reason: 'A tiny weed pass after soft soil saves bigger work later without making Today feel like a project.',
    kind: 'tidy',
    spaceTitle: space.title,
  }
}

function buildWatchOut(spaces: DemoGardenSpace[], flags: WeatherFlags): TodayBriefItem {
  const patio = spaces.find((item) => item.id === 'patio-pots')
  const trellis = spaces.find((item) => item.id === 'raised-bed-trellis')
  const bed = spaces.find((item) => item.id === 'in-ground-bed')
  const fern = spaces.find((item) => item.id === 'bathroom-fern-corner')

  if (flags.hot && flags.dry && patio) {
    return {
      id: 'watch-hot-pots',
      title: 'Patio pots can dry fast today',
      body: 'Concrete, sun, and warm air can dry containers before the beds look thirsty.',
      reason: patio.watchFor,
      kind: 'water',
      spaceTitle: patio.title,
    }
  }

  if (flags.rainy && bed) {
    return {
      id: 'watch-rain-bed',
      title: 'Let wet soil settle before working it',
      body: 'After rain, check for weeds and puddling but avoid stepping into soft bed soil.',
      reason: bed.watchFor,
      kind: 'weather',
      spaceTitle: bed.title,
    }
  }

  if (flags.windy && trellis) {
    return {
      id: 'watch-wind-trellis',
      title: 'Tender vines may need support',
      body: 'Wind can bend loose cucumber and bean runners before they grab the trellis.',
      reason: trellis.watchFor,
      kind: 'support',
      spaceTitle: trellis.title,
    }
  }

  if (fern) {
    return {
      id: 'watch-fern-water',
      title: 'Damp is good, soggy is not',
      body: 'The fern likes moisture, but brown tips or standing saucer water are worth a quick look.',
      reason: fern.watchFor,
      kind: 'indoor',
      spaceTitle: fern.title,
    }
  }

  return {
    id: 'watch-general',
    title: 'Look for the one thing changing fastest',
    body: 'A quick scan of pots, vines, and blooms is enough for today.',
    reason: 'The brief is meant to point attention, not create a long checklist.',
    kind: 'weather',
  }
}

function buildMilestone(spaces: DemoGardenSpace[], flags: WeatherFlags): TodayBriefItem {
  const readySoon = findPlanting(spaces, (planting) => planting.status === 'ready-soon')
  const blooming = findPlanting(spaces, (planting) => planting.status === 'blooming')
  const trellis = spaces.find((item) => item.id === 'raised-bed-trellis')

  if (readySoon) {
    const harvestName = readySoon.planting.variety ?? readySoon.planting.name

    return {
      id: 'milestone-ready-soon',
      title: `${harvestName} is getting close`,
      body: 'That is the fun part of the week: watch size and color, then pick before the plant slows down.',
      reason: readySoon.planting.careNote,
      kind: 'harvest',
      spaceTitle: readySoon.space.title,
      plantingName: readySoon.planting.name,
    }
  }

  if (blooming) {
    return {
      id: 'milestone-blooming',
      title: 'The pollinator border is doing its job',
      body: 'Fresh blooms mean color for the garden and food for bees and butterflies.',
      reason: blooming.planting.careNote,
      kind: 'bloom',
      spaceTitle: blooming.space.title,
      plantingName: blooming.planting.name,
    }
  }

  if (flags.warmSeason && trellis) {
    return {
      id: 'milestone-warm-vines',
      title: 'Warm-season vines are in their training window',
      body: 'Small, regular support now makes the trellis easier later.',
      reason: trellis.weeklyAction,
      kind: 'support',
      spaceTitle: trellis.title,
    }
  }

  return {
    id: 'milestone-steady',
    title: 'The garden has a steady rhythm today',
    body: 'No big push needed. One careful look-in keeps things moving.',
    reason: 'A calm day is still useful when it keeps attention on the garden.',
    kind: 'weather',
  }
}

function fallbackAction(spaces: DemoGardenSpace[]): ScoredBriefItem {
  const firstOutdoor = spaces.find((space) => space.group === 'outdoor') ?? spaces[0]

  return {
    id: 'fallback-look-in',
    priority: 1,
    title: firstOutdoor ? `Do one quick look-in at ${firstOutdoor.title}` : 'Do one quick garden look-in',
    body: firstOutdoor?.weeklyAction ?? 'Check the healthiest-looking plant and the thirstiest-looking plant.',
    reason: 'A short, focused look keeps the garden familiar without turning Today into a chore list.',
    kind: 'weather',
    spaceTitle: firstOutdoor?.title,
  }
}

function findPlanting(
  spaces: DemoGardenSpace[],
  predicate: (planting: DemoGardenPlanting) => boolean
): { space: DemoGardenSpace; planting: DemoGardenPlanting } | null {
  for (const space of spaces) {
    const planting = space.plantings.find(predicate)
    if (planting) return { space, planting }
  }

  return null
}

function stripPriority(item: ScoredBriefItem): TodayBriefItem {
  const { priority: _priority, ...briefItem } = item
  return briefItem
}

function isScoredBriefItem(item: ScoredBriefItem | null): item is ScoredBriefItem {
  return item !== null
}

function isRainCode(code: number) {
  return (code >= 51 && code <= 67) || (code >= 80 && code <= 82) || code >= 95
}
