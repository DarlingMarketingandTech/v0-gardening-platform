import type { EnrichedPlantRecord } from './types'

const TREFLE_BASE = 'https://trefle.io/api/v1'

function getTrefleToken(): string | null {
  return process.env.TREFLE_TOKEN ?? process.env.TREFLE_API_KEY ?? null
}

export function isTrefleConfigured(): boolean {
  return Boolean(getTrefleToken())
}

export async function enrichSpecies(scientificName: string): Promise<EnrichedPlantRecord> {
  const token = getTrefleToken()
  const refreshedAt = new Date().toISOString()

  if (!token) {
    return {
      scientificName,
      commonNames: [],
      family: null,
      genus: null,
      growthNotes: null,
      provenance: 'unavailable',
      refreshedAt,
    }
  }

  const url = new URL(`${TREFLE_BASE}/species/search`)
  url.searchParams.set('token', token)
  url.searchParams.set('q', scientificName)

  const response = await fetch(url.toString(), { next: { revalidate: 86400 } })

  if (!response.ok) {
    throw new Error(`Trefle request failed (${response.status})`)
  }

  const data = (await response.json()) as {
    data?: Array<{
      scientific_name?: string
      common_name?: string | null
      family?: string | null
      genus?: string | null
      growth?: { description?: string | null }
    }>
  }

  const match = data.data?.[0]

  return {
    scientificName: match?.scientific_name ?? scientificName,
    commonNames: match?.common_name ? [match.common_name] : [],
    family: match?.family ?? null,
    genus: match?.genus ?? null,
    growthNotes: match?.growth?.description ?? null,
    provenance: 'trefle',
    refreshedAt,
  }
}
