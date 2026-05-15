'use client'

import { useMemo } from 'react'
import { useGardenSpacesSource } from '@/lib/garden-os/hooks/use-garden-spaces-source'
import type { GardenContext } from '@/lib/garden-os/types'
import type { GardenSpacesSource } from '@/lib/garden-setup/types'

export function spacesSourceChanged(
  server: GardenSpacesSource,
  client: GardenSpacesSource,
): boolean {
  if (server.isPersonalized !== client.isPersonalized) return true
  if (server.spaces.length !== client.spaces.length) return true
  return server.spaces.some((space, index) => space.id !== client.spaces[index]?.id)
}

/**
 * Returns client-localStorage spaces when they differ from the server snapshot.
 * Demo mode (no householdId) always uses the server source.
 */
export function useHydratedSpacesSource(
  context: GardenContext,
  serverSpacesSource: GardenSpacesSource,
): GardenSpacesSource {
  const clientSpacesSource = useGardenSpacesSource(context.householdId)

  return useMemo(() => {
    if (!context.householdId) {
      return serverSpacesSource
    }

    if (spacesSourceChanged(serverSpacesSource, clientSpacesSource)) {
      return clientSpacesSource
    }

    return serverSpacesSource
  }, [context.householdId, serverSpacesSource, clientSpacesSource])
}
