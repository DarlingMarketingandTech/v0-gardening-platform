import { CalendarDays, HeartPulse, Home, Leaf } from 'lucide-react'

export const gardenNavigation = [
  {
    id: 'today',
    label: 'Today',
    href: '/my-garden/today',
    icon: Home,
  },
  {
    id: 'garden',
    label: 'Garden',
    href: '/my-garden/garden',
    icon: Leaf,
  },
  {
    id: 'plan',
    label: 'Plan',
    href: '/my-garden/plan',
    icon: CalendarDays,
  },
  {
    id: 'care',
    label: 'Care',
    href: '/my-garden/care',
    icon: HeartPulse,
  },
] as const

export type GardenNavId = (typeof gardenNavigation)[number]['id']

export function isGardenNavActive(pathname: string, href: string): boolean {
  if (pathname === href) return true
  return pathname.startsWith(`${href}/`)
}
