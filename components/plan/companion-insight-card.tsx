import type { ReactNode } from 'react'
import { AppSurface } from '@/components/garden-ui'
import type { PlanCompanionHint } from '@/lib/garden-os/types'
import { Flower2, Droplets, Move, Sprout } from 'lucide-react'

const toneIcon: Record<PlanCompanionHint['tone'], ReactNode> = {
  pairing: <Sprout className="size-4 text-[var(--garden-primary)]" aria-hidden />,
  pollinator: <Flower2 className="size-4 text-[var(--garden-primary)]" aria-hidden />,
  spacing: <Move className="size-4 text-[var(--garden-primary)]" aria-hidden />,
  water: <Droplets className="size-4 text-[var(--garden-water)]" aria-hidden />,
}

interface CompanionInsightCardProps {
  hint: PlanCompanionHint
}

export function CompanionInsightCard({ hint }: CompanionInsightCardProps) {
  return (
    <AppSurface variant="glass" padding="md" radius="lg" className="flex gap-3">
      <div
        className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[var(--garden-surface-muted)]"
        aria-hidden
      >
        {toneIcon[hint.tone]}
      </div>
      <div className="min-w-0 space-y-1">
        <p className="text-xs font-medium tracking-wide text-[var(--garden-text-muted)] uppercase">Planning hint</p>
        <p className="text-sm font-semibold text-[var(--garden-text)]">{hint.title}</p>
        <p className="text-xs leading-relaxed text-[var(--garden-text-muted)]">{hint.body}</p>
      </div>
    </AppSurface>
  )
}
