import type { GardenContext, PlanViewModel } from '@/lib/garden-os/types'

export function buildPlanPlaceholderViewModel(): PlanViewModel {
  const month = new Date().toLocaleString('en-US', { month: 'long' })

  return {
    seasonLabel: `${month} garden rhythm`,
    headline: 'Plan your season with calm, clear windows',
    summary:
      'A full planting timeline is coming next. For now, sketch what you want to sow, transplant, and harvest — Momma D’s Garden will grow into seasonal reminders here.',
    timelineSteps: [
      {
        label: 'Early season prep',
        placeholderNote: 'Placeholder — full timeline engine arrives in a later phase.',
      },
      {
        label: 'Main planting window',
        placeholderNote: 'Placeholder — full timeline engine arrives in a later phase.',
      },
      {
        label: 'Peak harvest',
        placeholderNote: 'Placeholder — full timeline engine arrives in a later phase.',
      },
    ],
    cropWindows: [
      {
        title: 'Cool-season greens',
        description: 'Sow → thin → harvest — dates will personalize to your garden.',
      },
      {
        title: 'Warm-season favorites',
        description: 'Last frost, transplant, and succession prompts will live here.',
      },
    ],
    footerNote:
      'No database changes needed — this is a polished planning shell until the plan engine ships.',
  }
}

export async function getPlanViewModel(_context: GardenContext): Promise<PlanViewModel> {
  return buildPlanPlaceholderViewModel()
}
