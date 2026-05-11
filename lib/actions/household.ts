'use server'

import { createClient } from '@/lib/supabase/server'

function normalizeEmail(email: string) {
  return email.trim().toLowerCase()
}

function getSiteOrigin(preferredOrigin?: string | null) {
  const candidates = [
    preferredOrigin,
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : null,
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
    'http://localhost:3000',
  ]

  for (const candidate of candidates) {
    if (!candidate) continue

    const withProtocol = /^https?:\/\//i.test(candidate) ? candidate : `https://${candidate}`

    try {
      const url = new URL(withProtocol)
      const isLocalhost = url.hostname === 'localhost' || url.hostname === '127.0.0.1'

      if (url.protocol === 'http:' && !isLocalhost) {
        continue
      }

      return url.origin
    } catch {
      continue
    }
  }

  return 'http://localhost:3000'
}

function getSafeMembershipError(errorMessage?: string | null) {
  switch (errorMessage) {
    case 'No household invite found':
      return "This email is not currently invited to Momma D's Garden. Please contact the garden admin."
    case 'Email does not match this account':
      return 'This invite does not match the signed-in email address.'
    case 'Unauthorized':
    case 'User not found':
      return 'Please request a fresh garden sign-in link and try again.'
    default:
      return MEMBERSHIP_CONNECT_ERROR
  }
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
  "We could not connect you to Momma D's Garden. Please check your invite setup."

/**
 * Check if an email has a family invite and get household details.
 * This intentionally goes through the SECURITY DEFINER RPC so clients do not
 * read family_invites directly.
 */
export async function checkFamilyInvite(email: string) {
  const supabase = await createClient()
  const normalized = normalizeEmail(email)

  const { data, error } = await supabase.rpc('check_family_invite', { invite_email: normalized }).single()
  const row = data as CheckFamilyInviteRow | null

  if (error || !row || !row.invited) {
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
 * Send a passwordless Supabase magic link after checking the family invite.
 * Login should authenticate only; household attachment happens after callback.
 */
export async function sendGardenMagicLink(email: string, redirectOrigin?: string) {
  const supabase = await createClient()
  const normalized = normalizeEmail(email)

  if (!normalized) {
    return { success: false, error: 'Enter your email address.' }
  }

  const invite = await checkFamilyInvite(normalized)
  if (!invite.invited) {
    return {
      success: false,
      error: `${normalized} is not invited to Momma D's Garden. Please contact the garden admin.`,
    }
  }

  const emailRedirectTo = new URL('/auth/callback', getSiteOrigin(redirectOrigin))
  emailRedirectTo.searchParams.set('next', '/my-garden')

  const { error } = await supabase.auth.signInWithOtp({
    email: normalized,
    options: {
      shouldCreateUser: true,
      emailRedirectTo: emailRedirectTo.toString(),
    },
  })

  if (error) {
    return { success: false, error: error.message }
  }

  return {
    success: true,
    message: `Check ${normalized} for your garden sign-in link.`,
  }
}

/**
 * Accept a family invite for the currently authenticated user.
 * Use this from the auth callback or onboarding only, never from login submit.
 */
export async function claimCurrentUserInvite(displayName?: string | null) {
  const supabase = await createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user?.email) {
    return { success: false, error: 'You need to sign in before joining the garden.' }
  }

  const existing = await getUserHousehold()
  if (existing.household_id) {
    return { success: true, household_id: existing.household_id, role: existing.role }
  }

  const normalized = normalizeEmail(user.email)
  const fallbackDisplay =
    (typeof displayName === 'string' && displayName.trim()) ||
    (typeof user.user_metadata?.full_name === 'string' && user.user_metadata.full_name.trim()) ||
    normalized.split('@')[0] ||
    ''

  const { data, error } = await supabase
    .rpc('accept_family_invite', {
      invite_email: normalized,
      new_user_id: user.id,
      display_name: fallbackDisplay,
    })
    .single()

  const row = data as AcceptFamilyInviteRow | null

  if (error) {
    return { success: false, error: MEMBERSHIP_CONNECT_ERROR }
  }

  if (!row?.success) {
    return {
      success: false,
      error: getSafeMembershipError(row?.error_message),
    }
  }

  return { success: true, household_id: row.household_id, role: row.role }
}

/**
 * Backwards-compatible wrapper for old imports. Login should not call this;
 * use claimCurrentUserInvite after Supabase has established a server session.
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
      error: getSafeMembershipError(row?.error_message),
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
