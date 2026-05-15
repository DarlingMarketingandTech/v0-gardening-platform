import {
  CheckCircle2,
  CloudSun,
  Droplets,
  Flower2,
  Home,
  Leaf,
  Sprout,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { TodayBriefItemKind } from '@/lib/today-brief'

export const todayBriefIcons: Record<TodayBriefItemKind, LucideIcon> = {
  water: Droplets,
  support: Sprout,
  harvest: Leaf,
  bloom: Flower2,
  indoor: Home,
  weather: CloudSun,
  tidy: CheckCircle2,
}
