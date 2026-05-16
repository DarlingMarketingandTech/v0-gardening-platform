import type {
  DemoGardenSpace,
  DemoGardenSpaceGroup,
  GardenSpaceForecastSensitivity,
  GardenSpaceLightProfile,
  GardenSpaceSetupHints,
} from '@/lib/demo-garden'
import type { GardenSetupProfile, GardenSkillLevel, SunLevel } from './types'
import { indoorSpaceOptions, outdoorSpaceOptions } from './questions'
import { getZoneTemplateMeta } from './zone-templates'

const outdoorTemplateById = new Map(outdoorSpaceOptions.map((d) => [d.id, d.templateId]))
const indoorTemplateById = new Map(indoorSpaceOptions.map((d) => [d.id, d.templateId]))

const sunCopy: Record<SunLevel, { bestFor: string; watchFor: string; weekly: string }> = {
  low: {
    bestFor: 'Leafy greens, shade-tolerant herbs, and calm indoor-style plants that prefer gentler light.',
    watchFor: 'Stretching toward light, pale leaves, or slow growth when shade lasts most of the day.',
    weekly: 'Rotate pots or trays a quarter turn so every side gets a fair share of light.',
  },
  'bright-indirect': {
    bestFor: 'Herbs on a sill, pothos, and foliage that loves steady light without harsh noon beams.',
    watchFor: 'Leaves fading if the spot drifts into deep shade, or crisping if summer sun swings too strong.',
    weekly: 'Dust leaves lightly so the plant can drink in every bit of available light.',
  },
  mid: {
    bestFor: 'Most vegetables, flowering herbs, and houseplants that like bright but not harsh sun.',
    watchFor: 'Midday wilting on hot days, or uneven growth if one side of the space is brighter.',
    weekly: 'Check soil moisture at finger depth before watering — mid sun dries soil at different speeds.',
  },
  high: {
    bestFor: 'Tomatoes, peppers, sun-loving herbs, and succulents that want strong light.',
    watchFor: 'Containers drying out quickly, leaf scorch in heat waves, and fast weed growth.',
    weekly: 'Water deeply in the morning on hot weeks so roots stay cool into the afternoon.',
  },
}

const AREA_TYPE_BY_TEMPLATE: Record<string, { outdoor: string; indoor: string }> = {
  patio: { outdoor: 'Patio & porch pots', indoor: 'Outdoor pots' },
  raised: { outdoor: 'Raised bed', indoor: 'Raised bed' },
  backyard: { outdoor: 'Backyard bed', indoor: 'Backyard bed' },
  inground: { outdoor: 'In-ground bed', indoor: 'In-ground bed' },
  balcony: { outdoor: 'Balcony', indoor: 'Balcony' },
  containers: { outdoor: 'Deck & porch containers', indoor: 'Containers' },
  greenhouse: { outdoor: 'Greenhouse', indoor: 'Greenhouse' },
  pollinator: { outdoor: 'Pollinator strip', indoor: 'Pollinator strip' },
  kitchen: { outdoor: 'Kitchen area', indoor: 'Kitchen windowsill' },
  living: { outdoor: 'Indoor shelf', indoor: 'Indoor shelf' },
  bath: { outdoor: 'Bath corner', indoor: 'Bath corner' },
  bedroom: { outdoor: 'Bedroom sill', indoor: 'Bedroom windowsill' },
}

const WATCH_PREFIX_BY_TEMPLATE: Partial<Record<string, string>> = {
  patio: 'Small pots dry out sooner than in-ground soil — ',
  balcony: 'Wind and sun off the railing can pull moisture quickly — ',
  containers: 'Grouped pots catch more sun and air on all sides — ',
  raised: 'Lifted soil drains after rain but can still warm fast — ',
  backyard: 'Open sky means rain and frost reach the leaves you tend — ',
  inground: 'Native soil holds rain longer than pots — still watch edges after storms — ',
  greenhouse: 'Warm enclosed air can sneak up on tender starts — ',
  pollinator: 'Open edges meet weather first — ',
  kitchen: 'A bright sill is cozy, but light shifts with the seasons — ',
  living: 'Back from the window, light falls off faster than it feels — ',
  bath: 'Humidity helps leaves, but soil can stay wet longer — ',
  bedroom: 'Gentler light asks for a slower watering rhythm — ',
}

