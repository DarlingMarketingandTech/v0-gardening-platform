import type { LucideIcon } from 'lucide-react'
import {
  Bath,
  BedDouble,
  Fence,
  Flower2,
  Home,
  Leaf,
  Rows3,
  Sun,
  TreeDeciduous,
  Warehouse,
} from 'lucide-react'

import type { SetupSpaceDraft } from './types'

export interface ZoneTemplateMeta {
  description: string
  bestFor: string
  icon: LucideIcon
}

const FALLBACK: ZoneTemplateMeta = {
  description: 'A corner of your garden you want to keep an eye on.',
  bestFor: 'Herbs, flowers, or veggies you tuck in where they fit.',
  icon: Leaf,
}

const byTemplateId: Record<string, ZoneTemplateMeta> = {
  patio: {
    description: 'Pots and planters on the porch or patio where you pass every day.',
    bestFor: 'Kitchen herbs, cherry tomatoes, and cheery annuals.',
    icon: Home,
  },
  raised: {
    description: 'Lifted soil that warms early and drains after a summer rain.',
    bestFor: 'Salad greens, roots, and compact veggies.',
    icon: Rows3,
  },
  backyard: {
    description: 'A familiar bed along the fence or lawn where you dig in each season.',
    bestFor: 'Tomatoes, squash, and sun-loving flowers.',
    icon: Fence,
  },
  inground: {
    description: 'Native soil with room for roots to wander.',
    bestFor: 'Perennials, shrubs, and bigger vegetables.',
    icon: TreeDeciduous,
  },
  balcony: {
    description: 'A smaller outdoor stage with wind and sky close by.',
    bestFor: 'Dwarf tomatoes, peppers in pots, and trailing blooms.',
    icon: Sun,
  },
  containers: {
    description: 'Grouped pots you can move when the weather turns.',
    bestFor: 'Herbs, lettuces, and anything you want near the door.',
    icon: Flower2,
  },
  greenhouse: {
    description: 'Sheltered warmth for seedlings and tender plants.',
    bestFor: 'Starts, cuttings, and heat-loving crops a little early.',
    icon: Warehouse,
  },
  pollinator: {
    description: 'A strip that welcomes bees and butterflies along an edge.',
    bestFor: 'Wildflowers, herbs left to bloom, and gentle color.',
    icon: Flower2,
  },
  kitchen: {
    description: 'Bright sill space while you cook and rinse dishes.',
    bestFor: 'Basil, parsley, and small herbs you snip often.',
    icon: Home,
  },
  living: {
    description: 'Shelves or a credenza where plants share the room with you.',
    bestFor: 'Pothos, snake plants, and leafy friends.',
    icon: Leaf,
  },
  bath: {
    description: 'Humid air and softer light between showers.',
    bestFor: 'Ferns, calatheas, and humidity-loving greens.',
    icon: Bath,
  },
  bedroom: {
    description: 'Gentle morning light for slower mornings.',
    bestFor: 'Low-light tolerant plants that forgive a sleepy water rhythm.',
    icon: BedDouble,
  },
}

export function getZoneTemplateMeta(draft: SetupSpaceDraft): ZoneTemplateMeta {
  const tid = draft.templateId?.trim()
  if (!tid) return FALLBACK
  return byTemplateId[tid] ?? FALLBACK
}
