'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { getPrivateBetaHouseholdId } from '@/lib/access/private-beta'

export type ActionResult = { ok: true } | { ok: false; error: string }

export async function submitAccessRequest(displayName?: string | null): Promise<ActionResult> {
  const householdId = getPrivateBetaHouseholdId()
  if (!householdId) {
    return { ok: false, error: 'Garden access is not configured for this deployment yet.' }
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { ok: false, error: 'Sign in first, then try again.' }
  }

  const { error } = await supabase.rpc('request_household_access', {
    p_household_id: householdId,
    p_display_name: displayName?.trim() || null,
  })

  if (error) {
    return { ok: false, error: error.message }
  }

  revalidatePath('/pending-approval')
  revalidatePath('/admin/access-requests')
  return { ok: true }
}

export async function approveAccessRequest(
  requestId: string,
  role: 'member' | 'admin' = 'member',
): Promise<ActionResult> {
  const supabase = await createClient()
  const { error } = await supabase.rpc('approve_access_request', {
    p_request_id: requestId,
    p_role: role,
  })
  if (error) {
    return { ok: false, error: error.message }
  }
  revalidatePath('/admin/access-requests')
  revalidatePath('/pending-approval')
  revalidatePath('/my-garden')
  return { ok: true }
}

export async function denyAccessRequest(requestId: string, reviewNote?: string | null): Promise<ActionResult> {
  const supabase = await createClient()
  const { error } = await supabase.rpc('deny_access_request', {
    p_request_id: requestId,
    p_review_note: reviewNote?.trim() || null,
  })
  if (error) {
    return { ok: false, error: error.message }
  }
  revalidatePath('/admin/access-requests')
  return { ok: true }
}
