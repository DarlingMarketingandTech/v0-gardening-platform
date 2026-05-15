import { redirect } from 'next/navigation'

/** Legacy route — private beta now uses /not-allowed for unsigned allowlist users. */
export default function PendingApprovalPage() {
  redirect('/not-allowed')
}
