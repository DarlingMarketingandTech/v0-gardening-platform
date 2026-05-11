'use server'

import { createClient } from '@/lib/supabase/server'

// Get user's household ID
export async function getHouseholdId(userId: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('household_members')
    .select('household_id')
    .eq('user_id', userId)
    .single()
  
  if (error || !data) {
    return { householdId: null, error: 'Household not found' }
  }
  
  return { householdId: data.household_id }
}

// Get all garden areas for household
export async function getGardenAreas(householdId: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('garden_areas')
    .select('*')
    .eq('household_id', householdId)
    .order('sort_order', { ascending: true })
  
  if (error) {
    return { areas: [], error: error.message }
  }
  
  return { areas: data || [] }
}

// Create a new garden area
export async function createGardenArea(householdId: string, name: string, description?: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('garden_areas')
    .insert({
      household_id: householdId,
      name,
      description: description || '',
    })
    .select()
    .single()
  
  if (error) {
    return { area: null, error: error.message }
  }
  
  return { area: data }
}

// Delete a garden area
export async function deleteGardenArea(householdId: string, areaId: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('garden_areas')
    .delete()
    .eq('id', areaId)
    .eq('household_id', householdId)
  
  if (error) {
    return { success: false, error: error.message }
  }
  
  return { success: true }
}

// Get plantings for household or specific area
export async function getPlantings(householdId: string, gardenAreaId?: string) {
  const supabase = await createClient()
  
  let query = supabase
    .from('plantings')
    .select(`
      *,
      garden_area:garden_areas(name),
      plant:plant_library(common_name, scientific_name)
    `)
    .eq('household_id', householdId)
  
  if (gardenAreaId) {
    query = query.eq('garden_area_id', gardenAreaId)
  }
  
  const { data, error } = await query
  
  if (error) {
    return { plantings: [], error: error.message }
  }
  
  return { plantings: data || [] }
}

// Create a new planting
export async function createPlanting(
  householdId: string,
  gardenAreaId: string,
  customName: string,
  plantedDate: string,
  quantity?: number,
  notes?: string,
  userId?: string
) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('plantings')
    .insert({
      household_id: householdId,
      garden_area_id: gardenAreaId,
      custom_name: customName,
      planted_date: plantedDate,
      quantity: quantity || 1,
      notes: notes || '',
      planted_by_user_id: userId,
    })
    .select()
    .single()
  
  if (error) {
    return { planting: null, error: error.message }
  }
  
  return { planting: data }
}

// Update a planting
export async function updatePlanting(
  householdId: string,
  plantingId: string,
  updates: {
    custom_name?: string
    quantity?: number
    status?: string
    notes?: string
  }
) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('plantings')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', plantingId)
    .eq('household_id', householdId)
    .select()
    .single()
  
  if (error) {
    return { planting: null, error: error.message }
  }
  
  return { planting: data }
}

// Delete a planting
export async function deletePlanting(householdId: string, plantingId: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('plantings')
    .delete()
    .eq('id', plantingId)
    .eq('household_id', householdId)
  
  if (error) {
    return { success: false, error: error.message }
  }
  
  return { success: true }
}

// Get care tasks for household
export async function getCareTasks(householdId: string, fromDate?: string) {
  const supabase = await createClient()
  
  let query = supabase
    .from('care_tasks')
    .select(`
      *,
      planting:plantings(custom_name),
      area:garden_areas(name)
    `)
    .eq('household_id', householdId)
    .is('completed_at', null)
  
  if (fromDate) {
    query = query.gte('due_date', fromDate)
  }
  
  const { data, error } = await query.order('due_date', { ascending: true })
  
  if (error) {
    return { tasks: [], error: error.message }
  }
  
  return { tasks: data || [] }
}

// Mark a task as complete
export async function completeTask(householdId: string, taskId: string, userId: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('care_tasks')
    .update({
      completed_at: new Date().toISOString(),
      completed_by_user_id: userId,
      updated_at: new Date().toISOString(),
    })
    .eq('id', taskId)
    .eq('household_id', householdId)
    .select()
    .single()
  
  if (error) {
    return { task: null, error: error.message }
  }
  
  return { task: data }
}

// Get observations for household
export async function getObservations(householdId: string, gardenAreaId?: string) {
  const supabase = await createClient()
  
  let query = supabase
    .from('observations')
    .select('*')
    .eq('household_id', householdId)
  
  if (gardenAreaId) {
    query = query.eq('garden_area_id', gardenAreaId)
  }
  
  const { data, error } = await query.order('observed_at', { ascending: false })
  
  if (error) {
    return { observations: [], error: error.message }
  }
  
  return { observations: data || [] }
}

// Create a new observation
export async function createObservation(
  householdId: string,
  note: string,
  observedAt: string,
  userId: string,
  gardenAreaId?: string,
  plantingId?: string,
  photoUrl?: string
) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('observations')
    .insert({
      household_id: householdId,
      note,
      observed_at: observedAt,
      created_by_user_id: userId,
      garden_area_id: gardenAreaId,
      planting_id: plantingId,
      photo_url: photoUrl,
    })
    .select()
    .single()
  
  if (error) {
    return { observation: null, error: error.message }
  }
  
  return { observation: data }
}

// Ensure default garden areas exist for a household
export async function ensureDefaultGardenAreas(householdId: string) {
  const supabase = await createClient()
  
  const defaultAreas = ['Raised Bed', 'Ground', 'Pots']
  
  for (const name of defaultAreas) {
    // Check if area already exists
    const { data: existing } = await supabase
      .from('garden_areas')
      .select('id')
      .eq('household_id', householdId)
      .eq('name', name)
      .single()
    
    if (!existing) {
      // Create default area
      await supabase
        .from('garden_areas')
        .insert({
          household_id: householdId,
          name,
          description: '',
          sort_order: defaultAreas.indexOf(name),
        })
    }
  }
  
  return { success: true }
}
