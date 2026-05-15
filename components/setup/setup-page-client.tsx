'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { GardenSetupWizard } from '@/components/setup/garden-setup-wizard'
import { isGardenSetupComplete } from '@/lib/garden-setup/store'

interface SetupPageClientProps {
  householdId: string
  initialDisplayName?: string
}

export function SetupPageClient({ householdId, initialDisplayName }: SetupPageClientProps) {
  const router = useRouter()

  useEffect(() => {
    if (isGardenSetupComplete(householdId)) {
      router.replace('/my-garden')
    }
  }, [householdId, router])

  return <GardenSetupWizard householdId={householdId} initialDisplayName={initialDisplayName} />
}
