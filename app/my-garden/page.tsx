import { redirect } from 'next/navigation'
import { DashboardClient } from '@/components/dashboard/dashboard-client'
import { MyGardenSetupGate } from '@/components/my-garden/my-garden-setup-gate'
import { DEMO_HOUSEHOLD_ID, demoPlants } from '@/lib/demo-garden'
import { hasPublicSupabaseEnv } from '@/lib/env/supabase-public'
import { createClient } from '@/lib/supabase/server'
import { claimPrivateBetaHousehold, getMyHouseholdMembership } from '@/lib/access/private-beta'

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

  let { householdId } = await getMyHouseholdMembership(supabase)

  if (!householdId) {
    const claim = await claimPrivateBetaHousehold(supabase)
    if (claim.householdId) {
      householdId = claim.householdId
    } else {
      redirect('/not-allowed')
    }
  }

  return (
    <MyGardenSetupGate householdId={householdId}>
      <DashboardClient plants={demoPlants} householdId={householdId} />
    </MyGardenSetupGate>
  )
}
