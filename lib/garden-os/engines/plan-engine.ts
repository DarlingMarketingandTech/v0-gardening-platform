import type { DemoGardenSpace } from '@/lib/demo-garden'
import type {
  PlanCompanionHint,
  PlanConfidence,
  PlanCropWindow,
  PlanGrowingMode,
  PlanOpportunity,
  PlanSeasonSummary,
  PlanTimelineRow,
  PlanTimelineStep,
  PlanViewModel,
} from '@/lib/garden-os/types'
import type { GardenSpacesSource } from '@/lib/garden-setup/types'
import { buildPlanSpaceFits, effectiveTemplateIdForPlan } from '@/lib/garden-os/engines/space-fit-engine'

type SeasonKey = 'winter' | 'spring' | 'summer' | 'fall'

function seasonKeyFromMonth(monthIndex: number): SeasonKey {
  if (monthIndex === 11 || monthIndex <= 1) return 'winter'
  if (monthIndex >= 2 && monthIndex <= 4) return 'spring'
  if (monthIndex >= 5 && monthIndex <= 7) return 'summer'
  return 'fall'
}

function seasonDisplayName(key: SeasonKey): string {
  switch (key) {
    case 'winter':
      return 'Winter'
    case 'spring':
      return 'Spring'
    case 'summer':
      return 'Summer'
    default:
      return 'Fall'
  }
}

function growingModeFromSpaces(spaces: DemoGardenSpace[]): PlanGrowingMode {
  const out = spaces.some((s) => s.group === 'outdoor')
  const inn = spaces.some((s) => s.group === 'indoor')
  if (out && inn) return 'mixed'
  if (out) return 'outdoor'
  if (inn) return 'indoor'
  return 'mixed'
}

function growingModeLabel(mode: PlanGrowingMode): string {
  if (mode === 'mixed') return 'Indoor & outdoor'
  if (mode === 'outdoor') return 'Outdoor growing'
  return 'Indoor growing'
}

function yearRhythmPercent(now: Date): number {
  const start = new Date(now.getFullYear(), 0, 0).getTime()
  const t = now.getTime() - start
  const end = new Date(now.getFullYear() + 1, 0, 0).getTime() - start
  return Math.round((t / end) * 100)
}

function spaceMention(spaces: DemoGardenSpace[]): string {
  const outdoor = spaces.filter((s) => s.group === 'outdoor').slice(0, 2)
  const indoor = spaces.filter((s) => s.group === 'indoor').slice(0, 1)
  const parts: string[] = []
  if (outdoor.length) parts.push(outdoor.map((s) => s.title).join(' and '))
  if (indoor.length) parts.push(`${indoor[0]!.title}`)
  if (parts.length === 0) return 'your spaces'
  return parts.join(' · ')
}

function buildSeasonExplanation(
  season: SeasonKey,
  mode: PlanGrowingMode,
  spaces: DemoGardenSpace[],
  hasRich: boolean,
): string {
  const mention = spaceMention(spaces)
  if (spaces.length === 0) {
    return 'Add outdoor or indoor spaces in garden setup so Plan can line up ideas with the places you actually tend.'
  }

  if (season === 'spring') {
    if (mode === 'indoor')
      return `${mention} can carry herbs and starts while outdoor soil wakes up — keep the plan gentle indoors.`
    if (mode === 'outdoor')
      return `${mention} ${hasRich ? 'are' : 'look'} ready for warm-season sketches — note last frost in your head before committing tender plants.`
    return `${mention} give you both worlds — keep herbs moving inside while outdoor beds ease into warmer nights.`
  }
  if (season === 'summer') {
    if (mode === 'indoor')
      return 'Indoor spots stay steadier than the weather — plan rotations and watering before adding heat-sensitive friends.'
    return `${mention} will ask for water checks more often than the calendar — plan morning glances on hot weeks.`
  }
  if (season === 'fall') {
    return `Cooler air is coming — plan finishes for summer pots and note where ${mention} can take late greens.`
  }
  return `Quiet season — plan light for ${mention}: tidy lists, seed browsing, and slow indoor wins.`
}

