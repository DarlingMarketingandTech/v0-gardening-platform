'use client'

import { useEffect, useMemo, useState } from 'react'

import { CareResultCard } from '@/components/care/care-result-card'
import { PlantIssueCard } from '@/components/care/plant-issue-card'
import { PlantIssueDetailSheet } from '@/components/care/plant-issue-detail-sheet'
import { SectionCard } from '@/components/garden-ui/section-card'
import { Input } from '@/components/ui/input'
import type { CareLocale } from '@/lib/care/care-copy'
import { getCareCopy } from '@/lib/care/care-copy'
import type { CareIssueGuideEntry } from '@/lib/care/care-issue-guide'
import { searchCareIssues } from '@/lib/care/care-issue-guide'
import type { CareResult } from '@/lib/care/care-result-types'

const DEMO_IDENTITY_RESULT: CareResult = {
  kind: 'identity',
  identity: {
    commonName: 'Cherry tomato',
    scientificName: 'Solanum lycopersicum',
    description: 'A bushy patio tomato with sweet bite-sized fruit—great for a sunny porch pot.',
    confidence: 0.82,
    careDetails: {
      light: 'Aim for six or more hours of sun; a little afternoon shade helps in hot summers.',
      watering: 'Let the top inch of soil dry, then water slowly until it drains.',
      soil: 'Rich potting mix with compost—nothing fancy, just well-draining.',
      temperature: 'Happiest roughly between 65–85°F (18–29°C).',
      maintenance: 'Snip suckers if you want a tidier plant; otherwise let it be a little wild.',
    },
    wateringIntervalDays: 2,
  },
}

export function PlantIssueGuide() {
  const [locale, setLocale] = useState<CareLocale>('en')
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<CareIssueGuideEntry | null>(null)

  useEffect(() => {
    if (typeof navigator === 'undefined') return
    setLocale(navigator.language.toLowerCase().startsWith('es') ? 'es' : 'en')
  }, [])

  const copy = useMemo(() => getCareCopy(locale), [locale])
  const filtered = useMemo(() => searchCareIssues(query), [query])

  return (
    <>
      <SectionCard
        eyebrow={copy.issueGuide.eyebrow}
        title={copy.issueGuide.title}
        description={copy.issueGuide.description}
      >
        <p className="text-xs leading-relaxed text-[var(--garden-text-muted)]">{copy.issueGuide.pestLookupHint}</p>

        <div className="space-y-3">
          <Input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={copy.issueGuide.searchPlaceholder}
            aria-label={copy.issueGuide.searchPlaceholder}
            className="bg-[var(--garden-surface)]"
          />

          <div className="space-y-2">
            {filtered.length === 0 ? (
              <div className="rounded-[length:var(--garden-radius-card)] border border-dashed border-[var(--garden-border)] bg-[var(--garden-surface-muted)] px-4 py-6 text-center">
                <p className="text-sm font-medium text-[var(--garden-text)]">{copy.issueGuide.emptyTitle}</p>
                <p className="mt-1 text-xs leading-relaxed text-[var(--garden-text-muted)]">{copy.issueGuide.emptyBody}</p>
              </div>
            ) : (
              filtered.map((entry) => (
                <PlantIssueCard
                  key={entry.id}
                  entry={entry}
                  copy={copy}
                  onOpen={() => setSelected(entry)}
                />
              ))
            )}
          </div>
        </div>

        <div className="mt-8 space-y-3 border-t border-[var(--garden-border)] pt-6">
          <p className="text-xs font-medium tracking-wide text-primary uppercase">{copy.issueGuide.sampleEyebrow}</p>
          <p className="text-xs leading-relaxed text-[var(--garden-text-muted)]">{copy.issueGuide.sampleIntro}</p>
          <CareResultCard result={DEMO_IDENTITY_RESULT} locale={locale} />
        </div>
      </SectionCard>

      <PlantIssueDetailSheet
        entry={selected}
        open={Boolean(selected)}
        onOpenChange={(open) => {
          if (!open) setSelected(null)
        }}
        copy={copy}
        locale={locale}
      />
    </>
  )
}
