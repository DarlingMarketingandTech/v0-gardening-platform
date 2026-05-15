import type { ReactNode } from 'react'
import { GardenAppShell } from '@/components/garden-shell/garden-app-shell'
import { MyGardenSetupGate } from '@/components/my-garden/my-garden-setup-gate'
import { getGardenContext } from '@/lib/garden-os/get-garden-context'

export default async function MyGardenLayout({ children }: { children: ReactNode }) {
  const context = await getGardenContext()

  if (!context.householdId) {
    return <GardenAppShell>{children}</GardenAppShell>
  }

  return (
    <MyGardenSetupGate householdId={context.householdId}>
      <GardenAppShell householdId={context.householdId}>{children}</GardenAppShell>
    </MyGardenSetupGate>
  )
}
