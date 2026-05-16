'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ActionPill } from '@/components/garden-ui/action-pill'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { LightSelector } from '@/components/setup/light-selector'
import { SetupChoiceGrid } from '@/components/setup/setup-choice-grid'
import { SetupPreviewCard } from '@/components/setup/setup-preview-card'
import { SetupProgressRail } from '@/components/setup/setup-progress-rail'
import { SetupQuestionCard } from '@/components/setup/setup-question-card'
import { SetupStageHeader } from '@/components/setup/setup-stage-header'
import { SetupSummaryCard } from '@/components/setup/setup-summary-card'
import { ZoneTemplateCard } from '@/components/setup/zone-template-card'
import {
  answersToProfile,
  buildSetupSteps,
  defaultSetupAnswers,
  getStepCopy,
  indoorSpaceOptions,
  outdoorSpaceOptions,
  type SetupAnswers,
  type SetupStep,
} from '@/lib/garden-setup/questions'
import { SETUP_STAGES, setupStageForStep } from '@/lib/garden-setup/setup-stages'
import { saveGardenSetupProfile } from '@/lib/garden-setup/store'
import type { GardenSkillLevel, NotifyChannel, NotifyFrequency } from '@/lib/garden-setup/types'
import { ChevronLeft, Leaf } from 'lucide-react'

interface GardenSetupWizardProps {
  householdId: string
  initialDisplayName?: string
}

export function GardenSetupWizard({ householdId, initialDisplayName }: GardenSetupWizardProps) {
  const router = useRouter()
  const [answers, setAnswers] = useState<SetupAnswers>(() => ({
    ...defaultSetupAnswers(),
    displayName: initialDisplayName ?? '',
  }))
  const [stepIndex, setStepIndex] = useState(0)

  const steps = useMemo(() => buildSetupSteps(answers), [answers])

  useEffect(() => {
    setStepIndex((i) => Math.min(i, Math.max(steps.length - 1, 0)))
  }, [steps.length])

  const step = steps[stepIndex] ?? steps[steps.length - 1]
  const copy = getStepCopy(step, answers)
  const stage = SETUP_STAGES.find((s) => s.id === setupStageForStep(step)) ?? SETUP_STAGES[0]
  const progress = steps.length > 1 ? (stepIndex + 1) / steps.length : 1

  const goNext = () => setStepIndex((i) => Math.min(i + 1, steps.length - 1))
  const goBack = () => setStepIndex((i) => Math.max(i - 1, 0))

  const finish = () => {
    const profile = answersToProfile(answers)
    saveGardenSetupProfile(householdId, profile)
    router.replace('/my-garden')
    router.refresh()
  }

  const canContinue = validateStep(step, answers)
  const body = renderStepBody(step, answers, setAnswers, goNext, finish)

  return (
    <div className="relative flex min-h-dvh flex-col bg-linear-to-b from-[color-mix(in_oklch,var(--garden-primary)_12%,var(--background))] via-background to-[color-mix(in_oklch,var(--garden-primary)_8%,var(--background))]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,transparent_0%,color-mix(in_oklch,var(--garden-primary)_6%,transparent)_55%,transparent_72%)]" aria-hidden />

      <header className="relative z-10 shrink-0 border-b border-[color-mix(in_oklch,var(--garden-primary)_18%,var(--garden-border))] bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-lg flex-col gap-3 px-4 py-3">
          <div className="flex items-center gap-2">
            <Leaf className="size-5 shrink-0 text-primary" aria-hidden />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold tracking-wide text-primary uppercase">Garden setup</p>
              <p className="text-[11px] text-muted-foreground">Guided builder · Momma D&apos;s Garden</p>
            </div>
            <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
              {stepIndex + 1}/{steps.length}
            </span>
          </div>
          <SetupProgressRail activeStage={setupStageForStep(step)} overallFraction={progress} />
        </div>
      </header>

      <main className="relative z-10 mx-auto flex w-full max-w-lg flex-1 flex-col px-4 py-6">
        <div className="flex min-h-0 flex-1 flex-col gap-6">
          <SetupStageHeader stage={stage} stepTitle={copy.title} stepHint={copy.hint} />

          <SetupPreviewCard answers={answers} />

          {step.kind === 'summary' ? (
            body
          ) : (
            <SetupQuestionCard>{body}</SetupQuestionCard>
          )}
        </div>
      </main>

      <footer className="relative z-10 mt-auto shrink-0 border-t border-(--garden-border) bg-background/90 px-4 py-4 backdrop-blur-md">
        <div className="mx-auto flex max-w-lg gap-2">
          {stepIndex > 0 ? (
            <Button type="button" variant="outline" className="h-11 min-w-22" onClick={goBack}>
              <ChevronLeft className="mr-1 size-4" aria-hidden />
              Back
            </Button>
          ) : (
            <Button type="button" variant="ghost" className="h-11" asChild>
              <Link href="/my-garden">Skip for now</Link>
            </Button>
          )}

          {step.kind === 'summary' ? <div className="flex-1" /> : null}

          {step.kind === 'summary' ? null : (
            <Button type="button" className="h-11 flex-1" disabled={!canContinue} onClick={goNext}>
              Continue
            </Button>
          )}
        </div>
      </footer>
    </div>
  )
}

