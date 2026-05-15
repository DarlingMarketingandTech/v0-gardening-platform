import type { CarePlantIdentity, CareResult } from '@/lib/care/care-result-types'
import type { IdentifyAndEnrichResult } from '@/lib/plant-intelligence'

function buildWhatWeNoticed(result: IdentifyAndEnrichResult, displayName: string): string {
  const { identification } = result
  const lines: string[] = []
  const others = identification.candidates.length - 1

  if (others > 0) {
    lines.push(
      `From this photo, ${displayName} lined up closest. ${others} other ${others === 1 ? 'name is' : 'names are'} still in the running—open the list below if it does not feel quite right.`,
    )
  } else {
    lines.push(
      `From this photo, ${displayName} was the clearest match this pass. Compare it with your plant before you change care in a big way.`,
    )
  }

  if (identification.disclaimer?.trim()) {
    lines.push(identification.disclaimer.trim())
  }

  return lines.join('\n\n')
}

function careDetailsFromEnrichment(
  enrichment: IdentifyAndEnrichResult['enrichment'],
): CarePlantIdentity['careDetails'] | undefined {
  if (!enrichment) return undefined
  const lines: string[] = []
  if (enrichment.family?.trim()) lines.push(`Family: ${enrichment.family.trim()}.`)
  if (enrichment.genus?.trim()) lines.push(`Genus: ${enrichment.genus.trim()}.`)
  const notes = enrichment.growthNotes?.trim()
  if (notes) lines.push(notes)
  if (!lines.length) return undefined
  return { maintenance: lines.join('\n\n') }
}

/**
 * Maps Plant Identify / PlantNet response into the shared {@link CareResult} identity shape.
 * Returns null when there is no top match — callers should show a friendly fallback instead.
 */
export function mapPlantIdentifyToCareResult(
  result: IdentifyAndEnrichResult,
  imageUrl?: string | null,
): CareResult | null {
  const top = result.identification.topMatch
  if (!top) return null

  const enrichment = result.enrichment
  const displayName = top.commonNames[0] ?? top.scientificName
  const careDetailsBlock = careDetailsFromEnrichment(enrichment)

  return {
    kind: 'identity',
    imageUrl: imageUrl ?? undefined,
    identity: {
      commonName: top.commonNames[0],
      scientificName: top.scientificName,
      whatWeNoticed: buildWhatWeNoticed(result, displayName),
      confidence: top.confidence,
      careDetails: careDetailsBlock,
    },
  }
}

/**
 * Honest sample identity for offline / demo teaching — never includes fake confidence.
 */
export function buildSamplePlantIdentifyCareResult(imageUrl?: string | null): CareResult {
  return {
    kind: 'identity',
    imageUrl: imageUrl ?? undefined,
    identity: {
      commonName: 'Sweet basil',
      scientificName: 'Ocimum basilicum',
      description:
        'Warm soil, plenty of sun, and a light hand with water keep basil happy on the porch. Pinch flowers if you want leaves for the kitchen.',
      whatWeNoticed:
        'Pretend match for layout only — your camera did not send this name. When plant lookup is on, Momma D will see her own plant story here instead.',
      careDetails: {
        light: 'At least six hours of direct sun most days.',
        watering: 'Let the top inch dry, then soak; basil sulks in soggy pots.',
        soil: 'Airy potting mix with a little compost feels like home.',
        temperature: 'Happy above about 60°F; bring pots in before a hard chill.',
        maintenance: 'Harvest often; it grows bushier when you snip stems above a leaf pair.',
      },
    },
  }
}
