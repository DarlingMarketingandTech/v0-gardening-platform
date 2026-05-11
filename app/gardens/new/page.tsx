'use server'

import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getHouseholdId } from '@/lib/actions/garden'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft } from 'lucide-react'
import { NewGardenAreaForm } from '@/components/new-garden-area-form'

export default async function NewGardenAreaPage() {
  const supabase = await createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const { householdId } = await getHouseholdId(user.id)

  if (!householdId) {
    redirect('/gardens')
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container px-4 py-8 max-w-2xl">
        <Link 
          href="/gardens" 
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Garden Areas
        </Link>

        <Card>
          <CardHeader>
            <CardTitle>Create New Garden Area</CardTitle>
            <CardDescription>
              Add a new garden area to organize your plants by location or type.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <NewGardenAreaForm householdId={householdId} />
          </CardContent>
        </Card>
      </main>
      
      <Footer />
    </div>
  )
}