function skillTone(skill: GardenSkillLevel): string {
  if (skill === 'beginner') return 'Keep it simple this week — one clear action is enough.'
  if (skill === 'comfortable') return 'You can layer one care task with one observation pass.'
  return 'You already read the garden well — focus on timing and prevention.'
}

function resolveOutdoorTemplateId(space: { id: string; templateId?: string }): string {
  const fromDraftId = outdoorTemplateById.get(space.id)
  if (fromDraftId) return fromDraftId
  const raw = space.templateId?.trim()
  return raw && raw.length > 0 ? raw : 'patio'
}

function resolveIndoorTemplateId(space: { id: string; templateId?: string }): string {
  const fromDraftId = indoorTemplateById.get(space.id)
  if (fromDraftId) return fromDraftId
  const raw = space.templateId?.trim()
  return raw && raw.length > 0 ? raw : 'living'
}

/** Exported for docs / manual QA — deterministic setup → forecast flags. */
export function forecastSensitivityForTemplate(
  templateId: string,
  group: DemoGardenSpaceGroup,
): GardenSpaceForecastSensitivity {
  if (group === 'indoor') {
    return {
      driesFast: false,
      rainExposed: false,
      heatSensitive: false,
      frostSensitive: false,
      protectedIndoor: true,
    }
  }

  const t = templateId
  const base: GardenSpaceForecastSensitivity = {
    driesFast: false,
    rainExposed: false,
    heatSensitive: false,
    frostSensitive: false,
    protectedIndoor: false,
  }

  if (t === 'patio' || t === 'balcony' || t === 'containers') {
    return { ...base, driesFast: true, heatSensitive: true, frostSensitive: true }
  }
  if (t === 'raised' || t === 'backyard' || t === 'inground' || t === 'pollinator') {
    return { ...base, rainExposed: true, frostSensitive: true }
  }
  if (t === 'greenhouse') {
    return { ...base, heatSensitive: true }
  }
  return { ...base, frostSensitive: true }
}

/** Exported for docs — human area label for zone cards. */
export function areaTypeLabelForSetupTemplate(templateId: string, group: DemoGardenSpaceGroup): string {
  const row = AREA_TYPE_BY_TEMPLATE[templateId]
  if (row) return group === 'outdoor' ? row.outdoor : row.indoor
  return group === 'outdoor' ? 'Outdoor space' : 'Indoor space'
}

function beginnerLine(
  skill: GardenSkillLevel,
  group: DemoGardenSpaceGroup,
  templateId: string,
  light: SunLevel,
): string {
  const lightNote =
    light === 'high'
      ? 'On bright days, peek at soil in the morning before the heat picks up.'
      : light === 'low'
        ? 'Let the soil go slightly dry between drinks so roots still breathe.'
        : 'Use your fingertip in the soil as the honest “when to water” signal.'

  if (group === 'indoor') {
    if (templateId === 'kitchen')
      return skill === 'beginner'
        ? 'Snip herbs little and often — small cuts keep the plant bushy and forgiving.'
        : 'Rotate pots weekly so growth stays even as the light path shifts.'
    if (templateId === 'bath')
      return skill === 'beginner'
        ? 'Check that pots drain well — humid air slows surface drying more than you expect.'
        : 'Lift pots after watering to be sure saucers empty so roots do not sit wet.'
    return skill === 'beginner'
      ? 'One calm pass a week beats a big overhaul — steady rhythm wins indoors.'
      : 'Match watering to the room’s light, not the calendar alone.'
  }

  if (templateId === 'patio' || templateId === 'balcony' || templateId === 'containers') {
    return skill === 'beginner'
      ? 'Containers tell the truth fast — lift the lightest pot when unsure, then soak if needed.'
      : `${lightNote} Wind days count double for drying.`
  }
  if (templateId === 'raised' || templateId === 'backyard' || templateId === 'inground') {
    return skill === 'beginner'
      ? 'After rain, check the top inch before watering — beds often hold more than they look.'
      : 'Walk the bed edge after storms — mulch and ties are cheap insurance.'
  }
  if (templateId === 'greenhouse') {
    return skill === 'beginner'
      ? 'If the air feels heavy or leaves look soft, crack ventilation before problems stack up.'
      : 'Track mid-day warmth — a few degrees above outside still matters to tender starts.'
  }
  if (templateId === 'pollinator') {
    return skill === 'beginner'
      ? 'Let a few blooms go to seed on purpose — pollinators read that as an open invitation.'
      : 'Deadhead gently where you want tidy, leave blooms where you want buzz.'
  }
  return skill === 'beginner'
    ? 'One lap of your spaces today is enough to spot the one thing that actually needs you.'
    : lightNote
}

