'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { GardenCard } from '@/components/garden-card'
import { WeatherWidget } from './weather-widget'
import { PlantLibrary } from './plant-library'
import { TaskList } from './task-list'
import { GardenLog } from './garden-log'
import { ServiceProviders } from './service-providers'
import { PlantIdentifier } from './plant-identifier'
import { 
  Sprout, 
  Leaf, 
  Calendar, 
  Plus, 
  ArrowRight,
  Home,
  BookOpen,
  MapPin,
  CheckSquare,
  BookHeart,
  Flower2
} from 'lucide-react'
import type { User } from '@supabase/supabase-js'
import type { Garden, Plant, Profile } from '@/lib/types'

interface DashboardClientProps {
  user: User
  profile: Profile | null
  gardens: Garden[]
  gardenPlants: { garden_id: string; plant_id: string; status: string; planted_date: string | null; expected_harvest_date: string | null }[]
  plants: Plant[]
  totalGardens: number
  totalPlants: number
}

export function DashboardClient({
  user,
  profile,
  gardens,
  gardenPlants,
  plants,
  totalGardens,
  totalPlants
}: DashboardClientProps) {
  const [activeTab, setActiveTab] = useState('home')
  const [isRainy, setIsRainy] = useState(false)

  // Calculate plant counts per garden
  const countByGarden = gardenPlants.reduce((acc: Record<string, number>, item) => {
    acc[item.garden_id] = (acc[item.garden_id] || 0) + 1
    return acc
  }, {})

  // Calculate upcoming harvests
  const upcomingHarvests = gardenPlants.filter(gp => {
    if (!gp.expected_harvest_date) return false
    const harvestDate = new Date(gp.expected_harvest_date)
    const now = new Date()
    const daysUntil = Math.ceil((harvestDate.getTime() - now.getTime()) / 86400000)
    return daysUntil >= 0 && daysUntil <= 14
  }).length

  // Check weather for rainy conditions (this will be set by WeatherWidget)
  useEffect(() => {
    const checkWeather = async () => {
      try {
        const res = await fetch(
          'https://api.open-meteo.com/v1/forecast?latitude=40.7128&longitude=-74.006&current=weather_code,precipitation'
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
  }, [])

  return (
    <main className="flex-1 container px-4 py-6">
      {/* Header Section */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-1">
          Welcome back{profile?.full_name ? `, ${profile.full_name}` : ''}!
        </h1>
        <p className="text-muted-foreground">
          Your personalized gardening dashboard
        </p>
      </div>

      {/* Tab Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="w-full md:w-auto flex-wrap h-auto gap-1 bg-muted/50 p-1">
          <TabsTrigger value="home" className="flex items-center gap-1.5 data-[state=active]:bg-background">
            <Home className="h-4 w-4" />
            <span className="hidden sm:inline">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="plants" className="flex items-center gap-1.5 data-[state=active]:bg-background">
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">Plants</span>
          </TabsTrigger>
          <TabsTrigger value="tasks" className="flex items-center gap-1.5 data-[state=active]:bg-background">
            <CheckSquare className="h-4 w-4" />
            <span className="hidden sm:inline">Tasks</span>
          </TabsTrigger>
          <TabsTrigger value="log" className="flex items-center gap-1.5 data-[state=active]:bg-background">
            <BookHeart className="h-4 w-4" />
            <span className="hidden sm:inline">Log</span>
          </TabsTrigger>
          <TabsTrigger value="local" className="flex items-center gap-1.5 data-[state=active]:bg-background">
            <MapPin className="h-4 w-4" />
            <span className="hidden sm:inline">Local Pros</span>
          </TabsTrigger>
        </TabsList>

        {/* HOME TAB */}
        <TabsContent value="home" className="space-y-6 mt-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Gardens
                </CardTitle>
                <Sprout className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl md:text-3xl font-bold">{totalGardens}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Plants Growing
                </CardTitle>
                <Leaf className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl md:text-3xl font-bold">{totalPlants}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Harvests Soon
                </CardTitle>
                <Flower2 className="h-4 w-4 text-amber-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl md:text-3xl font-bold">{upcomingHarvests}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Experience
                </CardTitle>
                <Calendar className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-xl md:text-2xl font-bold capitalize">
                  {profile?.experience_level || 'Beginner'}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Grid */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Weather Widget */}
            <WeatherWidget />

            {/* Plant Identifier */}
            <div className="space-y-6">
              <PlantIdentifier />
              
              {/* Quick Actions */}
              <Card className="bg-gradient-to-br from-primary/5 to-transparent border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-3">
                  <Button asChild>
                    <Link href="/gardens/new">
                      <Sprout className="h-4 w-4 mr-2" />
                      New Garden
                    </Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/plants">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Browse Plants
                    </Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/planner">
                      <Calendar className="h-4 w-4 mr-2" />
                      Planner
                    </Link>
                  </Button>
                  <Button variant="outline" onClick={() => setActiveTab('tasks')}>
                    <CheckSquare className="h-4 w-4 mr-2" />
                    Tasks
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Recent Gardens */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Your Gardens</h2>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/gardens">
                  View All
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </div>
            
            {gardens.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {gardens.slice(0, 3).map((garden) => (
                  <GardenCard 
                    key={garden.id} 
                    garden={garden} 
                    plantCount={countByGarden[garden.id] || 0}
                  />
                ))}
              </div>
            ) : (
              <Card className="text-center py-12">
                <CardContent>
                  <Sprout className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold text-lg mb-2">No gardens yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Create your first garden to start growing.
                  </p>
                  <Button asChild>
                    <Link href="/gardens/new">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Garden
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* PLANTS TAB */}
        <TabsContent value="plants" className="mt-6">
          <PlantLibrary plants={plants} />
        </TabsContent>

        {/* TASKS TAB */}
        <TabsContent value="tasks" className="mt-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <TaskList isRainy={isRainy} />
            <WeatherWidget />
          </div>
        </TabsContent>

        {/* LOG TAB */}
        <TabsContent value="log" className="mt-6">
          <GardenLog />
        </TabsContent>

        {/* LOCAL PROS TAB */}
        <TabsContent value="local" className="mt-6">
          <ServiceProviders />
        </TabsContent>
      </Tabs>
    </main>
  )
}
