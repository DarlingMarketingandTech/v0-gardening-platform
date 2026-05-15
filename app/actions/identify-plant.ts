'use server'

import { identifyAndEnrichFromImage } from '@/lib/plant-intelligence'
import type { IdentifyAndEnrichResult } from '@/lib/plant-intelligence'

export async function identifyPlantAction(imageBase64: string): Promise<IdentifyAndEnrichResult> {
  if (!imageBase64 || imageBase64.length < 100) {
    throw new Error('Please provide a valid plant photo.')
  }

  if (imageBase64.length > 8_000_000) {
    throw new Error('Image is too large. Try a smaller photo.')
  }

  return identifyAndEnrichFromImage(imageBase64)
}
