export type {
  PlantIdentificationResult,
  PlantSpeciesCandidate,
  EnrichedPlantRecord,
  IdentifyAndEnrichResult,
} from './types'
export {
  identifyFromImageBase64,
  isPlantNetConfigured,
} from './identify-from-image'
export { enrichSpecies, isTrefleConfigured } from './enrich-species'

import { enrichSpecies } from './enrich-species'
import { identifyFromImageBase64 } from './identify-from-image'
import type { IdentifyAndEnrichResult } from './types'

export async function identifyAndEnrichFromImage(
  imageBase64: string,
): Promise<IdentifyAndEnrichResult> {
  const identification = await identifyFromImageBase64(imageBase64)
  const top = identification.topMatch

  if (!top) {
    return { identification, enrichment: null }
  }

  try {
    const enrichment = await enrichSpecies(top.scientificName)
    return { identification, enrichment }
  } catch {
    return { identification, enrichment: null }
  }
}
