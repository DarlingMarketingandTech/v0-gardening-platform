'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { gardenNavigation, isGardenNavActive } from '@/lib/garden-os/constants/navigation'
import { cn } from '@/lib/utils'

export function GardenBottomNav() {
  const pathname = usePathname()

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 border-t border-primary/10 bg-card/95 backdrop-blur md:hidden"
      aria-label="Garden navigation"
    >
      <div className="mx-auto flex max-w-lg items-stretch justify-around px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2">
        {gardenNavigation.map((item) => {
          const Icon = item.icon
          const active = isGardenNavActive(pathname, item.href)

          return (
            <Link
              key={item.id}
              href={item.href}
              className={cn(
                'flex min-w-0 flex-1 flex-col items-center gap-1 rounded-2xl px-2 py-2 text-xs font-medium transition-colors',
                active
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:bg-primary/5 hover:text-foreground',
              )}
              aria-current={active ? 'page' : undefined}
            >
              <Icon className="h-5 w-5 shrink-0" aria-hidden />
              <span className="truncate">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
