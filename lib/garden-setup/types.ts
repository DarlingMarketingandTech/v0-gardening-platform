import type { DemoGardenSpace } from '@/lib/demo-garden'

export type GardenSkillLevel = 'beginner' | 'comfortable' | 'confident'
/** Light / sun intensity saved on each space (localStorage profile). */
export type SunLevel = 'low' | 'bright-indirect' | 'mid' | 'high'
export type NotifyFrequency = 'daily' | 'important' | 'weekly'
export type NotifyChannel = 'email' | 'sms' | 'app'

export interface SetupSpaceDraft {
  id: string
  title: string
  /** If missing on older saved profiles, `build-spaces` infers from `id`. */
  templateId?: string
}

export interface GardenSetupProfile {
  version: 1
  completedAt: string
  displayName?: string
  locationLabel: string
  skillLevel: GardenSkillLevel
  growsOutdoor: boolean
  growsIndoor: boolean
  outdoorSpaces: Array<SetupSpaceDraft & { sunLevel: SunLevel }>
  indoorSpaces: Array<SetupSpaceDraft & { lightLevel: SunLevel }>
  notifications: {
    topics: string[]
    channels: NotifyChannel[]
    frequency: NotifyFrequency
  }
}

export type GardenSpacesSource = {
  spaces: DemoGardenSpace[]
  isPersonalized: boolean
  profile: GardenSetupProfile | null
}
