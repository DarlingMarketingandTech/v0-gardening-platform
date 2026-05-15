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

export interface GardenWeatherLocation {
  label: string
  latitude: number
  longitude: number
  source: 'demo' | 'saved'
  note: string
}

export interface GardenWeatherState {
  weather: GardenWeatherData | null
  sunData: GardenSunData | null
  location: GardenWeatherLocation
  loading: boolean
  error: string | null
}