function nextFocusFor(season: SeasonKey, mode: PlanGrowingMode): string {
  if (season === 'spring') {
    if (mode === 'indoor') return 'Bright windows: line up herbs and easy starts.'
    if (mode === 'outdoor') return 'Warm-season transplants and last-frost timing.'
    return 'Balance indoor starts with outdoor bed prep.'
  }
  if (season === 'summer') {
    if (mode === 'indoor') return 'Heat indoors: lighter watering rhythm and shade checks.'
    return 'Water rhythm, shade for tender leaves, and succession sowing where there is room.'
  }
  if (season === 'fall') {
    return 'Cool-season greens, garlic thoughts, and tucking pots before frost.'
  }
  return 'Restocking soil, tools, and dreams — keep plans small and kind.'
}

type OppDef = {
  id: string
  templates: string[]
  title: string
  whyItFits: string
  timingLabel: string
  confidence: PlanConfidence
}

const OPPORTUNITY_LIBRARY: OppDef[] = [
  {
    id: 'kitchen-herbs',
    templates: ['kitchen'],
    title: 'Start herbs near the kitchen window',
    whyItFits: 'Snipping distance matters — you will actually use what sits beside the sink.',
    timingLabel: 'This week',
    confidence: 'high',
  },
  {
    id: 'patio-heat',
    templates: ['patio', 'containers', 'balcony'],
    title: 'Plan heat-tolerant patio containers',
    whyItFits: 'Small pots move heat fast — sketch sun backup before the hottest stretch.',
    timingLabel: 'Next 2 weeks',
    confidence: 'medium',
  },
  {
    id: 'raised-veg',
    templates: ['raised', 'backyard', 'inground'],
    title: 'Use raised or open beds for tomatoes or greens',
    whyItFits: 'Beds hold rain and roots differently than pots — worth a simple row map on paper.',
    timingLabel: 'This month',
    confidence: 'high',
  },
  {
    id: 'greenhouse-air',
    templates: ['greenhouse'],
    title: 'Keep greenhouse spaces ventilated on warm days',
    whyItFits: 'Warm air stacks before you feel it — a vent plan saves tender starts.',
    timingLabel: 'Warm afternoons',
    confidence: 'medium',
  },
  {
    id: 'pollinator-strip',
    templates: ['pollinator'],
    title: 'Add pollinator-friendly flowers near outdoor beds',
    whyItFits: 'Blooms beside veg bring helpful visitors without a big redesign.',
    timingLabel: 'Before peak bloom',
    confidence: 'starter',
  },
  {
    id: 'balcony-compact',
    templates: ['balcony'],
    title: 'Plan compact herbs and shallow containers on the balcony',
    whyItFits: 'Wind and weight limits reward a tight plant list with one watering rhythm.',
    timingLabel: 'Next 2 weeks',
    confidence: 'medium',
  },
  {
    id: 'living-shelf',
    templates: ['living', 'bedroom', 'bath'],
    title: 'Group indoor plants by light and water pace',
    whyItFits: 'Shelves read calmer when neighbors want the same care week to week.',
    timingLabel: 'This week',
    confidence: 'starter',
  },
]

function pickOpportunities(spaces: DemoGardenSpace[], limit = 5): PlanOpportunity[] {
  const templateBySpace = new Map(spaces.map((s) => [s.id, effectiveTemplateIdForPlan(s)]))
  const chosen: PlanOpportunity[] = []

  for (const def of OPPORTUNITY_LIBRARY) {
    const match = spaces.find((s) => def.templates.includes(templateBySpace.get(s.id) ?? ''))
    if (match) {
      chosen.push({
        id: def.id,
        title: def.title,
        whyItFits: def.whyItFits,
        bestSpaceName: match.title,
        bestSpaceId: match.id,
        timingLabel: def.timingLabel,
        confidence: def.confidence,
      })
    }
    if (chosen.length >= limit) break
  }

  if (chosen.length < 3 && spaces.length > 0) {
    const filler: PlanOpportunity = {
      id: 'gentle-pass',
      title: 'Sketch one small change per space',
      whyItFits: 'Tiny edits stick better than a giant overhaul — one line per card is enough.',
      bestSpaceName: spaces[0]?.title ?? null,
      bestSpaceId: spaces[0]?.id ?? null,
      timingLabel: 'Whenever you have ten minutes',
      confidence: 'starter',
    }
    if (!chosen.some((c) => c.id === filler.id)) chosen.push(filler)
  }

  return chosen.slice(0, limit)
}

