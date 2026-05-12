'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LayoutGrid, LandPlot, Layers, Flower2 } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { demoBackyardZones } from '@/lib/demo-garden'
import type { DemoBackyardZoneId, DemoZonePlanting } from '@/lib/demo-garden'

const zoneIcons: Record<DemoBackyardZoneId, LucideIcon> = {
  'patio-pots': LayoutGrid,
  'in-ground-bed': LandPlot,
  'raised-bed-trellis': Layers,
  'pollinator-border': Flower2,
}

const statusLabels: Record<DemoZonePlanting['status'], string> = {
  'getting-started': 'Getting started',
  growing: 'Growing',
  'ready-soon': 'Ready soon',
  blooming: 'Blooming',
}

export function GardenBackyardZones() {
  return (
    <div className="space-y-4">
      <div className="space-y-1 px-0.5">
        <h2 className="text-lg font-semibold tracking-tight">Your backyard</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Four real zones from Momma D&apos;s layout, with a quick look at what is growing where.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {demoBackyardZones.map((zone) => {
          const Icon = zoneIcons[zone.id]
          return (
            <Card key={zone.id} className="overflow-hidden border-primary/10 shadow-sm rounded-2xl bg-card/80">
              <CardHeader className="pb-2 pt-4 px-4 space-y-0">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" aria-hidden />
                  </div>
                  <div className="min-w-0">
                    <CardTitle className="text-base font-semibold leading-tight">{zone.title}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">{zone.description}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="px-4 pb-4 pt-0 space-y-3">
                <ZoneRow label="Best for" body={zone.bestFor} />
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground mb-2">
                    Growing here
                  </p>
                  <div className="space-y-2">
                    {zone.plantings.map((planting) => (
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
                <ZoneRow label="Watch for" body={zone.watchFor} />
                <div className="rounded-xl border border-primary/15 bg-muted/30 px-3 py-2.5">
                  <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground mb-1">This week</p>
                  <p className="text-sm text-foreground leading-snug">{zone.weeklyAction}</p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <p className="text-xs text-muted-foreground rounded-lg border border-dashed border-muted-foreground/25 bg-muted/20 px-3 py-2.5">
        Sample garden plan. Real saved garden data comes later.
      </p>
    </div>
  )
}

function ZoneRow({ label, body }: { label: string; body: string }) {
  return (
    <div>
      <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground mb-1">{label}</p>
      <p className="text-sm text-foreground/90 leading-relaxed">{body}</p>
    </div>
  )
}

