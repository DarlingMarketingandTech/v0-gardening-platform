'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LayoutGrid, LandPlot, Layers, Flower2, Home, Sparkles, Droplets } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { demoGardenSpaces } from '@/lib/demo-garden'
import type {
  DemoGardenPlanting,
  DemoGardenSpaceGroup,
  DemoGardenSpaceId,
} from '@/lib/demo-garden'

const spaceIcons: Record<DemoGardenSpaceId, LucideIcon> = {
  'patio-pots': LayoutGrid,
  'in-ground-bed': LandPlot,
  'raised-bed-trellis': Layers,
  'pollinator-border': Flower2,
  'kitchen-window': Sparkles,
  'living-room-plant-shelf': Home,
  'bathroom-fern-corner': Droplets,
  'bedroom-windowsill': Sparkles,
}

const statusLabels: Record<DemoGardenPlanting['status'], string> = {
  'getting-started': 'Getting started',
  growing: 'Growing',
  'ready-soon': 'Ready soon',
  blooming: 'Blooming',
}

const spaceGroupContent: Record<DemoGardenSpaceGroup, { title: string; description: string }> = {
  outdoor: {
    title: 'Outdoor Spaces',
    description: "Momma D's beds, pots, and border with a quick look at what needs attention.",
  },
  indoor: {
    title: 'Indoor Spaces',
    description: 'Easy rooms and windowsills that follow the same simple care rhythm.',
  },
}

export function GardenSpaces() {
  const groupedSpaces: Record<DemoGardenSpaceGroup, typeof demoGardenSpaces> = {
    outdoor: demoGardenSpaces.filter((space) => space.group === 'outdoor'),
    indoor: demoGardenSpaces.filter((space) => space.group === 'indoor'),
  }

  return (
    <div className="space-y-4">
      <div className="space-y-1 px-0.5">
        <h2 className="text-lg font-semibold tracking-tight">Your spaces</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          A simple look at what is growing in each space, indoors and out.
        </p>
      </div>

      {(Object.keys(spaceGroupContent) as DemoGardenSpaceGroup[]).map((group) => (
        <SpaceSection
          key={group}
          title={spaceGroupContent[group].title}
          description={spaceGroupContent[group].description}
          spaces={groupedSpaces[group]}
        />
      ))}

      <p className="text-xs text-muted-foreground rounded-lg border border-dashed border-muted-foreground/25 bg-muted/20 px-3 py-2.5">
        Demo spaces for now. Saved spaces can come later.
      </p>
    </div>
  )
}

function SpaceSection({
  title,
  description,
  spaces,
}: {
  title: string
  description: string
  spaces: typeof demoGardenSpaces
}) {
  return (
    <section className="space-y-3">
      <div className="space-y-1 px-0.5">
        <h3 className="text-base font-semibold tracking-tight">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
      </div>

      <div className="flex flex-col gap-4">
        {spaces.map((space) => {
          const Icon = spaceIcons[space.id]
          return (
            <Card key={space.id} className="overflow-hidden rounded-2xl border-primary/10 bg-card/80 shadow-sm">
              <CardHeader className="space-y-0 px-4 pb-2 pt-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" aria-hidden />
                  </div>
                  <div className="min-w-0">
                    <CardTitle className="text-base font-semibold leading-tight">{space.title}</CardTitle>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{space.description}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 px-4 pb-4 pt-0">
                <SpaceRow label="Best for" body={space.bestFor} />
                <div>
                  <p className="mb-2 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                    Growing here
                  </p>
                  <div className="space-y-2">
                    {space.plantings.map((planting) => (
                      <div
                        key={planting.id}
                        className="rounded-xl border border-border/70 bg-background/70 px-3 py-2.5"
                      >
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-sm font-medium text-foreground">
                            {planting.name}
                            {planting.variety ? (
                              <span className="font-normal text-muted-foreground">, {planting.variety}</span>
                            ) : null}
                          </p>
                          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
                            {statusLabels[planting.status]}
                          </span>
                        </div>
                        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{planting.careNote}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <SpaceRow label="Watch for" body={space.watchFor} />
                <div className="rounded-xl border border-primary/15 bg-muted/30 px-3 py-2.5">
                  <p className="mb-1 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                    This week
                  </p>
                  <p className="text-sm leading-snug text-foreground">{space.weeklyAction}</p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </section>
  )
}

function SpaceRow({ label, body }: { label: string; body: string }) {
  return (
    <div>
      <p className="mb-1 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="text-sm text-foreground/90 leading-relaxed">{body}</p>
    </div>
  )
}
