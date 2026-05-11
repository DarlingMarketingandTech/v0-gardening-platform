'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { PlantCard } from '@/components/plant-card'
import { PlantsFilters } from '@/components/plants-filters'
import { Card, CardContent } from '@/components/ui/card'
import { Sprout } from 'lucide-react'
import type { Plant, PlantLibraryItem } from '@/lib/types'

export default function PlantsPage() {
  const [plants, setPlants] = useState<Plant[]>([])
  const [filteredPlants, setFilteredPlants] = useState<Plant[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchPlants = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('plant_library')
        .select('*')
        .order('common_name')

      if (error) {
        console.error('Error fetching plants:', error)
        setPlants([])
        setFilteredPlants([])
      } else {
        // Convert PlantLibraryItem to Plant for compatibility
        const converted: Plant[] = (data || []).map((item: any) => ({
          id: item.id,
          name: item.common_name,
          scientific_name: item.scientific_name,
          category: item.category,
          difficulty: 'intermediate',
          sunlight_needs: (item.sunlight_needs as any) || 'partial_sun',
          water_needs: (item.water_needs as any) || 'moderate',
          days_to_maturity: item.days_to_maturity,
          description: item.description,
          care_tips: item.care_notes,
        }))
        setPlants(converted)
        setFilteredPlants(converted)
      }
      setLoading(false)
    }

    fetchPlants()
  }, [])

  const handleFilterChange = (filters: {
    category?: string
    difficulty?: string
    sunlight?: string
    water?: string
    search?: string
  }) => {
    let filtered = plants

    if (filters.category) {
      filtered = filtered.filter(p => p.category === filters.category)
    }
    if (filters.difficulty) {
      filtered = filtered.filter(p => p.difficulty === filters.difficulty)
    }
    if (filters.sunlight) {
      filtered = filtered.filter(p => p.sunlight_needs === filters.sunlight)
    }
    if (filters.water) {
      filtered = filtered.filter(p => p.water_needs === filters.water)
    }
    if (filters.search) {
      const search = filters.search.toLowerCase()
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(search) ||
        (p.scientific_name?.toLowerCase().includes(search) ?? false) ||
        (p.description?.toLowerCase().includes(search) ?? false)
      )
    }

    setFilteredPlants(filtered)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Plant Database</h1>
          <p className="text-muted-foreground">
            Explore our collection of plants and find the perfect ones for your garden.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading plants...</p>
          </div>
        ) : plants.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="pt-12 pb-12 text-center">
              <Sprout className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground">No plants in the library yet.</p>
            </CardContent>
          </Card>
        ) : (
          <>
            <PlantsFilters onFilterChange={handleFilterChange} />

            {filteredPlants && filteredPlants.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
                {filteredPlants.map((plant: Plant) => (
                  <PlantCard key={plant.id} plant={plant} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No plants found matching your criteria.</p>
              </div>
            )}
          </>
        )}
      </main>
      
      <Footer />
    </div>
  )
}
