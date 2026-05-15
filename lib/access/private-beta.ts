/**
 * Private beta access helpers — single household gate via env until invites mature.
 */

export type GardenHouseholdRole = 'owner' | 'admin' | 'member'

export function getPrivateBetaHouseholdId(): string | undefined {
  const id = process.env.NEXT_PUBLIC_PRIVATE_BETA_HOUSEHOLD_ID
  return id && id.trim() ? id.trim() : undefined
}

export function isPrivateBetaHouseholdConfigured(): boolean {
  return Boolean(getPrivateBetaHouseholdId())
}

/**
 * Where to send someone immediately after sign-in (or when they hit a gate).
 * - No household membership yet → wait for approval
 * - Owner/admin → review queue first
 * - Member → garden
 */
export function resolvePostLoginPath(
  role: GardenHouseholdRole | string | null | undefined,
  hasHousehold: boolean,
): '/pending-approval' | '/admin/access-requests' | '/my-garden' {
  if (!hasHousehold) return '/pending-approval'
  if (role === 'owner' || role === 'admin') return '/admin/access-requests'
  return '/my-garden'
}
