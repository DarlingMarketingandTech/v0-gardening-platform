import type { PlanConfidence } from '@/lib/garden-os/types'
import { StateBadge } from '@/components/garden-ui'

export function planConfidenceBadge(confidence: PlanConfidence) {
  switch (confidence) {
    case 'high':
      return <StateBadge tone="stable">Grounded in your spaces</StateBadge>
    case 'medium':
      return <StateBadge tone="neutral">Gentle read</StateBadge>
    default:
      return <StateBadge tone="neutral">Starter hint</StateBadge>
  }
}
