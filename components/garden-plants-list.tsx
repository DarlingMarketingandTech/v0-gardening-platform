'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Sprout, Trash2, Calendar, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import type { GardenPlant, Plant } from '@/lib/types'

interface GardenPlantsListProps {
  gardenPlants: (GardenPlant & { plant: Plant })[]
  gardenId: string
}

const statusColors: Record<string, string> = {
  planned: 'bg-gray-100 text-gray-800',
  planted: 'bg-blue-100 text-blue-800',
  growing: 'bg-green-100 text-green-800',
  harvesting: 'bg-yellow-100 text-yellow-800',
  completed: 'bg-purple-100 text-purple-800',
}

const statusLabels: Record<string, string> = {
  planned: 'Planned',
  planted: 'Planted',
  growing: 'Growing',
  harvesting: 'Harvesting',
  completed: 'Completed',
}

export function GardenPlantsList({ gardenPlants, gardenId }: GardenPlantsListProps) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const supabase = createClient()

  const handleStatusChange = async (plantId: string, newStatus: string) => {
    startTransition(async () => {
      const { error } = await supabase
        .from('garden_plants')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', plantId)

      if (error) {
        toast.error('Failed to update status')
        return
      }

      toast.success('Status updated')
      router.refresh()
    })
  }

  const handleRemovePlant = async (plantId: string) => {
    if (!confirm('Are you sure you want to remove this plant from your garden?')) {
      return
    }

    startTransition(async () => {
      const { error } = await supabase
        .from('garden_plants')
        .delete()
        .eq('id', plantId)

      if (error) {
        toast.error('Failed to remove plant')
        return
      }

      toast.success('Plant removed from garden')
      router.refresh()
    })
  }

  if (gardenPlants.length === 0) {
    return (
      <Card className="text-center py-12">
        <CardContent>
          <Sprout className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-semibold text-lg mb-2">No plants yet</h3>
          <p className="text-muted-foreground">
            Add plants from our database to start tracking your garden.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {gardenPlants.map((gardenPlant) => (
        <Card key={gardenPlant.id} className="overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-start gap-4">
              <div className="h-16 w-16 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-3xl shrink-0">
                {gardenPlant.plant.category === 'vegetable' && '🥕'}
                {gardenPlant.plant.category === 'fruit' && '🍓'}
                {gardenPlant.plant.category === 'herb' && '🌿'}
                {gardenPlant.plant.category === 'flower' && '🌸'}
                {gardenPlant.plant.category === 'shrub' && '🌳'}
                {gardenPlant.plant.category === 'tree' && '🌲'}
                {gardenPlant.plant.category === 'succulent' && '🌵'}
                {gardenPlant.plant.category === 'indoor' && '🪴'}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold">{gardenPlant.plant.name}</h3>
                    <p className="text-sm text-muted-foreground italic">
                      {gardenPlant.plant.scientific_name}
                    </p>
                  </div>
                  <Badge className={statusColors[gardenPlant.status]}>
                    {statusLabels[gardenPlant.status]}
                  </Badge>
                </div>

                <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-muted-foreground">
                  <span>Qty: {gardenPlant.quantity}</span>
                  {gardenPlant.planted_date && (
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      Planted: {new Date(gardenPlant.planted_date).toLocaleDateString()}
                    </span>
                  )}
                  {gardenPlant.expected_harvest_date && (
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      Harvest: {new Date(gardenPlant.expected_harvest_date).toLocaleDateString()}
                    </span>
                  )}
                </div>

                {gardenPlant.notes && (
                  <p className="text-sm text-muted-foreground mt-2 bg-muted/50 p-2 rounded">
                    {gardenPlant.notes}
                  </p>
                )}

                <div className="flex items-center gap-2 mt-4">
                  <Select
                    value={gardenPlant.status}
                    onValueChange={(value) => handleStatusChange(gardenPlant.id, value)}
                    disabled={isPending}
                  >
                    <SelectTrigger className="w-[140px] h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="planned">Planned</SelectItem>
                      <SelectItem value="planted">Planted</SelectItem>
                      <SelectItem value="growing">Growing</SelectItem>
                      <SelectItem value="harvesting">Harvesting</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => handleRemovePlant(gardenPlant.id)}
                    disabled={isPending}
                  >
                    {isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
