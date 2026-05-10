'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  Search, 
  Leaf, 
  Sun, 
  Droplets, 
  BookOpen,
  ExternalLink,
  X,
  Sprout,
  Flower2,
  TreeDeciduous
} from 'lucide-react'
import type { Plant } from '@/lib/types'

interface PlantLibraryProps {
  plants: Plant[]
}

interface WikiSummary {
  title: string
  extract: string
  thumbnail?: {
    source: string
  }
  content_urls?: {
    desktop: {
      page: string
    }
  }
}

function getCategoryIcon(category: string) {
  switch (category) {
    case 'vegetable':
      return <Sprout className="h-4 w-4" />
    case 'flower':
      return <Flower2 className="h-4 w-4" />
    case 'herb':
      return <Leaf className="h-4 w-4" />
    case 'tree':
    case 'shrub':
      return <TreeDeciduous className="h-4 w-4" />
    default:
      return <Leaf className="h-4 w-4" />
  }
}

function getCategoryColor(category: string) {
  switch (category) {
    case 'vegetable':
      return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
    case 'flower':
      return 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400'
    case 'herb':
      return 'bg-lime-100 text-lime-700 dark:bg-lime-900/30 dark:text-lime-400'
    case 'fruit':
      return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
    case 'indoor':
      return 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400'
    case 'succulent':
      return 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400'
    default:
      return 'bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400'
  }
}

export function PlantLibrary({ plants }: PlantLibraryProps) {
  const [search, setSearch] = useState('')
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null)
  const [wikiData, setWikiData] = useState<WikiSummary | null>(null)
  const [wikiLoading, setWikiLoading] = useState(false)
  const [wikiError, setWikiError] = useState<string | null>(null)

  const filteredPlants = plants.filter(plant =>
    plant.name.toLowerCase().includes(search.toLowerCase()) ||
    plant.scientific_name?.toLowerCase().includes(search.toLowerCase()) ||
    plant.category?.toLowerCase().includes(search.toLowerCase())
  )

  const fetchWikiData = useCallback(async (plantName: string, scientificName?: string) => {
    setWikiLoading(true)
    setWikiError(null)
    setWikiData(null)

    try {
      // Try scientific name first, then common name
      const searchTerms = [scientificName, plantName].filter(Boolean)
      
      for (const term of searchTerms) {
        const res = await fetch(
          `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(term || '')}`,
          { headers: { 'Accept': 'application/json' } }
        )
        
        if (res.ok) {
          const data = await res.json()
          if (data.extract) {
            setWikiData(data)
            return
          }
        }
      }
      
      setWikiError('No Wikipedia article found for this plant.')
    } catch (err) {
      console.error('Wiki fetch error:', err)
      setWikiError('Failed to load plant information from Wikipedia.')
    } finally {
      setWikiLoading(false)
    }
  }, [])

  useEffect(() => {
    if (selectedPlant) {
      fetchWikiData(selectedPlant.name, selectedPlant.scientific_name || undefined)
    }
  }, [selectedPlant, fetchWikiData])

  return (
    <>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              Plant Encyclopedia
            </span>
            <Badge variant="secondary" className="font-normal">
              {plants.length} plants
            </Badge>
          </CardTitle>
          <div className="relative mt-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search plants by name or category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px] pr-4">
            {filteredPlants.length === 0 ? (
              <div className="text-center py-12">
                <Leaf className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                <p className="text-muted-foreground">No plants found</p>
                <p className="text-sm text-muted-foreground/80">Try a different search term</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {filteredPlants.map((plant) => (
                  <button
                    key={plant.id}
                    onClick={() => setSelectedPlant(plant)}
                    className="group text-left p-4 rounded-xl border bg-card hover:bg-accent/50 hover:border-primary/30 transition-all duration-200"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${getCategoryColor(plant.category || '')}`}>
                        {getCategoryIcon(plant.category || '')}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold group-hover:text-primary transition-colors truncate">
                          {plant.name}
                        </h3>
                        <p className="text-sm text-muted-foreground italic truncate">
                          {plant.scientific_name}
                        </p>
                        <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
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
                    </div>
                  </button>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Plant Quick Info Modal */}
      <Dialog open={!!selectedPlant} onOpenChange={() => setSelectedPlant(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {selectedPlant && (
                  <div className={`p-2 rounded-lg ${getCategoryColor(selectedPlant.category || '')}`}>
                    {getCategoryIcon(selectedPlant.category || '')}
                  </div>
                )}
                <div>
                  <DialogTitle className="text-xl">{selectedPlant?.name}</DialogTitle>
                  <DialogDescription className="italic">
                    {selectedPlant?.scientific_name}
                  </DialogDescription>
                </div>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-4">
            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-3 rounded-lg bg-muted/50">
                <Sun className="h-5 w-5 mx-auto mb-1 text-amber-500" />
                <div className="text-xs text-muted-foreground">Sunlight</div>
                <div className="text-sm font-medium capitalize">
                  {selectedPlant?.sunlight_needs?.replace('_', ' ')}
                </div>
              </div>
              <div className="text-center p-3 rounded-lg bg-muted/50">
                <Droplets className="h-5 w-5 mx-auto mb-1 text-blue-500" />
                <div className="text-xs text-muted-foreground">Water</div>
                <div className="text-sm font-medium capitalize">{selectedPlant?.water_needs}</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-muted/50">
                <Leaf className="h-5 w-5 mx-auto mb-1 text-emerald-500" />
                <div className="text-xs text-muted-foreground">Difficulty</div>
                <div className="text-sm font-medium capitalize">{selectedPlant?.difficulty}</div>
              </div>
            </div>

            {/* App Description */}
            {selectedPlant?.description && (
              <div>
                <h4 className="text-sm font-medium mb-1">About</h4>
                <p className="text-sm text-muted-foreground">{selectedPlant.description}</p>
              </div>
            )}

            {/* Care Tips */}
            {selectedPlant?.care_tips && (
              <div>
                <h4 className="text-sm font-medium mb-1">Care Tips</h4>
                <p className="text-sm text-muted-foreground">{selectedPlant.care_tips}</p>
              </div>
            )}

            {/* Wikipedia Summary */}
            <div className="border-t pt-4">
              <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                From Wikipedia
              </h4>
              
              {wikiLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              ) : wikiError ? (
                <p className="text-sm text-muted-foreground">{wikiError}</p>
              ) : wikiData ? (
                <div className="space-y-2">
                  {wikiData.thumbnail && (
                    <img 
                      src={wikiData.thumbnail.source} 
                      alt={wikiData.title}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  )}
                  <p className="text-sm text-muted-foreground line-clamp-4">
                    {wikiData.extract}
                  </p>
                  {wikiData.content_urls?.desktop?.page && (
                    <Button variant="outline" size="sm" className="w-full mt-2" asChild>
                      <a href={wikiData.content_urls.desktop.page} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Read more on Wikipedia
                      </a>
                    </Button>
                  )}
                </div>
              ) : null}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
