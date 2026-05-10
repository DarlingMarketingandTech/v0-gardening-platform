import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { GardenCard } from '@/components/garden-card'
import { Sprout, Leaf, Calendar, Plus, ArrowRight } from 'lucide-react'
import type { Garden } from '@/lib/types'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // Fetch user's gardens
  const { data: gardens } = await supabase
    .from('gardens')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(3)

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

  // Get total stats
  const { count: totalGardens } = await supabase
    .from('gardens')
    .select('*', { count: 'exact', head: true })

  const { count: totalPlants } = await supabase
    .from('garden_plants')
    .select('*', { count: 'exact', head: true })

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <div className="min-h-screen flex flex-col">
      <Header user={user} />
      
      <main className="flex-1 container px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back{profile?.full_name ? `, ${profile.full_name}` : ''}!
          </h1>
          <p className="text-muted-foreground">
            Here&apos;s an overview of your gardening journey.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Gardens
              </CardTitle>
              <Sprout className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalGardens || 0}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Plants Growing
              </CardTitle>
              <Leaf className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalPlants || 0}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Experience Level
              </CardTitle>
              <Calendar className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold capitalize">
                {profile?.experience_level || 'Beginner'}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Climate Zone
              </CardTitle>
              <Calendar className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {profile?.climate_zone || 'Not Set'}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Create New Garden
              </CardTitle>
              <CardDescription>
                Start planning a new garden bed or container garden.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link href="/gardens/new">Create Garden</Link>
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Leaf className="h-5 w-5" />
                Browse Plants
              </CardTitle>
              <CardDescription>
                Explore our plant database and find the perfect plants.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" asChild>
                <Link href="/plants">View Plants</Link>
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Season Planner
              </CardTitle>
              <CardDescription>
                Plan your planting schedule based on your climate zone.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" asChild>
                <Link href="/planner">Open Planner</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Gardens */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Your Gardens</h2>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/gardens">
                View All
                <ArrowRight className="h-4 w-4 ml-1" />
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
            <Card className="text-center py-12">
              <CardContent>
                <Sprout className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">No gardens yet</h3>
                <p className="text-muted-foreground mb-4">
                  Create your first garden to start planning and growing.
                </p>
                <Button asChild>
                  <Link href="/gardens/new">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Garden
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  )
}
