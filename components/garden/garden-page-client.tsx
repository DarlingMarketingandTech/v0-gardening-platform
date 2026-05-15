'use client'

import { EmptyStatePanel } from '@/components/garden-ui/empty-state-panel'
import { GardenSpaces } from '@/components/dashboard/garden-spaces'
import { ZoneCard } from '@/components/garden/zone-card'
import { ZoneDetailPanel } from '@/components/garden/zone-detail-panel'
import { ZoneOverviewHeader } from '@/components/garden/zone-overview-header'
import { Button } from '@/components/ui/button'
import { DEMO_HOUSEHOLD_ID } from '@/lib/demo-garden'
import { useHydratedGardenViewModel } from '@/lib/garden-os/hooks/use-hydrated-garden-view-model'
import { isGardenSetupComplete } from '@/lib/garden-setup/store'
import type { GardenContext, GardenViewModel } from '@/lib/garden-os/types'
import type { GardenSpacesSource } from '@/lib/garden-setup/types'
import { cn } from '@/lib/utils'
import { Leaf } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'

interface GardenPageClientProps {
  context: GardenContext
  viewModel: GardenViewModel
  spacesSource: GardenSpacesSource
}

export function GardenPageClient({ context, viewModel, spacesSource }: GardenPageClientProps) {
  const hydratedViewModel = useHydratedGardenViewModel(context, viewModel, spacesSource)
  const { spacesSource: hydratedSpaces, zoneCards, overview, householdId } = hydratedViewModel

  const locationLabel =
    hydratedSpaces.profile?.locationLabel ?? hydratedViewModel.locationLabel ?? null

  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null)
  /** Mobile-only: list vs detail step; desktop always shows both columns. */
  const [mobileShowList, setMobileShowList] = useState(true)

  useEffect(() => {
    if (zoneCards.length === 0) {
      setSelectedZoneId(null)
      return
    }
    setSelectedZoneId((prev) =>
      prev && zoneCards.some((z) => z.id === prev) ? prev : zoneCards[0]!.id,
    )
  }, [zoneCards])

  const selectedZone = useMemo(
    () => zoneCards.find((z) => z.id === selectedZoneId) ?? null,
    [zoneCards, selectedZoneId],
  )

  const showSetupCta =
    Boolean(householdId) &&
    householdId !== DEMO_HOUSEHOLD_ID &&
    !hydratedSpaces.isPersonalized &&
    !isGardenSetupComplete(householdId)

  const selectZone = (id: string) => {
    setSelectedZoneId(id)
    setMobileShowList(false)
  }

  const backToMobileZones = () => {
    setMobileShowList(true)
  }

  return (
    <div className="space-y-6 pb-4">
      <section
        className={cn(
          'md:grid md:items-start md:gap-8 lg:gap-10',
          zoneCards.length > 0 && 'md:grid-cols-[minmax(0,1fr)_minmax(280px,380px)]',
        )}
      >
        <div className={cn('space-y-6', !mobileShowList && 'max-md:hidden')}>
          <ZoneOverviewHeader
            overview={overview}
            locationLabel={locationLabel}
            isPersonalized={hydratedSpaces.isPersonalized}
          />

          {zoneCards.length === 0 ? (
            <EmptyStatePanel
              title="No zones yet"
              description="Add outdoor or indoor spaces in setup so your Garden tab can show zones and plants."
              icon={<Leaf className="size-6 text-[var(--garden-primary)]" aria-hidden />}
              action={
                <Button asChild size="sm">
                  <Link href="/setup">Open garden setup</Link>
                </Button>
              }
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {zoneCards.map((zone) => (
                <ZoneCard
                  key={zone.id}
                  zone={zone}
                  selected={zone.id === selectedZoneId}
                  onSelect={() => selectZone(zone.id)}
                />
              ))}
            </div>
          )}

          {showSetupCta ? (
            <div className="rounded-xl border border-dashed border-primary/30 bg-primary/5 px-4 py-4 space-y-2">
              <p className="text-sm text-muted-foreground">
                Personalize your spaces with a short setup — about two minutes.
              </p>
              <Button asChild size="sm" variant="secondary">
                <Link href="/setup">Set up my garden</Link>
              </Button>
            </div>
          ) : !hydratedSpaces.isPersonalized ? (
            <p className="text-xs text-muted-foreground rounded-xl border border-dashed border-muted-foreground/25 bg-muted/20 px-3 py-2.5">
              Demo zones for now. Sign in to save your own layout.
            </p>
          ) : null}

          <details className="group rounded-xl border border-[var(--garden-border)] bg-[var(--garden-surface-muted)] px-3 py-2">
            <summary className="cursor-pointer text-sm font-medium text-[var(--garden-text)]">
              Grouped spaces view
            </summary>
            <div className="mt-4 pb-2">
              <GardenSpaces
                spaces={hydratedSpaces.spaces}
                isPersonalized={hydratedSpaces.isPersonalized}
                locationLabel={locationLabel}
                householdId={householdId}
              />
            </div>
          </details>
        </div>

        {zoneCards.length > 0 ? (
          <aside
            className={cn(
              mobileShowList && 'max-md:hidden',
              'md:block md:sticky md:top-20 md:self-start',
            )}
          >
            <ZoneDetailPanel
              zone={selectedZone}
              showBack={!mobileShowList}
              onBack={backToMobileZones}
            />
          </aside>
        ) : null}
      </section>
    </div>
  )
}
