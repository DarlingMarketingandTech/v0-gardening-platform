import type { DemoGardenSpace } from '@/lib/demo-garden'
import { mapSpaceToZoneCard } from '@/lib/garden-os/mappers/map-space-to-zone-card'
import type { PlanSpaceFit } from '@/lib/garden-os/types'

/** Resolve template id for planning copy — prefers setup, else demo id heuristics. */
export function effectiveTemplateIdForPlan(space: DemoGardenSpace): string {
  const fromHints = space.setupHints?.templateId?.trim()
  if (fromHints) return fromHints

  const id = String(space.id).toLowerCase()
  const t = String(space.title).toLowerCase()
  if (id.includes('patio') || t.includes('patio')) return 'patio'
  if (id.includes('balcony') || t.includes('balcony')) return 'balcony'
  if (id.includes('raised') || id.includes('trellis') || t.includes('raised')) return 'raised'
  if (id.includes('in-ground') || id.includes('ground') || t.includes('in-ground')) return 'inground'
  if (id.includes('pollinator') || t.includes('pollinator')) return 'pollinator'
  if (id.includes('kitchen') || t.includes('kitchen')) return 'kitchen'
  if (id.includes('living') || id.includes('shelf') || t.includes('shelf')) return 'living'
  if (id.includes('bath') || t.includes('bath')) return 'bath'
  if (id.includes('bedroom') || t.includes('bedroom')) return 'bedroom'
  if (id.includes('greenhouse') || t.includes('greenhouse')) return 'greenhouse'
  if (id.includes('container') || id.includes('deck') || t.includes('deck')) return 'containers'
  return space.group === 'outdoor' ? 'backyard' : 'living'
}

const PLANNING_BY_TEMPLATE: Record<string, string> = {
  kitchen:
    'Plan compact herbs in small pots — sow little and often so the sill never feels crowded.',
  living:
    'Sketch a simple watering week before adding plants — back from the window, soil stays wet longer.',
  bath: 'Choose humidity-loving greens and plan drainage first so roots never sit cold.',
  bedroom: 'Favor forgiving foliage and keep the plan gentle — low light means slower growth cycles.',
  patio:
    'Line up heat-tolerant pots (basil, peppers, small tomatoes) and note a backup shade spot for July.',
  balcony:
    'Favor compact herbs, shallow roots, and wind-tough leaves — plan saucer weight before buying big pots.',
  containers:
    'Group pots by sun and water appetite so one hot week does not split your attention three ways.',
  raised:
    'Reserve bed edges for greens and roots, center for tomatoes or beans — sketch rows before you sow.',
  backyard: 'Plan tall crops to the north side of the bed so shorter greens still get morning light.',
  inground:
    'Think in layers — deep roots below, salad pace above — and leave a mulch ring in the sketch.',
  greenhouse: 'Stage seedlings first, then heat-lovers like cucumbers — plan a daily vent check on warm days.',
  pollinator: 'Leave a few blooms to go to seed on purpose — plan color in strips beside veg rows.',
}

function planningSuggestionForSpace(space: DemoGardenSpace): string {
  const tid = effectiveTemplateIdForPlan(space)
  return (
    PLANNING_BY_TEMPLATE[tid] ??
    (space.group === 'outdoor'
      ? 'Walk your outdoor rhythm once a week — note sun shifts before you rearrange pots.'
      : 'Keep indoor plans small and repeatable — one new plant at a time is easier to read.')
  )
}

export function buildPlanSpaceFits(spaces: DemoGardenSpace[]): PlanSpaceFit[] {
  return spaces.map((space) => {
    const z = mapSpaceToZoneCard(space)
    return {
      spaceId: z.id,
      spaceTitle: z.title,
      group: z.group,
      areaTypeLabel: z.areaTypeLabel,
      bestFor: z.bestFor,
      watchFor: z.watchFor,
      lightExposureLabel: z.lightExposureLabel,
      planningSuggestion: planningSuggestionForSpace(space),
    }
  })
}
