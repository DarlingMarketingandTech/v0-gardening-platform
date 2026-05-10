'use client'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Sun, Droplets, Clock, Plus } from 'lucide-react'
import type { Plant } from '@/lib/types'

interface PlantCardProps {
  plant: Plant
  onAddToGarden?: (plant: Plant) => void
  showAddButton?: boolean
}

const categoryColors: Record<string, string> = {
  vegetable: 'bg-green-100 text-green-800',
  fruit: 'bg-red-100 text-red-800',
  herb: 'bg-emerald-100 text-emerald-800',
  flower: 'bg-pink-100 text-pink-800',
  shrub: 'bg-lime-100 text-lime-800',
  tree: 'bg-amber-100 text-amber-800',
  succulent: 'bg-teal-100 text-teal-800',
  indoor: 'bg-cyan-100 text-cyan-800',
}

const sunlightLabels: Record<string, string> = {
  full_sun: 'Full Sun',
  partial_sun: 'Partial Sun',
  shade: 'Shade',
}

const waterLabels: Record<string, string> = {
  low: 'Low',
  moderate: 'Moderate',
  high: 'High',
}

const difficultyColors: Record<string, string> = {
  easy: 'bg-green-100 text-green-800',
  moderate: 'bg-yellow-100 text-yellow-800',
  hard: 'bg-red-100 text-red-800',
}

export function PlantCard({ plant, onAddToGarden, showAddButton = false }: PlantCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="h-40 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
        <div className="text-6xl opacity-50">
          {plant.category === 'vegetable' && '🥕'}
          {plant.category === 'fruit' && '🍓'}
          {plant.category === 'herb' && '🌿'}
          {plant.category === 'flower' && '🌸'}
          {plant.category === 'shrub' && '🌳'}
          {plant.category === 'tree' && '🌲'}
          {plant.category === 'succulent' && '🌵'}
          {plant.category === 'indoor' && '🪴'}
        </div>
      </div>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-semibold text-lg leading-tight">{plant.name}</h3>
            {plant.scientific_name && (
              <p className="text-xs text-muted-foreground italic">{plant.scientific_name}</p>
            )}
          </div>
          <Badge className={categoryColors[plant.category] || 'bg-gray-100 text-gray-800'}>
            {plant.category}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {plant.description}
        </p>
        
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className={difficultyColors[plant.difficulty]}>
            {plant.difficulty}
          </Badge>
        </div>
        
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Sun className="h-3.5 w-3.5 text-yellow-500" />
            <span>{sunlightLabels[plant.sunlight_needs]}</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Droplets className="h-3.5 w-3.5 text-blue-500" />
            <span>{waterLabels[plant.water_needs]}</span>
          </div>
          {plant.days_to_harvest && (
            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock className="h-3.5 w-3.5 text-primary" />
              <span>{plant.days_to_harvest}d</span>
            </div>
          )}
        </div>

        {showAddButton && onAddToGarden && (
          <Button 
            onClick={() => onAddToGarden(plant)} 
            size="sm" 
            className="w-full mt-2"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add to Garden
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
