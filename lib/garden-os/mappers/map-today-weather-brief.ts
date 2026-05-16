import type { DemoGardenSpace } from '@/lib/demo-garden'
import { getGardenWeatherTipMessage } from '@/lib/garden-os/weather-tips'
import type { GardenWeatherData, GardenWeatherState } from '@/lib/garden-os/weather-types'
import type {
  TodayForecastSpaceCheck,
  TodayForecastSpaceTone,
  TodayInsightCard,
  TodayInsightsRowModel,
  TodayWeatherBrief,
} from '@/lib/garden-os/types'
import type { TodayBrief } from '@/lib/today-brief'
import {
  areaTypeLabelForSpace,
  computeOpenTaskCount,
  conditionLabelFor,
  deriveZoneCondition,
} from '@/lib/garden-os/mappers/derive-zone-from-space'

interface WeatherFlags {
  hot: boolean
  dry: boolean
  rainy: boolean
  windy: boolean
  cold: boolean
  lowIndoorHumidity: boolean
}

function isRainCode(code: number) {
  return (code >= 51 && code <= 67) || (code >= 80 && code <= 82) || code >= 95
}

function getFlagsFromWeather(weather: GardenWeatherData | null): WeatherFlags {
  if (!weather) {
    return {
      hot: false,
      dry: false,
      rainy: false,
      windy: false,
      cold: false,
      lowIndoorHumidity: false,
    }
  }

  const today = weather.daily[0]
  const highTemp = Math.max(weather.temperature, today?.tempMax ?? weather.temperature)
  const lowTemp = Math.min(weather.temperature, today?.tempMin ?? weather.temperature)
  const precipitation = Math.max(weather.precipitation, today?.precipitationSum ?? 0)
  const code = today?.weatherCode ?? weather.weatherCode

  return {
    hot: highTemp >= 86 || weather.uvIndex >= 8,
    dry: precipitation < 0.2 && weather.humidity <= 60,
    rainy: precipitation >= 1 || isRainCode(code),
    windy: weather.windSpeed >= 18,
    cold: lowTemp <= 40,
    lowIndoorHumidity: weather.humidity < 45,
  }
}

function isOutdoorPotStyleSpace(space: DemoGardenSpace): boolean {
  if (space.setupHints?.forecast.driesFast) return space.group === 'outdoor'
  if (space.group !== 'outdoor') return false
  const id = String(space.id).toLowerCase()
  return (
    /patio|pot|container|balcony|deck/i.test(id) || /patio|pots|balcony|container|deck/i.test(space.title)
  )
}

function isTrellisSpace(space: DemoGardenSpace): boolean {
  return /trellis/i.test(String(space.id)) || /trellis/i.test(space.title)
}

function isRaisedOrInGround(space: DemoGardenSpace): boolean {
  if (space.setupHints?.forecast.rainExposed && space.group === 'outdoor') {
    const t = space.setupHints.templateId
    return t === 'raised' || t === 'backyard' || t === 'inground' || t === 'pollinator'
  }
  const id = String(space.id).toLowerCase()
  return space.group === 'outdoor' && (/in-ground|raised/.test(id) || /raised bed|in-ground/i.test(space.title))
}

function mapZoneToForecastTone(
  zone: ReturnType<typeof deriveZoneCondition>,
  flags: WeatherFlags,
  space: DemoGardenSpace,
): TodayForecastSpaceTone {
  if (zone === 'needs_water') return 'water'
  if (zone === 'critical' || zone === 'attention') return 'attention'
  if (space.group === 'outdoor' && flags.hot && flags.dry && isOutdoorPotStyleSpace(space)) return 'water'
  if (space.group === 'outdoor' && flags.windy && isTrellisSpace(space)) return 'watch'
  return 'stable'
}

