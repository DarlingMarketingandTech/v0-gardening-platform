import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { GardenPlantsList } from '@/components/garden-plants-list'
import { AddPlantDialog } from '@/components/add-plant-dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, MapPin, Ruler, Calendar } from 'lucide-react'
import type { Garden, GardenPlant, Plant } from '@/lib/types'

interface GardenDetailPageProps {
  params: Promise<{ id: string }>
}

const gardenTypeLabels: Record<string, string> = {
  raised_bed: 'Raised Bed',
  container: 'Container',
  in_ground: 'In Ground',
  greenhouse: 'Greenhouse',
  balcony: 'Balcony',
  indoor: 'Indoor',
}

export default async function GardenDetailPage({ params }: GardenDetailPageProps) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // Legacy persistence path: this route still reads old `gardens` rows.
  // Future household-backed spaces should read from `garden_areas`.
  const { data: garden, error } = await supabase
    .from('gardens')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !garden) {
    notFound()
  }

  // Legacy persistence path: `garden_plants` plus joined `plants` should
  // eventually become `plantings` joined to `plant_library`.
  const { data: gardenPlants } = await supabase
    .from('garden_plants')
    .select(`
      *,
      plant:plants(*)
    `)
    .eq('garden_id', id)
    .order('created_at', { ascending: false })

  // Legacy plant reference path: old generic `plants` data should migrate
  // toward `plant_library` when persistence work is scheduled.
  const { data: allPlants } = await supabase
    .from('plants')
    .select('*')
    .order('name')

  const typedGarden = garden as Garden
  const typedGardenPlants = (gardenPlants || []) as (GardenPlant & { plant: Plant })[]
  const typedAllPlants = (allPlants || []) as Plant[]

  return (
    <div className="min-h-screen flex flex-col">
      <Header user={user} />
      
      <main className="flex-1 container px-4 py-8">
        <Link 
          href="/gardens" 
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Gardens
        </Link>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Garden Info */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl">{typedGarden.name}</CardTitle>
                  <Badge variant="secondary" className="mt-2">
                    {gardenTypeLabels[typedGarden.garden_type]}
                  </Badge>
                </div>
              </div>
              {typedGarden.description && (
                <CardDescription className="mt-4">
                  {typedGarden.description}
                </CardDescription>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              {typedGarden.location && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{typedGarden.location}</span>
                </div>
              )}
              {typedGarden.size_sqft && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Ruler className="h-4 w-4" />
                  <span>{typedGarden.size_sqft} sq ft</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Created {new Date(typedGarden.created_at).toLocaleDateString()}</span>
              </div>

              <div className="pt-4 border-t">
                <div className="text-sm font-medium mb-2">Quick Stats</div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-primary">
                      {typedGardenPlants.length}
                    </div>
                    <div className="text-xs text-muted-foreground">Plants</div>
                  </div>
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-primary">
                      {typedGardenPlants.filter(p => p.status === 'growing').length}
                    </div>
                    <div className="text-xs text-muted-foreground">Growing</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Plants List */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Plants in this Garden</h2>
              <AddPlantDialog gardenId={id} plants={typedAllPlants} />
            </div>

            <GardenPlantsList 
              gardenPlants={typedGardenPlants} 
              gardenId={id}
            />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}
