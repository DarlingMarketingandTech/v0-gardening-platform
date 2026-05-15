import { mapBriefToTodayViewModel } from '@/lib/garden-os/mappers/map-brief-to-today-view-model'
import type { TodayViewModel } from '@/lib/garden-os/types'
import type { GardenWeatherState } from '@/lib/garden-os/weather-types'
import type { GardenSpacesSource } from '@/lib/garden-setup/types'

export function assembleTodayViewModel(
  spacesSource: GardenSpacesSource,
  weatherState: GardenWeatherState,
): TodayViewModel {
  return mapBriefToTodayViewModel(spacesSource.spaces, weatherState)
}
