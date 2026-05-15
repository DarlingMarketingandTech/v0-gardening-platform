import type {
  GardenSetupProfile,
  GardenSkillLevel,
  NotifyChannel,
  NotifyFrequency,
  SetupSpaceDraft,
  SunLevel,
} from './types'

export type SetupStepKind =
  | 'welcome'
  | 'location'
  | 'skill'
  | 'grow-where'
  | 'outdoor-pick'
  | 'outdoor-sun'
  | 'indoor-pick'
  | 'indoor-light'
  | 'notify-topics'
  | 'notify-channels'
  | 'notify-frequency'
  | 'summary'

export interface SetupStep {
  id: string
  kind: SetupStepKind
  spaceId?: string
}

export interface SetupAnswers {
  displayName: string
  locationLabel: string
  skillLevel: GardenSkillLevel | null
  growsOutdoor: boolean
  growsIndoor: boolean
  outdoorDrafts: SetupSpaceDraft[]
  outdoorSun: Record<string, SunLevel>
  indoorDrafts: SetupSpaceDraft[]
  indoorLight: Record<string, SunLevel>
  notifyTopics: string[]
  notifyChannels: NotifyChannel[]
  notifyFrequency: NotifyFrequency | null
}

export const defaultSetupAnswers = (): SetupAnswers => ({
  displayName: '',
  locationLabel: '',
  skillLevel: null,
  growsOutdoor: false,
  growsIndoor: false,
  outdoorDrafts: [],
  outdoorSun: {},
  indoorDrafts: [],
  indoorLight: {},
  notifyTopics: ['watering', 'weather'],
  notifyChannels: ['app'],
  notifyFrequency: 'important',
})

export const outdoorSpaceOptions: SetupSpaceDraft[] = [
  { id: 'patio', title: 'Patio or porch pots', templateId: 'patio' },
  { id: 'raised-bed', title: 'Raised bed', templateId: 'raised' },
  { id: 'in-ground', title: 'In-ground bed', templateId: 'inground' },
  { id: 'pollinator', title: 'Pollinator strip', templateId: 'pollinator' },
]

export const indoorSpaceOptions: SetupSpaceDraft[] = [
  { id: 'kitchen-window', title: 'Kitchen window', templateId: 'kitchen' },
  { id: 'living-shelf', title: 'Living room shelf', templateId: 'living' },
  { id: 'bathroom', title: 'Bathroom corner', templateId: 'bath' },
  { id: 'bedroom-sill', title: 'Bedroom windowsill', templateId: 'bedroom' },
]

export function buildSetupSteps(answers: SetupAnswers): SetupStep[] {
  const steps: SetupStep[] = [
    { id: 'welcome', kind: 'welcome' },
    { id: 'location', kind: 'location' },
    { id: 'skill', kind: 'skill' },
    { id: 'grow-where', kind: 'grow-where' },
  ]

  if (answers.growsOutdoor) {
    steps.push({ id: 'outdoor-pick', kind: 'outdoor-pick' })
    for (const space of answers.outdoorDrafts) {
      steps.push({ id: `outdoor-sun-${space.id}`, kind: 'outdoor-sun', spaceId: space.id })
    }
  }

  if (answers.growsIndoor) {
    steps.push({ id: 'indoor-pick', kind: 'indoor-pick' })
    for (const space of answers.indoorDrafts) {
      steps.push({ id: `indoor-light-${space.id}`, kind: 'indoor-light', spaceId: space.id })
    }
  }

  steps.push(
    { id: 'notify-topics', kind: 'notify-topics' },
    { id: 'notify-channels', kind: 'notify-channels' },
    { id: 'notify-frequency', kind: 'notify-frequency' },
    { id: 'summary', kind: 'summary' },
  )

  return steps
}

export function answersToProfile(answers: SetupAnswers): GardenSetupProfile {
  return {
    version: 1,
    completedAt: new Date().toISOString(),
    displayName: answers.displayName.trim() || undefined,
    locationLabel: answers.locationLabel.trim() || 'My garden',
    skillLevel: answers.skillLevel ?? 'beginner',
    growsOutdoor: answers.growsOutdoor,
    growsIndoor: answers.growsIndoor,
    outdoorSpaces: answers.outdoorDrafts.map((s) => ({
      ...s,
      sunLevel: answers.outdoorSun[s.id] ?? 'mid',
    })),
    indoorSpaces: answers.indoorDrafts.map((s) => ({
      ...s,
      lightLevel: answers.indoorLight[s.id] ?? 'mid',
    })),
    notifications: {
      topics: answers.notifyTopics,
      channels: answers.notifyChannels.length ? answers.notifyChannels : ['app'],
      frequency: answers.notifyFrequency ?? 'important',
    },
  }
}

export function getStepCopy(step: SetupStep, answers: SetupAnswers): { title: string; hint: string } {
  switch (step.kind) {
    case 'welcome':
      return {
        title: 'Welcome — let’s set up your garden notebook.',
        hint: 'One question at a time. You can go back anytime.',
      }
    case 'location':
      return {
        title: 'Where is your garden?',
        hint: 'We use this for weather and seasonal timing.',
      }
    case 'skill':
      return {
        title: 'How would you describe your gardening experience?',
        hint: 'This tunes how much detail we show on Today.',
      }
    case 'grow-where':
      return {
        title: 'Where do you grow plants right now?',
        hint: 'Pick every place that applies.',
      }
    case 'outdoor-pick':
      return {
        title: 'Which outdoor spaces do you tend?',
        hint: 'Choose the areas you want to track.',
      }
    case 'outdoor-sun': {
      const space = answers.outdoorDrafts.find((s) => s.id === step.spaceId)
      return {
        title: `How much sun does ${space?.title ?? 'this space'} get?`,
        hint: 'Think about a typical sunny day in growing season.',
      }
    }
    case 'indoor-pick':
      return {
        title: 'Which indoor plant spots matter to you?',
        hint: 'Rooms, shelves, and windows count as spaces too.',
      }
    case 'indoor-light': {
      const space = answers.indoorDrafts.find((s) => s.id === step.spaceId)
      return {
        title: `How is the light in ${space?.title ?? 'this spot'}?`,
        hint: 'Low is far from a window; high is bright most of the day.',
      }
    }
    case 'notify-topics':
      return {
        title: 'What should we nudge you about?',
        hint: 'You can change this later in Guide.',
      }
    case 'notify-channels':
      return {
        title: 'How would you like gentle reminders?',
        hint: 'In-app works today; email and text are saved for when we turn them on.',
      }
    case 'notify-frequency':
      return {
        title: 'How often should reminders feel right?',
        hint: 'We keep the tone calm — never naggy.',
      }
    case 'summary':
      return {
        title: 'You’re set up. Here’s your garden at a glance.',
        hint: 'Tap finish to open My Garden with your spaces.',
      }
    default:
      return { title: '', hint: '' }
  }
}