function buildSetupHints(args: {
  templateId: string
  group: DemoGardenSpaceGroup
  lightProfile: GardenSpaceLightProfile
  skill: GardenSkillLevel
}): GardenSpaceSetupHints {
  const { templateId, group, lightProfile, skill } = args
  return {
    templateId,
    areaTypeLabel: areaTypeLabelForSetupTemplate(templateId, group),
    lightProfile,
    forecast: forecastSensitivityForTemplate(templateId, group),
    beginnerRecommendation: beginnerLine(skill, group, templateId, lightProfile),
  }
}

function makeSpace(args: {
  id: string
  group: DemoGardenSpaceGroup
  title: string
  description: string
  sun: SunLevel
  skill: GardenSkillLevel
  templateId: string
  draftId: string
  setupHints: GardenSpaceSetupHints
}): DemoGardenSpace {
  const copy = sunCopy[args.sun]
  const templateMeta = getZoneTemplateMeta({
    id: args.draftId,
    title: args.title,
    templateId: args.templateId,
  })
  const watchPrefix = WATCH_PREFIX_BY_TEMPLATE[args.templateId] ?? ''
  const bestFor = `${templateMeta.bestFor} ${copy.bestFor}`.trim()
  const watchFor = `${watchPrefix}${copy.watchFor}`.trim()
  const weeklyAction = `${copy.weekly} ${skillTone(args.skill)} — ${args.setupHints.beginnerRecommendation}`

  return {
    id: args.id as DemoGardenSpace['id'],
    group: args.group,
    title: args.title,
    description: args.description,
    bestFor,
    watchFor,
    weeklyAction,
    plantings: [],
    setupHints: args.setupHints,
  }
}

export function buildSpacesFromProfile(profile: GardenSetupProfile): DemoGardenSpace[] {
  const spaces: DemoGardenSpace[] = []

  for (const space of profile.outdoorSpaces) {
    const templateId = resolveOutdoorTemplateId(space)
    const sun = space.sunLevel
    const hints = buildSetupHints({
      templateId,
      group: 'outdoor',
      lightProfile: sun as GardenSpaceLightProfile,
      skill: profile.skillLevel,
    })
    spaces.push(
      makeSpace({
        id: `user-outdoor-${space.id}`,
        group: 'outdoor',
        title: space.title,
        description: `${space.title} outdoors at ${profile.locationLabel}. Sun is mostly ${sun}.`,
        sun,
        skill: profile.skillLevel,
        templateId,
        draftId: space.id,
        setupHints: hints,
      }),
    )
  }

  for (const space of profile.indoorSpaces) {
    const templateId = resolveIndoorTemplateId(space)
    const sun = space.lightLevel
    const hints = buildSetupHints({
      templateId,
      group: 'indoor',
      lightProfile: sun as GardenSpaceLightProfile,
      skill: profile.skillLevel,
    })
    spaces.push(
      makeSpace({
        id: `user-indoor-${space.id}`,
        group: 'indoor',
        title: space.title,
        description: `${space.title} indoors at ${profile.locationLabel}. Light is mostly ${sun}.`,
        sun,
        skill: profile.skillLevel,
        templateId,
        draftId: space.id,
        setupHints: hints,
      }),
    )
  }

  return spaces
}
