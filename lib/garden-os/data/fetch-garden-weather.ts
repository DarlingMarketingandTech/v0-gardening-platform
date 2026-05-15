import { DEMO_GARDEN_LOCATION } from '@/lib/demo-garden'
import type {
  GardenWeatherData,
  GardenWeatherDay,
  GardenWeatherLocation,
  GardenWeatherState,
  GardenSunData,
} from '@/lib/garden-os/weather-types'

interface OpenMeteoResponse {
  current?: {
    temperature_2m?: number
    relative_humidity_2m?: number
    precipitation?: number
    weather_code?: number
    wind_speed_10m?: number
  }
  daily?: {
    time?: string[]
    temperature_2m_max?: number[]
    temperature_2m_min?: number[]
    precipitation_sum?: number[]
    weather_code?: number[]
    uv_index_max?: number[]
  }
}

interface SunriseSunsetResponse {
  results?: {
    sunrise?: string
    sunset?: string
    day_length?: number
  }
}

export function resolveGardenWeatherLocation(
  latitude?: number | null,
  longitude?: number | null,
  locationName?: string,
): GardenWeatherLocation {
  if (
    typeof latitude === 'number' &&
    typeof longitude === 'number' &&
    Number.isFinite(latitude) &&
    Number.isFinite(longitude)
  ) {
    return {
      label: locationName ?? 'Saved garden location',
      latitude,
      longitude,
      source: 'saved',
      note: 'Forecast for the saved garden spot.',
    }
  }

  return { ...DEMO_GARDEN_LOCATION }
}

function roundWeatherNumber(value: number | undefined, fallback = 0) {
  return Math.round(value ?? fallback)
}

function formatSunTime(value: string | undefined) {
  if (!value) return '--'

  return new Date(value).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  })
}

function formatDayLength(seconds: number | undefined) {
  if (!seconds) return '--'

  const hours = Math.floor(seconds / 3600)
  const minutes = Math.round((seconds % 3600) / 60)
  return `${hours}h ${minutes}m`
}

function mapDailyWeather(daily: OpenMeteoResponse['daily']): GardenWeatherDay[] {
  const dates = daily?.time ?? []

  return dates.slice(0, 3).map((date, index) => ({
    date,
    tempMax: roundWeatherNumber(daily?.temperature_2m_max?.[index]),
    tempMin: roundWeatherNumber(daily?.temperature_2m_min?.[index]),
    precipitationSum: daily?.precipitation_sum?.[index] ?? 0,
    weatherCode: daily?.weather_code?.[index] ?? 0,
  }))
}

export async function fetchGardenWeather(
  latitude?: number | null,
  longitude?: number | null,
  locationName?: string,
  signal?: AbortSignal,
): Promise<GardenWeatherState> {
  const location = resolveGardenWeatherLocation(latitude, longitude, locationName)
  const lat = location.latitude
  const lng = location.longitude

  try {
    const weatherUrl = new URL('https://api.open-meteo.com/v1/forecast')
    weatherUrl.search = new URLSearchParams({
      latitude: String(lat),
      longitude: String(lng),
      current: 'temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m',
      daily: 'temperature_2m_max,temperature_2m_min,precipitation_sum,weather_code,uv_index_max',
      temperature_unit: 'fahrenheit',
      wind_speed_unit: 'mph',
      timezone: 'auto',
    }).toString()

    const sunUrl = new URL('https://api.sunrise-sunset.org/json')
    sunUrl.search = new URLSearchParams({
      lat: String(lat),
      lng: String(lng),
      formatted: '0',
    }).toString()

    const [weatherResponse, sunResponse] = await Promise.all([
      fetch(weatherUrl, { signal }),
      fetch(sunUrl, { signal }),
    ])

    if (!weatherResponse.ok || !sunResponse.ok) {
      throw new Error('Unable to load weather data')
    }

    const weatherData = (await weatherResponse.json()) as OpenMeteoResponse
    const sunData = (await sunResponse.json()) as SunriseSunsetResponse
    const current = weatherData.current

    if (!current) {
      throw new Error('Weather response did not include current conditions')
    }

    const weather: GardenWeatherData = {
      temperature: roundWeatherNumber(current.temperature_2m),
      weatherCode: current.weather_code ?? 0,
      humidity: roundWeatherNumber(current.relative_humidity_2m),
      precipitation: current.precipitation ?? 0,
      windSpeed: roundWeatherNumber(current.wind_speed_10m),
      uvIndex: roundWeatherNumber(weatherData.daily?.uv_index_max?.[0]),
      daily: mapDailyWeather(weatherData.daily),
    }

    const sun: GardenSunData = {
      sunrise: formatSunTime(sunData.results?.sunrise),
      sunset: formatSunTime(sunData.results?.sunset),
      dayLength: formatDayLength(sunData.results?.day_length),
    }

    return {
      weather,
      sunData: sun,
      location,
      loading: false,
      error: null,
    }
  } catch (error) {
    if (signal?.aborted) {
      return {
        weather: null,
        sunData: null,
        location,
        loading: false,
        error: null,
      }
    }

    return {
      weather: null,
      sunData: null,
      location,
      loading: false,
      error: error instanceof Error ? error.message : 'Unable to load weather data',
    }
  }
}
