import type { CareToolDescriptor, CareViewModel } from '@/lib/garden-os/types'
import type { DemoGardenSpace } from '@/lib/demo-garden'

export const careToolDescriptors: CareToolDescriptor[] = [
  {
    id: 'plant-check',
    label: 'Plant Check',
    description: 'A quick placement hint based on your spaces — not a full planner.',
  },
  {
    id: 'symptom-check',
    label: 'Symptom Check',
    description: 'Short guidance with sources — calm follow-up when something looks off.',
  },
  {
    id: 'pest-lookup',
    label: 'Pest Lookup',
    description: 'Search common garden pests and problems for practical next steps.',
  },
  {
    id: 'plant-identify',
    label: 'Plant Identify',
    description: 'Snap or upload a photo. We show a calm guess with confidence — not a chatbot.',
  },
]

export function mapGuideToolsToCareViewModel(
  householdId: string | null,
  spaces: DemoGardenSpace[],
): CareViewModel {
  return {
    householdId,
    spaces,
    headline: 'Care',
    summary: 'Plant checks, symptoms, pests, and follow-up guidance.',
    tools: careToolDescriptors,
  }
}
