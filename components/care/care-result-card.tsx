'use client'

import { Leaf, Sparkles } from 'lucide-react'

import {
  ActionPill,
  AppSurface,
  MetricChip,
  PlantImageFrame,
  ProgressMeter,
  SectionCard,
  StateBadge,
  StatusSurface,
} from '@/components/garden-ui'
import type { CareLocale } from '@/lib/care/care-copy'
import { getCareCopy } from '@/lib/care/care-copy'
import type { CareResult, CareUrgency } from '@/lib/care/care-result-types'

import { TreatmentChecklist } from '@/components/care/treatment-checklist'

function normalizeConfidencePercent(value: number) {
  if (value >= 0 && value <= 1) return Math.round(value * 100)
  return Math.round(Math.min(100, Math.max(0, value)))
}

function urgencyTone(u: CareUrgency | undefined) {
  if (u === 'high') return { badge: 'critical' as const, meter: 'attention' as const, status: 'critical' as const }
  if (u === 'medium') return { badge: 'attention' as const, meter: 'attention' as const, status: 'attention' as const }
  return { badge: 'stable' as const, meter: 'green' as const, status: 'stable' as const }
}

function urgencyLabel(u: CareUrgency | undefined, locale: CareLocale | string | null | undefined) {
  const copy = getCareCopy(locale)
  if (u === 'high') return copy.urgency.high
  if (u === 'medium') return copy.urgency.medium
  return copy.urgency.low
}

export interface CareResultCardProps {
  result: CareResult
  locale?: CareLocale | string | null
  className?: string
}

function TextBlock({ label, body }: { label: string; body?: string }) {
  if (!body?.trim()) return null
  return (
    <div className="space-y-1">
      <p className="text-xs font-medium tracking-wide text-primary uppercase">{label}</p>
      <p className="text-sm leading-relaxed text-[var(--garden-text)]">{body}</p>
    </div>
  )
}

