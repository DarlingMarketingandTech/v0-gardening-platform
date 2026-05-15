import type { DemoGardenPlanting, DemoGardenSpace } from '@/lib/demo-garden'
import {
  areaTypeLabelFromGroup,
  computeOpenTaskCount,
  conditionLabelFor,
  deriveZoneCondition,
  inferLightExposureLabel,
} from '@/lib/garden-os/mappers/derive-zone-from-space'
import type { GardenZoneCard } from '@/lib/garden-os/types'

const statusLabels: Record<DemoGardenPlanting['status'], string> = {
  'getting-started': 'Getting started',
  growing: 'Growing',
  'ready-soon': 'Ready soon',
  blooming: 'Blooming',
}

export function mapSpaceToZoneCard(space: DemoGardenSpace): GardenZoneCard {
  const condition = deriveZoneCondition(space)
  return {
    id: space.id,
    group: space.group,
    title: space.title,
    description: space.description,
    bestFor: space.bestFor,
    watchFor: space.watchFor,
    weeklyAction: space.weeklyAction,
    plantingCount: space.plantings.length,
    plantings: space.plantings.map((planting) => ({
      id: planting.id,
      name: planting.name,
      statusLabel: statusLabels[planting.status],
    })),
    areaTypeLabel: areaTypeLabelFromGroup(space.group),
    lightExposureLabel: inferLightExposureLabel(space),
    condition,
    conditionLabel: conditionLabelFor(condition),
    openTaskCount: computeOpenTaskCount(space),
  }
}

export function mapSpacesToZoneCards(spaces: DemoGardenSpace[]): GardenZoneCard[] {
  return spaces.map(mapSpaceToZoneCard)
}
