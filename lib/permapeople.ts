/**
 * PermaPeople API client for plant reference data
 * Read-only service to search and fetch plant information
 */

export interface PermaPlantResult {
  id: string
  name: string
  scientific_name?: string
  category?: string
  sunlight_requirements?: string
  water_requirements?: string
  days_to_maturity?: number
  description?: string
  care_notes?: string
}

const PERMAPEOPLE_API = 'https://api.permapeople.org'

/**
 * Search PermaPeople for plants by name
 */
export async function searchPermaPlants(
  query: string
): Promise<PermaPlantResult[]> {
  if (!query.trim()) return []

  try {
    const response = await fetch(
      `${PERMAPEOPLE_API}/plants/search?q=${encodeURIComponent(query)}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )

    if (!response.ok) {
      console.error(`PermaPeople API error: ${response.status}`)
      return []
    }

    const data = await response.json()
    return (data.results || []).map((plant: any) => ({
      id: plant.id || plant.slug,
      name: plant.common_name || plant.name,
      scientific_name: plant.scientific_name,
      category: plant.plant_type || plant.category,
      sunlight_requirements: plant.sunlight_needs || plant.sunlight,
      water_requirements: plant.water_needs || plant.water,
      days_to_maturity: plant.days_to_maturity || plant.maturity_days,
      description: plant.description,
      care_notes: plant.care_tips || plant.care_notes,
    }))
  } catch (error) {
    console.error('PermaPeople search error:', error)
    return []
  }
}

/**
 * Get plant details from PermaPeople by ID
 */
export async function getPermaPlant(
  plantId: string
): Promise<PermaPlantResult | null> {
  try {
    const response = await fetch(
      `${PERMAPEOPLE_API}/plants/${encodeURIComponent(plantId)}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )

    if (!response.ok) {
      console.error(`PermaPeople API error: ${response.status}`)
      return null
    }

    const plant = await response.json()
    return {
      id: plant.id || plant.slug,
      name: plant.common_name || plant.name,
      scientific_name: plant.scientific_name,
      category: plant.plant_type || plant.category,
      sunlight_requirements: plant.sunlight_needs || plant.sunlight,
      water_requirements: plant.water_needs || plant.water,
      days_to_maturity: plant.days_to_maturity || plant.maturity_days,
      description: plant.description,
      care_notes: plant.care_tips || plant.care_notes,
    }
  } catch (error) {
    console.error('PermaPeople fetch error:', error)
    return null
  }
}