function validateStep(step: SetupStep, answers: SetupAnswers): boolean {
  switch (step.kind) {
    case 'welcome':
      return true
    case 'location':
      return answers.locationLabel.trim().length >= 2
    case 'skill':
      return answers.skillLevel !== null
    case 'grow-where':
      return answers.growsOutdoor || answers.growsIndoor
    case 'outdoor-pick':
      return answers.outdoorDrafts.length > 0
    case 'outdoor-sun':
      return step.spaceId ? Boolean(answers.outdoorSun[step.spaceId]) : false
    case 'indoor-pick':
      return answers.indoorDrafts.length > 0
    case 'indoor-light':
      return step.spaceId ? Boolean(answers.indoorLight[step.spaceId]) : false
    case 'notify-topics':
      return answers.notifyTopics.length > 0
    case 'notify-channels':
      return answers.notifyChannels.length > 0
    case 'notify-frequency':
      return answers.notifyFrequency !== null
    case 'summary':
      return true
    default:
      return false
  }
}

function renderStepBody(
  step: SetupStep,
  answers: SetupAnswers,
  setAnswers: React.Dispatch<React.SetStateAction<SetupAnswers>>,
  onAutoAdvance: () => void,
  onFinish: () => void,
) {
  switch (step.kind) {
    case 'welcome':
      return (
        <Input
          className="h-12 border border-(--garden-border) bg-(--garden-surface) text-base"
          placeholder="Your first name (optional)"
          value={answers.displayName}
          onChange={(e) => setAnswers((a) => ({ ...a, displayName: e.target.value }))}
        />
      )
    case 'location':
      return (
        <div className="space-y-3">
          <Input
            className="h-12 border border-(--garden-border) bg-(--garden-surface) text-base"
            placeholder="City, state — e.g. Raleigh, NC"
            value={answers.locationLabel}
            onChange={(e) => setAnswers((a) => ({ ...a, locationLabel: e.target.value }))}
          />
          <div className="flex flex-wrap gap-2">
            {['Raleigh, NC', 'Charlotte, NC', 'Atlanta, GA'].map((loc) => (
              <Button
                key={loc}
                type="button"
                size="sm"
                variant={answers.locationLabel === loc ? 'default' : 'outline'}
                onClick={() => setAnswers((a) => ({ ...a, locationLabel: loc }))}
              >
                {loc}
              </Button>
            ))}
          </div>
        </div>
      )
    case 'skill':
      return (
        <SetupChoiceGrid
          mode="single"
          columns="1"
          selected={answers.skillLevel}
          onToggle={(v) => {
            setAnswers((a) => ({ ...a, skillLevel: v as GardenSkillLevel }))
            setTimeout(onAutoAdvance, 180)
          }}
          options={[
            { value: 'beginner', label: 'Just getting started', sub: 'Simple, clear steps.' },
            { value: 'comfortable', label: 'Some experience', sub: 'Basics down — still learning.' },
            { value: 'confident', label: 'Confident gardener', sub: 'You read the garden and adjust often.' },
          ]}
        />
      )
    case 'grow-where': {
      const selected = [...(answers.growsOutdoor ? ['outdoor'] : []), ...(answers.growsIndoor ? ['indoor'] : [])]
      return (
        <SetupChoiceGrid
          mode="multi"
          columns="1"
          selected={selected}
          onToggle={(v) => {
            setAnswers((a) => {
              if (v === 'outdoor') {
                const next = !a.growsOutdoor
                return { ...a, growsOutdoor: next, outdoorDrafts: next ? a.outdoorDrafts : [] }
              }
              if (v === 'indoor') {
                const next = !a.growsIndoor
                return { ...a, growsIndoor: next, indoorDrafts: next ? a.indoorDrafts : [] }
              }
              return a
            })
          }}
          options={[
            { value: 'outdoor', label: 'Outdoor beds & pots' },
            { value: 'indoor', label: 'Indoor plants' },
          ]}
        />
      )
    }
    case 'outdoor-pick':
      return (
        <div className="grid gap-3 sm:grid-cols-2">
          {outdoorSpaceOptions.map((opt) => (
            <ZoneTemplateCard
              key={opt.id}
              draft={opt}
              selected={answers.outdoorDrafts.some((d) => d.id === opt.id)}
              onToggle={() =>
                setAnswers((a) => {
                  const has = a.outdoorDrafts.some((d) => d.id === opt.id)
                  return {
                    ...a,
                    outdoorDrafts: has
                      ? a.outdoorDrafts.filter((d) => d.id !== opt.id)
                      : [...a.outdoorDrafts, opt],
                  }
                })
              }
            />
          ))}
        </div>
      )
    case 'outdoor-sun':
      return (
        <LightSelector
          variant="outdoor-sun"
          value={step.spaceId ? answers.outdoorSun[step.spaceId] : undefined}
          onPick={(level) => {
            if (!step.spaceId) return
            setAnswers((a) => ({
              ...a,
              outdoorSun: { ...a.outdoorSun, [step.spaceId!]: level },
            }))
            setTimeout(onAutoAdvance, 200)
          }}
        />
      )
    case 'indoor-pick':
      return (
        <div className="grid gap-3 sm:grid-cols-2">
          {indoorSpaceOptions.map((opt) => (
            <ZoneTemplateCard
              key={opt.id}
              draft={opt}
              selected={answers.indoorDrafts.some((d) => d.id === opt.id)}
              onToggle={() =>
                setAnswers((a) => {
                  const has = a.indoorDrafts.some((d) => d.id === opt.id)
                  return {
                    ...a,
                    indoorDrafts: has ? a.indoorDrafts.filter((d) => d.id !== opt.id) : [...a.indoorDrafts, opt],
                  }
                })
              }
            />
          ))}
        </div>
      )
    case 'indoor-light':
      return (
        <LightSelector
          variant="indoor-light"
          value={step.spaceId ? answers.indoorLight[step.spaceId] : undefined}
          onPick={(level) => {
            if (!step.spaceId) return
            setAnswers((a) => ({
              ...a,
              indoorLight: { ...a.indoorLight, [step.spaceId!]: level },
            }))
            setTimeout(onAutoAdvance, 200)
          }}
        />
      )
    case 'notify-topics':
      return (
        <SetupChoiceGrid
          mode="multi"
          columns="1"
          selected={answers.notifyTopics}
          onToggle={(topic) =>
            setAnswers((a) => {
              const has = a.notifyTopics.includes(topic)
              return {
                ...a,
                notifyTopics: has ? a.notifyTopics.filter((t) => t !== topic) : [...a.notifyTopics, topic],
              }
            })
          }
          options={[
            { value: 'watering', label: 'Watering & dry soil' },
            { value: 'weather', label: 'Weather shifts' },
            { value: 'harvest', label: 'Harvest & ripening' },
            { value: 'pests', label: 'Pests & plant health' },
          ]}
        />
      )
    case 'notify-channels':
      return (
        <SetupChoiceGrid
          mode="multi"
          columns="1"
          selected={answers.notifyChannels}
          onToggle={(ch) =>
            setAnswers((a) => {
              const has = a.notifyChannels.includes(ch as NotifyChannel)
              const next = has
                ? a.notifyChannels.filter((c) => c !== ch)
                : [...a.notifyChannels, ch as NotifyChannel]
              return { ...a, notifyChannels: next }
            })
          }
          options={[
            { value: 'app', label: 'In the app' },
            { value: 'email', label: 'Email' },
            { value: 'sms', label: 'Text message' },
          ]}
        />
      )
    case 'notify-frequency':
      return (
        <SetupChoiceGrid
          mode="single"
          columns="1"
          selected={answers.notifyFrequency}
          onToggle={(v) => {
            setAnswers((a) => ({ ...a, notifyFrequency: v as NotifyFrequency }))
            setTimeout(onAutoAdvance, 200)
          }}
          options={[
            { value: 'daily', label: 'Daily digest', sub: 'One calm check-in per day.' },
            { value: 'important', label: 'Important only', sub: 'Only when something needs you.' },
            { value: 'weekly', label: 'Weekly roundup', sub: 'A gentle Sunday-style summary.' },
          ]}
        />
      )
    case 'summary':
      return (
        <SetupSummaryCard
          answers={answers}
          finishAction={
            <ActionPill type="button" variant="primary" size="lg" className="w-full min-h-11" onClick={onFinish}>
              Open my garden
            </ActionPill>
          }
        />
      )
    default:
      return null
  }
}
