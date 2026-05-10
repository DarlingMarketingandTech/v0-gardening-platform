// Companion planting data based on traditional gardening wisdom

export interface CompanionInfo {
  goodCompanions: string[]
  badCompanions: string[]
  benefits?: string[]
}

export const companionData: Record<string, CompanionInfo> = {
  'Tomato': {
    goodCompanions: ['Basil', 'Carrot', 'Parsley', 'Marigold', 'Nasturtium', 'Onion', 'Garlic', 'Celery'],
    badCompanions: ['Potato', 'Fennel', 'Cabbage', 'Broccoli', 'Cauliflower', 'Corn', 'Kohlrabi'],
    benefits: ['Basil repels flies and mosquitoes', 'Carrots loosen soil for tomato roots']
  },
  'Basil': {
    goodCompanions: ['Tomato', 'Pepper', 'Oregano', 'Parsley', 'Chamomile'],
    badCompanions: ['Sage', 'Rue', 'Common Rue'],
    benefits: ['Improves tomato flavor', 'Repels aphids and mites']
  },
  'Pepper': {
    goodCompanions: ['Tomato', 'Basil', 'Carrot', 'Onion', 'Spinach', 'Parsley'],
    badCompanions: ['Fennel', 'Kohlrabi', 'Apricot'],
    benefits: ['Basil improves growth', 'Onions deter pests']
  },
  'Cucumber': {
    goodCompanions: ['Beans', 'Corn', 'Peas', 'Radish', 'Sunflower', 'Lettuce', 'Dill'],
    badCompanions: ['Potato', 'Aromatic Herbs', 'Melon', 'Sage'],
    benefits: ['Corn provides shade', 'Beans fix nitrogen']
  },
  'Carrot': {
    goodCompanions: ['Tomato', 'Lettuce', 'Onion', 'Leek', 'Rosemary', 'Sage', 'Pea'],
    badCompanions: ['Dill', 'Parsnip', 'Celery'],
    benefits: ['Onions repel carrot fly', 'Tomatoes provide shade']
  },
  'Lettuce': {
    goodCompanions: ['Carrot', 'Radish', 'Strawberry', 'Chive', 'Garlic', 'Beet'],
    badCompanions: ['Celery'],
    benefits: ['Fast-growing, fills space between slower crops']
  },
  'Squash': {
    goodCompanions: ['Corn', 'Beans', 'Radish', 'Marigold', 'Nasturtium', 'Sunflower'],
    badCompanions: ['Potato'],
    benefits: ['Part of Three Sisters planting with corn and beans']
  },
  'Zucchini': {
    goodCompanions: ['Corn', 'Beans', 'Radish', 'Marigold', 'Nasturtium'],
    badCompanions: ['Potato'],
    benefits: ['Nasturtiums trap aphids away from zucchini']
  },
  'Potato': {
    goodCompanions: ['Beans', 'Corn', 'Cabbage', 'Horseradish', 'Marigold', 'Pea'],
    badCompanions: ['Tomato', 'Cucumber', 'Squash', 'Sunflower', 'Pumpkin', 'Raspberry'],
    benefits: ['Horseradish deters potato beetles', 'Beans fix nitrogen']
  },
  'Bean': {
    goodCompanions: ['Corn', 'Squash', 'Potato', 'Cucumber', 'Carrot', 'Cauliflower', 'Beet'],
    badCompanions: ['Onion', 'Garlic', 'Fennel', 'Chive', 'Leek'],
    benefits: ['Fixes nitrogen in soil for other plants']
  },
  'Corn': {
    goodCompanions: ['Beans', 'Squash', 'Cucumber', 'Pumpkin', 'Melon', 'Pea'],
    badCompanions: ['Tomato', 'Celery'],
    benefits: ['Provides support for climbing beans']
  },
  'Onion': {
    goodCompanions: ['Carrot', 'Beet', 'Lettuce', 'Tomato', 'Strawberry', 'Chamomile'],
    badCompanions: ['Bean', 'Pea', 'Asparagus', 'Sage'],
    benefits: ['Deters many pests with strong scent']
  },
  'Garlic': {
    goodCompanions: ['Tomato', 'Pepper', 'Potato', 'Cabbage', 'Rose', 'Raspberry'],
    badCompanions: ['Bean', 'Pea', 'Asparagus', 'Sage', 'Parsley'],
    benefits: ['Natural fungicide', 'Repels aphids']
  },
  'Spinach': {
    goodCompanions: ['Strawberry', 'Pea', 'Bean', 'Celery', 'Cauliflower', 'Eggplant'],
    badCompanions: [],
    benefits: ['Provides ground cover to keep soil cool']
  },
  'Radish': {
    goodCompanions: ['Lettuce', 'Pea', 'Cucumber', 'Spinach', 'Carrot', 'Bean'],
    badCompanions: ['Hyssop', 'Grape'],
    benefits: ['Quick harvest, loosens soil for other roots']
  },
  'Marigold': {
    goodCompanions: ['Tomato', 'Pepper', 'Squash', 'Cucumber', 'Melon', 'Most Vegetables'],
    badCompanions: ['Bean', 'Cabbage'],
    benefits: ['Repels nematodes, aphids, and many pests']
  },
  'Mint': {
    goodCompanions: ['Tomato', 'Cabbage', 'Pea'],
    badCompanions: ['Parsley', 'Chamomile'],
    benefits: ['Deters ants and aphids', 'Attracts pollinators']
  },
  'Rosemary': {
    goodCompanions: ['Carrot', 'Cabbage', 'Bean', 'Sage'],
    badCompanions: ['Cucumber', 'Pumpkin'],
    benefits: ['Repels carrot fly and cabbage moths']
  },
  'Lavender': {
    goodCompanions: ['Brassicas', 'Celery', 'Lettuce', 'Onion', 'Tomato'],
    badCompanions: [],
    benefits: ['Attracts pollinators', 'Repels moths and fleas']
  },
  'Sunflower': {
    goodCompanions: ['Cucumber', 'Squash', 'Corn', 'Melon'],
    badCompanions: ['Potato', 'Pole Beans'],
    benefits: ['Attracts pollinators', 'Provides shade for heat-sensitive crops']
  },
  'Strawberry': {
    goodCompanions: ['Spinach', 'Lettuce', 'Bean', 'Onion', 'Thyme', 'Borage'],
    badCompanions: ['Cabbage', 'Broccoli', 'Fennel', 'Kohlrabi'],
    benefits: ['Borage improves flavor and disease resistance']
  }
}

