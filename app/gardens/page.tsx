import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { GardenCard } from '@/components/garden-card'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Plus, Sprout } from 'lucide-react'
import type { Garden } from '@/lib/types'

export default async function GardensPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const { data: gardens } = await supabase
    .from('gardens')
    .select('*')
    .order('created_at', { ascending: false })

  // Fetch garden plant counts
  const gardenIds = gardens?.map(g => g.id) || []
  const { data: plantCounts } = gardenIds.length > 0
    ? await supabase
        .from('garden_plants')
        .select('garden_id')
        .in('garden_id', gardenIds)
    : { data: [] }

  const countByGarden = (plantCounts || []).reduce((acc: Record<string, number>, item: { garden_id: string }) => {
    acc[item.garden_id] = (acc[item.garden_id] || 0) + 1
    return acc
  }, {})

  return (
    <div className="min-h-screen flex flex-col">
      <Header user={user} />
      
      <main className="flex-1 container px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Gardens</h1>
            <p className="text-muted-foreground">
              Manage and organize all your garden spaces.
            </p>
          </div>
          <Button asChild>
            <Link href="/gardens/new">
              <Plus className="h-4 w-4 mr-2" />
              New Garden
            </Link>
          </Button>
        </div>

        {gardens && gardens.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {gardens.map((garden: Garden) => (
              <GardenCard 
                key={garden.id} 
                garden={garden} 
                plantCount={countByGarden[garden.id] || 0}
              />
            ))}
          </div>
        ) : (
          <Card className="text-center py-16">
            <CardContent>
              <Sprout className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold text-xl mb-2">No gardens yet</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Create your first garden to start planning your plants and tracking your growing journey.
              </p>
              <Button size="lg" asChild>
                <Link href="/gardens/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Garden
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
      
      <Footer />
    </div>
  )
}
