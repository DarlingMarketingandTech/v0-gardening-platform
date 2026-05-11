import { createClient } from '@/lib/supabase/server'
import { getHouseholdId, getGardenAreas, ensureDefaultGardenAreas } from '@/lib/actions/garden'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Sprout, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

export default async function GardensPage() {
  const supabase = await createClient()
  
  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/auth/login')
  }
  
  // Get user's household
  const { householdId, error: householdError } = await getHouseholdId(user.id)
  
  if (!householdId) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container py-12 px-4">
          <div className="flex items-start gap-3 p-4 border border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-900 rounded-lg">
            <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-amber-900 dark:text-amber-200">Household not found</h3>
              <p className="text-sm text-amber-800 dark:text-amber-300">Please contact your garden admin.</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }
  
  // Ensure default garden areas exist
  await ensureDefaultGardenAreas(householdId)
  
  // Fetch garden areas
  const { areas } = await getGardenAreas(householdId)
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container py-8 px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Garden Areas</h1>
            <p className="text-muted-foreground">Organize your garden by location and type</p>
          </div>
          <Button asChild>
            <Link href="/gardens/new">
              <Plus className="h-4 w-4 mr-2" />
              New Area
            </Link>
          </Button>
        </div>
        
        {areas.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="pt-12 pb-12 text-center">
              <Sprout className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground mb-4">No garden areas yet</p>
              <Button asChild variant="outline">
                <Link href="/gardens/new">Create your first area</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {areas.map((area: any) => (
              <Link key={area.id} href={`/gardens/${area.id}`}>
                <Card className="cursor-pointer hover:shadow-md transition-shadow h-full">
                  <CardHeader>
                    <CardTitle className="text-lg">{area.name}</CardTitle>
                    {area.description && (
                      <CardDescription>{area.description}</CardDescription>
                    )}
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  )
}
