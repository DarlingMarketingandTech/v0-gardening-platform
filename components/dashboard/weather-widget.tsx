'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Sun,
  Cloud,
  CloudRain,
  CloudSnow,
  Wind,
  Droplets,
  Thermometer,
  Sunrise,
  Sunset,
  AlertTriangle,
  Umbrella,
  ShieldAlert,
} from 'lucide-react'
import {
  useGardenWeather,
  getGardenWeatherTipMessage,
  isActionableGardenWeather,
  type GardenWeatherData,
  type GardenWeatherLocation,
  type GardenWeatherState,
  type GardenWeatherTipKind,
} from '@/components/dashboard/use-garden-weather'

function getWeatherIcon(code: number, className = 'h-8 w-8') {
  if (code === 0) return <Sun className={`${className} text-amber-500`} />
  if (code >= 1 && code <= 3) return <Cloud className={`${className} text-slate-400`} />
  if (code >= 51 && code <= 67) return <CloudRain className={`${className} text-blue-500`} />
  if (code >= 71 && code <= 77) return <CloudSnow className={`${className} text-blue-300`} />
  if (code >= 80 && code <= 82) return <CloudRain className={`${className} text-blue-600`} />
  if (code >= 95) return <CloudRain className={`${className} text-slate-600`} />
  return <Sun className={`${className} text-amber-500`} />
}

function getWeatherDescription(code: number): string {
  if (code === 0) return 'Clear sky'
  if (code === 1) return 'Mainly clear'
  if (code === 2) return 'Partly cloudy'
  if (code === 3) return 'Overcast'
  if (code >= 51 && code <= 55) return 'Drizzle'
  if (code >= 56 && code <= 57) return 'Freezing drizzle'
  if (code >= 61 && code <= 65) return 'Rain'
  if (code >= 66 && code <= 67) return 'Freezing rain'
  if (code >= 71 && code <= 77) return 'Snow'
  if (code >= 80 && code <= 82) return 'Rain showers'
  if (code >= 95) return 'Thunderstorm'
  return 'Unknown'
}

function tipIconForKind(kind: GardenWeatherTipKind, className = 'h-5 w-5 shrink-0') {
  switch (kind) {
    case 'rain':
      return <Umbrella className={`${className} text-blue-500`} />
    case 'uv':
      return <ShieldAlert className={`${className} text-orange-500`} />
    case 'heat':
      return <Thermometer className={`${className} text-red-500`} />
    case 'cold':
      return <AlertTriangle className={`${className} text-blue-400`} />
    case 'wind':
      return <Wind className={`${className} text-slate-500`} />
    default:
      return <Sun className={`${className} text-amber-500`} />
  }
}

function momTipFromWeather(weather: GardenWeatherData) {
  const { message, kind } = getGardenWeatherTipMessage(weather)
  return { tip: message, icon: tipIconForKind(kind) }
}

function calculateWateringScore(precipitation: number, temp: number, humidity: number): number {
  let score = 100
  score -= precipitation * 10
  if (temp > 85) score += 20
  if (temp < 50) score -= 20
  if (humidity > 70) score -= 15
  if (humidity < 40) score += 15
  return Math.max(0, Math.min(100, Math.round(score)))
}

interface WeatherWidgetProps {
  latitude?: number | null
  longitude?: number | null
  locationName?: string
}

function WeatherCardHeader({ location }: { location: GardenWeatherLocation }) {
  const title = location.source === 'demo' ? 'Demo Forecast' : 'Garden Forecast'
  const locationSummary = `${location.label}. ${location.note}`

  return (
    <CardHeader className="pb-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Sun className="h-5 w-5 text-amber-500" />
            {title}
          </CardTitle>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{locationSummary}</p>
        </div>
        {location.source === 'demo' ? (
          <Badge variant="outline" className="shrink-0 text-[10px]">
            Demo
          </Badge>
        ) : null}
      </div>
    </CardHeader>
  )
}

export function WeatherWidget({ latitude, longitude, locationName }: WeatherWidgetProps) {
  const weatherState = useGardenWeather(latitude, longitude, locationName)
  return <WeatherWidgetContent weatherState={weatherState} />
}

