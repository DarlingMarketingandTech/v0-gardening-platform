'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'

/** @deprecated Legacy access-request UI; private beta uses email allowlist + /not-allowed. */
export function PendingApprovalActions() {
  return (
    <p className="text-xs text-muted-foreground text-center w-full">
      Access is now managed by email allowlist.{' '}
      <Button variant="link" className="h-auto p-0 text-xs" asChild>
        <Link href="/not-allowed">Learn more</Link>
      </Button>
    </p>
  )
}
