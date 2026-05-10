'use client'

import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MapPin, Ruler, ArrowRight } from 'lucide-react'
import type { Garden } from '@/lib/types'

interface GardenCardProps {
  garden: Garden
  plantCount?: number
}

const gardenTypeLabels: Record<string, string> = {
  raised_bed: 'Raised Bed',
  container: 'Container',
  in_ground: 'In Ground',
  greenhouse: 'Greenhouse',
  balcony: 'Balcony',
  indoor: 'Indoor',
}

const gardenTypeIcons: Record<string, string> = {
  raised_bed: '🌱',
  container: '🪴',
  in_ground: '🌾',
  greenhouse: '🏡',
  balcony: '🌺',
  indoor: '🪻',
}

export function GardenCard({ garden, plantCount = 0 }: GardenCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow group">
      <div className="h-32 bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center">
        <span className="text-5xl">{gardenTypeIcons[garden.garden_type] || '🌿'}</span>
      </div>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{garden.name}</CardTitle>
            {garden.description && (
              <CardDescription className="line-clamp-1">{garden.description}</CardDescription>
            )}
          </div>
          <Badge variant="secondary">
            {gardenTypeLabels[garden.garden_type]}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          {garden.location && (
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span>{garden.location}</span>
            </div>
          )}
          {garden.size_sqft && (
            <div className="flex items-center gap-1">
              <Ruler className="h-4 w-4" />
              <span>{garden.size_sqft} sq ft</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {plantCount} {plantCount === 1 ? 'plant' : 'plants'}
          </p>
          <Button variant="ghost" size="sm" asChild className="group-hover:bg-primary/10">
            <Link href={`/gardens/${garden.id}`}>
              View Garden
              <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
