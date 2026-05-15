'use client'

import { useEffect, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { DEMO_HOUSEHOLD_ID } from '@/lib/demo-garden'
import { isGardenSetupComplete } from '@/lib/garden-setup/store'

interface MyGardenSetupGateProps {
  householdId: string | null | undefined
  children: ReactNode
}

/** Sends signed-in users without a saved setup profile to /setup once. */
export function MyGardenSetupGate({ householdId, children }: MyGardenSetupGateProps) {
  const router = useRouter()

  useEffect(() => {
    if (!householdId || householdId === DEMO_HOUSEHOLD_ID) return
    if (isGardenSetupComplete(householdId)) return
    router.replace('/setup')
  }, [householdId, router])

  return <>{children}</>
}
