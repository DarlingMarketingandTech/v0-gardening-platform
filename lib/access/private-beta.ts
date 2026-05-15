import type { SupabaseClient } from '@supabase/supabase-js'

export type GardenHouseholdRole = 'owner' | 'admin' | 'member'

export type HouseholdMembership = {
  householdId: string | null
  role: GardenHouseholdRole | null
}

export type ClaimPrivateBetaResult = {
  success: boolean
  householdId: string | null
  role: GardenHouseholdRole | null
  notAllowlisted: boolean
  errorMessage: string | null
}

type ClaimPrivateBetaRow = {
  success: boolean
  household_id: string | null
  role: string | null
  error_message: string | null
}

function parseRole(role: string | null | undefined): GardenHouseholdRole | null {
  if (role === 'owner' || role === 'admin' || role === 'member') return role
  return null
}

export async function getMyHouseholdMembership(
  supabase: SupabaseClient,
): Promise<HouseholdMembership> {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { householdId: null, role: null }
  }

  const { data, error } = await supabase
    .from('household_members')
    .select('household_id, role')
    .eq('user_id', user.id)
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle()

  if (error || !data?.household_id) {
    return { householdId: null, role: null }
  }

  return {
    householdId: data.household_id,
    role: parseRole(data.role),
  }
}

export async function claimPrivateBetaHousehold(
  supabase: SupabaseClient,
): Promise<ClaimPrivateBetaResult> {
  const { data, error } = await supabase.rpc('claim_private_beta_household').single()

  const row = data as ClaimPrivateBetaRow | null

  if (error) {
    return {
      success: false,
      householdId: null,
      role: null,
      notAllowlisted: false,
      errorMessage: error.message,
    }
  }

  if (!row?.success) {
    return {
      success: false,
      householdId: null,
      role: null,
      notAllowlisted: Boolean(row?.error_message?.toLowerCase().includes('allowlist')),
      errorMessage: row?.error_message ?? 'Could not claim garden access',
    }
  }

  return {
    success: true,
    householdId: row.household_id,
    role: parseRole(row.role),
    notAllowlisted: false,
    errorMessage: null,
  }
}

export function resolvePrivateBetaDestination(
  claim: ClaimPrivateBetaResult,
): '/my-garden' | '/not-allowed' {
  if (claim.householdId) return '/my-garden'
  return '/not-allowed'
}
