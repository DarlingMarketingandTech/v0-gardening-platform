import { redirect } from 'next/navigation'
import { SetupPageClient } from '@/components/setup/setup-page-client'
import { claimPrivateBetaHousehold, getMyHouseholdMembership } from '@/lib/access/private-beta'
import { hasPublicSupabaseEnv } from '@/lib/env/supabase-public'
import { createClient } from '@/lib/supabase/server'

export default async function SetupPage() {
  if (!hasPublicSupabaseEnv()) {
    redirect('/my-garden')
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  let { householdId } = await getMyHouseholdMembership(supabase)

  if (!householdId) {
    const claim = await claimPrivateBetaHousehold(supabase)
    if (!claim.householdId) {
      redirect('/not-allowed')
    }
    householdId = claim.householdId
  }

  const displayName =
    (typeof user.user_metadata?.full_name === 'string' && user.user_metadata.full_name) ||
    (typeof user.user_metadata?.name === 'string' && user.user_metadata.name) ||
    undefined

  return <SetupPageClient householdId={householdId} initialDisplayName={displayName} />
}