function buildImpactAndRecommendation(
  space: DemoGardenSpace,
  flags: WeatherFlags,
  hasForecastPayload: boolean,
): { impact: string; recommendation: string } {
  const hints = space.setupHints
  const templateId = hints?.templateId
  const f = hints?.forecast

  if (space.group === 'indoor') {
    if (!hasForecastPayload) {
      return {
        impact: 'Home rhythm',
        recommendation:
          hints?.beginnerRecommendation ??
          'Houseplants keep a steadier pace than the weather — one calm check goes a long way.',
      }
    }
    if (flags.lowIndoorHumidity) {
      return {
        impact: 'Dry indoor air',
        recommendation: 'Misting helps leaves a little, but soil still wins — check pots with a fingertip.',
      }
    }
    if (templateId === 'kitchen') {
      return {
        impact: 'Protected indoors',
        recommendation: 'Protected indoors. Rotate if the leaves lean toward the light.',
      }
    }
    if (templateId === 'living') {
      return {
        impact: 'Protected indoors',
        recommendation: 'Back from the window, soil can surprise you — lift pots to feel their weight.',
      }
    }
    if (templateId === 'bath') {
      return {
        impact: 'Humid room air',
        recommendation: 'Humidity helps foliage — still confirm soil is not staying soggy.',
      }
    }
    if (templateId === 'bedroom') {
      return {
        impact: 'Protected indoors',
        recommendation: 'Gentler light means slower drying — let soil go slightly dry between drinks.',
      }
    }
    return {
      impact: 'Protected indoors',
      recommendation:
        hints?.beginnerRecommendation ??
        'Weather outside is a backdrop — your pots still want a calm, regular eye.',
    }
  }

  // Outdoor
  if (!hasForecastPayload) {
    return {
      impact: 'Outdoor rhythm',
      recommendation:
        hints?.beginnerRecommendation ??
        'When forecast connects again, we will match rain, heat, and wind to this spot.',
    }
  }

  if (flags.cold) {
    if (templateId === 'greenhouse') {
      return {
        impact: 'Cool outside',
        recommendation:
          'The structure helps, but corners can still dip — tuck a cloth over the tenderest trays if needed.',
      }
    }
    if (f?.frostSensitive) {
      return {
        impact: 'Cool spell',
        recommendation: 'Tender outdoor plants may need a cover or a closer look on cold mornings.',
      }
    }
    if (!hints) {
      return {
        impact: 'Chilly spell',
        recommendation: 'Watch tender outdoor plants if overnight cold is in play.',
      }
    }
    return {
      impact: 'Cool outside',
      recommendation: 'This spot is a bit more sheltered — still worth a glance at anything newly planted.',
    }
  }

  if (flags.rainy && f?.rainExposed && templateId !== 'greenhouse') {
    return {
      impact: 'Rain in the picture',
      recommendation: 'Rain may cover watering. Check only if the top inch is dry.',
    }
  }

  if (flags.rainy && !isOutdoorPotStyleSpace(space)) {
    return {
      impact: 'Rain in the picture',
      recommendation: 'Skip watering if rain arrives later.',
    }
  }

  if (flags.hot && flags.dry && (f?.driesFast || isOutdoorPotStyleSpace(space))) {
    if (templateId === 'balcony' || /balcony/i.test(space.title)) {
      return {
        impact: 'Wind and sun',
        recommendation: 'Wind and sun can dry containers quickly. Check soil before dinner.',
      }
    }
    return {
      impact: 'Heat and dry air',
      recommendation: 'Pots can dry faster today. Check soil before dinner.',
    }
  }

  if (templateId === 'greenhouse' && flags.hot) {
    return {
      impact: 'Warm greenhouse air',
      recommendation: 'Warm enclosed air can build up. Vent if it feels stuffy.',
    }
  }

  if (flags.windy && (f?.driesFast || isOutdoorPotStyleSpace(space))) {
    return {
      impact: 'Breezy',
      recommendation: 'Wind pulls moisture from leaves and soil surfaces — pots deserve an extra glance.',
    }
  }

  if (flags.rainy && isOutdoorPotStyleSpace(space)) {
    return {
      impact: 'Mixed rain and pots',
      recommendation: 'Eaves and leaves can block some rain — slip a finger in the soil before skipping water.',
    }
  }

  if (f?.rainExposed && !flags.rainy && flags.dry && isRaisedOrInGround(space)) {
    return {
      impact: 'Dry stretch for beds',
      recommendation: 'Open soil may need a slower, deeper drink than pots do this week.',
    }
  }

  if (isTrellisSpace(space) && flags.windy) {
    return {
      impact: 'Breezy',
      recommendation: 'Watch trellis ties and loose vines this afternoon.',
    }
  }

  if (flags.hot && isOutdoorPotStyleSpace(space)) {
    return {
      impact: 'Warm and sunny',
      recommendation: 'Watch direct-sun containers this afternoon.',
    }
  }

  if (flags.hot && f?.heatSensitive && f.driesFast) {
    return {
      impact: 'Warm day for pots',
      recommendation: 'Containers heat up fast — a morning soil check saves afternoon surprises.',
    }
  }

  return {
    impact: 'Steady outdoors',
    recommendation:
      hints?.beginnerRecommendation ?? 'A quick walkthrough is enough if moisture looks even.',
  }
}

export function buildTodayForecastSpaceChecks(
  spaces: DemoGardenSpace[],
  weather: GardenWeatherData | null,
): TodayForecastSpaceCheck[] {
  const flags = getFlagsFromWeather(weather)
  const hasForecastPayload = Boolean(weather)
  return spaces.map((space) => {
    const zone = deriveZoneCondition(space)
    const { impact, recommendation } = buildImpactAndRecommendation(space, flags, hasForecastPayload)
    const tone = mapZoneToForecastTone(zone, flags, space)

    return {
      id: `forecast-${space.id}`,
      name: space.title,
      areaTypeLabel: areaTypeLabelForSpace(space),
      condition: conditionLabelFor(zone),
      impactLabel: impact,
      recommendation,
      tone,
      plantCount: space.plantings.length,
      openTaskCount: computeOpenTaskCount(space),
    }
  })
}

