'use client'

import { AppSurface } from '@/components/garden-ui/app-surface'
import type { SunLevel } from '@/lib/garden-setup/types'
import { cn } from '@/lib/utils'

const OUTDOOR_CHOICES: {
  value: SunLevel
  title: string
  body: string
  examples: string
  warn?: string
}[] = [
  {
    value: 'low',
    title: 'Low light',
    body: 'Mostly shade, dappled sun, or short sun windows.',
    examples: 'Leafy greens, shade herbs, and spots under trees or eaves.',
    warn: 'Vegetables that want full sun may grow slowly here.',
  },
  {
    value: 'bright-indirect',
    title: 'Bright indirect',
    body: 'Bright open shade or reflected light without baking in noon rays.',
    examples: 'Many houseplants moved outside for summer, part-shade flowers.',
  },
  {
    value: 'mid',
    title: 'Part sun',
    body: 'A few hours of direct sun, often morning or late afternoon.',
    examples: 'Beans, many herbs, and flowers that like a mix of sun and relief.',
  },
  {
    value: 'high',
    title: 'Full sun',
    body: 'Strong direct light for much of the day in growing season.',
    examples: 'Tomatoes, peppers, sun-loving herbs, and pollinator favorites.',
    warn: 'Containers can dry out fast—plan for watering on hot weeks.',
  },
]

const INDOOR_CHOICES: {
  value: SunLevel
  title: string
  body: string
  examples: string
  warn?: string
}[] = [
  {
    value: 'low',
    title: 'Low light',
    body: 'Across the room from windows or a short winter day.',
    examples: 'Snake plant, ZZ, and other forgiving low-light friends.',
    warn: 'Herbs and bloomers usually want more light than this.',
  },
  {
    value: 'bright-indirect',
    title: 'Bright indirect',
    body: 'Near a sunny window, but not baking in direct rays all afternoon.',
    examples: 'Kitchen herbs on a sill, pothos, and many foliage plants.',
  },
  {
    value: 'mid',
    title: 'Part sun indoors',
    body: 'Several hours of direct sun hits the leaves.',
    examples: 'Succulents on a bright sill, dwarf citrus, happy herbs.',
  },
  {
    value: 'high',
    title: 'Strong indoor sun',
    body: 'A very bright window or sunroom for much of the day.',
    examples: 'Tomato starts in a bay window, hibiscus, sun-hungry herbs.',
    warn: 'Watch for leaf burn if glass magnifies summer heat.',
  },
]

export interface LightSelectorProps {
  variant: 'outdoor-sun' | 'indoor-light'
  value?: SunLevel | null
  onPick: (level: SunLevel) => void
  className?: string
}

export function LightSelector({ variant, value, onPick, className }: LightSelectorProps) {
  const choices = variant === 'outdoor-sun' ? OUTDOOR_CHOICES : INDOOR_CHOICES

  return (
    <div className={cn('grid gap-3 sm:grid-cols-2', className)}>
      {choices.map((c) => {
        const active = value === c.value
        return (
          <button key={c.value} type="button" onClick={() => onPick(c.value)} className="text-left">
            <AppSurface
              variant={active ? 'tinted' : 'muted'}
              padding="md"
              radius="lg"
              className={cn(
                'h-full border transition-colors',
                active ? 'border-primary ring-1 ring-primary/20' : 'border-(--garden-border)',
              )}
            >
              <p className="text-sm font-semibold text-(--garden-text)">{c.title}</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{c.body}</p>
              <p className="mt-2 text-[11px] leading-relaxed text-(--garden-text-muted)">
                <span className="font-medium text-(--garden-text)">Examples: </span>
                {c.examples}
              </p>
              {c.warn ? <p className="mt-2 text-[11px] leading-relaxed text-amber-800/90 dark:text-amber-200/90">{c.warn}</p> : null}
            </AppSurface>
          </button>
        )
      })}
    </div>
  )
}
