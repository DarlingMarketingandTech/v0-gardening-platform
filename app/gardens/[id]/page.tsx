import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getHouseholdId } from '@/lib/actions/garden'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { AddPlantDialog } from '@/components/add-plant-dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Calendar, Plus, Sprout } from 'lucide-react'
import type { GardenArea, Planting } from '@/lib/types'

interface GardenDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function GardenDetailPage({ params }: GardenDetailPageProps) {
  const { id } = await params
  const supabase = await createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // Get user's household
  const { householdId } = await getHouseholdId(user.id)

  if (!householdId) {
    redirect('/gardens')
  }

  // Fetch garden area scoped to household
  const { data: gardenArea, error: areaError } = await supabase
    .from('garden_areas')
    .select('*')
    .eq('id', id)
    .eq('household_id', householdId)
    .single()

  if (areaError || !gardenArea) {
    notFound()
  }

  // Fetch plantings in this garden area
  const { data: plantings } = await supabase
    .from('plantings')
    .select('*')
    .eq('garden_area_id', id)
    .eq('household_id', householdId)
    .order('created_at', { ascending: false })

  const typedArea = gardenArea as GardenArea
  const typedPlantings = (plantings || []) as Planting[]

  const activeCount = typedPlantings.filter(p => ['planted', 'growing'].includes(p.status)).length
  const readyCount = typedPlantings.filter(p => p.status === 'ready').length

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container px-4 py-8">
        <Link 
          href="/gardens" 
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Garden Areas
        </Link>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Area Info */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-2xl">{typedArea.name}</CardTitle>
              {typedArea.description && (
                <CardDescription className="mt-4">
                  {typedArea.description}
                </CardDescription>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Created {new Date(typedArea.created_at).toLocaleDateString()}</span>
              </div>

              <div className="pt-4 border-t">
                <div className="text-sm font-medium mb-2">Quick Stats</div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-primary">
                      {typedPlantings.length}
                    </div>
                    <div className="text-xs text-muted-foreground">Plants</div>
                  </div>
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-primary">
                      {activeCount}
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
              <h2 className="text-xl font-semibold">Plants in this Area</h2>
              <AddPlantDialog gardenAreaId={id} />
            </div>

            {typedPlantings.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="pt-12 pb-12 text-center">
                  <Sprout className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-muted-foreground mb-4">No plants in this area yet</p>
                  <AddPlantDialog gardenAreaId={id} variant="outline" />
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {typedPlantings.map((planting) => (
                  <Card key={planting.id} className="overflow-hidden hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg">{planting.custom_name}</CardTitle>
                          <CardDescription>
                            Planted {new Date(planting.planted_date).toLocaleDateString()}
                          </CardDescription>
                        </div>
                        <Badge variant="secondary" className="capitalize">
                          {planting.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Quantity:</span>
                          <span className="font-medium">{planting.quantity}</span>
                        </div>
                        {planting.notes && (
                          <div className="pt-2 border-t">
                            <p className="text-muted-foreground">{planting.notes}</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}