function buildTimelineRows(season: SeasonKey, mode: PlanGrowingMode): PlanTimelineRow[] {
  const indoorNote =
    mode === 'indoor'
      ? 'bright sill or shelf spots'
      : mode === 'mixed'
        ? 'bright indoor nooks'
        : 'indoor starts (if you use them)'
  const outdoorNote = mode === 'outdoor' || mode === 'mixed' ? 'patio pots and open beds' : 'outdoor beds when you add them'

  const w = season === 'winter'
  const sp = season === 'spring'

  return [
    {
      id: 'this-week',
      windowLabel: 'This week',
      recommendedAction:
        sp && mode !== 'outdoor'
          ? `Choose herbs for ${indoorNote}.`
          : sp
            ? 'List seeds and starts you already trust for outdoor warmth.'
            : w
              ? 'Dream in pencil — note one indoor plant you want to understand better.'
              : 'Tidy one corner and note what still makes you happy in each space.',
      spaceTypeHint: indoorNote,
      whyNow: w ? 'Short days reward tiny, sure wins.' : 'Small decisions now prevent crowded shelves later.',
      confidence: 'starter',
    },
    {
      id: 'two-weeks',
      windowLabel: 'Next 2 weeks',
      recommendedAction:
        mode === 'outdoor' || mode === 'mixed'
          ? `Prep ${outdoorNote} before the hottest dry stretch — saucers, mulch, and shade ideas.`
          : 'Refresh potting mix plans and check drainage for anything root-bound.',
      spaceTypeHint: outdoorNote,
      whyNow: 'Containers dry faster than memory — a two-week heads-up is plenty.',
      confidence: 'medium',
    },
    {
      id: 'this-month',
      windowLabel: 'This month',
      recommendedAction:
        sp || season === 'summer'
          ? 'Plan raised or in-ground rows around frost memory — not exact dates, just tender vs tough.'
          : 'Slide cool-season greens into the sketch where summer crops will finish.',
      spaceTypeHint: 'raised or in-ground beds',
      whyNow: 'Beds forgive a slower rhythm than pots if you plan depth and shade.',
      confidence: 'medium',
    },
    {
      id: 'later-season',
      windowLabel: 'Later this season',
      recommendedAction:
        'Leave room for flowers or pollinator-friendly blooms beside food — color supports the whole yard.',
      spaceTypeHint: 'edges and borders',
      whyNow: 'Planning edges early keeps paths clear when vines wake up.',
      confidence: 'starter',
    },
  ]
}

function buildCropWindows(season: SeasonKey): PlanCropWindow[] {
  if (season === 'spring' || season === 'winter') {
    return [
      {
        title: 'Cool-season greens and roots',
        description: 'Lettuce, spinach, peas, and radishes — sketch sowing beats before warm nights settle.',
      },
      {
        title: 'Warm-season favorites (on deck)',
        description: 'Tomatoes, peppers, and basil — mark transplant week as a question, not a deadline.',
      },
    ]
  }
  if (season === 'summer') {
    return [
      {
        title: 'Heat-tolerant picks',
        description: 'Basil, peppers, beans, and cherry tomatoes — plan shade partners for August.',
      },
      {
        title: 'Succession and gaps',
        description: 'Where a spring crop fades, pencil a fast green or cover crop instead of leaving soil bare.',
      },
    ]
  }
  return [
    {
      title: 'Late color and pollinators',
      description: 'Asters, zinnias, or native blooms — light planning now saves rushed buys later.',
    },
    {
      title: 'Put the garden to bed',
      description: 'Mulch, garlic thoughts, and tool cleanup — calm closures make spring feel lighter.',
    },
  ]
}

