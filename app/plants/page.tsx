'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { PlantCard } from '@/components/plant-card'
import { PlantsFilters } from '@/components/plants-filters'
import type { Plant } from '@/lib/types'

// Sample plant data
const SAMPLE_PLANTS: Plant[] = [
  {
    id: '1',
    name: 'Tomato',
    scientific_name: 'Solanum lycopersicum',
    category: 'vegetable',
    difficulty: 'beginner',
    sunlight_needs: 'full_sun',
    water_needs: 'moderate',
    days_to_maturity: 70,
    description: 'Popular garden vegetable, rich in vitamins and great for fresh eating or cooking.',
    care_tips: 'Provide sturdy support, consistent watering, and full sunlight.',
  },
  {
    id: '2',
    name: 'Basil',
    scientific_name: 'Ocimum basilicum',
    category: 'herb',
    difficulty: 'beginner',
    sunlight_needs: 'full_sun',
    water_needs: 'moderate',
    days_to_maturity: 21,
    description: 'Aromatic herb perfect for cooking and companion planting.',
    care_tips: 'Pinch off flowers to encourage leaf growth. Keep soil moist but not waterlogged.',
  },
  {
    id: '3',
    name: 'Pepper',
    scientific_name: 'Capsicum annuum',
    category: 'vegetable',
    difficulty: 'intermediate',
    sunlight_needs: 'full_sun',
    water_needs: 'moderate',
    days_to_maturity: 60,
    description: 'Colorful and nutritious, peppers add beauty and flavor to gardens and kitchens.',
    care_tips: 'Provide consistent warmth and moisture. Support heavy fruit with stakes.',
  },
]

export default function PlantsPage() {
  const [plants, setPlants] = useState<Plant[]>(SAMPLE_PLANTS)
  const [filteredPlants, setFilteredPlants] = useState<Plant[]>(SAMPLE_PLANTS)

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
      </main>
      
      <Footer />
    </div>
  )
}
