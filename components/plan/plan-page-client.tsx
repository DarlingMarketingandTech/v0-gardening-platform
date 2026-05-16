'use client'

import {
  ActionPill,
  AppSurface,
  EmptyStatePanel,
  SectionCard,
} from '@/components/garden-ui'
import { CompanionInsightCard } from '@/components/plan/companion-insight-card'
import { CropPlanCard } from '@/components/plan/crop-plan-card'
import { OpportunityPanel } from '@/components/plan/opportunity-panel'
import { PlantingTimeline } from '@/components/plan/planting-timeline'
import { SeasonStatusHero } from '@/components/plan/season-status-hero'
import { SpaceFitCard } from '@/components/plan/space-fit-card'
import { useHydratedPlanViewModel } from '@/lib/garden-os/hooks/use-hydrated-plan-view-model'
import type { GardenContext, PlanViewModel } from '@/lib/garden-os/types'
import type { GardenSpacesSource } from '@/lib/garden-setup/types'
import { isGardenSetupComplete } from '@/lib/garden-setup/store'
import { DEMO_HOUSEHOLD_ID } from '@/lib/demo-garden'
import { Leaf } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface PlanPageClientProps {
  context: GardenContext
  viewModel: PlanViewModel
  spacesSource: GardenSpacesSource
}

export function PlanPageClient({ context, viewModel, spacesSource }: PlanPageClientProps) {
  const vm = useHydratedPlanViewModel(context, viewModel, spacesSource)
  const { seasonSummary, opportunities, spaceFits, timelineRows, companionHints, cropWindows, footerNote } =
    vm

  const householdId = context.householdId
  const showSetupCta =
    Boolean(householdId) &&
    householdId !== DEMO_HOUSEHOLD_ID &&
    !spacesSource.isPersonalized &&
    !isGardenSetupComplete(householdId)

  const showMetadataHint = spaceFits.length > 0 && !vm.hasRichSpaceMetadata

  return (
    <div className="space-y-6 pb-6">
      <header className="space-y-1">
        <h1 className="text-xl font-bold leading-tight text-[var(--garden-text)] md:text-2xl">Plan</h1>
        <p className="text-sm text-[var(--garden-text-muted)]">
          Seasonal sketches tied to your spaces — calm, practical, and beginner-safe.
        </p>
      </header>

      <SeasonStatusHero season={seasonSummary} />

      {showMetadataHint ? (
        <AppSurface variant="muted" padding="md" radius="lg" className="text-sm text-[var(--garden-text-muted)]">
          <span className="font-medium text-[var(--garden-text)]">Tip: </span>
          Finish garden setup on this device to attach richer space hints — Plan gets sharper without changing your
          rhythm.
        </AppSurface>
      ) : null}

      <OpportunityPanel opportunities={opportunities} />

      <SectionCard
        eyebrow="Your spaces"
        title="Where things fit best"
        description="Each card pulls from your space notes and light — use it as a sketchpad, not a rulebook."
      >
        {spaceFits.length === 0 ? (
          <EmptyStatePanel
            title="No spaces yet"
            description="Add outdoor or indoor spaces in garden setup so Plan can line up ideas with real spots."
            icon={<Leaf className="size-6 text-[var(--garden-primary)]" aria-hidden />}
            action={
              showSetupCta ? (
                <Button asChild size="sm">
                  <Link href="/setup">Open garden setup</Link>
                </Button>
              ) : undefined
            }
          />
        ) : (
          <ul className="grid gap-4 md:grid-cols-2">
            {spaceFits.map((fit) => (
              <li key={fit.spaceId}>
                <SpaceFitCard fit={fit} />
              </li>
            ))}
          </ul>
        )}
      </SectionCard>

      <PlantingTimeline rows={timelineRows} />

      <SectionCard
        eyebrow="Windows at a glance"
        title="Crop windows"
        description="Two soft lanes — cool and warm — so you are not staring at a blank calendar."
      >
        <div className="grid gap-3 sm:grid-cols-2">
          {cropWindows.map((w) => (
            <CropPlanCard key={w.title} window={w} />
          ))}
        </div>
      </SectionCard>

      <SectionCard
        eyebrow="Light companion notes"
        title="Spacing & neighbors"
        description="Planning hints only — your yard always has the final say."
      >
        <ul className="grid gap-3 md:grid-cols-2">
          {companionHints.map((hint) => (
            <li key={hint.id}>
              <CompanionInsightCard hint={hint} />
            </li>
          ))}
        </ul>
      </SectionCard>

      <AppSurface variant="tinted" padding="md" radius="lg" className="text-xs leading-relaxed text-[var(--garden-text-muted)]">
        {footerNote}
      </AppSurface>

      {showSetupCta && spaceFits.length > 0 ? (
        <div className="flex justify-center">
          <ActionPill href="/setup" variant="secondary" size="md">
            Refine in garden setup
          </ActionPill>
        </div>
      ) : null}
    </div>
  )
}
