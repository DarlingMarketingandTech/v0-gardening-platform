import type { Plant } from '@/lib/types'

export const DEMO_HOUSEHOLD_ID = 'demo-momma-ds-garden'

export const DEMO_GARDEN_LOCATION = {
  label: 'Raleigh, NC demo weather',
  latitude: 35.7796,
  longitude: -78.6382,
  source: 'demo',
  note: 'Using demo weather until a real garden location is saved.',
} as const

export type DemoGardenSpaceId =
  | 'patio-pots'
  | 'in-ground-bed'
  | 'raised-bed-trellis'
  | 'pollinator-border'
  | 'kitchen-window'
  | 'living-room-plant-shelf'
  | 'bathroom-fern-corner'
  | 'bedroom-windowsill'

export type DemoGardenSpaceGroup = 'outdoor' | 'indoor'

export type DemoGardenPlantingStatus = 'getting-started' | 'growing' | 'ready-soon' | 'blooming'

export interface DemoGardenPlanting {
  id: string
  name: string
  variety?: string
  status: DemoGardenPlantingStatus
  careNote: string
}

export interface DemoGardenSpace {
  id: DemoGardenSpaceId
  group: DemoGardenSpaceGroup
  title: string
  description: string
  bestFor: string
  watchFor: string
  weeklyAction: string
  plantings: DemoGardenPlanting[]
}

export const demoGardenSpaces: DemoGardenSpace[] = [
  {
    id: 'patio-pots',
    group: 'outdoor',
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
    group: 'outdoor',
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
    group: 'outdoor',
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
    group: 'outdoor',
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
  {
    id: 'kitchen-window',
    group: 'indoor',
    title: 'Kitchen Window',
    description: 'Bright morning light near the sink, perfect for quick checks between meals.',
    bestFor: 'Handy herbs, small starts, and cheerful plants that like close daily attention.',
    watchFor: 'Dry soil from warm glass and leaves leaning hard toward the light.',
    weeklyAction: 'Turn each pot a quarter turn and trim anything getting leggy.',
    plantings: [
      {
        id: 'kitchen-basil',
        name: 'Sweet Basil',
        status: 'growing',
        careNote: 'Harvest from the tips so the plant stays full instead of stretching thin.',
      },
    ],
  },
  {
    id: 'living-room-plant-shelf',
    group: 'indoor',
    title: 'Living Room Plant Shelf',
    description: 'Steady filtered light with room for a small cluster of easy houseplants.',
    bestFor: 'Trailing plants, foliage favorites, and other plants that prefer bright indirect light.',
    watchFor: 'Dusty leaves and crowded pots blocking airflow around the shelf.',
    weeklyAction: 'Wipe one or two leaves clean and check that saucers stay dry underneath.',
    plantings: [
      {
        id: 'shelf-pothos',
        name: 'Golden Pothos',
        status: 'growing',
        careNote: 'Let the top inch of soil dry before watering again.',
      },
    ],
  },
  {
    id: 'bathroom-fern-corner',
    group: 'indoor',
    title: 'Bathroom Fern Corner',
    description: 'A humid little pocket that stays gentler on moisture-loving foliage.',
    bestFor: 'Ferns and other plants that enjoy soft light and a little extra humidity.',
    watchFor: 'Brown tips if the pot dries fully or sits in stale water too long.',
    weeklyAction: 'Check moisture with a fingertip and pour off any water still resting in the saucer.',
    plantings: [
      {
        id: 'bathroom-fern',
        name: 'Boston Fern',
        status: 'growing',
        careNote: 'Keep the soil lightly damp and snip tired fronds at the base.',
      },
    ],
  },
  {
    id: 'bedroom-windowsill',
    group: 'indoor',
    title: 'Bedroom Windowsill',
    description: 'Gentle window light for a small plant that feels calm and low-fuss.',
    bestFor: 'Compact, patient plants that like a bright perch without constant watering.',
    watchFor: 'Cool drafts at night and leaves pressing right against the glass.',
    weeklyAction: 'Slide pots an inch back from the pane and check for dry soil before watering.',
    plantings: [
      {
        id: 'bedroom-sansevieria',
        name: 'Snake Plant',
        status: 'getting-started',
        careNote: 'Wait until the soil is mostly dry before giving it another drink.',
      },
    ],
  },
]

export type DemoSpacesAccordionSectionId =
  | 'outdoor-beds'
  | 'containers'
  | 'indoor-plants'
  | 'seed-starting'
  | 'problem-plants'

export interface DemoSpacesAccordionSection {
  id: DemoSpacesAccordionSectionId
  title: string
  summary: string
  spaceIds: DemoGardenSpaceId[]
  /** When `spaceIds` is empty, show this copy instead of space cards */
  emptyContent?: string
}

/** Product-facing accordion groups for the Garden tab (demo data only). */
export const demoSpacesAccordionSections: DemoSpacesAccordionSection[] = [
  {
    id: 'outdoor-beds',
    title: 'Outdoor beds',
    summary: 'In-ground, raised bed, and pollinator border',
    spaceIds: ['in-ground-bed', 'raised-bed-trellis', 'pollinator-border'],
  },
  {
    id: 'containers',
    title: 'Containers',
    summary: 'Patio pots you can check on the way in and out',
    spaceIds: ['patio-pots'],
  },
  {
    id: 'indoor-plants',
    title: 'Indoor plants',
    summary: 'Windowsills, shelves, and a humid bathroom corner',
    spaceIds: ['kitchen-window', 'living-room-plant-shelf', 'bathroom-fern-corner', 'bedroom-windowsill'],
  },
  {
    id: 'seed-starting',
    title: 'Seed starting',
    summary: 'Light, warmth, and gentle moisture when you are ready',
    spaceIds: [],
    emptyContent:
      "This demo keeps seed inventory light. When you are ready to plan starts, open the Guide and expand Seeds for a simple checklist rhythm.",
  },
  {
    id: 'problem-plants',
    title: 'Problem plants',
    summary: 'Spaces worth a closer look this week',
    spaceIds: ['in-ground-bed', 'raised-bed-trellis'],
  },
]

export function getDemoGardenSpaceById(id: DemoGardenSpaceId): DemoGardenSpace | undefined {
  return demoGardenSpaces.find((s) => s.id === id)
}

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
