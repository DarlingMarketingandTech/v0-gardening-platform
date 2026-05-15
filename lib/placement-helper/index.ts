import type { DemoGardenSpace } from '@/lib/demo-garden'

export type PlacementPlantKind = 'tomato' | 'pepper' | 'herb' | 'cucumber' | 'leafy' | 'flower' | 'houseplant' | 'general'

export interface PlacementRecommendation {
  bestPlace: string
  why: string
  nextStep: string
  caution: string
  spaceId?: string
}

const rules: Record<
  PlacementPlantKind,
  (spaces: DemoGardenSpace[]) => PlacementRecommendation
> = {
  tomato: (spaces) => pickSpace(spaces, 'in-ground-bed', 'raised-bed-trellis', {
    best: 'In-ground bed or a large raised bed',
    why: 'Tomatoes want deep roots, steady moisture, and room for support.',
    next: 'Stake or cage when you transplant.',
    caution: 'Avoid the smallest patio pots unless it is a true patio variety.',
  }),
  pepper: (spaces) => pickSpace(spaces, 'patio-pots', 'raised-bed-trellis', {
    best: 'Patio pots or a sunny raised bed',
    why: 'Peppers love heat and drain well in containers you can check daily.',
    next: 'Keep soil evenly moist while fruit sets.',
    caution: 'Cold nights below 50°F can stall growth.',
  }),
  herb: (spaces) => pickSpace(spaces, 'kitchen-window', 'patio-pots', {
    best: 'Kitchen window or patio pots',
    why: 'Herbs reward being close to where you cook and easy to snip.',
    next: 'Harvest tips often to keep plants bushy.',
    caution: 'Let soil dry slightly between waterings for Mediterranean herbs.',
  }),
  cucumber: (spaces) => pickSpace(spaces, 'raised-bed-trellis', 'in-ground-bed', {
    best: 'Raised bed with trellis',
    why: 'Cucumbers climb happily and stay cleaner off the ground.',
    next: 'Tuck the first vines while stems are soft.',
    caution: 'Crowded leaves need airflow to stay healthy.',
  }),
  leafy: (spaces) => pickSpace(spaces, 'in-ground-bed', 'patio-pots', {
    best: 'In-ground bed or part-shade patio',
    why: 'Greens prefer cooler roots and steady moisture.',
    next: 'Harvest outer leaves first.',
    caution: 'Bolting in heat — give afternoon shade if possible.',
  }),
  flower: (spaces) => pickSpace(spaces, 'pollinator-border', 'patio-pots', {
    best: 'Pollinator border or sunny pots',
    why: 'Blooms near food beds bring pollinators and color.',
    next: 'Deadhead lightly to encourage more flowers.',
    caution: 'Avoid overcrowding slow growers with aggressive spreaders.',
  }),
  houseplant: (spaces) => pickSpace(spaces, 'living-room-plant-shelf', 'bedroom-windowsill', {
    best: 'Bright indirect shelf or windowsill',
    why: 'Most houseplants want light without harsh midday sun on the glass.',
    next: 'Turn the pot a quarter turn each week.',
    caution: 'Do not let pots sit in saucer water.',
  }),
  general: (spaces) => {
    const outdoor = spaces.find((s) => s.group === 'outdoor')
    return {
      bestPlace: outdoor?.title ?? 'Your sunniest outdoor space',
      why: outdoor?.bestFor ?? 'Start where you already check the garden most often.',
      nextStep: outdoor?.weeklyAction ?? 'Do one look-in and note what looks thirsty.',
      caution: outdoor?.watchFor ?? 'Change one thing at a time.',
      spaceId: outdoor?.id,
    }
  },
}

function pickSpace(
  spaces: DemoGardenSpace[],
  preferredId: string,
  fallbackId: string,
  copy: { best: string; why: string; next: string; caution: string },
): PlacementRecommendation {
  const preferred =
    spaces.find((s) => s.id === preferredId) ??
    spaces.find((s) => String(s.id).includes(preferredId.replace(/-/g, '')))
  const fallback = spaces.find((s) => s.id === fallbackId)
  const space = preferred ?? fallback ?? spaces.find((s) => s.group === 'outdoor')

  return {
    bestPlace: space?.title ?? copy.best,
    why: space?.bestFor ?? copy.why,
    nextStep: space?.weeklyAction ?? copy.next,
    caution: space?.watchFor ?? copy.caution,
    spaceId: space?.id,
  }
}

export function recommendPlacement(
  plantKind: PlacementPlantKind,
  spaces: DemoGardenSpace[],
): PlacementRecommendation {
  return rules[plantKind](spaces)
}

export const placementPlantOptions: Array<{ id: PlacementPlantKind; label: string }> = [
  { id: 'tomato', label: 'Tomato' },
  { id: 'pepper', label: 'Pepper' },
  { id: 'herb', label: 'Herb' },
  { id: 'cucumber', label: 'Cucumber' },
  { id: 'leafy', label: 'Leafy greens' },
  { id: 'flower', label: 'Flowers' },
  { id: 'houseplant', label: 'Houseplant' },
  { id: 'general', label: 'Not sure yet' },
]
