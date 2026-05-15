import type { Plant } from '@/lib/types'
import type { DemoGardenSpace, DemoGardenSpaceGroup } from '@/lib/demo-garden'
import type { GardenSpacesSource } from '@/lib/garden-setup/types'
import type { TodayBrief } from '@/lib/today-brief'
import type { GardenWeatherState } from '@/lib/garden-os/weather-types'

export type { GardenWeatherState } from '@/lib/garden-os/weather-types'

export type GardenDestination = 'today' | 'garden' | 'plan' | 'care'

export interface GardenContext {
  householdId: string | null
  isDemo: boolean
  plants: Plant[]
}

export interface TodayViewModel {
  brief: TodayBrief
  greeting: string
  weatherState: GardenWeatherState
}

export type GardenZoneCondition = 'stable' | 'needs_water' | 'attention' | 'critical'

export interface GardenZoneCardPlanting {
  id: string
  name: string
  statusLabel: string
  /** Future: local or CDN thumbnail — omit in demo. */
  imageUrl?: string
}

export interface GardenZoneCard {
  id: string
  group: DemoGardenSpaceGroup
  title: string
  description: string
  bestFor: string
  watchFor: string
  weeklyAction: string
  plantingCount: number
  plantings: GardenZoneCardPlanting[]
  areaTypeLabel: string
  lightExposureLabel: string
  condition: GardenZoneCondition
  conditionLabel: string
  openTaskCount: number
}

/** Header metrics for the Garden tab — all derived from spaces + zone cards. */
export interface GardenOverviewSummary {
  gardenLabel: string | null
  zoneCount: number
  plantingCount: number
  openTaskCount: number
  /** Zones where a Care check would help soon (condition !== stable). */
  activeCareCaseCount: number
  summaryLine: string
}

export interface GardenViewModel {
  householdId: string | null
  spacesSource: GardenSpacesSource
  zoneCards: GardenZoneCard[]
  overview: GardenOverviewSummary
  locationLabel: string | null
  isPersonalized: boolean
}

export type CareToolId = 'plant-check' | 'symptom-check' | 'pest-lookup' | 'plant-identify'

export interface CareToolDescriptor {
  id: CareToolId
  label: string
  description: string
}

export interface CareViewModel {
  householdId: string | null
  spaces: DemoGardenSpace[]
  headline: string
  summary: string
  tools: CareToolDescriptor[]
}

export interface PlanTimelineStep {
  label: string
  placeholderNote: string
}

export interface PlanCropWindow {
  title: string
  description: string
}

export interface PlanViewModel {
  seasonLabel: string
  headline: string
  summary: string
  timelineSteps: PlanTimelineStep[]
  cropWindows: PlanCropWindow[]
  footerNote: string
}