function buildCompanionHints(): PlanCompanionHint[] {
  return [
    {
      id: 'herb-tomato',
      title: 'Herbs near tomatoes',
      body: 'Basil and parsley are friendly neighbors in planning sketches — keep airflow in mind so leaves do not stay wet overnight.',
      tone: 'pairing',
    },
    {
      id: 'flowers-beds',
      title: 'Flowers beside food',
      body: 'A thin flower strip near outdoor beds can welcome pollinators without crowding your harvest path.',
      tone: 'pollinator',
    },
    {
      id: 'container-crowd',
      title: 'Containers need elbow room',
      body: 'Plan one finger of space between pots for air and watering — overcrowding is a summer regret, not a winter one.',
      tone: 'spacing',
    },
    {
      id: 'water-band',
      title: 'Group by thirst',
      body: 'When pots share a tray, they should also share a watering rhythm — planning hints, not hard rules.',
      tone: 'water',
    },
  ]
}

function planConfidenceForContext(
  isPersonalized: boolean,
  hasRich: boolean,
  spaces: DemoGardenSpace[],
): PlanConfidence {
  if (isPersonalized && hasRich && spaces.length > 0) return 'high'
  if (spaces.length >= 3) return 'medium'
  return 'starter'
}

export function buildPlanViewModel(spacesSource: GardenSpacesSource): PlanViewModel {
  const now = new Date()
  const monthIndex = now.getMonth()
  const monthName = now.toLocaleString('en-US', { month: 'long' })
  const seasonKey = seasonKeyFromMonth(monthIndex)
  const seasonWord = seasonDisplayName(seasonKey)
  const spaces = spacesSource.spaces
  const profile = spacesSource.profile
  const locationLabel = profile?.locationLabel?.trim() || null
  const mode = growingModeFromSpaces(spaces)
  const hasRich =
    spaces.length > 0 && spaces.filter((s) => Boolean(s.setupHints)).length >= Math.ceil(spaces.length / 2)

  const confidence = planConfidenceForContext(spacesSource.isPersonalized, hasRich, spaces)

  const seasonSummary: PlanSeasonSummary = {
    seasonEyebrow: locationLabel ? `${monthName} · ${locationLabel}` : `${monthName} · ${seasonWord} rhythm`,
    headline: `${seasonWord} planning mode`,
    monthName,
    locationLabel,
    growingMode: mode,
    growingModeLabel: growingModeLabel(mode),
    nextFocus: nextFocusFor(seasonKey, mode),
    confidence,
    explanation: buildSeasonExplanation(seasonKey, mode, spaces, hasRich),
    rhythmPercent: yearRhythmPercent(now),
  }

  const opportunities = pickOpportunities(spaces, 5)
  const spaceFits = buildPlanSpaceFits(spaces)
  const timelineRows = buildTimelineRows(seasonKey, mode)
  const companionHints = buildCompanionHints()
  const cropWindows = buildCropWindows(seasonKey)

  const timelineSteps: PlanTimelineStep[] = timelineRows.map((row) => ({
    label: row.windowLabel,
    placeholderNote: `${row.recommendedAction} ${row.whyNow}`,
  }))

  const headline = seasonSummary.headline
  const summary = seasonSummary.explanation
  const seasonLabel = seasonSummary.seasonEyebrow

  return {
    seasonLabel,
    headline,
    summary,
    timelineSteps,
    cropWindows,
    footerNote:
      'Saved plans will live here later — for now this page is a calm sketchpad tied to your spaces. Nothing writes to the database yet.',
    seasonSummary,
    opportunities,
    spaceFits,
    timelineRows,
    companionHints,
    hasRichSpaceMetadata: hasRich,
  }
}
