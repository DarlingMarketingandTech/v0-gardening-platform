'use server'

import { createClient } from '@/lib/supabase/server'

function normalizeEmail(email: string) {
  return email.trim().toLowerCase()
}

type CheckFamilyInviteRow = {
  invited: boolean
  household_id: string | null
  household_name: string | null
  role: string | null
}

type AcceptFamilyInviteRow = {
  success: boolean
  household_id: string | null
  role: string | null
  error_message: string | null
}

const MEMBERSHIP_CONNECT_ERROR =
  "You signed in, but we could not connect you to Momma D's Garden. Please check your invite setup."

/**
 * Check if an email has a family invite and get household details (SECURITY DEFINER RPC).
 */
export async function checkFamilyInvite(email: string) {
  const supabase = await createClient()
  const normalized = normalizeEmail(email)

  const { data, error } = await supabase.rpc('check_family_invite', { invite_email: normalized }).single()

  const row = data as CheckFamilyInviteRow | null

  if (error || !row) {
    return { invited: false, household_id: null, role: null, household_name: null }
  }

  if (!row.invited) {
    return { invited: false, household_id: null, role: null, household_name: null }
  }

  return {
    invited: true,
    household_id: row.household_id,
    role: row.role,
    household_name: row.household_name,
  }
}

/**
 * Accept a family invite and create household member record after user signs up.
 */
export async function acceptFamilyInvite(email: string, userId: string, displayName: string) {
  const supabase = await createClient()
  const normalized = normalizeEmail(email)

  const { data, error } = await supabase
    .rpc('accept_family_invite', {
      invite_email: normalized,
      new_user_id: userId,
      display_name: displayName ?? '',
    })
    .single()

  const row = data as AcceptFamilyInviteRow | null

  if (error) {
    return { success: false, error: error.message }
  }

  if (!row?.success) {
    return {
      success: false,
      error: row?.error_message ?? 'Failed to join household',
    }
  }

  return { success: true, household_id: row.household_id }
}

/**
 * Link an existing user to their household if they're not already linked.
 * Called after login if the user hasn't been added to household_members yet.
 */
export async function ensureHouseholdMembership(
  email: string,
  userId: string,
  displayName?: string | null,
) {
  const supabase = await createClient()
  const normalized = normalizeEmail(email)

  const { data: existing } = await supabase
    .from('household_members')
    .select('household_id')
    .eq('user_id', userId)
    .maybeSingle()

  if (existing?.household_id) {
    return { success: true, household_id: existing.household_id }
  }

  const fallbackDisplay =
    (typeof displayName === 'string' && displayName.trim()) || normalized.split('@')[0] || ''

  const { data, error } = await supabase
    .rpc('accept_family_invite', {
      invite_email: normalized,
      new_user_id: userId,
      display_name: fallbackDisplay,
    })
    .single()

  const row = data as AcceptFamilyInviteRow | null

  if (error) {
    const msg = error.message.toLowerCase()
    if (msg.includes('recursion') || msg.includes('infinite')) {
      return {
        success: false,
        error:
          'We could not connect you to the garden because of a server configuration problem. Please contact the garden admin.',
      }
    }
    return { success: false, error: MEMBERSHIP_CONNECT_ERROR }
  }

  if (!row?.success) {
    if (row?.error_message === 'No household invite found') {
      return {
        success: false,
        error: MEMBERSHIP_CONNECT_ERROR,
      }
    }
    return {
      success: false,
      error: row?.error_message ?? MEMBERSHIP_CONNECT_ERROR,
    }
  }

  return { success: true, household_id: row.household_id }
}

export async function getUserHousehold() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { household_id: null, role: null }
  }

  const { data, error } = await supabase
    .from('household_members')
    .select('household_id, role')
    .eq('user_id', user.id)
    .maybeSingle()

  if (error || !data) {
    return { household_id: null, role: null }
  }

  return { household_id: data.household_id, role: data.role }
}
