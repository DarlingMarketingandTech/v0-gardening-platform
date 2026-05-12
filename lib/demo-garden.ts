import type { Plant } from '@/lib/types'

export const DEMO_HOUSEHOLD_ID = 'demo-momma-ds-garden'

export type DemoBackyardZoneId = 'patio-pots' | 'in-ground-bed' | 'raised-bed-trellis' | 'pollinator-border'

export interface DemoZonePlanting {
  id: string
  name: string
  variety?: string
  status: 'getting-started' | 'growing' | 'ready-soon' | 'blooming'
  careNote: string
}

export interface DemoBackyardZone {
  id: DemoBackyardZoneId
  title: string
  description: string
  bestFor: string
  watchFor: string
  weeklyAction: string
  plantings: DemoZonePlanting[]
}

export const demoBackyardZones: DemoBackyardZone[] = [
  {
    id: 'patio-pots',
    title: 'Patio Pots',
    description: 'Sunny concrete near the kitchen, easy to check when Momma D walks in and out.',
    bestFor: 'Herbs and compact warm-season crops that like quick access and steady watering.',
    watchFor: 'Containers drying out faster than beds after hot, windy afternoons.',
    weeklyAction: 'Lift the lightest pot. If it feels hollow, soak it until water runs through.',
    plantings: [
      {
        id: 'patio-basil',
        name: 'Genovese Basil',
        status: 'growing',
        careNote: 'Pinch the tips before flowers form so the plant stays leafy.',
      },
      {
        id: 'patio-pepper',
        name: 'Patio Pepper',
        variety: 'Sweet Banana',
        status: 'ready-soon',
        careNote: 'Keep moisture even while the peppers size up.',
      },
    ],
  },
  {
    id: 'in-ground-bed',
    title: 'In-Ground Bed',
    description: 'Native soil with room for deeper roots and bigger summer vegetables.',
    bestFor: 'Tomatoes, squash, beans, and greens that want more root space.',
    watchFor: 'Weeds along the edges and soil compaction after heavy rain.',
    weeklyAction: 'Walk the bed edge once and pull obvious weeds before they seed.',
    plantings: [
      {
        id: 'ground-tomato',
        name: 'Cherokee Purple Tomato',
        status: 'growing',
        careNote: 'Check lower leaves and keep mulch pulled back from the stem.',
      },
      {
        id: 'ground-squash',
        name: 'Summer Squash',
        status: 'getting-started',
        careNote: 'Give leaves airflow and water at the base when mornings are dry.',
      },
    ],
  },
  {
    id: 'raised-bed-trellis',
    title: 'Raised Bed + Trellis',
    description: 'Warm, well-drained soil with vertical space for climbers.',
    bestFor: 'Cucumbers, pole beans, small melons, and vining flowers.',
    watchFor: 'Fast vine growth that needs gentle tying before wind bends stems.',
    weeklyAction: 'Tuck one stray vine onto the trellis while the stems are still flexible.',
    plantings: [
      {
        id: 'trellis-cucumber',
        name: 'Marketmore Cucumber',
        status: 'growing',
        careNote: 'Train new vines upward and pick fruit before it gets oversized.',
      },
      {
        id: 'trellis-beans',
        name: 'Pole Beans',
        status: 'getting-started',
        careNote: 'Guide young runners toward the trellis strings.',
      },
    ],
  },
  {
    id: 'pollinator-border',
    title: 'Pollinator Border',
    description: 'A soft blooming edge that brings bees, butterflies, and color near the food garden.',
    bestFor: 'Zinnias, cosmos, native perennials, and flowering herbs.',
    watchFor: 'Aggressive spreaders crowding slower blooms during the heat of summer.',
    weeklyAction: 'Deadhead a short stretch of spent blooms so fresh buds keep coming.',
    plantings: [
      {
        id: 'border-zinnia',
        name: 'Cut-and-Come-Again Zinnia',
        status: 'blooming',
        careNote: 'Cut flowers often to encourage more blooms.',
      },
      {
        id: 'border-cosmos',
        name: 'Cosmos',
        status: 'growing',
        careNote: 'Let a few flowers mature for reseeding and pollinator visits.',
      },
    ],
  },
]

export const demoPlants: Plant[] = [
  {
    id: 'demo-tomato',
    name: 'Cherokee Purple Tomato',
    scientific_name: 'Solanum lycopersicum',
    description: 'Heirloom tomato grown for rich flavor, big slicers, and summer bragging rights.',
    image_url: null,
    category: 'vegetable',
    sunlight_needs: 'full_sun',
    water_needs: 'moderate',
    difficulty: 'moderate',
    growing_season: 'Warm season',
    days_to_harvest: 80,
    spacing_inches: 24,
    min_temp_f: 55,
    max_temp_f: 90,
    care_tips: 'Stake early, water deeply, mulch heavily, and prune lower leaves for airflow.',
  },
  {
    id: 'demo-basil',
    name: 'Genovese Basil',
    scientific_name: 'Ocimum basilicum',
    description: 'Fragrant basil for pesto, tomatoes, and kitchen-counter victory laps.',
    image_url: null,
    category: 'herb',
    sunlight_needs: 'full_sun',
    water_needs: 'moderate',
    difficulty: 'easy',
    growing_season: 'Warm season',
    days_to_harvest: 30,
    spacing_inches: 12,
    min_temp_f: 50,
    max_temp_f: 90,
    care_tips: 'Pinch flowers quickly and harvest often to keep leaves tender.',
  },
  {
    id: 'demo-zinnia',
    name: 'Cut-and-Come-Again Zinnia',
    scientific_name: 'Zinnia elegans',
    description: 'Bright pollinator magnet that makes the garden look like it dressed up for company.',
    image_url: null,
    category: 'flower',
    sunlight_needs: 'full_sun',
    water_needs: 'low',
    difficulty: 'easy',
    growing_season: 'Warm season',
    days_to_harvest: 60,
    spacing_inches: 12,
    min_temp_f: 60,
    max_temp_f: 95,
    care_tips: 'Deadhead regularly for more blooms and better airflow.',
  },
  {
    id: 'demo-cucumber',
    name: 'Marketmore Cucumber',
    scientific_name: 'Cucumis sativus',
    description: 'Classic slicing cucumber for trellis growing and snack raids.',
    image_url: null,
    category: 'vegetable',
    sunlight_needs: 'full_sun',
    water_needs: 'high',
    difficulty: 'moderate',
    growing_season: 'Warm season',
    days_to_harvest: 60,
    spacing_inches: 18,
    min_temp_f: 60,
    max_temp_f: 90,
    care_tips: 'Trellis to save space and pick often before fruits get oversized.',
  },
]
