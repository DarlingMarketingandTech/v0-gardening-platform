import type { DemoGardenPlanting, DemoGardenSpace } from '@/lib/demo-garden'
import type { GardenZoneCard } from '@/lib/garden-os/types'

const statusLabels: Record<DemoGardenPlanting['status'], string> = {
  'getting-started': 'Getting started',
  growing: 'Growing',
  'ready-soon': 'Ready soon',
  blooming: 'Blooming',
}

export function mapSpaceToZoneCard(space: DemoGardenSpace): GardenZoneCard {
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
  }
}

export function mapSpacesToZoneCards(spaces: DemoGardenSpace[]): GardenZoneCard[] {
  return spaces.map(mapSpaceToZoneCard)
}
