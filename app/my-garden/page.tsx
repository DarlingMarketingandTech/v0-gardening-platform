import { redirect } from 'next/navigation'
import { DashboardClient } from '@/components/dashboard/dashboard-client'
import { DEMO_HOUSEHOLD_ID, demoPlants } from '@/lib/demo-garden'
import { hasPublicSupabaseEnv } from '@/lib/env/supabase-public'
import { createClient } from '@/lib/supabase/server'
import { getUserHousehold } from '@/lib/actions/household'

export default async function MyGardenPage() {
  if (!hasPublicSupabaseEnv()) {
    return <DashboardClient plants={demoPlants} householdId={DEMO_HOUSEHOLD_ID} />
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return <DashboardClient plants={demoPlants} householdId={DEMO_HOUSEHOLD_ID} />
  }

  const { household_id: householdId } = await getUserHousehold()
  if (!householdId) {
    redirect('/pending-approval')
  }

  return <DashboardClient plants={demoPlants} householdId={householdId} />
}
