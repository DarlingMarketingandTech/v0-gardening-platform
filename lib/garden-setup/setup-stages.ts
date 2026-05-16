import type { SetupStep, SetupStepKind } from './questions'

export type SetupStageId = 'space' | 'conditions' | 'rhythm'

export interface SetupStageDefinition {
  id: SetupStageId
  title: string
  explanation: string
  unlocks: string
}

export const SETUP_STAGES: readonly SetupStageDefinition[] = [
  {
    id: 'space',
    title: 'Your Space',
    explanation: 'Tell us where things grow so Momma D can organize your spaces.',
    unlocks: 'Zones on your Garden map and Care tuned to each spot.',
  },
  {
    id: 'conditions',
    title: 'Conditions',
    explanation: 'Light and weather help us make smarter care suggestions.',
    unlocks: 'Today’s weather briefing and calmer nudges that match your light.',
  },
  {
    id: 'rhythm',
    title: 'Garden Rhythm',
    explanation: 'Choose how often you want a nudge.',
    unlocks: 'Important-only reminders keep Today calmer; digests when you want more.',
  },
] as const

const SPACE_STEPS: ReadonlySet<SetupStepKind> = new Set([
  'welcome',
  'grow-where',
  'outdoor-pick',
  'outdoor-sun',
  'indoor-pick',
  'indoor-light',
])

const CONDITIONS_STEPS: ReadonlySet<SetupStepKind> = new Set(['location', 'skill'])

export function setupStageForStep(step: SetupStep): SetupStageId {
  if (SPACE_STEPS.has(step.kind)) return 'space'
  if (CONDITIONS_STEPS.has(step.kind)) return 'conditions'
  return 'rhythm'
}

export function setupStageIndex(stage: SetupStageId): number {
  return SETUP_STAGES.findIndex((s) => s.id === stage)
}
