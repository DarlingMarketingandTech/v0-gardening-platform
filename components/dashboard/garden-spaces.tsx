'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { LayoutGrid, LandPlot, Layers, Flower2, Home, Sparkles, Droplets } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  demoSpacesAccordionSections,
  DEMO_HOUSEHOLD_ID,
  type DemoGardenPlanting,
  type DemoGardenSpace,
  type DemoGardenSpaceId,
} from '@/lib/demo-garden'
import { isGardenSetupComplete } from '@/lib/garden-setup/store'
import {
  buildAccordionSectionsFromSpaces,
  type GardenSpacesAccordionSection,
} from '@/lib/garden-setup/store'

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

interface GardenSpacesProps {
  spaces: DemoGardenSpace[]
  isPersonalized?: boolean
  locationLabel?: string | null
  householdId?: string | null
}

export function GardenSpaces({
  spaces,
  isPersonalized = false,
  locationLabel,
  householdId = null,
}: GardenSpacesProps) {
  const showSetupCta =
    householdId &&
    householdId !== DEMO_HOUSEHOLD_ID &&
    !isPersonalized &&
    !isGardenSetupComplete(householdId)
  const sections: GardenSpacesAccordionSection[] = isPersonalized
    ? buildAccordionSectionsFromSpaces(spaces)
    : demoSpacesAccordionSections

  const spaceById = new Map<string, DemoGardenSpace>(spaces.map((s) => [String(s.id), s]))

  return (
    <div className="space-y-4">
      <div className="space-y-1 px-0.5">
        <h2 className="text-lg font-semibold tracking-tight">Spaces</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {isPersonalized && locationLabel
            ? `Your garden near ${locationLabel}. Tap a group to see each space.`
            : 'Tap a group to see what is growing there. Everything stays calm until you expand it.'}
        </p>
      </div>

      <Accordion type="single" collapsible className="w-full space-y-2">
        {sections.map((section) => (
          <AccordionItem
            key={section.id}
            value={section.id}
            className="rounded-xl border border-primary/10 bg-card/80 px-1 data-[state=open]:shadow-sm"
          >
            <AccordionTrigger className="px-3 py-3 text-left hover:no-underline">
              <div className="flex flex-col items-start gap-0.5 pr-2">
                <span className="text-base font-semibold leading-tight">{section.title}</span>
                <span className="text-sm font-normal text-muted-foreground leading-snug">{section.summary}</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-3 pb-3">
              {section.spaceIds.length === 0 && section.emptyContent ? (
                <p className="text-sm leading-relaxed text-muted-foreground">{section.emptyContent}</p>
              ) : (
                <div className="flex flex-col gap-4 pt-1">
                  {section.spaceIds.map((id) => {
                    const space = spaceById.get(id)
                    if (!space) return null
                    return <SpaceDetail key={id} space={space} />
                  })}
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      {showSetupCta ? (
        <div className="rounded-lg border border-dashed border-primary/30 bg-primary/5 px-3 py-3 space-y-2">
          <p className="text-sm text-muted-foreground">
            Personalize your spaces with a short setup — about two minutes.
          </p>
          <Button asChild size="sm" variant="secondary">
            <Link href="/setup">Set up my garden</Link>
          </Button>
        </div>
      ) : !isPersonalized ? (
        <p className="text-xs text-muted-foreground rounded-lg border border-dashed border-muted-foreground/25 bg-muted/20 px-3 py-2.5">
          Demo spaces for now. Sign in to save your own layout.
        </p>
      ) : null}
    </div>
  )
}

function SpaceDetail({ space }: { space: DemoGardenSpace }) {
  const Icon =
    spaceIcons[space.id as DemoGardenSpaceId] ??
    (space.group === 'outdoor' ? LandPlot : Home)

  return (
    <Card className="overflow-hidden rounded-2xl border-primary/10 bg-background/80 shadow-sm">
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
          <p className="mb-2 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Growing here</p>
          {space.plantings.length === 0 ? (
            <p className="text-sm text-muted-foreground leading-relaxed">
              Nothing logged here yet — add plants when you are ready.
            </p>
          ) : (
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
          )}
        </div>
        <SpaceRow label="Watch for" body={space.watchFor} />
        <div className="rounded-xl border border-primary/15 bg-muted/30 px-3 py-2.5">
          <p className="mb-1 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">This week</p>
          <p className="text-sm leading-snug text-foreground">{space.weeklyAction}</p>
        </div>
      </CardContent>
    </Card>
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
