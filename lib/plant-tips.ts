// Plant tips and care intervals - mirrors the SQL plan
// Used by Active Crops for "Best Results" tips and Notification Settings for "Key Times" scheduling

export interface PlantTipData {
  best_results_tip: string
  nutrient_interval_days: number
  pruning_interval_days: number // 0 means no pruning needed
  harvest_tip?: string
}

// Keyed by lowercase plant name
const PLANT_TIPS: Record<string, PlantTipData> = {
  tomato: {
    best_results_tip: "Stop watering 2 days before harvest for sweeter flavor. Needs 8+ hours of direct sun daily.",
    nutrient_interval_days: 14,
    pruning_interval_days: 7,
    harvest_tip: "Pick when fully colored but still slightly firm. Morning harvest tastes best!"
  },
  carrot: {
    best_results_tip: "Thin seedlings to 2-3 inches apart early for bigger roots. Loose, sandy soil prevents forking.",
    nutrient_interval_days: 21,
    pruning_interval_days: 0, // No pruning for carrots
    harvest_tip: "Gently loosen soil before pulling. Shoulders showing orange means ready!"
  },
  basil: {
    best_results_tip: "Pinch the top 2 inches when plant reaches 6 inches tall. This encourages bushy growth.",
    nutrient_interval_days: 14,
    pruning_interval_days: 7,
    harvest_tip: "Harvest in the morning before the sun wilts the leaves. Never take more than 1/3 at once."
  },
  zucchini: {
    best_results_tip: "Pick at 6-8 inches long for best texture. Larger ones become seedy and tough.",
    nutrient_interval_days: 14,
    pruning_interval_days: 0, // No pruning for zucchini
    harvest_tip: "Check daily - they grow fast! Cut stem 1 inch from fruit."
  },
  pepper: {
    best_results_tip: "Wait for full color change for maximum sweetness. Green peppers are just unripe!",
    nutrient_interval_days: 14,
    pruning_interval_days: 14,
    harvest_tip: "Cut with scissors to avoid damaging the plant. Leave stem attached."
  },
  cucumber: {
    best_results_tip: "Pick frequently to encourage more fruit. Never let them turn yellow on the vine.",
    nutrient_interval_days: 10,
    pruning_interval_days: 0,
    harvest_tip: "Harvest when dark green and firm. Best picked in the cool morning."
  },
  lettuce: {
    best_results_tip: "Harvest outer leaves first for continuous growth. Plant in partial shade during summer.",
    nutrient_interval_days: 21,
    pruning_interval_days: 0,
    harvest_tip: "Pick before flowering (bolting) or leaves turn bitter. Morning harvest is crispest."
  },
  spinach: {
    best_results_tip: "Cool weather crop - bolt-resistant varieties for spring. Keep soil consistently moist.",
    nutrient_interval_days: 21,
    pruning_interval_days: 0,
    harvest_tip: "Cut outer leaves when 3-4 inches long. Inner leaves keep growing."
  },
  beans: {
    best_results_tip: "Don't over-fertilize with nitrogen - they fix their own! Pick before seeds bulge.",
    nutrient_interval_days: 28, // Beans fix nitrogen, need less feeding
    pruning_interval_days: 0,
    harvest_tip: "Harvest every 2-3 days to keep plants producing. Morning picking prevents snap."
  },
  squash: {
    best_results_tip: "Hand-pollinate if bees are scarce. Male flowers appear first - be patient!",
    nutrient_interval_days: 14,
    pruning_interval_days: 0,
    harvest_tip: "Winter squash: wait until stem dries. Summer squash: pick small and often."
  },
  onion: {
    best_results_tip: "Stop watering when tops start falling over. Cure in sun for 1-2 weeks after harvest.",
    nutrient_interval_days: 21,
    pruning_interval_days: 0,
    harvest_tip: "Harvest when 50% of tops have fallen. Let cure before storage."
  },
  garlic: {
    best_results_tip: "Cut scapes (flower stalks) to direct energy to bulb. Stop watering 2 weeks before harvest.",
    nutrient_interval_days: 28,
    pruning_interval_days: 0,
    harvest_tip: "Ready when lower leaves brown but 5-6 green leaves remain. Cure 2 weeks."
  }
}

// Default values for plants not in our database
const DEFAULT_TIPS: PlantTipData = {
  best_results_tip: "Water deeply but infrequently to encourage strong root growth. Mulch to retain moisture.",
  nutrient_interval_days: 14,
  pruning_interval_days: 0,
  harvest_tip: "Harvest in the cool morning for best flavor and longest shelf life."
}

/**
 * Get tips and care intervals for a specific plant
 */
export function getPlantTips(plantName: string): PlantTipData {
  const normalized = plantName.toLowerCase().trim()
  
  // Check exact match first
  if (PLANT_TIPS[normalized]) {
    return PLANT_TIPS[normalized]
  }
  
  // Check if plant name contains any of our known plants
  for (const [key, value] of Object.entries(PLANT_TIPS)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return value
    }
  }
  
  return DEFAULT_TIPS
}

/**
 * Calculate the next feeding date based on last fed timestamp
 */
export function getNextFeedingDate(
  plantName: string, 
  plantedAt: Date, 
  lastFedAt?: Date | null
): Date {
  const tips = getPlantTips(plantName)
  const baseDate = lastFedAt || plantedAt
  const nextDate = new Date(baseDate)
  nextDate.setDate(nextDate.getDate() + tips.nutrient_interval_days)
  return nextDate
}

/**
 * Calculate the next pruning date (returns null if plant doesn't need pruning)
 */
export function getNextPruningDate(
  plantName: string, 
  plantedAt: Date,
  lastPrunedAt?: Date | null
): Date | null {
  const tips = getPlantTips(plantName)
  
  // Plant doesn't need pruning
  if (tips.pruning_interval_days === 0) {
    return null
  }
  
  // First pruning is typically 3 weeks after planting
  const firstPruneDate = new Date(plantedAt)
  firstPruneDate.setDate(firstPruneDate.getDate() + 21)
  
  if (!lastPrunedAt) {
    return firstPruneDate
  }
  
  // Subsequent pruning based on interval
  const nextDate = new Date(lastPrunedAt)
  nextDate.setDate(nextDate.getDate() + tips.pruning_interval_days)
  return nextDate
}

/**
 * Get days until harvest from planted date and maturity days
 */
export function getDaysUntilHarvest(plantedAt: Date, daysToMaturity: number): number {
  const harvestDate = new Date(plantedAt)
  harvestDate.setDate(harvestDate.getDate() + daysToMaturity)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  harvestDate.setHours(0, 0, 0, 0)
  return Math.ceil((harvestDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
}

/**
 * Check if plant is in "Peak Flavor" window (85%+ progress)
 */
export function isInPeakFlavorWindow(progress: number): boolean {
  return progress >= 85
}

/**
 * Get urgency level for a task date
 */
export function getTaskUrgency(taskDate: Date): 'today' | 'soon' | 'upcoming' | 'past' {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const task = new Date(taskDate)
  task.setHours(0, 0, 0, 0)
  
  const diffDays = Math.ceil((task.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  
  if (diffDays < 0) return 'past'
  if (diffDays === 0) return 'today'
  if (diffDays <= 3) return 'soon'
  return 'upcoming'
}