export function WeatherWidgetContent({ weatherState }: { weatherState: GardenWeatherState }) {
  const { weather, sunData, loading, error, location } = weatherState

  if (loading) {
    return (
      <Card className="bg-linear-to-br from-emerald-50 to-amber-50 dark:from-emerald-950/30 dark:to-amber-950/30 border-emerald-200/50">
        <WeatherCardHeader location={location} />
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Skeleton className="h-16 w-16 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
    )
  }

  if (error || !weather) {
    return (
      <Card className="bg-linear-to-br from-emerald-50 to-amber-50 dark:from-emerald-950/30 dark:to-amber-950/30 border-emerald-200/50">
        <WeatherCardHeader location={location} />
        <CardContent>
          <div className="text-center py-6 text-muted-foreground">
            <Cloud className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>Unable to load weather data</p>
            <p className="text-sm">Please check your connection</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const momTip = momTipFromWeather(weather)

  return (
    <Card className="bg-linear-to-br from-emerald-50 to-amber-50 dark:from-emerald-950/30 dark:to-amber-950/30 border-emerald-200/50">
      <WeatherCardHeader location={location} />
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {getWeatherIcon(weather.weatherCode, 'h-14 w-14')}
            <div>
              <div className="text-4xl font-bold">{weather.temperature}°F</div>
              <div className="text-muted-foreground">{getWeatherDescription(weather.weatherCode)}</div>
            </div>
          </div>
          <div className="text-right space-y-1">
            <div className="flex items-center justify-end gap-1 text-sm">
              <Droplets className="h-4 w-4 text-blue-500" />
              <span>{weather.humidity}%</span>
            </div>
            <div className="flex items-center justify-end gap-1 text-sm">
              <Wind className="h-4 w-4 text-slate-500" />
              <span>{weather.windSpeed} mph</span>
            </div>
            <Badge
              variant={weather.uvIndex >= 6 ? 'destructive' : weather.uvIndex >= 3 ? 'secondary' : 'outline'}
              className="text-xs"
            >
              UV: {weather.uvIndex}
            </Badge>
          </div>
        </div>

        {sunData && (
          <div className="bg-white/60 dark:bg-black/20 rounded-lg p-3">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="font-medium">Sunlight Today</span>
              <span className="text-muted-foreground">{sunData.dayLength}</span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-1.5">
                <Sunrise className="h-4 w-4 text-orange-400" />
                <span className="text-sm">{sunData.sunrise}</span>
              </div>
              <div className="flex-1 h-2 bg-linear-to-r from-orange-200 via-amber-300 to-orange-200 rounded-full" />
              <div className="flex items-center gap-1.5">
                <Sunset className="h-4 w-4 text-orange-500" />
                <span className="text-sm">{sunData.sunset}</span>
              </div>
            </div>
          </div>
        )}

        <div>
          <div className="text-sm font-medium mb-2">3-Day Watering Forecast</div>
          <div className="grid grid-cols-3 gap-2">
            {weather.daily.map((day, i) => {
              const score = calculateWateringScore(day.precipitationSum, day.tempMax, weather.humidity)
              const dateLabel =
                i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })

              return (
                <div key={day.date} className="bg-white/60 dark:bg-black/20 rounded-lg p-2 text-center">
                  <div className="text-xs text-muted-foreground mb-1">{dateLabel}</div>
                  {getWeatherIcon(day.weatherCode, 'h-6 w-6 mx-auto mb-1')}
                  <div className="text-xs">
                    {day.tempMax}° / {day.tempMin}°
                  </div>
                  <div
                    className={`mt-1 text-xs font-medium ${score > 70 ? 'text-red-500' : score > 40 ? 'text-amber-500' : 'text-emerald-500'}`}
                  >
                    {score > 70 ? 'Water!' : score > 40 ? 'Maybe' : 'Skip'}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="bg-primary/10 rounded-lg p-3 flex items-start gap-3">
          {momTip.icon}
          <div>
            <div className="text-sm font-medium mb-0.5">Mom&apos;s Tip</div>
            <p className="text-sm text-muted-foreground">{momTip.tip}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

/** Single calm line for Today when weather suggests a concrete adjustment (hidden on “nice day”). */
export function WeatherTodayNote({ latitude, longitude, locationName }: WeatherWidgetProps) {
  const { weather, loading, error } = useGardenWeather(latitude, longitude, locationName)

  if (loading || error || !weather) return null
  if (!isActionableGardenWeather(weather)) return null

  const { message, kind } = getGardenWeatherTipMessage(weather)

  return (
    <div className="rounded-xl border border-primary/15 bg-muted/25 px-3 py-2.5 flex gap-2.5 items-start">
      {tipIconForKind(kind, 'h-4 w-4 mt-0.5')}
      <p className="text-sm text-muted-foreground leading-snug">{message}</p>
    </div>
  )
}
