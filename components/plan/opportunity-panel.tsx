import { ActionPill, AppSurface, SectionCard } from '@/components/garden-ui'
import type { PlanOpportunity } from '@/lib/garden-os/types'
import { Sprout } from 'lucide-react'
import { planConfidenceBadge } from '@/components/plan/plan-confidence-badge'

interface OpportunityPanelProps {
  opportunities: PlanOpportunity[]
}

export function OpportunityPanel({ opportunities }: OpportunityPanelProps) {
  if (opportunities.length === 0) return null

  return (
    <SectionCard
      eyebrow="Openings"
      title="Opportunities to sketch"
      description="Ideas matched to the spaces you already tend — tap below is a placeholder until plan saves ship."
    >
      <ul className="grid gap-3 sm:grid-cols-2">
        {opportunities.map((o) => (
          <li key={o.id}>
            <AppSurface variant="elevated" padding="md" radius="lg" className="flex h-full flex-col gap-3">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <p className="min-w-0 text-sm font-semibold leading-snug text-[var(--garden-text)]">{o.title}</p>
                {planConfidenceBadge(o.confidence)}
              </div>
              <p className="text-xs leading-relaxed text-[var(--garden-text-muted)]">{o.whyItFits}</p>
              <div className="mt-auto flex flex-wrap items-center gap-2 border-t border-[color-mix(in_oklch,var(--garden-primary)_12%,var(--garden-border))] pt-3 text-[11px] text-[var(--garden-text-muted)]">
                <Sprout className="size-3.5 shrink-0 text-[var(--garden-primary)]" aria-hidden />
                {o.bestSpaceName ? (
                  <span>
                    <span className="font-medium text-[var(--garden-text)]">Best fit:</span> {o.bestSpaceName}
                  </span>
                ) : (
                  <span className="font-medium text-[var(--garden-text)]">Any space you choose</span>
                )}
                <span className="text-[var(--garden-text-muted)]">·</span>
                <span>{o.timingLabel}</span>
              </div>
              <ActionPill type="button" variant="secondary" size="sm" disabled className="w-full sm:w-auto">
                Add to plan soon
              </ActionPill>
            </AppSurface>
          </li>
        ))}
      </ul>
    </SectionCard>
  )
}
