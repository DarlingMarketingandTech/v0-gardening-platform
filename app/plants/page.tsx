import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { PlantCard } from '@/components/plant-card'
import { PlantsFilters } from '@/components/plants-filters'
import type { Plant } from '@/lib/types'

interface PlantsPageProps {
  searchParams: Promise<{
    category?: string
    difficulty?: string
    sunlight?: string
    water?: string
    search?: string
  }>
}

export default async function PlantsPage({ searchParams }: PlantsPageProps) {
  const params = await searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let query = supabase.from('plants').select('*')

  if (params.category) {
    query = query.eq('category', params.category)
  }
  if (params.difficulty) {
    query = query.eq('difficulty', params.difficulty)
  }
  if (params.sunlight) {
    query = query.eq('sunlight_needs', params.sunlight)
  }
  if (params.water) {
    query = query.eq('water_needs', params.water)
  }
  if (params.search) {
    query = query.or(`name.ilike.%${params.search}%,scientific_name.ilike.%${params.search}%,description.ilike.%${params.search}%`)
  }

  const { data: plants } = await query.order('name')

  return (
    <div className="min-h-screen flex flex-col">
      <Header user={user} />
      
      <main className="flex-1 container px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Plant Database</h1>
          <p className="text-muted-foreground">
            Explore our collection of plants and find the perfect ones for your garden.
          </p>
        </div>

        <PlantsFilters />

        {plants && plants.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
            {plants.map((plant: Plant) => (
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
