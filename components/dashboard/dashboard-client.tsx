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
import {
  Sprout,
  Leaf,
  Plus,
  Home,
  BookOpen,
  BookHeart,
  Flower2,
  Settings,
  Sun,
  Droplets,
  Bell,
  Package,
  MapPin,
  Bug,
} from 'lucide-react'
import type { Plant } from '@/lib/types'

interface DashboardClientProps {
  plants: Plant[]
  householdId?: string | null
}

type MainTab = 'today' | 'garden' | 'log' | 'guide'

export function DashboardClient({ plants, householdId }: DashboardClientProps) {
  const [activeTab, setActiveTab] = useState<MainTab>('today')
  const [isRainy, setIsRainy] = useState(false)
  const [showFullTaskList, setShowFullTaskList] = useState(false)

  // Check weather for rainy conditions if we have location data
  useEffect(() => {
    // Weather checking would go here if we had location data
    setIsRainy(false)
  }, [])

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
              <h1 className="font-semibold text-lg leading-tight">Momma D&apos;s Garden</h1>
              <p className="text-xs text-muted-foreground">Simple today, deeper when you want it</p>
            </div>
          </div>

          {/* In demo-first mode, avoid sending Mom to a protected /settings route. */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setActiveTab('guide')}
            aria-label="Open guide"
          >
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <main className="container px-4 py-6">
        {/* Greeting */}
        <div className="mb-6">
          <h2 className="text-2xl md:text-3xl font-bold mb-1">Welcome to your garden!</h2>
          <p className="text-muted-foreground">{getGreeting()}</p>
        </div>

        {/* Calm Navigation */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as MainTab)} className="space-y-6">
          <TabsList className="w-full grid grid-cols-4 h-auto bg-muted/50 p-1 rounded-xl">
            <TabsTrigger
              value="today"
              className="flex flex-col items-center gap-0.5 py-2 px-1 data-[state=active]:bg-background rounded-lg"
            >
              <Home className="h-4 w-4" />
              <span className="text-[10px]">Today</span>
            </TabsTrigger>

            <TabsTrigger
              value="garden"
              className="flex flex-col items-center gap-0.5 py-2 px-1 data-[state=active]:bg-background rounded-lg"
            >
              <Leaf className="h-4 w-4" />
              <span className="text-[10px]">Garden</span>
            </TabsTrigger>

            <TabsTrigger
              value="log"
              className="flex flex-col items-center gap-0.5 py-2 px-1 data-[state=active]:bg-background rounded-lg"
            >
              <BookHeart className="h-4 w-4" />
              <span className="text-[10px]">Log</span>
            </TabsTrigger>

            <TabsTrigger
              value="guide"
              className="flex flex-col items-center gap-0.5 py-2 px-1 data-[state=active]:bg-background rounded-lg"
            >
              <BookOpen className="h-4 w-4" />
              <span className="text-[10px]">Guide</span>
            </TabsTrigger>
          </TabsList>

          {/* TODAY */}
          <TabsContent value="today" className="space-y-6 mt-6">
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
                <h3 className="text-white text-xl font-semibold">Momma D&apos;s Garden</h3>
              </div>
            </div>

            {/* Weather */}
            <WeatherWidget latitude={null} longitude={null} />

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

            {/* One-next-step actions */}
            <Card className="border-primary/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-3">
                <Button className="h-auto py-4 flex-col gap-2" asChild>
                  <Link href="/plants">
                    <Leaf className="h-5 w-5" />
                    <span>Add Plant</span>
                  </Link>
                </Button>

                <Button
                  variant="outline"
                  className="h-auto py-4 flex-col gap-2"
                  onClick={() => setActiveTab('log')}
                >
                  <BookHeart className="h-5 w-5" />
                  <span>New Log Entry</span>
                </Button>

                <Button
                  variant="outline"
                  className="h-auto py-4 flex-col gap-2"
                  onClick={() => setActiveTab('garden')}
                >
                  <Sprout className="h-5 w-5" />
                  <span>View Crops</span>
                </Button>

                <Button
                  variant="outline"
                  className="h-auto py-4 flex-col gap-2"
                  onClick={() => setActiveTab('guide')}
                >
                  <BookOpen className="h-5 w-5" />
                  <span>Get Advice</span>
                </Button>
              </CardContent>
            </Card>

            {/* Tasks */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Today&apos;s Tasks</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <TaskList isRainy={isRainy} compact={!showFullTaskList} />

                <details
                  className="rounded-lg border bg-muted/10 p-3"
                  open={showFullTaskList}
                  onToggle={(event) => setShowFullTaskList(event.currentTarget.open)}
                >
                  <summary className="cursor-pointer text-sm font-medium">
                    {showFullTaskList ? 'Show fewer tasks' : 'See the full checklist'}
                  </summary>
                </details>
              </CardContent>
            </Card>
          </TabsContent>

          {/* GARDEN */}
          <TabsContent value="garden" className="mt-6 space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Garden Areas</CardTitle>
                <p className="text-sm text-muted-foreground">
                  We&apos;ll match your real backyard: pots, in-ground, and a raised bed with trellis.
                </p>
              </CardHeader>
              <CardContent className="grid gap-3">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <AreaCard title="Patio Pots" subtitle="Best for herbs + peppers" />
                  <AreaCard title="In-Ground" subtitle="Best for bigger root space" />
                  <AreaCard title="Raised Bed + Trellis" subtitle="Best for cucumbers + climbers" />
                </div>

                <div className="rounded-lg border bg-muted/10 p-3 text-sm text-muted-foreground">
                  Demo household: <span className="font-mono">{householdId ?? 'demo-momma-ds-garden'}</span>
                </div>
              </CardContent>
            </Card>

            <ActiveCrops />
          </TabsContent>

          {/* LOG */}
          <TabsContent value="log" className="mt-6 space-y-6">
            <GardenLog />
          </TabsContent>

          {/* GUIDE */}
          <TabsContent value="guide" className="mt-6 space-y-4">
            <Card className="border-primary/10">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Guide</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Optional depth. Open a section when you&apos;re curious.
                </p>
              </CardHeader>
            </Card>

            <details className="rounded-xl border bg-background p-4">
              <summary className="cursor-pointer font-semibold flex items-center gap-2">
                <BookOpen className="h-4 w-4" /> Plant Library
              </summary>
              <div className="mt-4">
                <PlantLibrary plants={plants} />
              </div>
            </details>

            <details className="rounded-xl border bg-background p-4">
              <summary className="cursor-pointer font-semibold flex items-center gap-2">
                <Package className="h-4 w-4" /> Seeds
              </summary>
              <div className="mt-4">
                <SeedInventory />
              </div>
            </details>

            <details className="rounded-xl border bg-background p-4">
              <summary className="cursor-pointer font-semibold flex items-center gap-2">
                <Bell className="h-4 w-4" /> Alerts & Reminders
              </summary>
              <div className="mt-4">
                <NotificationSettings />
              </div>
            </details>

            <details className="rounded-xl border bg-background p-4">
              <summary className="cursor-pointer font-semibold flex items-center gap-2">
                <Bug className="h-4 w-4" /> Pest lookup
              </summary>
              <div className="mt-4">
                <PestLookup />
              </div>
            </details>

            <details className="rounded-xl border bg-background p-4">
              <summary className="cursor-pointer font-semibold flex items-center gap-2">
                <MapPin className="h-4 w-4" /> Local help
              </summary>
              <div className="mt-4">
                <ServiceProviders latitude={null} longitude={null} />
              </div>
            </details>

            <details className="rounded-xl border bg-background p-4">
              <summary className="cursor-pointer font-semibold flex items-center gap-2">
                <MoonPhaseWidgetIcon /> Moon phase
              </summary>
              <div className="mt-4">
                <MoonPhaseWidget />
              </div>
            </details>
          </TabsContent>
        </Tabs>
      </main>

      {/* Bottom padding for mobile */}
      <div className="h-6" />
    </div>
  )
}

function AreaCard({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="rounded-xl border bg-muted/10 p-4">
      <div className="font-semibold">{title}</div>
      <div className="text-sm text-muted-foreground">{subtitle}</div>
      <div className="mt-3">
        <Button variant="outline" size="sm" disabled>
          Coming next
        </Button>
      </div>
    </div>
  )
}

function MoonPhaseWidgetIcon() {
  return (
    <span aria-hidden="true" className="inline-flex h-4 w-4 items-center justify-center">
      🌙
    </span>
  )
}

function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning! Ready for some gardening?'
  if (hour < 17) return "Good afternoon! How's the garden today?"
  return 'Good evening! Time to relax and enjoy your garden.'
}
