export type PendingAccessRequest = {
  id: string
  household_id: string
  user_id: string
  email: string
  display_name: string | null
  status: string
  requested_at: string
}
