import { assembleTodayViewModel } from '@/lib/garden-os/assemble/assemble-today-view-model'
import { fetchGardenWeather } from '@/lib/garden-os/data/fetch-garden-weather'
import { resolveSpacesSourceForContext } from '@/lib/garden-os/data/resolve-spaces-source'
import type { GardenContext, TodayViewModel } from '@/lib/garden-os/types'

export async function getTodayViewModel(context: GardenContext): Promise<TodayViewModel> {
  const spacesSource = resolveSpacesSourceForContext(context)
  const weatherState = await fetchGardenWeather()
  return assembleTodayViewModel(spacesSource, weatherState)
}
