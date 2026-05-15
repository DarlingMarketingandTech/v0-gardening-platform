'use client'

import { useEffect, useState } from 'react'
import { getGardenSpacesForHousehold } from '@/lib/garden-setup/store'
import type { GardenSpacesSource } from '@/lib/garden-setup/types'

export function useGardenSpacesSource(householdId: string | null | undefined): GardenSpacesSource {
  const [spacesSource, setSpacesSource] = useState(() => getGardenSpacesForHousehold(householdId))

  useEffect(() => {
    setSpacesSource(getGardenSpacesForHousehold(householdId))
  }, [householdId])

  return spacesSource
}
