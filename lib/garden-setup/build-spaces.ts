import type { DemoGardenSpace, DemoGardenSpaceGroup } from '@/lib/demo-garden'
import type { GardenSetupProfile, GardenSkillLevel, SunLevel } from './types'

const sunCopy: Record<SunLevel, { bestFor: string; watchFor: string; weekly: string }> = {
  low: {
    bestFor: 'Leafy greens, shade-tolerant herbs, and calm indoor-style plants that prefer gentler light.',
    watchFor: 'Stretching toward light, pale leaves, or slow growth when shade lasts most of the day.',
    weekly: 'Rotate pots or trays a quarter turn so every side gets a fair share of light.',
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

function skillTone(skill: GardenSkillLevel): string {
  if (skill === 'beginner') return 'Keep it simple this week — one clear action is enough.'
  if (skill === 'comfortable') return 'You can layer one care task with one observation pass.'
  return 'You already read the garden well — focus on timing and prevention.'
}

function makeSpace(
  id: string,
  group: DemoGardenSpaceGroup,
  title: string,
  description: string,
  sun: SunLevel,
  skill: GardenSkillLevel,
): DemoGardenSpace {
  const copy = sunCopy[sun]
  return {
    id: id as DemoGardenSpace['id'],
    group,
    title,
    description,
    bestFor: copy.bestFor,
    watchFor: copy.watchFor,
    weeklyAction: `${copy.weekly} ${skillTone(skill)}`,
    plantings: [],
  }
}

export function buildSpacesFromProfile(profile: GardenSetupProfile): DemoGardenSpace[] {
  const spaces: DemoGardenSpace[] = []

  for (const space of profile.outdoorSpaces) {
    spaces.push(
      makeSpace(
        `user-outdoor-${space.id}`,
        'outdoor',
        space.title,
        `${space.title} at ${profile.locationLabel}. Sun is mostly ${space.sunLevel}.`,
        space.sunLevel,
        profile.skillLevel,
      ),
    )
  }

  for (const space of profile.indoorSpaces) {
    spaces.push(
      makeSpace(
        `user-indoor-${space.id}`,
        'indoor',
        space.title,
        `${space.title} indoors at ${profile.locationLabel}. Light is mostly ${space.lightLevel}.`,
        space.lightLevel,
        profile.skillLevel,
      ),
    )
  }

  return spaces
}
