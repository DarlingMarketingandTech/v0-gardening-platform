import { mapSpacesToZoneCards } from '@/lib/garden-os/mappers/map-space-to-zone-card'
import { aggregatePlantingCount } from '@/lib/garden-os/mappers/derive-zone-from-space'
import type { GardenOverviewSummary, GardenViewModel, GardenZoneCard } from '@/lib/garden-os/types'
import type { GardenSpacesSource } from '@/lib/garden-setup/types'

function buildOverviewSummary(spacesSource: GardenSpacesSource, zoneCards: GardenZoneCard[]): GardenOverviewSummary {
  const profile = spacesSource.profile
  const gardenLabel = profile?.displayName?.trim() || profile?.locationLabel?.trim() || null

  const zoneCount = zoneCards.length
  const plantingCount = aggregatePlantingCount(spacesSource.spaces)
  const openTaskCount = zoneCards.reduce((acc, z) => acc + z.openTaskCount, 0)
  const activeCareCaseCount = zoneCards.filter((z) => z.condition !== 'stable').length

  let summaryLine: string
  if (zoneCount === 0) {
    summaryLine = 'Add a space to start mapping your zones and plants.'
  } else if (plantingCount === 0) {
    summaryLine = `${zoneCount} zone${zoneCount === 1 ? '' : 's'} ready — plant when you are.`
  } else {
    summaryLine = `${zoneCount} zone${zoneCount === 1 ? '' : 's'}, ${plantingCount} plant${plantingCount === 1 ? '' : 's'}`
    if (openTaskCount > 0) {
      summaryLine += ` · ${openTaskCount} gentle task${openTaskCount === 1 ? '' : 's'} on your radar`
    }
    if (activeCareCaseCount > 0) {
      summaryLine += ` · ${activeCareCaseCount} zone${activeCareCaseCount === 1 ? '' : 's'} could use a Care check`
    } else if (openTaskCount === 0) {
      summaryLine += '. Everything looks calm.'
    }
  }

  return {
    gardenLabel,
    zoneCount,
    plantingCount,
    openTaskCount,
    activeCareCaseCount,
    summaryLine,
  }
}

export function assembleGardenViewModel(
  householdId: string | null,
  spacesSource: GardenSpacesSource,
): GardenViewModel {
  const zoneCards = mapSpacesToZoneCards(spacesSource.spaces)
  const overview = buildOverviewSummary(spacesSource, zoneCards)

  return {
    householdId,
    spacesSource,
    zoneCards,
    overview,
    locationLabel: spacesSource.profile?.locationLabel ?? null,
    isPersonalized: spacesSource.isPersonalized,
  }
}
