'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { WeatherWidget } from './weather-widget'
import { PlantLibrary } from './plant-library'
import { TaskList } from './task-list'
import { GardenLog } from './garden-log'
import { ServiceProviders } from './service-providers'
import { ActiveCrops } from './active-crops'
import { NotificationSettings } from './notification-settings'
import { getProfile, type MomProfile } from '@/lib/profile-store'
import { 
  Sprout, 
  Leaf, 
  Plus, 
  Home,
  BookOpen,
  MapPin,
  CheckSquare,
  BookHeart,
  Flower2,
  Settings,
  Sun,
  Droplets,
  Bell
} from 'lucide-react'
import type { Plant } from '@/lib/types'

interface DashboardClientProps {
  plants: Plant[]
}

export function DashboardClient({ plants }: DashboardClientProps) {
  const [activeTab, setActiveTab] = useState('home')
  const [isRainy, setIsRainy] = useState(false)
  const [profile, setProfile] = useState<MomProfile | null>(null)

  useEffect(() => {
    setProfile(getProfile())
  }, [])

  // Check weather for rainy conditions using profile location
  useEffect(() => {
    if (!profile?.latitude || !profile?.longitude) return

    const checkWeather = async () => {
      try {
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${profile.latitude}&longitude=${profile.longitude}&current=weather_code,precipitation`
        )
        const data = await res.json()
        if (data.current) {
          const weatherCode = data.current.weather_code
          const precipitation = data.current.precipitation
          setIsRainy(precipitation > 0 || (weatherCode >= 51 && weatherCode <= 82))
        }
      } catch {
        setIsRainy(false)
      }
    }
    checkWeather()
  }, [profile?.latitude, profile?.longitude])

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 via-background to-accent/5">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-primary/10">
        <div className="container px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Flower2 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="font-semibold text-lg leading-tight">
                {profile?.gardenName || "Mom's Garden"}
              </h1>
              <p className="text-sm text-muted-foreground">
                {profile?.city}, {profile?.state}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" asChild>
            <Link href="/settings">
              <Settings className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </header>

      <main className="container px-4 py-6">
        {/* Greeting */}
        <div className="mb-6">
          <h2 className="text-2xl md:text-3xl font-bold mb-1">
            Hello, {profile?.name || 'Gardener'}!
          </h2>
          <p className="text-muted-foreground">
            {getGreeting()}
          </p>
        </div>

        {/* Tab Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="w-full grid grid-cols-6 h-auto bg-muted/50 p-1 rounded-xl">
            <TabsTrigger 
              value="home" 
              className="flex flex-col items-center gap-1 py-2 data-[state=active]:bg-background rounded-lg"
            >
              <Home className="h-5 w-5" />
              <span className="text-xs">Home</span>
            </TabsTrigger>
            <TabsTrigger 
              value="plants" 
              className="flex flex-col items-center gap-1 py-2 data-[state=active]:bg-background rounded-lg"
            >
              <BookOpen className="h-5 w-5" />
              <span className="text-xs">Plants</span>
            </TabsTrigger>
            <TabsTrigger 
              value="tasks" 
              className="flex flex-col items-center gap-1 py-2 data-[state=active]:bg-background rounded-lg"
            >
              <CheckSquare className="h-5 w-5" />
              <span className="text-xs">Tasks</span>
            </TabsTrigger>
            <TabsTrigger 
              value="log" 
              className="flex flex-col items-center gap-1 py-2 data-[state=active]:bg-background rounded-lg"
            >
              <BookHeart className="h-5 w-5" />
              <span className="text-xs">Log</span>
            </TabsTrigger>
            <TabsTrigger 
              value="alerts" 
              className="flex flex-col items-center gap-1 py-2 data-[state=active]:bg-background rounded-lg"
            >
              <Bell className="h-5 w-5" />
              <span className="text-xs">Alerts</span>
            </TabsTrigger>
            <TabsTrigger 
              value="local" 
              className="flex flex-col items-center gap-1 py-2 data-[state=active]:bg-background rounded-lg"
            >
              <MapPin className="h-5 w-5" />
              <span className="text-xs">Local</span>
            </TabsTrigger>
          </TabsList>

          {/* HOME TAB */}
          <TabsContent value="home" className="space-y-6 mt-6">
            {/* Featured Garden Photo */}
            <div className="relative h-48 md:h-56 rounded-2xl overflow-hidden shadow-lg">
              <img 
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/20220618_180911-PBDTHZW4x1HiwJrf0Vqz8sEWuvlZ2P.jpg"
                alt="Garden with squash growing on trellis"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <p className="text-white/80 text-sm">Your Garden</p>
                <h3 className="text-white text-xl font-semibold">{profile?.gardenName || "Mom's Garden"}</h3>
              </div>
            </div>

            {/* Weather Widget - Full Width */}
            <WeatherWidget 
              latitude={profile?.latitude || null} 
              longitude={profile?.longitude || null}
              locationName={profile?.city ? `${profile.city}, ${profile.state}` : undefined}
            />

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-3">
              <Card className="bg-green-50 dark:bg-green-950/30 border-green-200/50">
                <CardContent className="pt-4 pb-4 text-center">
                  <Sprout className="h-6 w-6 text-green-600 dark:text-green-400 mx-auto mb-1" />
                  <div className="text-2xl font-bold text-green-700 dark:text-green-300">12</div>
                  <div className="text-xs text-green-600/80 dark:text-green-400/80">Growing</div>
                </CardContent>
              </Card>
              
              <Card className="bg-amber-50 dark:bg-amber-950/30 border-amber-200/50">
                <CardContent className="pt-4 pb-4 text-center">
                  <Sun className="h-6 w-6 text-amber-600 dark:text-amber-400 mx-auto mb-1" />
                  <div className="text-2xl font-bold text-amber-700 dark:text-amber-300">3</div>
                  <div className="text-xs text-amber-600/80 dark:text-amber-400/80">Need Sun</div>
                </CardContent>
              </Card>
              
              <Card className="bg-blue-50 dark:bg-blue-950/30 border-blue-200/50">
                <CardContent className="pt-4 pb-4 text-center">
                  <Droplets className="h-6 w-6 text-blue-600 dark:text-blue-400 mx-auto mb-1" />
                  <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">5</div>
                  <div className="text-xs text-blue-600/80 dark:text-blue-400/80">Need Water</div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card className="border-primary/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-3">
                <Button className="h-auto py-4 flex-col gap-2">
                  <Leaf className="h-5 w-5" />
                  <span>Add Plant</span>
                </Button>
                <Button variant="outline" className="h-auto py-4 flex-col gap-2" onClick={() => setActiveTab('log')}>
                  <BookHeart className="h-5 w-5" />
                  <span>New Log Entry</span>
                </Button>
                <Button variant="outline" className="h-auto py-4 flex-col gap-2" onClick={() => setActiveTab('tasks')}>
                  <CheckSquare className="h-5 w-5" />
                  <span>View Tasks</span>
                </Button>
                <Button variant="outline" className="h-auto py-4 flex-col gap-2" asChild>
                  <Link href="/plants">
                    <BookOpen className="h-5 w-5" />
                    <span>Plant Library</span>
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Today's Tasks Preview */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Today&apos;s Tasks</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => setActiveTab('tasks')}>
                    See All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <TaskList isRainy={isRainy} compact />
              </CardContent>
            </Card>

            {/* Active Crops Section */}
            <ActiveCrops />
          </TabsContent>

          {/* PLANTS TAB */}
          <TabsContent value="plants" className="mt-6">
            <PlantLibrary plants={plants} />
          </TabsContent>

          {/* TASKS TAB */}
          <TabsContent value="tasks" className="mt-6 space-y-6">
            <TaskList isRainy={isRainy} />
          </TabsContent>

          {/* LOG TAB */}
          <TabsContent value="log" className="mt-6">
            <GardenLog />
          </TabsContent>

          {/* ALERTS TAB */}
          <TabsContent value="alerts" className="mt-6">
            <NotificationSettings />
          </TabsContent>

          {/* LOCAL PROS TAB */}
          <TabsContent value="local" className="mt-6">
            <ServiceProviders 
              latitude={profile?.latitude || null}
              longitude={profile?.longitude || null}
            />
          </TabsContent>
        </Tabs>
      </main>

      {/* Bottom padding for mobile */}
      <div className="h-6" />
    </div>
  )
}

function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return "Good morning! Ready for some gardening?"
  if (hour < 17) return "Good afternoon! How's the garden today?"
  return "Good evening! Time to relax and enjoy your garden."
}
