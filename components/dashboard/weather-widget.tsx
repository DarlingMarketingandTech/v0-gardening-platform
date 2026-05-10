'use client'

import { useEffect, useState } from 'react'
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
  ShieldAlert
} from 'lucide-react'

interface WeatherData {
  temperature: number
  weatherCode: number
  humidity: number
  windSpeed: number
  uvIndex: number
  precipitation: number
  daily: {
    date: string
    tempMax: number
    tempMin: number
    precipitationSum: number
    weatherCode: number
  }[]
}

interface SunData {
  sunrise: string
  sunset: string
  dayLength: string
}

function getWeatherIcon(code: number, className = "h-8 w-8") {
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

function getMomTip(weather: WeatherData, sunData: SunData | null): { tip: string; icon: React.ReactNode } {
  if (weather.precipitation > 5 || (weather.weatherCode >= 61 && weather.weatherCode <= 82)) {
    return {
      tip: "It's raining today - no need to water the garden! Perfect day for indoor seed starting.",
      icon: <Umbrella className="h-5 w-5 text-blue-500" />
    }
  }
  if (weather.uvIndex >= 8) {
    return {
      tip: "High UV today - wear a hat and garden early morning or evening. Water in the morning to avoid evaporation!",
      icon: <ShieldAlert className="h-5 w-5 text-orange-500" />
    }
  }
  if (weather.temperature > 90) {
    return {
      tip: "Very hot today! Water deeply and consider providing shade for sensitive plants.",
      icon: <Thermometer className="h-5 w-5 text-red-500" />
    }
  }
  if (weather.temperature < 40) {
    return {
      tip: "Chilly today! Cover tender plants tonight and hold off on transplanting seedlings.",
      icon: <AlertTriangle className="h-5 w-5 text-blue-400" />
    }
  }
  if (weather.windSpeed > 20) {
    return {
      tip: "Windy conditions - stake tall plants and avoid spraying fertilizers or pesticides.",
      icon: <Wind className="h-5 w-5 text-slate-500" />
    }
  }
  return {
    tip: "Perfect gardening weather! Great day to plant, weed, or just enjoy your garden.",
    icon: <Sun className="h-5 w-5 text-amber-500" />
  }
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

export function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [sunData, setSunData] = useState<SunData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [location, setLocation] = useState({ lat: 40.7128, lng: -74.006 }) // Default NYC

  useEffect(() => {
    // Try to get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          })
        },
        () => {
          // Use default location if geolocation fails
        }
      )
    }
  }, [])

  useEffect(() => {
    async function fetchWeather() {
      try {
        setLoading(true)
        
        // Fetch weather from Open-Meteo
        const weatherRes = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${location.lat}&longitude=${location.lng}&current=temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weather_code,uv_index_max&temperature_unit=fahrenheit&wind_speed_unit=mph&timezone=auto`
        )
        const weatherData = await weatherRes.json()

        // Fetch sunrise/sunset data
        const sunRes = await fetch(
          `https://api.sunrise-sunset.org/json?lat=${location.lat}&lng=${location.lng}&formatted=0`
        )
        const sunJson = await sunRes.json()

        if (weatherData.current) {
          setWeather({
            temperature: Math.round(weatherData.current.temperature_2m),
            weatherCode: weatherData.current.weather_code,
            humidity: weatherData.current.relative_humidity_2m,
            windSpeed: Math.round(weatherData.current.wind_speed_10m),
            uvIndex: weatherData.daily?.uv_index_max?.[0] || 0,
            precipitation: weatherData.current.precipitation,
            daily: weatherData.daily?.time?.slice(0, 3).map((date: string, i: number) => ({
              date,
              tempMax: Math.round(weatherData.daily.temperature_2m_max[i]),
              tempMin: Math.round(weatherData.daily.temperature_2m_min[i]),
              precipitationSum: weatherData.daily.precipitation_sum[i],
              weatherCode: weatherData.daily.weather_code[i]
            })) || []
          })
        }

        if (sunJson.results) {
          const sunrise = new Date(sunJson.results.sunrise)
          const sunset = new Date(sunJson.results.sunset)
          const dayLengthMs = sunset.getTime() - sunrise.getTime()
          const hours = Math.floor(dayLengthMs / 3600000)
          const minutes = Math.floor((dayLengthMs % 3600000) / 60000)
          
          setSunData({
            sunrise: sunrise.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
            sunset: sunset.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
            dayLength: `${hours}h ${minutes}m`
          })
        }

        setError(null)
      } catch (err) {
        setError('Unable to fetch weather data')
        console.error('Weather fetch error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchWeather()
  }, [location])

  if (loading) {
    return (
      <Card className="bg-gradient-to-br from-emerald-50 to-amber-50 dark:from-emerald-950/30 dark:to-amber-950/30 border-emerald-200/50">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Sun className="h-5 w-5 text-amber-500" />
            Smart Forecast
          </CardTitle>
        </CardHeader>
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
      <Card className="bg-gradient-to-br from-emerald-50 to-amber-50 dark:from-emerald-950/30 dark:to-amber-950/30 border-emerald-200/50">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Sun className="h-5 w-5 text-amber-500" />
            Smart Forecast
          </CardTitle>
        </CardHeader>
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

  const momTip = getMomTip(weather, sunData)

  return (
    <Card className="bg-gradient-to-br from-emerald-50 to-amber-50 dark:from-emerald-950/30 dark:to-amber-950/30 border-emerald-200/50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Sun className="h-5 w-5 text-amber-500" />
          Smart Forecast
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Weather */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {getWeatherIcon(weather.weatherCode, "h-14 w-14")}
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
            <Badge variant={weather.uvIndex >= 6 ? "destructive" : weather.uvIndex >= 3 ? "secondary" : "outline"} className="text-xs">
              UV: {weather.uvIndex}
            </Badge>
          </div>
        </div>

        {/* Sunlight Gauge */}
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
              <div className="flex-1 h-2 bg-gradient-to-r from-orange-200 via-amber-300 to-orange-200 rounded-full" />
              <div className="flex items-center gap-1.5">
                <Sunset className="h-4 w-4 text-orange-500" />
                <span className="text-sm">{sunData.sunset}</span>
              </div>
            </div>
          </div>
        )}

        {/* 3-Day Watering Necessity */}
        <div>
          <div className="text-sm font-medium mb-2">3-Day Watering Forecast</div>
          <div className="grid grid-cols-3 gap-2">
            {weather.daily.map((day, i) => {
              const score = calculateWateringScore(day.precipitationSum, day.tempMax, weather.humidity)
              const dateLabel = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })
              
              return (
                <div key={day.date} className="bg-white/60 dark:bg-black/20 rounded-lg p-2 text-center">
                  <div className="text-xs text-muted-foreground mb-1">{dateLabel}</div>
                  {getWeatherIcon(day.weatherCode, "h-6 w-6 mx-auto mb-1")}
                  <div className="text-xs">{day.tempMax}° / {day.tempMin}°</div>
                  <div className={`mt-1 text-xs font-medium ${score > 70 ? 'text-red-500' : score > 40 ? 'text-amber-500' : 'text-emerald-500'}`}>
                    {score > 70 ? 'Water!' : score > 40 ? 'Maybe' : 'Skip'}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Mom's Tip */}
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
