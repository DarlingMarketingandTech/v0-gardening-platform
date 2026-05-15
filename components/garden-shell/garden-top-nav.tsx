'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { gardenNavigation, isGardenNavActive } from '@/lib/garden-os/constants/navigation'
import { cn } from '@/lib/utils'

export function GardenTopNav() {
  const pathname = usePathname()

  return (
    <nav
      className="hidden border-b border-primary/10 bg-card/60 md:block"
      aria-label="Garden navigation"
    >
      <div className="container flex items-center gap-2 px-4 py-3">
        {gardenNavigation.map((item) => {
          const Icon = item.icon
          const active = isGardenNavActive(pathname, item.href)

          return (
            <Link
              key={item.id}
              href={item.href}
              className={cn(
                'inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors',
                active
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:bg-primary/5 hover:text-foreground',
              )}
              aria-current={active ? 'page' : undefined}
            >
              <Icon className="h-4 w-4 shrink-0" aria-hidden />
              {item.label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