export function CareResultCard({ result, locale, className }: CareResultCardProps) {
  const copy = getCareCopy(locale)

  if (result.kind === 'identity') {
    const { identity, imageUrl } = result
    const conf = identity.confidence
    const confPct = conf != null ? normalizeConfidencePercent(conf) : null
    const tones = urgencyTone('low')
    const plantLabel = identity.commonName ?? copy.resultCard.plantFallback

    return (
      <SectionCard
        className={className}
        eyebrow={copy.resultCard.identityEyebrow}
        title={plantLabel}
        description={identity.scientificName}
      >
        <StatusSurface
          status={tones.status}
          title={plantLabel}
          description={identity.description}
          icon={<Leaf className="size-5" aria-hidden />}
          action={
            confPct != null ? (
              <MetricChip label={copy.sections.confidence} value={`${confPct}%`} tone="green" />
            ) : null
          }
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
            <PlantImageFrame
              src={imageUrl}
              alt={identity.commonName ?? copy.resultCard.photoAlt}
              size="wide"
              className="sm:max-w-[12rem]"
            />
            <div className="min-w-0 flex-1 space-y-4">
              {confPct != null ? (
                <ProgressMeter
                  label={copy.sections.howSure}
                  value={confPct}
                  max={100}
                  tone={tones.meter}
                  showValue
                />
              ) : null}
              {identity.wateringIntervalDays != null ? (
                <MetricChip
                  label={copy.sections.wateringRhythm}
                  value={identity.wateringIntervalDays}
                  tone="water"
                  icon={<Sparkles className="size-4" aria-hidden />}
                />
              ) : null}
            </div>
          </div>

          <TextBlock label={copy.sections.whatWeNoticed} body={identity.whatWeNoticed} />

          {identity.careDetails ? (
            <AppSurface variant="tinted" padding="sm" radius="lg" className="border-primary/15">
              <p className="mb-2 text-xs font-medium tracking-wide text-primary uppercase">{copy.sections.careDetails}</p>
              <dl className="grid gap-2 text-sm">
                {identity.careDetails.light ? (
                  <div>
                    <dt className="text-[var(--garden-text-muted)]">{copy.careDetailLabels.light}</dt>
                    <dd className="text-[var(--garden-text)]">{identity.careDetails.light}</dd>
                  </div>
                ) : null}
                {identity.careDetails.watering ? (
                  <div>
                    <dt className="text-[var(--garden-text-muted)]">{copy.careDetailLabels.water}</dt>
                    <dd className="text-[var(--garden-text)]">{identity.careDetails.watering}</dd>
                  </div>
                ) : null}
                {identity.careDetails.soil ? (
                  <div>
                    <dt className="text-[var(--garden-text-muted)]">{copy.careDetailLabels.soil}</dt>
                    <dd className="text-[var(--garden-text)]">{identity.careDetails.soil}</dd>
                  </div>
                ) : null}
                {identity.careDetails.temperature ? (
                  <div>
                    <dt className="text-[var(--garden-text-muted)]">{copy.careDetailLabels.temperature}</dt>
                    <dd className="text-[var(--garden-text)]">{identity.careDetails.temperature}</dd>
                  </div>
                ) : null}
                {identity.careDetails.maintenance ? (
                  <div>
                    <dt className="text-[var(--garden-text-muted)]">{copy.careDetailLabels.upkeep}</dt>
                    <dd className="text-[var(--garden-text)]">{identity.careDetails.maintenance}</dd>
                  </div>
                ) : null}
              </dl>
            </AppSurface>
          ) : null}

          <AppSurface variant="muted" padding="sm" radius="lg" className="border-dashed border-[var(--garden-border)]">
            <p className="text-sm text-[var(--garden-text-muted)]">{copy.sections.saveToGardenSoon}</p>
            <ActionPill type="button" variant="secondary" size="sm" className="mt-3" disabled>
              {copy.resultCard.saveCta}
            </ActionPill>
          </AppSurface>
        </StatusSurface>
      </SectionCard>
    )
  }

  const { issue, imageUrl } = result
  const tones = urgencyTone(issue.urgency)
  const healthy = issue.isHealthy === true
  const title = healthy
    ? copy.sections.plantLooksFine
    : (issue.issueName ?? copy.sections.somethingToWatch)
  const issueConfPct = issue.confidence != null ? normalizeConfidencePercent(issue.confidence) : null

  return (
    <SectionCard className={className} eyebrow={copy.resultCard.issueEyebrow} title={title}>
      <StatusSurface
        status={healthy ? 'stable' : tones.status}
        title={title}
        description={issue.whatWeNoticed}
        icon={<Leaf className="size-5" aria-hidden />}
        action={
          <div className="flex flex-wrap gap-2">
            {issue.urgency && !healthy ? (
              <StateBadge tone={tones.badge} size="md">
                {urgencyLabel(issue.urgency, locale)}
              </StateBadge>
            ) : null}
            {issueConfPct != null && !healthy ? (
              <MetricChip
                label={copy.sections.confidence}
                value={`${issueConfPct}%`}
                tone="attention"
              />
            ) : null}
          </div>
        }
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          <PlantImageFrame
            src={imageUrl}
            alt={issue.issueName ?? copy.resultCard.photoAlt}
            size="wide"
            className="sm:max-w-[12rem]"
          />
          {issueConfPct != null && !healthy ? (
            <div className="min-w-0 flex-1">
              <ProgressMeter
                label={copy.sections.howSure}
                value={issueConfPct}
                max={100}
                tone={tones.meter}
                showValue
              />
            </div>
          ) : null}
        </div>

        <div className="space-y-4">
          <TextBlock label={copy.sections.whatWeNoticed} body={issue.whatWeNoticed} />
          <TextBlock label={copy.sections.whatToDoToday} body={issue.whatToDoToday} />
          <TextBlock label={copy.sections.whatNotToDo} body={issue.whatNotToDo} />
          <TextBlock label={copy.sections.whenToCheckAgain} body={issue.whenToCheckAgain} />
        </div>

        {issue.treatmentSteps?.length ? <TreatmentChecklist steps={issue.treatmentSteps} locale={locale} /> : null}

        {issue.preventionTips?.length ? (
          <div className="space-y-2">
            <p className="text-xs font-medium tracking-wide text-primary uppercase">{copy.sections.prevention}</p>
            <ul className="list-inside list-disc space-y-1 text-sm leading-relaxed text-[var(--garden-text)]">
              {issue.preventionTips.map((tip, i) => (
                <li key={`${i}-${tip.slice(0, 24)}`}>{tip}</li>
              ))}
            </ul>
          </div>
        ) : null}

        <AppSurface variant="muted" padding="sm" radius="lg" className="border-dashed border-[var(--garden-border)]">
          <p className="text-sm text-[var(--garden-text-muted)]">{copy.sections.saveToGardenSoon}</p>
          <ActionPill type="button" variant="secondary" size="sm" className="mt-3" disabled>
            {copy.resultCard.saveCta}
          </ActionPill>
        </AppSurface>
      </StatusSurface>
    </SectionCard>
  )
}
