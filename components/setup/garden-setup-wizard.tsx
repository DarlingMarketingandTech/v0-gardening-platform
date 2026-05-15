'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { Leaf, ChevronLeft } from 'lucide-react'
import { cn } from '@/lib/utils'
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
import { saveGardenSetupProfile } from '@/lib/garden-setup/store'
import type { GardenSkillLevel, NotifyChannel, NotifyFrequency, SunLevel } from '@/lib/garden-setup/types'

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
  const progress = steps.length > 1 ? ((stepIndex + 1) / steps.length) * 100 : 100

  const goNext = () => setStepIndex((i) => Math.min(i + 1, steps.length - 1))
  const goBack = () => setStepIndex((i) => Math.max(i - 1, 0))

  const finish = () => {
    const profile = answersToProfile(answers)
    saveGardenSetupProfile(householdId, profile)
    router.replace('/my-garden')
    router.refresh()
  }

  const canContinue = validateStep(step, answers)

  return (
    <div className="min-h-dvh flex flex-col bg-linear-to-b from-primary/5 via-background to-accent/5">
      <header className="shrink-0 border-b border-primary/10 bg-background/90 backdrop-blur px-4 py-3">
        <div className="flex items-center gap-2 max-w-lg mx-auto">
          <Leaf className="h-5 w-5 text-primary shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-primary">Garden setup</p>
            <Progress value={progress} className="h-1.5 mt-1" />
          </div>
          <span className="text-xs text-muted-foreground tabular-nums shrink-0">
            {stepIndex + 1}/{steps.length}
          </span>
        </div>
      </header>

      <main className="flex-1 flex flex-col max-w-lg mx-auto w-full px-4 py-6">
        <div className="flex-1 flex flex-col justify-center min-h-0">
          <h1 className="text-xl font-semibold leading-snug text-balance">{copy.title}</h1>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{copy.hint}</p>

          <div className="mt-6 space-y-3">{renderStepBody(step, answers, setAnswers, goNext)}</div>
        </div>

        <div className="shrink-0 pt-6 flex gap-2">
          {stepIndex > 0 ? (
            <Button type="button" variant="outline" className="h-11" onClick={goBack}>
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
          ) : (
            <Button type="button" variant="ghost" className="h-11" asChild>
              <Link href="/my-garden">Skip for now</Link>
            </Button>
          )}

          {step.kind === 'summary' ? (
            <Button type="button" className="h-11 flex-1" onClick={finish}>
              Open my garden
            </Button>
          ) : (
            <Button type="button" className="h-11 flex-1" disabled={!canContinue} onClick={goNext}>
              Continue
            </Button>
          )}
        </div>
      </main>
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
) {
  switch (step.kind) {
    case 'welcome':
      return (
        <Input
          className="h-12 text-base"
          placeholder="Your first name (optional)"
          value={answers.displayName}
          onChange={(e) => setAnswers((a) => ({ ...a, displayName: e.target.value }))}
        />
      )
    case 'location':
      return (
        <div className="space-y-3">
          <Input
            className="h-12 text-base"
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
        <ChoiceList
          options={[
            { value: 'beginner', label: 'Just getting started', sub: 'I want simple, clear steps.' },
            { value: 'comfortable', label: 'Some experience', sub: 'I know the basics and keep learning.' },
            { value: 'confident', label: 'Confident gardener', sub: 'I read the garden and adjust often.' },
          ]}
          value={answers.skillLevel}
          onPick={(v) => {
            setAnswers((a) => ({ ...a, skillLevel: v as GardenSkillLevel }))
            setTimeout(onAutoAdvance, 180)
          }}
        />
      )
    case 'grow-where':
      return (
        <MultiChoice
          options={[
            { value: 'outdoor', label: 'Outdoor beds & pots' },
            { value: 'indoor', label: 'Indoor plants' },
          ]}
          selected={[
            ...(answers.growsOutdoor ? ['outdoor'] : []),
            ...(answers.growsIndoor ? ['indoor'] : []),
          ]}
          onChange={(selected) =>
            setAnswers((a) => ({
              ...a,
              growsOutdoor: selected.includes('outdoor'),
              growsIndoor: selected.includes('indoor'),
              outdoorDrafts: selected.includes('outdoor') ? a.outdoorDrafts : [],
              indoorDrafts: selected.includes('indoor') ? a.indoorDrafts : [],
            }))
          }
        />
      )
    case 'outdoor-pick':
      return (
        <MultiChoice
          options={outdoorSpaceOptions.map((o) => ({ value: o.id, label: o.title }))}
          selected={answers.outdoorDrafts.map((d) => d.id)}
          onChange={(ids) =>
            setAnswers((a) => ({
              ...a,
              outdoorDrafts: outdoorSpaceOptions.filter((o) => ids.includes(o.id)),
            }))
          }
        />
      )
    case 'outdoor-sun':
      return (
        <SunChoice
          value={step.spaceId ? answers.outdoorSun[step.spaceId] : undefined}
          onPick={(level) => {
            if (!step.spaceId) return
            setAnswers((a) => ({
              ...a,
              outdoorSun: { ...a.outdoorSun, [step.spaceId!]: level },
            }))
            setTimeout(onAutoAdvance, 180)
          }}
        />
      )
    case 'indoor-pick':
      return (
        <MultiChoice
          options={indoorSpaceOptions.map((o) => ({ value: o.id, label: o.title }))}
          selected={answers.indoorDrafts.map((d) => d.id)}
          onChange={(ids) =>
            setAnswers((a) => ({
              ...a,
              indoorDrafts: indoorSpaceOptions.filter((o) => ids.includes(o.id)),
            }))
          }
        />
      )
    case 'indoor-light':
      return (
        <SunChoice
          value={step.spaceId ? answers.indoorLight[step.spaceId] : undefined}
          onPick={(level) => {
            if (!step.spaceId) return
            setAnswers((a) => ({
              ...a,
              indoorLight: { ...a.indoorLight, [step.spaceId!]: level },
            }))
            setTimeout(onAutoAdvance, 180)
          }}
        />
      )
    case 'notify-topics':
      return (
        <MultiChoice
          options={[
            { value: 'watering', label: 'Watering & dry soil' },
            { value: 'weather', label: 'Weather shifts' },
            { value: 'harvest', label: 'Harvest & ripening' },
            { value: 'pests', label: 'Pests & plant health' },
          ]}
          selected={answers.notifyTopics}
          onChange={(topics) => setAnswers((a) => ({ ...a, notifyTopics: topics }))}
        />
      )
    case 'notify-channels':
      return (
        <MultiChoice
          options={[
            { value: 'app', label: 'In the app' },
            { value: 'email', label: 'Email' },
            { value: 'sms', label: 'Text message' },
          ]}
          selected={answers.notifyChannels}
          onChange={(channels) =>
            setAnswers((a) => ({ ...a, notifyChannels: channels as NotifyChannel[] }))
          }
        />
      )
    case 'notify-frequency':
      return (
        <ChoiceList
          options={[
            { value: 'daily', label: 'Daily digest', sub: 'One calm check-in per day.' },
            { value: 'important', label: 'Important only', sub: 'Only when something needs you.' },
            { value: 'weekly', label: 'Weekly roundup', sub: 'A gentle Sunday-style summary.' },
          ]}
          value={answers.notifyFrequency}
          onPick={(v) => {
            setAnswers((a) => ({ ...a, notifyFrequency: v as NotifyFrequency }))
            setTimeout(onAutoAdvance, 180)
          }}
        />
      )
    case 'summary':
      return (
        <div className="rounded-xl border border-primary/15 bg-card/80 p-4 text-sm space-y-2">
          <p>
            <span className="text-muted-foreground">Location:</span> {answers.locationLabel}
          </p>
          <p>
            <span className="text-muted-foreground">Spaces:</span>{' '}
            {answers.outdoorDrafts.length + answers.indoorDrafts.length} saved
          </p>
          <p>
            <span className="text-muted-foreground">Reminders:</span>{' '}
            {answers.notifyTopics.join(', ')} via {answers.notifyChannels.join(', ')}
          </p>
        </div>
      )
    default:
      return null
  }
}

