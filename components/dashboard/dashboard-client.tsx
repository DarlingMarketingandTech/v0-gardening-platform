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
import { MoonPhaseWidget } from './moon-phase-widget'
import { SeedInventory } from './seed-inventory'
import { PestLookup } from './pest-lookup'
import { GardenIntelligence } from './garden-intelligence'
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
  Bell,
  Package,
  Brain,
} from 'lucide-react'
import type { GardenInsight, GardenPlanting, GardenTask, GardenZone, Plant } from '@/lib/types'

interface DashboardClientProps {
  plants: Plant[]
  householdId?: string | null
  zones?: GardenZone[]
  plantings?: GardenPlanting[]
  tasks?: GardenTask[]
  insights?: GardenInsight[]
}

export function DashboardClient({
  plants,
  householdId,
  zones = [],
  plantings = [],
  tasks = [],
  insights = [],
}: DashboardClientProps) {
  const [activeTab, setActiveTab] = useState('home')
  const [isRainy, setIsRainy] = useState(false)

  useEffect(() => {
    setIsRainy(false)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 via-background to-accent/5">
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-primary/10">
        <div className="container px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Flower2 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="font-semibold text-lg leading-tight">
                Momma D&apos;s Garden
              </h1>
              <p className="text-xs text-muted-foreground">Indianapolis backyard intelligence</p>
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
        <div className="mb-6">
          <h2 className="text-2xl md:text-3xl font-bold mb-1">
            Welcome to your garden!
          </h2>
          <p className="text-muted-foreground">
            {getGreeting()}
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="w-full grid grid-cols-8 h-auto bg-muted/50 p-1 rounded-xl">
            <TabsTrigger value="home" className="flex flex-col items-center gap-0.5 py-2 px-1 data-[state=active]:bg-background rounded-lg">
              <Home className="h-4 w-4" />
              <span className="text-[10px]">Home</span>
            </TabsTrigger>
            <TabsTrigger value="map" className="flex flex-col items-center gap-0.5 py-2 px-1 data-[state=active]:bg-background rounded-lg">
              <Brain className="h-4 w-4" />
              <span className="text-[10px]">Plan</span>
            </TabsTrigger>
            <TabsTrigger value="plants" className="flex flex-col items-center gap-0.5 py-2 px-1 data-[state=active]:bg-background rounded-lg">
              <BookOpen className="h-4 w-4" />
              <span className="text-[10px]">Plants</span>
            </TabsTrigger>
            <TabsTrigger value="seeds" className="flex flex-col items-center gap-0.5 py-2 px-1 data-[state=active]:bg-background rounded-lg">
              <Package className="h-4 w-4" />
              <span className="text-[10px]">Seeds</span>
            </TabsTrigger>
            <TabsTrigger value="tasks" className="flex flex-col items-center gap-0.5 py-2 px-1 data-[state=active]:bg-background rounded-lg">
              <CheckSquare className="h-4 w-4" />
              <span className="text-[10px]">Tasks</span>
            </TabsTrigger>
            <TabsTrigger value="log" className="flex flex-col items-center gap-0.5 py-2 px-1 data-[state=active]:bg-background rounded-lg">
              <BookHeart className="h-4 w-4" />
              <span className="text-[10px]">Log</span>
            </TabsTrigger>
            <TabsTrigger value="alerts" className="flex flex-col items-center gap-0.5 py-2 px-1 data-[state=active]:bg-background rounded-lg">
              <Bell className="h-4 w-4" />
              <span className="text-[10px]">Alerts</span>
            </TabsTrigger>
            <TabsTrigger value="local" className="flex flex-col items-center gap-0.5 py-2 px-1 data-[state=active]:bg-background rounded-lg">
              <MapPin className="h-4 w-4" />
              <span className="text-[10px]">Local</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="home" className="space-y-6 mt-6">
            <div className="relative h-48 md:h-56 rounded-2xl overflow-hidden shadow-lg">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/20220618_180911-PBDTHZW4x1HiwJrf0Vqz8sEWuvlZ2P.jpg"
                alt="Garden with squash growing on trellis"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <p className="text-white/80 text-sm">Your Garden</p>
                <h3 className="text-white text-xl font-semibold">Momma D&apos;s Garden</h3>
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2">
                <WeatherWidget latitude={null} longitude={null} />
              </div>
              <MoonPhaseWidget />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <Card className="bg-green-50 dark:bg-green-950/30 border-green-200/50">
                <CardContent className="pt-4 pb-4 text-center">
                  <Sprout className="h-6 w-6 text-green-600 dark:text-green-400 mx-auto mb-1" />
                  <div className="text-2xl font-bold text-green-700 dark:text-green-300">{plantings.length || 3}</div>
                  <div className="text-xs text-green-600/80 dark:text-green-400/80">Plantings</div>
                </CardContent>
              </Card>
              <Card className="bg-amber-50 dark:bg-amber-950/30 border-amber-200/50">
                <CardContent className="pt-4 pb-4 text-center">
                  <Sun className="h-6 w-6 text-amber-600 dark:text-amber-400 mx-auto mb-1" />
                  <div className="text-2xl font-bold text-amber-700 dark:text-amber-300">{zones.length || 3}</div>
                  <div className="text-xs text-amber-600/80 dark:text-amber-400/80">Zones</div>
                </CardContent>
              </Card>
              <Card className="bg-blue-50 dark:bg-blue-950/30 border-blue-200/50">
                <CardContent className="pt-4 pb-4 text-center">
                  <Droplets className="h-6 w-6 text-blue-600 dark:text-blue-400 mx-auto mb-1" />
                  <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">{tasks.length || 3}</div>
                  <div className="text-xs text-blue-600/80 dark:text-blue-400/80">Smart Tasks</div>
                </CardContent>
              </Card>
            </div>

            <Card className="border-primary/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-3">
                <Button className="h-auto py-4 flex-col gap-2" onClick={() => setActiveTab('map')}>
                  <Brain className="h-5 w-5" />
                  <span>Garden Plan</span>
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

            <ActiveCrops />
          </TabsContent>

          <TabsContent value="map" className="mt-6">
            <GardenIntelligence zones={zones} plantings={plantings} tasks={tasks} insights={insights} />
          </TabsContent>

          <TabsContent value="plants" className="mt-6">
            <PlantLibrary plants={plants} />
          </TabsContent>

          <TabsContent value="seeds" className="mt-6">
            <SeedInventory />
          </TabsContent>

          <TabsContent value="tasks" className="mt-6 space-y-6">
            <TaskList isRainy={isRainy} />
          </TabsContent>

          <TabsContent value="log" className="mt-6 space-y-6">
            <PestLookup />
            <GardenLog />
          </TabsContent>

          <TabsContent value="alerts" className="mt-6">
            <NotificationSettings />
          </TabsContent>

          <TabsContent value="local" className="mt-6">
            <ServiceProviders latitude={null} longitude={null} />
          </TabsContent>
        </Tabs>
      </main>

      <div className="h-6" />
    </div>
  )
}

function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning! Ready for some gardening?'
  if (hour < 17) return "Good afternoon! How's the garden today?"
  return 'Good evening! Time to relax and enjoy your garden.'
}
