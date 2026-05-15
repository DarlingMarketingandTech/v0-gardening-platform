'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2 } from 'lucide-react'
import { submitAccessRequest } from '@/app/admin/access-requests/actions'
import { isPrivateBetaHouseholdConfigured } from '@/lib/access/private-beta'

export function PendingApprovalActions() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)
  const canRequest = isPrivateBetaHouseholdConfigured()

  const onRequest = async () => {
    setError(null)
    setLoading(true)
    try {
      const res = await submitAccessRequest(null)
      if (!res.ok) {
        setError(res.error)
        return
      }
      setDone(true)
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  if (!canRequest) {
    return (
      <p className="text-xs text-muted-foreground text-center w-full">
        Request-from-app is not enabled (missing <code className="text-[10px]">NEXT_PUBLIC_PRIVATE_BETA_HOUSEHOLD_ID</code>
        ). Ask your admin to add you in Supabase or through their invite flow.
      </p>
    )
  }

  return (
    <div className="w-full space-y-2">
      {error ? (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}
      {done ? (
        <Alert>
          <AlertDescription>Request sent. We will notify the garden admin.</AlertDescription>
        </Alert>
      ) : (
        <Button type="button" className="w-full" disabled={loading} onClick={() => void onRequest()}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {loading ? 'Sending…' : 'Request garden access'}
        </Button>
      )}
    </div>
  )
}
