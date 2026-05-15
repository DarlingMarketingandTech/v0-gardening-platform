export interface PlantSpeciesCandidate {
  scientificName: string
  commonNames: string[]
  confidence: number
  genus?: string
  family?: string
}

export interface PlantIdentificationResult {
  candidates: PlantSpeciesCandidate[]
  topMatch: PlantSpeciesCandidate | null
  provenance: 'plantnet' | 'unavailable'
  refreshedAt: string
  disclaimer: string
}

export interface EnrichedPlantRecord {
  scientificName: string
  commonNames: string[]
  family: string | null
  genus: string | null
  growthNotes: string | null
  provenance: 'trefle' | 'unavailable'
  refreshedAt: string
}

export interface IdentifyAndEnrichResult {
  identification: PlantIdentificationResult
  enrichment: EnrichedPlantRecord | null
}
