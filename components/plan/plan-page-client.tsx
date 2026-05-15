import { CalendarDays, Clock, Sprout } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { PlanViewModel } from '@/lib/garden-os/types'

interface PlanPageClientProps {
  viewModel: PlanViewModel
}

export function PlanPageClient({ viewModel }: PlanPageClientProps) {
  return (
    <div className="space-y-4">
      <section className="overflow-hidden rounded-2xl border border-primary/15 bg-linear-to-br from-primary/10 via-card to-accent/20 p-6 shadow-sm">
        <p className="text-xs font-medium uppercase tracking-wide text-primary">{viewModel.seasonLabel}</p>
        <h2 className="mt-2 text-2xl font-bold leading-tight text-foreground md:text-3xl">{viewModel.headline}</h2>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base">
          {viewModel.summary}
        </p>
      </section>

      <Card className="rounded-2xl border-primary/10">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" aria-hidden />
            <CardTitle className="text-base">Season timeline — coming next</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {viewModel.timelineSteps.map((step, index) => (
              <div
                key={step.label}
                className="flex items-center gap-3 rounded-xl border border-dashed border-primary/20 bg-muted/20 px-3 py-3"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                  {index + 1}
                </span>
                <div>
                  <p className="text-sm font-medium">{step.label}</p>
                  <p className="text-xs text-muted-foreground">{step.placeholderNote}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-primary/10">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Sprout className="h-5 w-5 text-primary" aria-hidden />
            <CardTitle className="text-base">Crop windows</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {viewModel.cropWindows.map((window) => (
            <div key={window.title} className="rounded-xl border border-primary/10 bg-muted/15 px-4 py-3">
              <p className="text-sm font-medium">{window.title}</p>
              <p className="mt-1 text-xs text-muted-foreground">{window.description}</p>
            </div>
          ))}
          <div className="flex items-start gap-2 rounded-xl border border-dashed border-primary/25 bg-primary/5 px-3 py-2.5 text-xs text-muted-foreground">
            <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
            <p>{viewModel.footerNote}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
