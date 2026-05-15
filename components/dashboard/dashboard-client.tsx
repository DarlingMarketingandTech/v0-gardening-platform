'use client'

import { useEffect, useMemo, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { WeatherWidgetContent } from './weather-widget'
import { useGardenWeather } from './use-garden-weather'
import { PlantLibrary } from './plant-library'
import { GardenLog } from './garden-log'
import { ServiceProviders } from './service-providers'
import { GardenSpaces } from './garden-spaces'
import { NotificationSettings } from './notification-settings'
import { MoonPhaseWidget } from './moon-phase-widget'
import { SeedInventory } from './seed-inventory'
import { PestLookup } from './pest-lookup'
import {
  AlertTriangle,
  Bell,
  BookHeart,
  BookOpen,
  Bug,
  CheckCircle2,
  CloudSun,
  Droplets,
  Flower2,
  Home,
  Leaf,
  MapPin,
  Package,
  Settings,
  Sparkles,
  Sprout,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { Plant } from '@/lib/types'
import { getGardenSpacesForHousehold } from '@/lib/garden-setup/store'
import {
  buildTodayBrief,
  type TodayBriefItem,
  type TodayBriefItemKind,
} from '@/lib/today-engine'
import { GuideArticlesPanel } from '@/components/guide/guide-articles-panel'
import { PlacementHelperPanel } from '@/components/guide/placement-helper-panel'
import { PlantIdentifyPanel } from '@/components/guide/plant-identify-panel'
import { KnowledgeSnippetsPanel } from '@/components/guide/knowledge-snippets-panel'

interface DashboardClientProps {
  plants: Plant[]
  householdId?: string | null
}

type MainTab = 'today' | 'garden' | 'log' | 'guide'

const briefIcons: Record<TodayBriefItemKind, LucideIcon> = {
  water: Droplets,
  support: Sprout,
  harvest: Leaf,
  bloom: Flower2,
  indoor: Home,
  weather: CloudSun,
  tidy: CheckCircle2,
}

export function DashboardClient({ plants, householdId = null }: DashboardClientProps) {
  const [activeTab, setActiveTab] = useState<MainTab>('today')
  const [spacesSource, setSpacesSource] = useState(() =>
    getGardenSpacesForHousehold(householdId),
  )
  const weatherState = useGardenWeather(null, null)

  useEffect(() => {
    setSpacesSource(getGardenSpacesForHousehold(householdId))
  }, [householdId])

  const todayBrief = useMemo(
    () => buildTodayBrief({ spaces: spacesSource.spaces, weather: weatherState.weather }),
    [spacesSource.spaces, weatherState.weather],
  )

  return (
    <div
      key={householdId ?? 'demo'}
      className="min-h-screen bg-linear-to-b from-primary/5 via-background to-accent/5"
      data-household-id={householdId ?? undefined}
    >
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-primary/10">
        <div className="container px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Flower2 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="font-semibold text-lg leading-tight">Momma D&apos;s Garden</h1>
              <p className="text-xs text-muted-foreground">Simple today, deeper when you want it</p>
            </div>
          </div>

          {/* In demo-first mode, avoid sending Mom to a protected /settings route. */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setActiveTab('guide')}
            aria-label="Open guide"
          >
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <main className="container px-4 py-4 md:py-6">
        {/* Greeting — keep compact so Today stays above the fold on small screens */}
        <div className="mb-3">
          <h2 className="text-xl md:text-2xl font-bold leading-tight">My Garden</h2>
          <p className="text-sm text-muted-foreground">{getGreeting()}</p>
        </div>

        {/* Calm Navigation */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as MainTab)} className="space-y-4 md:space-y-6">
          <TabsList className="w-full grid grid-cols-4 h-auto bg-muted/50 p-1 rounded-xl">
            <TabsTrigger
              value="today"
              className="flex flex-col items-center gap-0.5 py-2 px-1 data-[state=active]:bg-background rounded-lg"
            >
              <Home className="h-4 w-4" />
              <span className="text-[10px]">Today</span>
            </TabsTrigger>

            <TabsTrigger
              value="garden"
              className="flex flex-col items-center gap-0.5 py-2 px-1 data-[state=active]:bg-background rounded-lg"
            >
              <Leaf className="h-4 w-4" />
              <span className="text-[10px]">Garden</span>
            </TabsTrigger>

            <TabsTrigger
              value="log"
              className="flex flex-col items-center gap-0.5 py-2 px-1 data-[state=active]:bg-background rounded-lg"
            >
              <BookHeart className="h-4 w-4" />
              <span className="text-[10px]">Log</span>
            </TabsTrigger>

            <TabsTrigger
              value="guide"
              className="flex flex-col items-center gap-0.5 py-2 px-1 data-[state=active]:bg-background rounded-lg"
            >
              <BookOpen className="h-4 w-4" />
              <span className="text-[10px]">Guide</span>
            </TabsTrigger>
          </TabsList>

          {/* TODAY */}
          <TabsContent value="today" className="mt-3 space-y-4 md:mt-4">
            <Card className="overflow-hidden rounded-2xl border-primary/15 shadow-sm">
              <CardHeader className="pb-2 pt-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <CardTitle className="text-base md:text-lg">Today</CardTitle>
                    <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">{todayBrief.contextLabel}</p>
                  </div>
                  <span className="shrink-0 rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-medium text-primary">
                    Now
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 pb-4">
                <BriefActionCard item={todayBrief.bestAction} />

                <div className="flex flex-wrap gap-2">
                  <Button className="h-10 shrink-0" onClick={() => setActiveTab('log')}>
                    <BookHeart className="mr-2 h-4 w-4" />
                    Log a note
                  </Button>
                  <Button variant="outline" className="h-10 shrink-0" onClick={() => setActiveTab('garden')}>
                    <Sprout className="mr-2 h-4 w-4" />
                    View spaces
                  </Button>
                </div>

                <details className="rounded-xl border border-border/80 bg-muted/10">
                  <summary className="cursor-pointer px-3 py-2.5 text-sm font-medium text-foreground select-none [&::-webkit-details-marker]:hidden">
                    More for today
                  </summary>
                  <div className="space-y-3 border-t border-border/60 px-3 py-3">
                    <div className="rounded-xl border border-primary/10 bg-muted/25 px-3 py-2.5">
                      <p className="mb-1 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                        Why this matters
                      </p>
                      <p className="text-sm leading-relaxed text-foreground/90">{todayBrief.whyThisMatters}</p>
                    </div>

                    {todayBrief.secondaryTasks.length > 0 ? (
                      <div className="space-y-2">
                        <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                          Small follow-ups
                        </p>
                        <div className="space-y-2">
                          {todayBrief.secondaryTasks.map((task) => (
                            <BriefSmallTask key={task.id} item={task} />
                          ))}
                        </div>
                      </div>
                    ) : null}

                    <div className="grid gap-3 md:grid-cols-2">
                      <BriefSignal
                        label="Watch out"
                        item={todayBrief.watchOut}
                        icon={AlertTriangle}
                        className="border-amber-200/70 bg-amber-50/70 dark:border-amber-900/50 dark:bg-amber-950/20"
                      />
                      <BriefSignal
                        label="Progress"
                        item={todayBrief.milestone}
                        icon={Sparkles}
                        className="border-emerald-200/70 bg-emerald-50/70 dark:border-emerald-900/50 dark:bg-emerald-950/20"
                      />
                    </div>
                  </div>
                </details>

                <details className="rounded-xl border border-border/80 bg-muted/10">
                  <summary className="cursor-pointer px-3 py-2.5 text-sm font-medium text-foreground select-none [&::-webkit-details-marker]:hidden">
                    Weather
                  </summary>
                  <div className="border-t border-border/60 px-3 py-3">
                    <WeatherWidgetContent weatherState={weatherState} />
                  </div>
                </details>

                <NeedHelpStrip onOpenGuide={() => setActiveTab('guide')} />
              </CardContent>
            </Card>
          </TabsContent>

          {/* GARDEN */}
          <TabsContent value="garden" className="mt-6 space-y-6">
            <GardenSpaces
              spaces={spacesSource.spaces}
              isPersonalized={spacesSource.isPersonalized}
              locationLabel={spacesSource.profile?.locationLabel}
              householdId={householdId}
            />
          </TabsContent>

          {/* LOG */}
          <TabsContent value="log" className="mt-6 space-y-6">
            <GardenLog householdId={householdId} />
          </TabsContent>

          {/* GUIDE */}
          <TabsContent value="guide" className="mt-6 space-y-4">
            <Card className="border-primary/10">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Guide</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Optional depth. Open a section when you&apos;re curious.
                </p>
              </CardHeader>
            </Card>

            <PlantIdentifyPanel />
            <PlacementHelperPanel spaces={spacesSource.spaces} />
            <GuideArticlesPanel />
            <KnowledgeSnippetsPanel />

            <details className="rounded-xl border bg-background p-4">
              <summary className="cursor-pointer font-semibold flex items-center gap-2">
                <BookOpen className="h-4 w-4" /> Plant Library
              </summary>
              <p className="mt-2 text-xs text-muted-foreground">
                A calm place to browse plants and ideas. Use it when you want to identify something or compare options.
              </p>
              <div className="mt-4">
                <PlantLibrary plants={plants} />
              </div>
            </details>

            <details className="rounded-xl border bg-background p-4">
              <summary className="cursor-pointer font-semibold flex items-center gap-2">
                <Package className="h-4 w-4" /> Seeds
              </summary>
              <div className="mt-4">
                <SeedInventory />
              </div>
            </details>

            <details className="rounded-xl border bg-background p-4">
              <summary className="cursor-pointer font-semibold flex items-center gap-2">
                <Bell className="h-4 w-4" /> Alerts & Reminders
              </summary>
              <div className="mt-4">
                <NotificationSettings />
              </div>
            </details>

            <details className="rounded-xl border bg-background p-4">
              <summary className="cursor-pointer font-semibold flex items-center gap-2">
                <Bug className="h-4 w-4" /> Pest lookup
              </summary>
              <div className="mt-4">
                <PestLookup />
              </div>
            </details>

            <details className="rounded-xl border bg-background p-4">
              <summary className="cursor-pointer font-semibold flex items-center gap-2">
                <MapPin className="h-4 w-4" /> Local help
              </summary>
              <div className="mt-4">
                <ServiceProviders latitude={null} longitude={null} />
              </div>
            </details>

            <details className="rounded-xl border bg-background p-4">
              <summary className="cursor-pointer font-semibold flex items-center gap-2">
                <MoonPhaseWidgetIcon /> Moon phase
              </summary>
              <div className="mt-4">
                <MoonPhaseWidget />
              </div>
            </details>
          </TabsContent>
        </Tabs>
      </main>

      {/* Bottom padding for mobile */}
      <div className="h-6" />
    </div>
  )
}

function NeedHelpStrip({ onOpenGuide }: { onOpenGuide: () => void }) {
  return (
    <div className="rounded-xl border border-dashed border-primary/25 bg-muted/20 px-3 py-3">
      <p className="mb-2 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Need help?</p>
      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="secondary" size="sm" className="shrink-0" onClick={onOpenGuide}>
          <Leaf className="mr-1.5 h-3.5 w-3.5" aria-hidden />
          Identify plant
        </Button>
        <Button type="button" variant="secondary" size="sm" className="shrink-0" onClick={onOpenGuide}>
          <Bug className="mr-1.5 h-3.5 w-3.5" aria-hidden />
          What&apos;s wrong?
        </Button>
        <Button type="button" variant="secondary" size="sm" className="shrink-0" onClick={onOpenGuide}>
          <CloudSun className="mr-1.5 h-3.5 w-3.5" aria-hidden />
          Seasonal advice
        </Button>
        <Button type="button" variant="secondary" size="sm" className="shrink-0" onClick={onOpenGuide}>
          <BookOpen className="mr-1.5 h-3.5 w-3.5" aria-hidden />
          Learn
        </Button>
      </div>
      <p className="mt-2 text-xs leading-snug text-muted-foreground">
        These open the Guide so advanced tools stay optional, not noisy.
      </p>
    </div>
  )
}

function BriefActionCard({ item }: { item: TodayBriefItem }) {
  const Icon = briefIcons[item.kind]

  return (
    <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4">
      <p className="mb-2 text-[11px] font-medium uppercase tracking-wide text-primary">
        Best next step
      </p>
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Icon className="h-5 w-5" aria-hidden />
        </div>
        <div className="min-w-0">
          <h3 className="text-base font-semibold leading-tight">{item.title}</h3>
          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
          <BriefContext item={item} />
        </div>
      </div>
    </div>
  )
}

function BriefSmallTask({ item }: { item: TodayBriefItem }) {
  const Icon = briefIcons[item.kind]

  return (
    <div className="rounded-xl border border-border/70 bg-background/70 px-3 py-2.5">
      <div className="flex gap-2.5">
        <Icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
        <div className="min-w-0">
          <p className="text-sm font-medium leading-snug">{item.title}</p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{item.body}</p>
          <BriefContext item={item} compact />
        </div>
      </div>
    </div>
  )
}

function BriefSignal({
  label,
  item,
  icon: Icon,
  className,
}: {
  label: string
  item: TodayBriefItem
  icon: LucideIcon
  className: string
}) {
  return (
    <div className={`rounded-xl border px-3 py-3 ${className}`}>
      <div className="mb-2 flex items-center gap-2">
        <Icon className="h-4 w-4 shrink-0" aria-hidden />
        <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      </div>
      <p className="text-sm font-medium leading-snug">{item.title}</p>
      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{item.body}</p>
      <BriefContext item={item} compact />
    </div>
  )
}

function BriefContext({ item, compact = false }: { item: TodayBriefItem; compact?: boolean }) {
  if (!item.spaceTitle && !item.plantingName) return null

  return (
    <p className={`${compact ? 'mt-2 text-[11px]' : 'mt-3 text-xs'} leading-snug text-muted-foreground`}>
      {[item.spaceTitle, item.plantingName].filter(Boolean).join(' - ')}
    </p>
  )
}

function MoonPhaseWidgetIcon() {
  return (
    <span aria-hidden="true" className="inline-flex h-4 w-4 items-center justify-center">
      🌙
    </span>
  )
}

function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning! Ready for some gardening?'
  if (hour < 17) return "Good afternoon! How's the garden today?"
  return 'Good evening! Time to relax and enjoy your garden.'
}
