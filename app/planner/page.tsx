import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, Sun, Droplets, Thermometer, Leaf } from 'lucide-react'
import type { Plant } from '@/lib/types'

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

const currentMonth = new Date().getMonth()

// Simplified planting recommendations based on growing season
const getPlantingRecommendations = (plants: Plant[]) => {
  const now = new Date()
  const month = now.getMonth()
  
  // Spring: March-May (2-4), Summer: June-Aug (5-7), Fall: Sept-Nov (8-10), Winter: Dec-Feb (11-1)
  const isCoolSeason = month >= 2 && month <= 4 || month >= 8 && month <= 10
  const isWarmSeason = month >= 4 && month <= 8
  
  return plants.filter(plant => {
    if (!plant.growing_season) return false
    const season = plant.growing_season.toLowerCase()
    
    if (isWarmSeason && (season.includes('summer') || season.includes('spring'))) return true
    if (isCoolSeason && (season.includes('spring') || season.includes('fall'))) return true
    if (season.includes('year-round')) return true
    
    return false
  })
}

export default async function PlannerPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // Legacy plant reference path: old generic `plants` data should migrate
  // toward `plant_library` before this becomes a persisted planning surface.
  const { data: plants } = await supabase
    .from('plants')
    .select('*')
    .order('name')

  const recommendedPlants = getPlantingRecommendations(plants || [])

  // Legacy persistence path: `garden_plants` joined to `plants` and `gardens`
  // should eventually become `plantings` joined to `plant_library` and `garden_areas`.
  const { data: gardenPlants } = await supabase
    .from('garden_plants')
    .select(`
      *,
      plant:plants(*),
      garden:gardens(name)
    `)
    .in('status', ['planted', 'growing', 'harvesting'])
    .order('expected_harvest_date')

  const upcomingHarvests = (gardenPlants || []).filter(
    gp => gp.expected_harvest_date && new Date(gp.expected_harvest_date) >= new Date()
  ).slice(0, 5)

  return (
    <div className="min-h-screen flex flex-col">
      <Header user={user} />
      
      <main className="flex-1 container px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Season Planner</h1>
          <p className="text-muted-foreground">
            Plan your planting schedule and track upcoming harvests.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Current Season Info */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Current Season
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center py-4 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg">
                <div className="text-4xl mb-2">
                  {currentMonth >= 2 && currentMonth <= 4 ? '🌸' : 
                   currentMonth >= 5 && currentMonth <= 7 ? '☀️' :
                   currentMonth >= 8 && currentMonth <= 10 ? '🍂' : '❄️'}
                </div>
                <div className="text-xl font-semibold">
                  {currentMonth >= 2 && currentMonth <= 4 ? 'Spring' : 
                   currentMonth >= 5 && currentMonth <= 7 ? 'Summer' :
                   currentMonth >= 8 && currentMonth <= 10 ? 'Fall' : 'Winter'}
                </div>
                <div className="text-sm text-muted-foreground">{months[currentMonth]}</div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <Thermometer className="h-4 w-4" />
                    Climate Zone
                  </span>
                  <span className="font-medium">{profile?.climate_zone || 'Not Set'}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <Sun className="h-4 w-4" />
                    Best for Planting
                  </span>
                  <span className="font-medium">
                    {currentMonth >= 2 && currentMonth <= 4 ? 'Cool crops, transplants' : 
                     currentMonth >= 5 && currentMonth <= 7 ? 'Warm crops, succession' :
                     currentMonth >= 8 && currentMonth <= 10 ? 'Fall crops, cover' : 'Indoor starts'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recommended Plants */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Leaf className="h-5 w-5 text-primary" />
                Recommended to Plant Now
              </CardTitle>
              <CardDescription>
                Based on the current season and your location
              </CardDescription>
            </CardHeader>
            <CardContent>
              {recommendedPlants.length > 0 ? (
                <div className="grid sm:grid-cols-2 gap-4">
                  {recommendedPlants.slice(0, 6).map((plant) => (
                    <div key={plant.id} className="flex items-center gap-3 p-3 border rounded-lg">
                      <div className="text-2xl">
                        {plant.category === 'vegetable' && '🥕'}
                        {plant.category === 'fruit' && '🍓'}
                        {plant.category === 'herb' && '🌿'}
                        {plant.category === 'flower' && '🌸'}
                        {plant.category === 'shrub' && '🌳'}
                        {plant.category === 'tree' && '🌲'}
                        {plant.category === 'succulent' && '🌵'}
                        {plant.category === 'indoor' && '🪴'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{plant.name}</div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Sun className="h-3 w-3" />
                            {plant.sunlight_needs?.replace('_', ' ')}
                          </span>
                          <span className="flex items-center gap-1">
                            <Droplets className="h-3 w-3" />
                            {plant.water_needs}
                          </span>
                        </div>
                      </div>
                      <Badge variant="outline" className="shrink-0">
                        {plant.difficulty}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  No specific recommendations for this time of year.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Upcoming Harvests */}
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Upcoming Harvests
              </CardTitle>
              <CardDescription>
                Your plants that are expected to be ready soon
              </CardDescription>
            </CardHeader>
            <CardContent>
              {upcomingHarvests.length > 0 ? (
                <div className="space-y-3">
                  {upcomingHarvests.map((gp: any) => (
                    <div key={gp.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">
                          {gp.plant.category === 'vegetable' && '🥕'}
                          {gp.plant.category === 'fruit' && '🍓'}
                          {gp.plant.category === 'herb' && '🌿'}
                          {gp.plant.category === 'flower' && '🌸'}
                        </div>
                        <div>
                          <div className="font-medium">{gp.plant.name}</div>
                          <div className="text-sm text-muted-foreground">
                            in {gp.garden?.name}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={
                          gp.status === 'harvesting' ? 'bg-yellow-100 text-yellow-800' :
                          gp.status === 'growing' ? 'bg-green-100 text-green-800' :
                          'bg-blue-100 text-blue-800'
                        }>
                          {gp.status}
                        </Badge>
                        <div className="text-sm text-muted-foreground mt-1">
                          {new Date(gp.expected_harvest_date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No upcoming harvests scheduled.</p>
                  <p className="text-sm">Add plants to your gardens and set planted dates to see harvest predictions.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}
