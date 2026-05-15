'use client'

import { StateBadge } from '@/components/garden-ui/state-badge'
import type { GardenZoneCondition } from '@/lib/garden-os/types'

const toneByCondition: Record<GardenZoneCondition, 'stable' | 'water' | 'attention' | 'critical'> = {
  stable: 'stable',
  needs_water: 'water',
  attention: 'attention',
  critical: 'critical',
}

export interface ZoneConditionBadgeProps {
  condition: GardenZoneCondition
  label: string
  className?: string
}

export function ZoneConditionBadge({ condition, label, className }: ZoneConditionBadgeProps) {
  return (
    <StateBadge tone={toneByCondition[condition]} size="md" className={className}>
      {label}
    </StateBadge>
  )
}
