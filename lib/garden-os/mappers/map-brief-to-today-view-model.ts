import { getGardenGreeting } from '@/lib/garden-os/greeting'
import {
  buildTodayInsightsRow,
  buildTodayWeatherBrief,
} from '@/lib/garden-os/mappers/map-today-weather-brief'
import type { TodayViewModel } from '@/lib/garden-os/types'
import type { GardenWeatherState } from '@/lib/garden-os/weather-types'
import type { DemoGardenSpace } from '@/lib/demo-garden'
import { buildTodayBrief } from '@/lib/today-engine'

export function mapBriefToTodayViewModel(
  spaces: DemoGardenSpace[],
  weatherState: GardenWeatherState,
): TodayViewModel {
  const brief = buildTodayBrief({
    spaces,
    weather: weatherState.weather,
  })
  const weatherBrief = buildTodayWeatherBrief(spaces, weatherState)
  const insights = buildTodayInsightsRow(brief, weatherBrief.spaceChecks, spaces)

  return {
    brief,
    greeting: getGardenGreeting(),
    weatherState,
    weatherBrief,
    insights,
  }
}
