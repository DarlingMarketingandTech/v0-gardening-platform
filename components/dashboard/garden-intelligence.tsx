import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { AlertTriangle, Brain, CalendarDays, Droplets, Flower2, MapPinned, Sprout, Sun, Tractor } from 'lucide-react'
import type { GardenInsight, GardenPlanting, GardenTask, GardenZone } from '@/lib/types'

const zoneLabels: Record<GardenZone['type'], string> = {
  container: 'Pots / Containers',
  in_ground: 'In-Ground Bed',
  raised_bed: 'Raised Bed',
  raised_bed_trellis: 'Raised Bed + Trellis',
}

const priorityLabel: Record<GardenInsight['priority'], string> = {
  high: 'High impact',
  medium: 'Good improvement',
  low: 'Nice polish',
}

interface GardenIntelligenceProps {
  zones: GardenZone[]
  plantings: GardenPlanting[]
  tasks: GardenTask[]
  insights: GardenInsight[]
}

export function GardenIntelligence({ zones, plantings, tasks, insights }: GardenIntelligenceProps) {
  return (
    <div className="space-y-6">
      <section className="grid gap-4 lg:grid-cols-[1.25fr_0.75fr]">
        <Card className="border-primary/20 bg-gradient-to-br from-background to-primary/5">
          <CardHeader>
            <div className="flex items-start gap-3">
              <div className="rounded-2xl bg-primary/10 p-3">
                <MapPinned className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle>Momma D&apos;s Garden Map</CardTitle>
                <CardDescription>
                  Organize the garden by real growing spaces so every plant has a smart home.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            {zones.map((zone) => (
              <Card key={zone.id} className="bg-background/80 shadow-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between gap-2">
                    <CardTitle className="text-base">{zone.name}</CardTitle>
                    <Badge variant="secondary">{zoneLabels[zone.type]}</Badge>
                  </div>
                  <CardDescription>{zone.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex gap-2">
                    <Sun className="mt-0.5 h-4 w-4 text-amber-500" />
                    <div>
                      <p className="font-medium">Sun</p>
                      <p className="text-muted-foreground capitalize">{zone.sunlight.replaceAll('_', ' ')}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Tractor className="mt-0.5 h-4 w-4 text-green-600" />
                    <div>
                      <p className="font-medium">Soil</p>
                      <p className="text-muted-foreground">{zone.soilProfile}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Droplets className="mt-0.5 h-4 w-4 text-blue-500" />
                    <div>
                      <p className="font-medium">Water</p>
                      <p className="text-muted-foreground">{zone.waterProfile}</p>
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <p className="mb-2 font-medium">Best for</p>
                    <div className="flex flex-wrap gap-1.5">
                      {zone.bestFor.map((crop) => (
                        <Badge key={crop} variant="outline">{crop}</Badge>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-xl bg-amber-50 p-3 text-amber-900 dark:bg-amber-950/30 dark:text-amber-200">
                    <div className="flex gap-2">
                      <AlertTriangle className="mt-0.5 h-4 w-4" />
                      <p>{zone.caution}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>

        <Card className="border-green-200/70 bg-green-50/70 dark:bg-green-950/20">
          <CardHeader>
            <div className="flex items-start gap-3">
              <div className="rounded-2xl bg-green-600/10 p-3">
                <Brain className="h-6 w-6 text-green-700 dark:text-green-300" />
              </div>
              <div>
                <CardTitle>Botanist Brain</CardTitle>
                <CardDescription>
                  The app should explain the science, then turn it into a simple action.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {insights.map((insight) => (
              <div key={insight.id} className="rounded-2xl border bg-background/80 p-4">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <Badge>{priorityLabel[insight.priority]}</Badge>
                  <Badge variant="outline" className="capitalize">{insight.topic}</Badge>
                </div>
                <h3 className="font-semibold">{insight.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{insight.summary}</p>
                <p className="mt-3 text-sm"><span className="font-medium">Science:</span> {insight.science}</p>
                <p className="mt-2 text-sm"><span className="font-medium">Do this:</span> {insight.action}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sprout className="h-5 w-5 text-primary" />
              Planting Plan
            </CardTitle>
            <CardDescription>
              What is planted where, and the strategy for getting impressive results.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {plantings.map((planting) => {
              const zone = zones.find((item) => item.id === planting.zoneId)

              return (
                <div key={planting.id} className="rounded-2xl border p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h3 className="font-semibold">{planting.plantName}</h3>
                      <p className="text-sm italic text-muted-foreground">{planting.scientificName}</p>
                    </div>
                    <Badge variant="secondary">{zone?.name ?? 'Unplaced'}</Badge>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">{planting.purpose}</p>
                  <p className="mt-3 text-sm"><span className="font-medium">Success strategy:</span> {planting.successStrategy}</p>
                  <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
                    <Badge variant="outline" className="capitalize">{planting.status.replaceAll('_', ' ')}</Badge>
                    <Badge variant="outline">Harvest: {planting.expectedHarvestWindow}</Badge>
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-primary" />
              Smart Timeline
            </CardTitle>
            <CardDescription>
              Small actions at the right time beat heroic rescue gardening later.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {tasks.map((task) => {
              const zone = zones.find((item) => item.id === task.zoneId)

              return (
                <div key={task.id} className="rounded-2xl border p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="font-semibold">{task.title}</h3>
                    <Badge className="capitalize">{task.dueTiming.replaceAll('_', ' ')}</Badge>
                  </div>
                  {zone && (
                    <p className="mt-1 text-xs text-muted-foreground">Zone: {zone.name}</p>
                  )}
                  <p className="mt-3 text-sm text-muted-foreground">{task.reason}</p>
                  <div className="mt-3 rounded-xl bg-primary/5 p-3 text-sm">
                    <div className="flex gap-2">
                      <Flower2 className="mt-0.5 h-4 w-4 text-primary" />
                      <p>{task.botanistNote}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
