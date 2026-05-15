'use client'

import { demoGardenSpaces, type DemoGardenSpace } from '@/lib/demo-garden'
import { buildSpacesFromProfile } from './build-spaces'
import type { GardenSetupProfile, GardenSpacesSource } from './types'

const STORAGE_PREFIX = 'momma-garden-setup-v1'

function storageKey(householdId: string) {
  return `${STORAGE_PREFIX}:${householdId}`
}

export function isGardenSetupComplete(householdId: string | null | undefined): boolean {
  if (!householdId || typeof window === 'undefined') return false
  try {
    const raw = localStorage.getItem(storageKey(householdId))
    if (!raw) return false
    const parsed = JSON.parse(raw) as GardenSetupProfile
    return parsed.version === 1 && Boolean(parsed.completedAt)
  } catch {
    return false
  }
}

export function loadGardenSetupProfile(householdId: string): GardenSetupProfile | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(storageKey(householdId))
    if (!raw) return null
    const parsed = JSON.parse(raw) as GardenSetupProfile
    if (parsed.version !== 1 || !parsed.completedAt) return null
    return parsed
  } catch {
    return null
  }
}

export function saveGardenSetupProfile(householdId: string, profile: GardenSetupProfile) {
  if (typeof window === 'undefined') return
  localStorage.setItem(storageKey(householdId), JSON.stringify(profile))
}

export function getGardenSpacesForHousehold(
  householdId: string | null | undefined,
): GardenSpacesSource {
  if (!householdId) {
    return { spaces: demoGardenSpaces, isPersonalized: false, profile: null }
  }

  const profile = loadGardenSetupProfile(householdId)
  if (profile) {
    const built = buildSpacesFromProfile(profile)
    if (built.length > 0) {
      return { spaces: built, isPersonalized: true, profile }
    }
  }

  return { spaces: demoGardenSpaces, isPersonalized: false, profile: null }
}

export function groupSpacesForAccordion(spaces: DemoGardenSpace[]) {
  const outdoor = spaces.filter((s) => s.group === 'outdoor')
  const indoor = spaces.filter((s) => s.group === 'indoor')
  return { outdoor, indoor }
}

export type GardenSpacesAccordionSection = {
  id: string
  title: string
  summary: string
  spaceIds: string[]
  emptyContent?: string
}

export function buildAccordionSectionsFromSpaces(
  spaces: DemoGardenSpace[],
): GardenSpacesAccordionSection[] {
  const { outdoor, indoor } = groupSpacesForAccordion(spaces)
  const sections: GardenSpacesAccordionSection[] = []

  if (outdoor.length > 0) {
    sections.push({
      id: 'your-outdoor',
      title: 'Outdoor spaces',
      summary:
        outdoor.length === 1
          ? outdoor[0].title
          : `${outdoor.length} areas you set up`,
      spaceIds: outdoor.map((s) => s.id),
    })
  }

  if (indoor.length > 0) {
    sections.push({
      id: 'your-indoor',
      title: 'Indoor plants',
      summary:
        indoor.length === 1 ? indoor[0].title : `${indoor.length} spots at home`,
      spaceIds: indoor.map((s) => s.id),
    })
  }

  return sections
}
