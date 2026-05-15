'use client'

import { SectionCard } from '@/components/garden-ui'
import { useHydratedTodayViewModel } from '@/lib/garden-os/hooks/use-hydrated-today-view-model'
import type { GardenContext, TodayViewModel } from '@/lib/garden-os/types'
import type { GardenSpacesSource } from '@/lib/garden-setup/types'
import { QuickCaptureBar } from '@/components/today/quick-capture-bar'
import { TaskStack } from '@/components/today/task-stack'
import { TodayHeroCard } from '@/components/today/today-hero-card'
import { TodayInsightsRow } from '@/components/today/today-insights-row'
import { TodayWeatherAccordion } from '@/components/today/today-weather-accordion'

interface TodayPageClientProps {
  context: GardenContext
  viewModel: TodayViewModel
  spacesSource: GardenSpacesSource
}

export function TodayPageClient({ context, viewModel, spacesSource }: TodayPageClientProps) {
  const hydratedViewModel = useHydratedTodayViewModel(context, viewModel, spacesSource)

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-xl font-bold leading-tight text-[var(--garden-text)] md:text-2xl">Today</h1>
        <p className="text-sm text-[var(--garden-text-muted)]">{hydratedViewModel.greeting}</p>
      </header>

      <TodayWeatherAccordion
        weatherBrief={hydratedViewModel.weatherBrief}
        weatherState={hydratedViewModel.weatherState}
      />

      <SectionCard
        eyebrow="Daily rhythm"
        title="More for Today"
        description="Your best next step and light follow-ups after the forecast."
      >
        <div className="space-y-5">
          <TodayHeroCard viewModel={hydratedViewModel} />
          <TaskStack tasks={hydratedViewModel.brief.secondaryTasks} />
        </div>
      </SectionCard>

      <div className="space-y-3">
        <p className="text-[11px] font-medium tracking-wide text-[var(--garden-text-muted)] uppercase">Insights</p>
        <TodayInsightsRow insights={hydratedViewModel.insights} />
      </div>

      <QuickCaptureBar />
    </div>
  )
}
