'use server'

import { createClient } from '@/lib/supabase/server'

/**
 * Check if an email has a family invite and get household details
 */
export async function checkFamilyInvite(email: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('family_invites')
    .select('id, household_id, role, households(name)')
    .eq('email', email.toLowerCase())
    .single()

  if (error || !data) {
    return { invited: false, household_id: null, role: null, household_name: null }
  }

  return {
    invited: true,
    household_id: data.household_id,
    role: data.role,
    household_name: data.households && Array.isArray(data.households) && data.households[0]?.name ? data.households[0].name : (data.households as any)?.name,
  }
}

/**
 * Accept a family invite and create household member record after user signs up
 */
export async function acceptFamilyInvite(email: string, userId: string, displayName: string) {
  const supabase = await createClient()

  // Get the invite to find household_id and role
  const { data: invite, error: inviteError } = await supabase
    .from('family_invites')
    .select('household_id, role')
    .eq('email', email.toLowerCase())
    .single()

  if (inviteError || !invite) {
    return { success: false, error: 'Invalid invite' }
  }

  // Create household member record
  const { error: memberError } = await supabase
    .from('household_members')
    .insert({
      household_id: invite.household_id,
      user_id: userId,
      role: invite.role,
      display_name: displayName,
    })

  if (memberError) {
    return { success: false, error: memberError.message }
  }

  // Mark invite as accepted
  await supabase
    .from('family_invites')
    .update({ accepted_at: new Date().toISOString() })
    .eq('email', email.toLowerCase())

  return { success: true, household_id: invite.household_id }
}

/**
 * Link an existing user to their household if they're not already linked
 * Called after login if the user hasn't been added to household_members yet
 */
export async function ensureHouseholdMembership(email: string, userId: string) {
  const supabase = await createClient()

  // Check if user already has household membership
  const { data: existing } = await supabase
    .from('household_members')
    .select('household_id')
    .eq('user_id', userId)
    .single()

  if (existing) {
    return { success: true, household_id: existing.household_id }
  }

  // Check if there's an invite for this email
  const { data: invite, error: inviteError } = await supabase
    .from('family_invites')
    .select('household_id, role')
    .eq('email', email.toLowerCase())
    .single()

  if (inviteError || !invite) {
    return { success: false, error: 'No household invite found' }
  }

  // Add user to household
  const { error: memberError } = await supabase
    .from('household_members')
    .insert({
      household_id: invite.household_id,
      user_id: userId,
      role: invite.role,
      display_name: email.split('@')[0],
    })

  if (memberError) {
    return { success: false, error: memberError.message }
  }

  // Mark invite as accepted if not already accepted
  await supabase
    .from('family_invites')
    .update({ accepted_at: new Date().toISOString() })
    .eq('email', email.toLowerCase())
    .is('accepted_at', null)

  return { success: true, household_id: invite.household_id }
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
    .single()

  if (error || !data) {
    return { household_id: null, role: null }
  }

  return { household_id: data.household_id, role: data.role }
}
