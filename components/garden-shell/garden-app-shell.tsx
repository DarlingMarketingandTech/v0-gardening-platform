'use client'

import type { ReactNode } from 'react'
import { GardenBottomNav } from './garden-bottom-nav'
import { GardenQuickActionMenu } from './garden-quick-action-menu'
import { GardenShellHeader } from './garden-shell-header'
import { GardenTopNav } from './garden-top-nav'

interface GardenAppShellProps {
  children: ReactNode
  householdId?: string | null
}

export function GardenAppShell({ children, householdId = null }: GardenAppShellProps) {
  return (
    <div
      key={householdId ?? 'demo'}
      className="min-h-screen bg-linear-to-b from-primary/5 via-background to-accent/5"
      data-household-id={householdId ?? undefined}
    >
      <GardenShellHeader />
      <GardenTopNav />
      <main className="container px-4 py-4 pb-28 md:pb-8 md:py-6">{children}</main>
      <GardenBottomNav />
      <GardenQuickActionMenu />
    </div>
  )
}
