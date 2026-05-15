import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Flower2, Leaf } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { getUserHousehold } from '@/lib/actions/household'
import { hasPublicSupabaseEnv } from '@/lib/env/supabase-public'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AccessRequestsTable } from './access-requests-table'
import type { PendingAccessRequest } from './types'

export default async function AccessRequestsAdminPage() {
  if (!hasPublicSupabaseEnv()) {
    redirect('/auth/login?error=configuration')
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect('/auth/login')
  }

  const { household_id: householdId, role } = await getUserHousehold()
  if (!householdId) {
    redirect('/not-allowed')
  }
  if (role !== 'owner' && role !== 'admin') {
    redirect('/my-garden')
  }

  const { data: requests, error } = await supabase
    .from('access_requests')
    .select('id, household_id, user_id, email, display_name, status, requested_at')
    .eq('status', 'pending')
    .order('requested_at', { ascending: true })

  const rows = (requests ?? []) as PendingAccessRequest[]

  return (
    <div className="min-h-screen bg-linear-to-b from-primary/5 via-background to-accent/5">
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-primary/10">
        <div className="container px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Flower2 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="font-semibold text-lg leading-tight">Access requests</h1>
              <p className="text-xs text-muted-foreground">
                Legacy — private beta now uses email allowlist. Use only if you still receive join requests.
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/my-garden">Open My Garden</Link>
          </Button>
        </div>
      </header>

      <main className="container px-4 py-6 max-w-3xl mx-auto space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Pending</CardTitle>
            <CardDescription>
              {error
                ? `Could not load requests: ${error.message}`
                : rows.length === 0
                  ? 'No pending requests right now.'
                  : `${rows.length} waiting for you`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {rows.length > 0 ? <AccessRequestsTable requests={rows} /> : null}
          </CardContent>
        </Card>

        <p className="text-xs text-muted-foreground text-center">
          <Link href="/" className="inline-flex items-center gap-1 text-primary hover:underline">
            <Leaf className="h-3 w-3" />
            Home
          </Link>
        </p>
      </main>
    </div>
  )
}
