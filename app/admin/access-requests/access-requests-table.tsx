'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { approveAccessRequest, denyAccessRequest } from '@/app/admin/access-requests/actions'
import type { PendingAccessRequest } from './types'
import { Loader2 } from 'lucide-react'

export function AccessRequestsTable({ requests }: { requests: PendingAccessRequest[] }) {
  const router = useRouter()
  const [busyId, setBusyId] = useState<string | null>(null)

  const fmt = (iso: string) => {
    try {
      return new Date(iso).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })
    } catch {
      return iso
    }
  }

  const run = async (id: string, mode: 'approve' | 'deny') => {
    setBusyId(id)
    try {
      if (mode === 'approve') {
        const res = await approveAccessRequest(id, 'member')
        if (!res.ok) {
          alert(res.error)
          return
        }
      } else {
        const res = await denyAccessRequest(id, null)
        if (!res.ok) {
          alert(res.error)
          return
        }
      }
      router.refresh()
    } finally {
      setBusyId(null)
    }
  }

  return (
    <ul className="divide-y rounded-lg border">
      {requests.map((r) => (
        <li key={r.id} className="p-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-medium text-foreground">{r.email}</p>
            {r.display_name ? <p className="text-sm text-muted-foreground">{r.display_name}</p> : null}
            <p className="text-xs text-muted-foreground mt-1">{fmt(r.requested_at)}</p>
          </div>
          <div className="flex gap-2 shrink-0">
            <Button
              size="sm"
              variant="default"
              disabled={busyId === r.id}
              onClick={() => void run(r.id, 'approve')}
            >
              {busyId === r.id ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Approve'}
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={busyId === r.id}
              onClick={() => void run(r.id, 'deny')}
            >
              Deny
            </Button>
          </div>
        </li>
      ))}
    </ul>
  )
}
