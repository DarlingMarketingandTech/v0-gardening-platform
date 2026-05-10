import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { DashboardClient } from '@/components/dashboard/dashboard-client'
import type { Garden, Plant, Profile } from '@/lib/types'

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

  // Fetch garden plant counts
  const gardenIds = gardens?.map(g => g.id) || []
  const { data: gardenPlants } = gardenIds.length > 0 
    ? await supabase
        .from('garden_plants')
        .select('garden_id, plant_id, status, planted_date, expected_harvest_date')
        .in('garden_id', gardenIds)
    : { data: [] }

  // Get total stats
  const { count: totalGardens } = await supabase
    .from('gardens')
    .select('*', { count: 'exact', head: true })

  const { count: totalPlants } = await supabase
    .from('garden_plants')
    .select('*', { count: 'exact', head: true })

  // Fetch profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // Fetch all plants for the library
  const { data: plants } = await supabase
    .from('plants')
    .select('*')
    .order('name')

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header user={user} />
      
      <DashboardClient
        user={user}
        profile={profile as Profile | null}
        gardens={(gardens || []) as Garden[]}
        gardenPlants={gardenPlants || []}
        plants={(plants || []) as Plant[]}
        totalGardens={totalGardens || 0}
        totalPlants={totalPlants || 0}
      />
      
      <Footer />
    </div>
  )
}
