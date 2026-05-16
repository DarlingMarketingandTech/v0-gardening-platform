'use client'

import type { SetupStageDefinition } from '@/lib/garden-setup/setup-stages'

export interface SetupStageHeaderProps {
  stage: SetupStageDefinition
  stepTitle: string
  stepHint: string
}

export function SetupStageHeader({ stage, stepTitle, stepHint }: SetupStageHeaderProps) {
  return (
    <header className="space-y-2">
      <p className="text-xs font-medium tracking-wide text-primary uppercase">{stage.title}</p>
      <p className="text-sm leading-relaxed text-muted-foreground">{stage.explanation}</p>
      <p className="text-xs leading-relaxed text-(--garden-text-muted)">
        <span className="font-medium text-(--garden-text)">Unlocks: </span>
        {stage.unlocks}
      </p>
      <h1 className="pt-2 text-xl font-semibold leading-snug text-balance text-(--garden-text)">{stepTitle}</h1>
      <p className="text-sm leading-relaxed text-muted-foreground">{stepHint}</p>
    </header>
  )
}
