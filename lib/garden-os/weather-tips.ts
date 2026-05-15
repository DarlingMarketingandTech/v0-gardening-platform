import type { GardenWeatherData, GardenWeatherTipKind } from '@/lib/garden-os/weather-types'

export function getGardenWeatherTipMessage(weather: GardenWeatherData): {
  message: string
  kind: GardenWeatherTipKind
} {
  if (weather.precipitation > 5 || (weather.weatherCode >= 61 && weather.weatherCode <= 82)) {
    return {
      message: 'Rain is helping today. Skip watering unless containers are tucked under cover.',
      kind: 'rain',
    }
  }

  if (weather.uvIndex >= 8) {
    return {
      message: 'Strong sun today. Check tender plants and water early or late, not in the midday heat.',
      kind: 'uv',
    }
  }

  if (weather.temperature >= 88) {
    return {
      message: 'Heat can dry pots fast. Give containers a quick finger-check before dinner.',
      kind: 'heat',
    }
  }

  if (weather.temperature <= 38) {
    return {
      message: 'Cold is the main watch-out. Protect tender starts if they are outside tonight.',
      kind: 'cold',
    }
  }

  if (weather.windSpeed >= 20) {
    return {
      message: 'Wind can stress young plants. Check stakes, covers, and anything newly transplanted.',
      kind: 'wind',
    }
  }

  return {
    message: 'A calm garden day. A quick look-in and light tidy-up should be enough.',
    kind: 'default',
  }
}

export function isActionableGardenWeather(weather: GardenWeatherData) {
  const { kind } = getGardenWeatherTipMessage(weather)
  return kind !== 'default'
}
