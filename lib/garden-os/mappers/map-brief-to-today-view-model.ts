import { getGardenGreeting } from '@/lib/garden-os/greeting'
import type { TodayViewModel } from '@/lib/garden-os/types'
import type { GardenWeatherState } from '@/lib/garden-os/weather-types'
import type { DemoGardenSpace } from '@/lib/demo-garden'
import { buildTodayBrief } from '@/lib/today-engine'

export function mapBriefToTodayViewModel(
  spaces: DemoGardenSpace[],
  weatherState: GardenWeatherState,
): TodayViewModel {
  return {
    brief: buildTodayBrief({
      spaces,
      weather: weatherState.weather,
    }),
    greeting: getGardenGreeting(),
    weatherState,
  }
}
