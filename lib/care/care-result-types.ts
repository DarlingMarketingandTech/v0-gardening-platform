export type CareUrgency = 'low' | 'medium' | 'high'

export interface CarePlantIdentity {
  commonName?: string
  scientificName?: string
  /** Plain-language summary (e.g. growth notes) shown under the plant name. */
  description?: string
  /** Short “from your photo” context — used for Plant Identify and similar flows. */
  whatWeNoticed?: string
  confidence?: number
  careDetails?: {
    light?: string
    soil?: string
    watering?: string
    temperature?: string
    maintenance?: string
  }
  wateringIntervalDays?: number
}

export interface CareIssueResult {
  isHealthy?: boolean
  issueName?: string
  confidence?: number
  urgency?: CareUrgency
  whatWeNoticed?: string
  whatToDoToday?: string
  whatNotToDo?: string
  whenToCheckAgain?: string
  treatmentSteps?: string[]
  preventionTips?: string[]
}

export type CareResult =
  | { kind: 'identity'; identity: CarePlantIdentity; imageUrl?: string }
  | { kind: 'issue'; issue: CareIssueResult; imageUrl?: string }
