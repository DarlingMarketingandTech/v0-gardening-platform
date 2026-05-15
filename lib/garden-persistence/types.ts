/** Supabase row shapes aligned with docs/SCHEMA_ALIGNMENT.md */

export type GardenAreaGroup = 'outdoor' | 'indoor'

export interface GardenAreaRow {
  id: string
  household_id: string
  name: string
  group_type: GardenAreaGroup
  description: string | null
  best_for: string | null
  watch_for: string | null
  weekly_action: string | null
  sort_order: number
  created_at: string
  updated_at: string
}

export interface PlantLibraryRow {
  id: string
  common_name: string
  scientific_name: string | null
  category: string | null
  care_summary: string | null
  created_at: string
}

export interface PlantingRow {
  id: string
  household_id: string
  garden_area_id: string
  plant_library_id: string | null
  nickname: string
  status: string
  care_note: string | null
  planted_at: string | null
  created_at: string
}

export interface ObservationRow {
  id: string
  household_id: string
  garden_area_id: string | null
  planting_id: string | null
  note: string
  photo_url: string | null
  entry_type: string
  observed_at: string
  created_at: string
}

export interface CareTaskRow {
  id: string
  household_id: string
  garden_area_id: string | null
  planting_id: string | null
  title: string
  reason: string | null
  due_date: string | null
  priority: string
  status: string
  created_at: string
}
