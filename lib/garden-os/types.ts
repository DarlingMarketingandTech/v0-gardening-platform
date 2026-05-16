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

export type TodayForecastSpaceTone = 'stable' | 'watch' | 'water' | 'attention'

export interface TodayForecastSpaceCheck {
  id: string
  name: string
  areaTypeLabel: string
  /** User-facing zone condition (Stable, Needs water, …). */
  condition: string
  impactLabel: string
  recommendation: string
  tone: TodayForecastSpaceTone
  plantCount?: number
  openTaskCount?: number
}

export interface TodayWeatherBrief {
  headline: string
  summary: string
  forecastImpact: string
  chips: string[]
  spaceChecks: TodayForecastSpaceCheck[]
}

export interface TodayInsightCard {
  label: string
  title: string
  body: string
}

export interface TodayInsightsRowModel {
  watch: TodayInsightCard
  progress: TodayInsightCard
  upcoming: TodayInsightCard
}

export interface TodayViewModel {
  brief: TodayBrief
  greeting: string
  weatherState: GardenWeatherState
  weatherBrief: TodayWeatherBrief
  insights: TodayInsightsRowModel
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

export type PlanGrowingMode = 'indoor' | 'outdoor' | 'mixed'

/** How strongly Plan can tie copy to your spaces (no weather / DB in Phase 8A). */
export type PlanConfidence = 'high' | 'medium' | 'starter'

export interface PlanSeasonSummary {
  /** Short eyebrow, e.g. "May · Spring rhythm" */
  seasonEyebrow: string
  /** Main line, e.g. "Spring planning mode" */
  headline: string
  monthName: string
  locationLabel: string | null
  growingMode: PlanGrowingMode
  /** Plain language, e.g. "Indoor & outdoor" */
  growingModeLabel: string
  nextFocus: string
  confidence: PlanConfidence
  /** Supporting paragraph under the hero */
  explanation: string
  /** 0–100 year rhythm for a soft progress meter (no weather). */
  rhythmPercent: number
}

export interface PlanOpportunity {
  id: string
  title: string
  whyItFits: string
  bestSpaceName: string | null
  bestSpaceId: string | null
  timingLabel: string
  confidence: PlanConfidence
}

export interface PlanSpaceFit {
  spaceId: string
  spaceTitle: string
  group: 'indoor' | 'outdoor'
  areaTypeLabel: string
  bestFor: string
  watchFor: string
  lightExposureLabel: string
  planningSuggestion: string
}

export interface PlanTimelineRow {
  id: string
  windowLabel: string
  recommendedAction: string
  spaceTypeHint: string
  whyNow: string
  confidence: PlanConfidence
}

export interface PlanCompanionHint {
  id: string
  title: string
  body: string
  tone: 'pairing' | 'spacing' | 'water' | 'pollinator'
}

export interface PlanViewModel {
  seasonLabel: string
  headline: string
  summary: string
  timelineSteps: PlanTimelineStep[]
  cropWindows: PlanCropWindow[]
  footerNote: string
  /** Phase 8A — season + growing context from date + spaces (always built). */
  seasonSummary: PlanSeasonSummary
  opportunities: PlanOpportunity[]
  spaceFits: PlanSpaceFit[]
  timelineRows: PlanTimelineRow[]
  companionHints: PlanCompanionHint[]
  /** True when most spaces carry `setupHints` from garden setup. */
  hasRichSpaceMetadata: boolean
}
