'use client'

import { useEffect, useState } from 'react'

export type GardenWeatherTipKind = 'default' | 'rain' | 'uv' | 'heat' | 'cold' | 'wind'

export interface GardenWeatherDay {
  date: string
  tempMax: number
  tempMin: number
  precipitationSum: number
  weatherCode: number
}

export interface GardenWeatherData {
  temperature: number
  weatherCode: number
  humidity: number
  precipitation: number
  windSpeed: number
  uvIndex: number
  daily: GardenWeatherDay[]
}

export interface GardenSunData {
  sunrise: string
  sunset: string
  dayLength: string
}

interface GardenWeatherState {
  weather: GardenWeatherData | null
  sunData: GardenSunData | null
  loading: boolean
  error: string | null
}

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

const DEFAULT_LATITUDE = 40.7128
const DEFAULT_LONGITUDE = -74.006

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

export function useGardenWeather(latitude?: number | null, longitude?: number | null): GardenWeatherState {
  const [state, setState] = useState<GardenWeatherState>({
    weather: null,
    sunData: null,
    loading: true,
    error: null,
  })

  useEffect(() => {
    const controller = new AbortController()
    const lat = latitude ?? DEFAULT_LATITUDE
    const lng = longitude ?? DEFAULT_LONGITUDE

    async function loadWeather() {
      setState((current) => ({ ...current, loading: true, error: null }))

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
          fetch(weatherUrl, { signal: controller.signal }),
          fetch(sunUrl, { signal: controller.signal }),
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

        setState({
          weather: {
            temperature: roundWeatherNumber(current.temperature_2m),
            weatherCode: current.weather_code ?? 0,
            humidity: roundWeatherNumber(current.relative_humidity_2m),
            precipitation: current.precipitation ?? 0,
            windSpeed: roundWeatherNumber(current.wind_speed_10m),
            uvIndex: roundWeatherNumber(weatherData.daily?.uv_index_max?.[0]),
            daily: mapDailyWeather(weatherData.daily),
          },
          sunData: {
            sunrise: formatSunTime(sunData.results?.sunrise),
            sunset: formatSunTime(sunData.results?.sunset),
            dayLength: formatDayLength(sunData.results?.day_length),
          },
          loading: false,
          error: null,
        })
      } catch (error) {
        if (controller.signal.aborted) return

        setState({
          weather: null,
          sunData: null,
          loading: false,
          error: error instanceof Error ? error.message : 'Unable to load weather data',
        })
      }
    }

    void loadWeather()

    return () => controller.abort()
  }, [latitude, longitude])

  return state
}
