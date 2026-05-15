'use client'

import { useEffect, useState } from 'react'
import { fetchGardenWeather, resolveGardenWeatherLocation } from '@/lib/garden-os/data/fetch-garden-weather'
import type { GardenWeatherState } from '@/lib/garden-os/weather-types'

export type {
  GardenWeatherTipKind,
  GardenWeatherDay,
  GardenWeatherData,
  GardenSunData,
  GardenWeatherLocation,
  GardenWeatherState,
} from '@/lib/garden-os/weather-types'

export { getGardenWeatherTipMessage, isActionableGardenWeather } from '@/lib/garden-os/weather-tips'

export function useGardenWeather(
  latitude?: number | null,
  longitude?: number | null,
  locationName?: string,
): GardenWeatherState {
  const resolvedLocation = resolveGardenWeatherLocation(latitude, longitude, locationName)
  const [state, setState] = useState<GardenWeatherState>({
    weather: null,
    sunData: null,
    location: resolvedLocation,
    loading: true,
    error: null,
  })

  useEffect(() => {
    const controller = new AbortController()
    const location = resolveGardenWeatherLocation(latitude, longitude, locationName)

    async function loadWeather() {
      setState((current) => ({ ...current, location, loading: true, error: null }))

      const next = await fetchGardenWeather(latitude, longitude, locationName, controller.signal)
      if (controller.signal.aborted) return

      setState(next)
    }

    void loadWeather()

    return () => controller.abort()
  }, [latitude, longitude, locationName])

  return state
}
