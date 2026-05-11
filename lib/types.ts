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

// New Supabase Models - Primary Source of Truth
export interface Household {
  id: string
  name: string
  created_at: string
  updated_at: string
  default_areas_created?: boolean
}

export interface HouseholdMember {
  id: string
  household_id: string
  user_id: string
  role: 'admin' | 'editor' | 'viewer'
  display_name: string
  created_at: string
}

export interface GardenArea {
  id: string
  household_id: string
  name: string
  description?: string | null
  sort_order: number
  created_at: string
  updated_at: string
}

export interface PlantLibraryItem {
  id: string
  common_name: string
  scientific_name?: string | null
  category: 'vegetable' | 'fruit' | 'herb' | 'flower' | 'shrub' | 'tree' | 'succulent' | 'indoor'
  sunlight_needs?: string | null
  water_needs?: string | null
  days_to_maturity?: number | null
  care_notes?: string | null
  description?: string | null
  created_at: string
}

export interface Planting {
  id: string
  household_id: string
  garden_area_id: string
  plant_library_id?: string | null
  custom_name: string
  quantity: number
  planted_date: string
  status: 'planted' | 'growing' | 'ready' | 'harvested' | 'completed'
  notes?: string | null
  planted_by_user_id?: string | null
  created_at: string
  updated_at: string
}

export interface CareTask {
  id: string
  household_id: string
  planting_id?: string | null
  garden_area_id?: string | null
  task_type: 'watering' | 'feeding' | 'pruning' | 'weeding' | 'harvesting' | 'other'
  title: string
  description?: string | null
  due_date: string
  completed_at?: string | null
  completed_by_user_id?: string | null
  created_at: string
  updated_at: string
}

export interface Observation {
  id: string
  household_id: string
  garden_area_id?: string | null
  planting_id?: string | null
  created_by_user_id: string
  note: string
  photo_url?: string | null
  observed_at: string
  created_at: string
}

// Legacy Models - Deprecated, use new models above
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