function weatherDescription(code: number): string {
  if (code === 0) return 'Clear sky'
  if (code === 1) return 'Mainly clear'
  if (code === 2) return 'Partly cloudy'
  if (code === 3) return 'Overcast'
  if (code >= 51 && code <= 55) return 'Drizzle'
  if (code >= 61 && code <= 65) return 'Rain'
  if (code >= 80 && code <= 82) return 'Rain showers'
  if (code >= 95) return 'Thunderstorm'
  return 'Mixed conditions'
}

export function buildTodayWeatherBrief(
  spaces: DemoGardenSpace[],
  weatherState: GardenWeatherState,
): TodayWeatherBrief {
  const weather = weatherState.weather
  const flags = getFlagsFromWeather(weather)

  if (!weather) {
    const spaceChecks = buildTodayForecastSpaceChecks(spaces, null)
    return {
      headline: "Today's snapshot",
      summary: weatherState.error
        ? 'Forecast paused — your spaces keep their usual rhythm.'
        : `${spaces.length} spaces checked against today’s rhythm while forecast data loads.`,
      forecastImpact:
        'When the forecast connects, this card will tailor water, wind, and rain notes to your spaces.',
      chips: ['Forecast loading', `${spaces.length} spaces`],
      spaceChecks,
    }
  }

  const tip = getGardenWeatherTipMessage(weather)
  const chips: string[] = []
  if (flags.rainy) chips.push('Rain likely')
  else if (flags.dry) chips.push('Dry stretch')
  if (flags.hot) chips.push('Warm day')
  if (flags.cold) chips.push('Cool spell')
  if (flags.windy) chips.push('Breezy')
  chips.push(`${weather.humidity}% humidity`)
  chips.push(`${weather.windSpeed} mph wind`)

  const headline = `${weather.temperature}°F · ${weatherDescription(weather.weatherCode)}`
  const high = weather.daily[0]?.tempMax ?? weather.temperature
  const summary = `${weatherState.location.label} · High near ${high}°F.`

  return {
    headline,
    summary,
    forecastImpact: tip.message,
    chips: chips.slice(0, 5),
    spaceChecks: buildTodayForecastSpaceChecks(spaces, weather),
  }
}

function watchOutRedundantWithForecast(watch: TodayBrief['watchOut'], checks: TodayForecastSpaceCheck[]): boolean {
  if (!watch.spaceTitle) return false
  const match = checks.find((c) => c.name === watch.spaceTitle)
  if (!match) return false
  if (watch.kind === 'water' && (match.tone === 'water' || match.tone === 'watch')) return true
  if (watch.kind === 'weather' && match.tone !== 'stable') return true
  if (watch.kind === 'support' && /trellis|vine|wind/i.test(match.recommendation)) return true
  return false
}

function buildUpcomingInsight(spaces: DemoGardenSpace[]): TodayInsightCard {
  for (const space of spaces) {
    const ready = space.plantings.find((p) => p.status === 'ready-soon')
    if (ready) {
      const name = ready.variety ?? ready.name
      return {
        label: 'Upcoming',
        title: `${name} is nearing harvest timing`,
        body: 'A short daily glance keeps picks in the sweet spot without rushing.',
      }
    }
  }

  for (const space of spaces) {
    const blooming = space.plantings.find((p) => p.status === 'blooming')
    if (blooming) {
      return {
        label: 'Upcoming',
        title: 'Pollinator blooms are doing their job',
        body: 'Enjoy the color — a light deadhead pass later keeps the border generous.',
      }
    }
  }

  return {
    label: 'Upcoming',
    title: 'Room for a tiny win',
    body: 'Pick one small task — a saucer pour-off, a weed, a trellis tuck — and stop there.',
  }
}

export function buildTodayInsightsRow(
  brief: TodayBrief,
  spaceChecks: TodayForecastSpaceCheck[],
  spaces: DemoGardenSpace[],
): TodayInsightsRowModel {
  const genericWatch: TodayInsightCard = {
    label: 'Watch out',
    title: 'Small checks beat big surprises',
    body: 'Peek at soil, leaves, and ties — the forecast check above already flagged the big weather cues.',
  }

  const watch: TodayInsightCard = watchOutRedundantWithForecast(brief.watchOut, spaceChecks)
    ? genericWatch
    : {
        label: 'Watch out',
        title: brief.watchOut.title,
        body: brief.watchOut.body,
      }

  const progress: TodayInsightCard = {
    label: 'Progress',
    title: brief.milestone.title,
    body: brief.milestone.body,
  }

  const upcoming = buildUpcomingInsight(spaces)

  return { watch, progress, upcoming }
}
