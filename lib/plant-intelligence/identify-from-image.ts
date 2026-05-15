import type { PlantIdentificationResult, PlantSpeciesCandidate } from './types'

const PLANTNET_BASE = 'https://my-api.plantnet.org/v2'
const DISCLAIMER =
  'Identification is a best guess from a photo. Confirm with your eyes and local conditions before major care changes.'

function getPlantNetKey(): string | null {
  return process.env.PLANTNET_API_KEY ?? process.env.PLANT_NET_API_KEY ?? null
}

export function isPlantNetConfigured(): boolean {
  return Boolean(getPlantNetKey())
}

export async function identifyFromImageBase64(
  imageBase64: string,
  organs: string[] = ['auto'],
): Promise<PlantIdentificationResult> {
  const apiKey = getPlantNetKey()
  const refreshedAt = new Date().toISOString()

  if (!apiKey) {
    return {
      candidates: [],
      topMatch: null,
      provenance: 'unavailable',
      refreshedAt,
      disclaimer: 'Plant identification is not configured on this server yet.',
    }
  }

  const binary = Buffer.from(imageBase64.replace(/^data:image\/\w+;base64,/, ''), 'base64')
  const form = new FormData()
  form.append('images', new Blob([binary]), 'plant.jpg')
  for (const organ of organs) {
    form.append('organs', organ)
  }

  const url = `${PLANTNET_BASE}/identify/all?api-key=${encodeURIComponent(apiKey)}&include-related-images=false`

  const response = await fetch(url, {
    method: 'POST',
    body: form,
  })

  if (!response.ok) {
    const text = await response.text().catch(() => '')
    throw new Error(`PlantNet request failed (${response.status}): ${text.slice(0, 200)}`)
  }

  const data = (await response.json()) as {
    results?: Array<{
      score: number
      species: {
        scientificNameWithoutAuthor?: string
        scientificName?: string
        genus?: { scientificNameWithoutAuthor?: string }
        family?: { scientificNameWithoutAuthor?: string }
        commonNames?: string[]
      }
    }>
  }

  const candidates: PlantSpeciesCandidate[] = (data.results ?? []).slice(0, 5).map((row) => ({
    scientificName:
      row.species.scientificNameWithoutAuthor ?? row.species.scientificName ?? 'Unknown',
    commonNames: row.species.commonNames ?? [],
    confidence: Math.round(row.score * 1000) / 10,
    genus: row.species.genus?.scientificNameWithoutAuthor,
    family: row.species.family?.scientificNameWithoutAuthor,
  }))

  return {
    candidates,
    topMatch: candidates[0] ?? null,
    provenance: 'plantnet',
    refreshedAt,
    disclaimer: DISCLAIMER,
  }
}
