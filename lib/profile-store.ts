"use client"

export interface MomProfile {
  name: string
  address: string
  city: string
  state: string
  zipCode: string
  latitude: number | null
  longitude: number | null
  timezone: string
  gardenName: string
  experienceLevel: 'beginner' | 'intermediate' | 'advanced'
  climateZone?: string
  setupComplete: boolean
}

const DEFAULT_PROFILE: MomProfile = {
  name: '',
  address: '',
  city: '',
  state: '',
  zipCode: '',
  latitude: null,
  longitude: null,
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  gardenName: "Mom's Garden",
  experienceLevel: 'beginner',
  climateZone: undefined,
  setupComplete: false,
}

const STORAGE_KEY = 'momma-d-profile'

export function getProfile(): MomProfile {
  if (typeof window === 'undefined') return DEFAULT_PROFILE
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return { ...DEFAULT_PROFILE, ...JSON.parse(stored) }
    }
  } catch (e) {
    console.error('Error reading profile:', e)
  }
  
  return DEFAULT_PROFILE
}

export function saveProfile(profile: Partial<MomProfile>): MomProfile {
  const current = getProfile()
  const updated = { ...current, ...profile }
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  } catch (e) {
    console.error('Error saving profile:', e)
  }
  
  return updated
}

export function clearProfile(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (e) {
    console.error('Error clearing profile:', e)
  }
}

// Geocode address using Nominatim (free, no API key needed)
export async function geocodeAddress(address: string, city: string, state: string, zipCode: string): Promise<{ lat: number; lon: number } | null> {
  const query = encodeURIComponent(`${address}, ${city}, ${state} ${zipCode}, USA`)
  
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1`,
      {
        headers: {
          'User-Agent': 'MommaDGardenTool/1.0'
        }
      }
    )
    
    const data = await response.json()
    
    if (data && data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lon: parseFloat(data[0].lon)
      }
    }
  } catch (e) {
    console.error('Geocoding error:', e)
  }
  
  return null
}
