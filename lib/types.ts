export interface Profile {
  id: string
  email: string | null
  full_name: string | null
  avatar_url: string | null
  location: string | null
  climate_zone: string | null
  experience_level: 'beginner' | 'intermediate' | 'advanced'
  created_at: string
  updated_at: string
}

export interface Plant {
  id: string
  name: string
  scientific_name?: string | null
  description?: string | null
  image_url?: string | null
  category: 'vegetable' | 'fruit' | 'herb' | 'flower' | 'shrub' | 'tree' | 'succulent' | 'indoor'
  sunlight_needs: 'full_sun' | 'partial_sun' | 'shade'
  water_needs: 'low' | 'moderate' | 'high'
  difficulty: 'easy' | 'moderate' | 'hard' | 'beginner' | 'intermediate' | 'advanced'
  growing_season?: string | null
  days_to_harvest?: number | null
  days_to_maturity?: number
  spacing_inches?: number | null
  min_temp_f?: number | null
  max_temp_f?: number | null
  care_tips?: string | null
  created_at?: string
}

export interface Garden {
  id: string
  user_id?: string
  name: string
  description: string | null
  size_sqft: number | null
  location: string | null
  garden_type: 'raised_bed' | 'container' | 'in_ground' | 'greenhouse' | 'balcony' | 'indoor'
  created_at: string
  updated_at: string
}

export interface GardenPlant {
  id: string
  garden_id: string
  plant_id: string
  planted_date: string | null
  expected_harvest_date: string | null
  quantity: number
  status: 'planned' | 'planted' | 'growing' | 'harvesting' | 'completed'
  notes: string | null
  position_x: number | null
  position_y: number | null
  created_at: string
  updated_at: string
  plant?: Plant
}
