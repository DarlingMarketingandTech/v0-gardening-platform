'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { getUserHousehold } from '@/lib/actions/household'

export type ActionResult = { ok: true } | { ok: false; error: string }

/** @deprecated Legacy shared-household access requests; private beta now uses email allowlist. */
export async function submitAccessRequest(displayName?: string | null): Promise<ActionResult> {
  const { household_id: householdId } = await getUserHousehold()
  if (!householdId) {
    return { ok: false, error: 'You need an approved garden before using this legacy request flow.' }
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
  revalidatePath('/my-garden')
  revalidatePath('/not-allowed')
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
