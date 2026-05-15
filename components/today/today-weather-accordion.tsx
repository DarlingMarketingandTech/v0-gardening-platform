'use client'

import { ChevronDown, CloudSun } from 'lucide-react'
import { GardenWeatherForecastBody } from '@/components/dashboard/weather-widget'
import { AppSurface, EmptyStatePanel, SectionCard } from '@/components/garden-ui'
import { Badge } from '@/components/ui/badge'
import type { TodayWeatherBrief } from '@/lib/garden-os/types'
import type { GardenWeatherState } from '@/lib/garden-os/weather-types'
import { ConditionStrip } from '@/components/today/condition-strip'
import { TodaysSpacesForecastCheck } from '@/components/today/todays-spaces-forecast-check'

export interface TodayWeatherAccordionProps {
  weatherBrief: TodayWeatherBrief
  weatherState: GardenWeatherState
}

export function TodayWeatherAccordion({ weatherBrief, weatherState }: TodayWeatherAccordionProps) {
  const { weather, sunData, loading, error, location } = weatherState

  return (
    <AppSurface
      variant="elevated"
      padding="md"
      className="overflow-hidden border-primary/15 bg-linear-to-br from-[color-mix(in_oklch,var(--garden-primary)_10%,var(--card))] via-card to-[color-mix(in_oklch,var(--accent)_12%,var(--card))] shadow-[var(--garden-shadow-lifted)]"
    >
      <details open className="group">
        <summary className="flex cursor-pointer list-none items-start gap-3 rounded-xl outline-none select-none [&::-webkit-details-marker]:hidden">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--garden-primary-soft)] text-[var(--garden-primary)]">
            <CloudSun className="size-6" aria-hidden />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-xs font-medium tracking-wide text-primary uppercase">Today&apos;s Weather</p>
              {location.source === 'demo' ? (
                <Badge variant="outline" className="text-[10px]">
                  Demo
                </Badge>
              ) : null}
            </div>
            <p className="mt-1 text-lg font-semibold leading-tight text-[var(--garden-text)]">
              {weatherBrief.headline}
            </p>
            <p className="mt-1 text-sm leading-relaxed text-[var(--garden-text-muted)]">{weatherBrief.summary}</p>
          </div>
          <ChevronDown
            className="mt-1 size-5 shrink-0 text-[var(--garden-text-muted)] transition-transform group-open:rotate-180"
            aria-hidden
          />
        </summary>

        <div className="mt-4 space-y-5 border-t border-[color-mix(in_oklch,var(--garden-primary)_12%,var(--garden-border))] pt-4">
          <ConditionStrip chips={weatherBrief.chips} />

          <SectionCard eyebrow="Forecast Check">
            {loading ? (
              <div className="space-y-3 animate-pulse">
                <div className="h-14 rounded-xl bg-[var(--garden-surface-muted)]" />
                <div className="h-28 rounded-xl bg-[var(--garden-surface-muted)]" />
              </div>
            ) : error || !weather ? (
              <EmptyStatePanel
                title="Forecast unavailable"
                description="Space checks below still follow today's rhythm and your zones."
                className="border-dashed py-6"
              />
            ) : (
              <GardenWeatherForecastBody weather={weather} sunData={sunData} showTip={false} />
            )}
          </SectionCard>

          <TodaysSpacesForecastCheck spaces={weatherBrief.spaceChecks} />

          <AppSurface variant="muted" padding="sm">
            <p className="text-[11px] font-medium tracking-wide text-[var(--garden-text-muted)] uppercase">
              What this means for your garden
            </p>
            <p className="mt-2 text-sm leading-relaxed text-[var(--garden-text)]">{weatherBrief.forecastImpact}</p>
          </AppSurface>
        </div>
      </details>
    </AppSurface>
  )
}