function ChoiceList({
  options,
  value,
  onPick,
}: {
  options: { value: string; label: string; sub?: string }[]
  value: string | null
  onPick: (value: string) => void
}) {
  return (
    <div className="space-y-2">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onPick(opt.value)}
          className={cn(
            'w-full rounded-xl border px-4 py-3 text-left transition-colors',
            value === opt.value
              ? 'border-primary bg-primary/10'
              : 'border-border bg-card hover:bg-muted/50',
          )}
        >
          <p className="font-medium text-sm">{opt.label}</p>
          {opt.sub ? <p className="text-xs text-muted-foreground mt-0.5">{opt.sub}</p> : null}
        </button>
      ))}
    </div>
  )
}

function MultiChoice({
  options,
  selected,
  onChange,
}: {
  options: { value: string; label: string }[]
  selected: string[]
  onChange: (values: string[]) => void
}) {
  const toggle = (value: string) => {
    onChange(selected.includes(value) ? selected.filter((v) => v !== value) : [...selected, value])
  }

  return (
    <div className="space-y-2">
      {options.map((opt) => {
        const active = selected.includes(opt.value)
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => toggle(opt.value)}
            className={cn(
              'w-full rounded-xl border px-4 py-3 text-left text-sm font-medium transition-colors',
              active ? 'border-primary bg-primary/10' : 'border-border bg-card hover:bg-muted/50',
            )}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}

function SunChoice({
  value,
  onPick,
}: {
  value?: SunLevel
  onPick: (level: SunLevel) => void
}) {
  const levels: { value: SunLevel; label: string; sub: string }[] = [
    { value: 'low', label: 'Low', sub: 'Shade or brief sun' },
    { value: 'mid', label: 'Medium', sub: 'Several hours of sun' },
    { value: 'high', label: 'High', sub: 'Full sun most of the day' },
  ]

  return <ChoiceList options={levels} value={value ?? null} onPick={(v) => onPick(v as SunLevel)} />
}
