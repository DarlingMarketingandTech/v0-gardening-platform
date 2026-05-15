import {
  AlertTriangle,
  CheckCircle2,
  CloudSun,
  Droplets,
  Flower2,
  Home,
  Leaf,
  Sparkles,
  Sprout,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { TodayBriefItem, TodayBriefItemKind } from '@/lib/today-brief'

export const todayBriefIcons: Record<TodayBriefItemKind, LucideIcon> = {
  water: Droplets,
  support: Sprout,
  harvest: Leaf,
  bloom: Flower2,
  indoor: Home,
  weather: CloudSun,
  tidy: CheckCircle2,
}

export function BriefActionCard({ item }: { item: TodayBriefItem }) {
  const Icon = todayBriefIcons[item.kind]

  return (
    <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4">
      <p className="mb-2 text-[11px] font-medium uppercase tracking-wide text-primary">Best next step</p>
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Icon className="h-5 w-5" aria-hidden />
        </div>
        <div className="min-w-0">
          <h3 className="text-base font-semibold leading-tight">{item.title}</h3>
          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
          <BriefContext item={item} />
        </div>
      </div>
    </div>
  )
}

export function BriefSmallTask({ item }: { item: TodayBriefItem }) {
  const Icon = todayBriefIcons[item.kind]

  return (
    <div className="rounded-xl border border-border/70 bg-background/70 px-3 py-2.5">
      <div className="flex gap-2.5">
        <Icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
        <div className="min-w-0">
          <p className="text-sm font-medium leading-snug">{item.title}</p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{item.body}</p>
          <BriefContext item={item} compact />
        </div>
      </div>
    </div>
  )
}

export function BriefSignal({
  label,
  item,
  icon: Icon,
  className,
}: {
  label: string
  item: TodayBriefItem
  icon: LucideIcon
  className: string
}) {
  return (
    <div className={`rounded-xl border px-3 py-3 ${className}`}>
      <div className="mb-2 flex items-center gap-2">
        <Icon className="h-4 w-4 shrink-0" aria-hidden />
        <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      </div>
      <p className="text-sm font-medium leading-snug">{item.title}</p>
      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{item.body}</p>
      <BriefContext item={item} compact />
    </div>
  )
}

function BriefContext({ item, compact = false }: { item: TodayBriefItem; compact?: boolean }) {
  if (!item.spaceTitle && !item.plantingName) return null

  return (
    <p className={`${compact ? 'mt-2 text-[11px]' : 'mt-3 text-xs'} leading-snug text-muted-foreground`}>
      {[item.spaceTitle, item.plantingName].filter(Boolean).join(' - ')}
    </p>
  )
}
