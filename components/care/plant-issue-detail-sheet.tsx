'use client'

import { CareResultCard } from '@/components/care/care-result-card'
import { AppSurface } from '@/components/garden-ui/app-surface'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import type { CareCopy, CareLocale } from '@/lib/care/care-copy'
import type { CareIssueGuideEntry } from '@/lib/care/care-issue-guide'
import { careIssueGuideToResult } from '@/lib/care/care-issue-guide'

export interface PlantIssueDetailSheetProps {
  entry: CareIssueGuideEntry | null
  open: boolean
  onOpenChange: (open: boolean) => void
  copy: CareCopy
  locale?: CareLocale | string | null
}

export function PlantIssueDetailSheet({ entry, open, onOpenChange, copy, locale }: PlantIssueDetailSheetProps) {
  const result = entry ? careIssueGuideToResult(entry) : null

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="flex max-h-[min(90vh,40rem)] flex-col gap-0 overflow-hidden p-0 sm:max-w-lg">
        {entry && result ? (
          <>
            <SheetHeader className="border-b border-border px-4 pb-3 pt-2 text-left sm:px-5">
              <SheetTitle className="text-lg">{entry.name}</SheetTitle>
              <SheetDescription className="text-left text-sm leading-relaxed">
                {copy.issueGuide.types[entry.type]}
              </SheetDescription>
            </SheetHeader>
            <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-5">
              <div className="space-y-6">
                <CareResultCard result={result} locale={locale} />

                <div className="space-y-3">
                  <p className="text-xs font-medium tracking-wide text-primary uppercase">{copy.issueGuide.symptoms}</p>
                  <ul className="list-inside list-disc space-y-1 text-sm leading-relaxed text-(--garden-text)">
                    {entry.symptoms.map((s, i) => (
                      <li key={`sym-${i}`}>{s}</li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-3">
                  <p className="text-xs font-medium tracking-wide text-primary uppercase">{copy.issueGuide.causes}</p>
                  <ul className="list-inside list-disc space-y-1 text-sm leading-relaxed text-(--garden-text)">
                    {entry.causes.map((c, i) => (
                      <li key={`cause-${i}`}>{c}</li>
                    ))}
                  </ul>
                </div>

                <AppSurface variant="muted" padding="sm" radius="lg" className="border border-dashed border-(--garden-border)">
                  <p className="text-xs leading-relaxed text-(--garden-text-muted)">
                    {copy.issueGuide.offlineNote}
                  </p>
                </AppSurface>
              </div>
            </div>
          </>
        ) : null}
      </SheetContent>
    </Sheet>
  )
}
