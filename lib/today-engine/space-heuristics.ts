import type { DemoGardenSpace } from '@/lib/demo-garden'

function titleLower(space: DemoGardenSpace) {
  return `${space.title} ${space.description}`.toLowerCase()
}

export function findContainerSpace(spaces: DemoGardenSpace[]): DemoGardenSpace | undefined {
  return (
    spaces.find((s) => s.id === 'patio-pots') ??
    spaces.find(
      (s) =>
        s.group === 'outdoor' &&
        /\b(pot|patio|container|deck|balcony)\b/i.test(titleLower(s)),
    )
  )
}

export function findTrellisSpace(spaces: DemoGardenSpace[]): DemoGardenSpace | undefined {
  return (
    spaces.find((s) => s.id === 'raised-bed-trellis') ??
    spaces.find(
      (s) =>
        s.group === 'outdoor' &&
        /\b(trellis|vine|climb|raised)\b/i.test(titleLower(s)),
    )
  )
}

export function findInGroundSpace(spaces: DemoGardenSpace[]): DemoGardenSpace | undefined {
  return (
    spaces.find((s) => s.id === 'in-ground-bed') ??
    spaces.find(
      (s) =>
        s.group === 'outdoor' &&
        /\b(in-ground|ground bed|plot|bed)\b/i.test(titleLower(s)) &&
        !/\braised\b/i.test(titleLower(s)),
    )
  )
}

export function findPollinatorSpace(spaces: DemoGardenSpace[]): DemoGardenSpace | undefined {
  return (
    spaces.find((s) => s.id === 'pollinator-border') ??
    spaces.find((s) => s.group === 'outdoor' && /\b(pollinator|border|flower)\b/i.test(titleLower(s)))
  )
}

export function findIndoorMoistureSpace(spaces: DemoGardenSpace[]): DemoGardenSpace | undefined {
  return (
    spaces.find((s) => s.id === 'bathroom-fern-corner') ??
    spaces.find(
      (s) =>
        s.group === 'indoor' &&
        /\b(fern|humid|bathroom|moisture)\b/i.test(titleLower(s)),
    ) ??
    spaces.find((s) => s.group === 'indoor')
  )
}

export function firstOutdoorSpace(spaces: DemoGardenSpace[]): DemoGardenSpace | undefined {
  return spaces.find((s) => s.group === 'outdoor')
}
