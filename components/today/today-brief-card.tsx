'use client'

import Link from 'next/link'
import { AlertTriangle, BookHeart, Sparkles, Sprout } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { WeatherWidgetContent } from '@/components/dashboard/weather-widget'
import type { TodayViewModel } from '@/lib/garden-os/types'
import { BriefActionCard, BriefSignal, BriefSmallTask } from './today-brief-parts'
import { TodayNeedHelpStrip } from './today-need-help-strip'

interface TodayBriefCardProps {
  viewModel: TodayViewModel
}

export function TodayBriefCard({ viewModel }: TodayBriefCardProps) {
  const { brief, weatherState } = viewModel

  return (
    <Card className="overflow-hidden rounded-2xl border-primary/15 shadow-sm">
      <CardHeader className="pb-2 pt-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="text-base md:text-lg">Today</CardTitle>
            <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">{brief.contextLabel}</p>
          </div>
          <span className="shrink-0 rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-medium text-primary">
            Now
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pb-4">
        <BriefActionCard item={brief.bestAction} />

        <div className="flex flex-wrap gap-2">
          <Button className="h-10 shrink-0" asChild>
            <Link href="/my-garden/log">
              <BookHeart className="mr-2 h-4 w-4" />
              Log a note
            </Link>
          </Button>
          <Button variant="outline" className="h-10 shrink-0" asChild>
            <Link href="/my-garden/garden">
              <Sprout className="mr-2 h-4 w-4" />
              View spaces
            </Link>
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
              <p className="text-sm leading-relaxed text-foreground/90">{brief.whyThisMatters}</p>
            </div>

            {brief.secondaryTasks.length > 0 ? (
              <div className="space-y-2">
                <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                  Small follow-ups
                </p>
                <div className="space-y-2">
                  {brief.secondaryTasks.map((task) => (
                    <BriefSmallTask key={task.id} item={task} />
                  ))}
                </div>
              </div>
            ) : null}

            <div className="grid gap-3 md:grid-cols-2">
              <BriefSignal
                label="Watch out"
                item={brief.watchOut}
                icon={AlertTriangle}
                className="border-amber-200/70 bg-amber-50/70 dark:border-amber-900/50 dark:bg-amber-950/20"
              />
              <BriefSignal
                label="Progress"
                item={brief.milestone}
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

        <TodayNeedHelpStrip />
      </CardContent>
    </Card>
  )
}
