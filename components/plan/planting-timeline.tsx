import { SectionCard } from '@/components/garden-ui'
import type { PlanTimelineRow } from '@/lib/garden-os/types'
import { TimelineRow } from '@/components/plan/timeline-row'
import { CalendarClock } from 'lucide-react'

interface PlantingTimelineProps {
  rows: PlanTimelineRow[]
}

export function PlantingTimeline({ rows }: PlantingTimelineProps) {
  return (
    <SectionCard
      eyebrow="Starter rhythm"
      title="Planting timeline"
      description="Not a full crop calendar — a gentle ladder of “think about this next” windows tied to your season and spaces."
    >
      <div className="flex items-center gap-2 text-[var(--garden-primary)]">
        <CalendarClock className="size-5 shrink-0" aria-hidden />
        <p className="text-xs text-[var(--garden-text-muted)]">Four light checkpoints you can rename on paper anytime.</p>
      </div>
      <ol className="mt-4 space-y-3">
        {rows.map((row) => (
          <li key={row.id}>
            <TimelineRow row={row} />
          </li>
        ))}
      </ol>
    </SectionCard>
  )
}