// Normalize plant names for matching
export function normalizeNamePlantName(name: string): string {
  return name
    .toLowerCase()
    .replace(/s$/, '') // Remove trailing 's'
    .replace(/^(sweet|hot|bell|cherry|roma|beefsteak)\s+/i, '') // Remove variety prefixes
    .trim()
}

// Find companion info for a plant
export function getCompanionInfo(plantName: string): CompanionInfo | null {
  const normalized = normalizeNamePlantName(plantName)
  
  // Direct match
  for (const [key, value] of Object.entries(companionData)) {
    if (normalizeNamePlantName(key) === normalized) {
      return value
    }
  }
  
  // Partial match
  for (const [key, value] of Object.entries(companionData)) {
    if (normalizeNamePlantName(key).includes(normalized) || normalized.includes(normalizeNamePlantName(key))) {
      return value
    }
  }
  
  return null
}

// Check compatibility between two plants
export function checkCompatibility(plant1: string, plant2: string): 'good' | 'bad' | 'neutral' {
  const info1 = getCompanionInfo(plant1)
  const info2 = getCompanionInfo(plant2)
  
  const norm1 = normalizeNamePlantName(plant1)
  const norm2 = normalizeNamePlantName(plant2)
  
  // Check if plant2 is in plant1's companions
  if (info1) {
    if (info1.goodCompanions.some(c => normalizeNamePlantName(c) === norm2 || normalizeNamePlantName(c).includes(norm2))) {
      return 'good'
    }
    if (info1.badCompanions.some(c => normalizeNamePlantName(c) === norm2 || normalizeNamePlantName(c).includes(norm2))) {
      return 'bad'
    }
  }
  
  // Check reverse
  if (info2) {
    if (info2.goodCompanions.some(c => normalizeNamePlantName(c) === norm1 || normalizeNamePlantName(c).includes(norm1))) {
      return 'good'
    }
    if (info2.badCompanions.some(c => normalizeNamePlantName(c) === norm1 || normalizeNamePlantName(c).includes(norm1))) {
      return 'bad'
    }
  }
  
  return 'neutral'
}
