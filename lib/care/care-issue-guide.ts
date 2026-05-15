import type { CareResult, CareUrgency } from '@/lib/care/care-result-types'

export type CareIssueType = 'fungal' | 'bacterial' | 'pest' | 'environmental'

export interface CareIssueGuideEntry {
  id: string
  name: string
  type: CareIssueType
  symptoms: string[]
  causes: string[]
  whatToDoToday: string
  whatNotToDo: string
  prevention: string[]
  urgencyDefault: CareUrgency
  beginnerSummary: string
  treatmentSteps: string[]
  whenToCheckAgain: string
  /** Extra words to improve local search without changing display name */
  searchAliases?: string[]
}

export const CARE_ISSUE_GUIDE: CareIssueGuideEntry[] = [
  {
    id: 'powdery-mildew',
    name: 'Powdery mildew',
    type: 'fungal',
    searchAliases: ['white dust', 'fungus leaves'],
    symptoms: [
      'White or gray dust on leaves that wipes off like flour',
      'Leaves may curl but often stay green at first',
      'Usually shows up when nights are cool and days are warm',
    ],
    causes: [
      'Crowded plants with poor airflow',
      'Dry leaves in humid air (odd combo, but common)',
      'Stress from drought or uneven watering',
    ],
    beginnerSummary:
      'That dusty white coat on leaves is usually a common fungus. It looks alarming, yet many plants bounce back with airflow and gentle cleanup.',
    whatToDoToday:
      'Pick off the worst leaves and bag them in the trash. Give the plant a little breathing room from its neighbors. Water at the soil line so leaves stay dry overnight.',
    whatNotToDo:
      'Do not hose the plant down late in the day—wet leaves at night feeds the problem. Skip heavy “miracle” sprays until you read the label for edibles.',
    prevention: [
      'Space plants so air can move between them',
      'Water in the morning at the base',
      'Choose resistant varieties next season when you can',
    ],
    urgencyDefault: 'medium',
    treatmentSteps: [
      'Remove and trash the most coated leaves',
      'Thin or stake so air moves through the plant',
      'Water at soil level in the morning',
      'Check again in 3–5 days for new dust',
    ],
    whenToCheckAgain: 'Peek in three to five days. If it spreads fast on food crops, ask a nursery for a food-safe option.',
  },
  {
    id: 'aphids',
    name: 'Aphids',
    type: 'pest',
    searchAliases: ['greenfly', 'sticky leaves', 'ants on plant'],
    symptoms: [
      'Clusters of tiny soft bugs on new growth or undersides of leaves',
      'Leaves may look shiny or sticky from honeydew',
      'Ants sometimes “farm” aphids for that sticky sap',
    ],
    causes: [
      'Tender spring growth is their favorite snack bar',
      'They wander in from nearby plants or weeds',
      'Over-fertilizing with nitrogen can attract them',
    ],
    beginnerSummary:
      'Aphids are small sap-suckers that love fresh shoots. They multiply fast but respond well to patience, water blasts, and simple checks.',
    whatToDoToday:
      'Squish a few clusters with gloved fingers or rinse them off with a firm spray of water. Check the undersides of leaves—that is where they hide.',
    whatNotToDo:
      'Avoid spraying every bug in sight with a random kitchen mix on edibles without a trusted recipe. Do not ignore ants; they may be protecting aphids.',
    prevention: [
      'Encourage ladybugs and lacewings (fewer broad sprays helps)',
      'Inspect new plants before tucking them into the garden',
      'Keep weeds down near vulnerable crops',
    ],
    urgencyDefault: 'low',
    treatmentSteps: [
      'Blast undersides with water in the morning',
      'Repeat for two or three days',
      'Watch for ants and disturb their trails if needed',
      'Re-check new growth in a week',
    ],
    whenToCheckAgain: 'Look daily for a few days after a rinse. New growth should emerge clean.',
  },
  {
    id: 'root-rot',
    name: 'Root rot (overwatering)',
    type: 'environmental',
    searchAliases: ['yellow leaves', 'wilting wet soil', 'soggy'],
    symptoms: [
      'Wilting even though the soil feels wet',
      'Yellowing leaves, sometimes mushy stems at the base',
      'A sour or musty smell from the pot or bed',
    ],
    causes: [
      'Soil that stays soggy too long',
      'Containers without drainage',
      'Watering on a calendar instead of checking the soil',
    ],
    beginnerSummary:
      'When roots sit wet too long, they suffocate. The plant looks thirsty, but the fix is usually less water and better drainage—not more.',
    whatToDoToday:
      'Stop watering until the top inch or two feels dry. If it is in a pot, check that holes are clear. Tip the nursery pot gently to see if water is pooling.',
    whatNotToDo:
      'Do not pour on fertilizer to “wake it up.” Do not repot into a giant pot of wet soil—that often makes drainage worse.',
    prevention: [
      'Use pots with holes and a saucer you empty',
      'Mix grit or bark into heavy soil',
      'Lift the pot; light means dry, heavy means wait',
    ],
    urgencyDefault: 'high',
    treatmentSteps: [
      'Pause watering and let soil dry appropriately',
      'Confirm drainage holes are open',
      'Remove any mulch plugging the pot base',
      'If mushy smell continues, plan a careful repot with fresh mix',
    ],
    whenToCheckAgain: 'Check daily. If wilting worsens while soil stays wet, a nursery can help decide if repotting saves the plant.',
  },
  {
    id: 'spider-mites',
    name: 'Spider mites',
    type: 'pest',
    searchAliases: ['webbing', 'speckled leaves', 'tiny spots'],
    symptoms: [
      'Fine webbing where leaf meets stem',
      'Speckled, dusty-looking leaf surface',
      'Leaves bronze or crisp at the edges in bad cases',
    ],
    causes: [
      'Hot, dry air—greenhouses and houseplants see them often',
      'Dusty leaves (they love neglected foliage)',
      'Stress from underwatering',
    ],
    beginnerSummary:
      'Spider mites are tiny relatives of spiders, not insects. They love dry heat. Raising humidity and rinsing leaves helps more than panic.',
    whatToDoToday:
      'Rinse leaves (top and bottom) in the sink or shower with lukewarm water. Increase airflow without baking the plant in direct hot sun right after.',
    whatNotToDo:
      'Do not ignore them on indoor plants—they can spread plant to plant. Avoid heavy oils on hairy leaves unless the label says it is safe.',
    prevention: [
      'Mist or wipe leaves occasionally in dry homes',
      'Isolate new plants for a week when possible',
      'Keep plants adequately watered',
    ],
    urgencyDefault: 'medium',
    treatmentSteps: [
      'Wash both sides of leaves with water',
      'Repeat every two days for a week',
      'Separate from healthy plants while you watch',
      'Boost humidity if air is very dry',
    ],
    whenToCheckAgain: 'Revisit in two days. Webbing returning means keep rinsing and ask a shop for the gentlest next step.',
  },
  {
    id: 'rust',
    name: 'Rust',
    type: 'fungal',
    searchAliases: ['orange spots', 'brown pustules'],
    symptoms: [
      'Orange, yellow, or brown spots—often raised—on leaf undersides',
      'Powder rubs off on your finger like cinnamon dust',
      'Can show up on stems too',
    ],
    causes: [
      'Wet leaves for long periods',
      'Cool nights with dew',
      'Some plants are simply prone (roses, hollyhocks, beans)',
    ],
    beginnerSummary:
      'Rust is another fungus that travels on moisture. It is stubborn on some plants, yet good habits still slow it down.',
    whatToDoToday:
      'Pick off infected leaves and trash them (not compost). Switch to morning watering at soil level only.',
    whatNotToDo:
      'Do not compost infected leaves. Avoid crowding the same susceptible plants year after year in the exact same spot if you can rotate.',
    prevention: [
      'Water at the base in the morning',
      'Choose resistant varieties when available',
      'Clean up fallen leaves under problem plants',
    ],
    urgencyDefault: 'medium',
    treatmentSteps: [
      'Remove spotted leaves into the trash',
      'Avoid wetting foliage when you water',
      'Mulch to reduce soil splashing onto leaves',
      'Monitor weekly during humid spells',
    ],
    whenToCheckAgain: 'Check weekly. On food plants, confirm any spray is labeled for edibles before you use it.',
  },
  {
    id: 'bacterial-leaf-spot',
    name: 'Bacterial leaf spot',
    type: 'bacterial',
    searchAliases: ['water soaked spots', 'dark spots', 'holes in leaves'],
    symptoms: [
      'Small dark or water-soaked spots, sometimes with yellow halos',
      'Spots may merge and leaves drop early',
      'Often follows splashing rain or overhead watering',
    ],
    causes: [
      'Bacteria spread by water droplets hitting soil then leaves',
      'Working among wet plants spreads it further',
      'Damage from hail or bugs gives bacteria an entry',
    ],
    beginnerSummary:
      'These spots behave like a cold going through a classroom—moisture and touch spread it. Calm cleanup beats dramatic chopping.',
    whatToDoToday:
      'Snip the worst leaves with clean pruners. Mulch to stop soil from splashing. Water at the base in the morning only.',
    whatNotToDo:
      'Do not work among wet plants; wait for dry leaves. Skip home concoctions on tomatoes and peppers unless you trust the source.',
    prevention: [
      'Stake or cage plants to improve airflow',
      'Rotate tomatoes and peppers when you can',
      'Avoid crowding seedlings',
    ],
    urgencyDefault: 'medium',
    treatmentSteps: [
      'Sanitize pruners between plants',
      'Remove heavily spotted foliage',
      'Mulch soil surface under susceptible plants',
      'Water low and slow, not overhead',
    ],
    whenToCheckAgain: 'Watch new growth after a week of dry-leaf habits. If spots race up the plant, bring a photo to a nursery.',
  },
]

function normalize(s: string) {
  return s.trim().toLowerCase()
}

export function searchCareIssues(query: string): CareIssueGuideEntry[] {
  const q = normalize(query)
  if (!q) return CARE_ISSUE_GUIDE

  return CARE_ISSUE_GUIDE.filter((entry) => {
    const haystack = [
      entry.name,
      entry.id,
      entry.beginnerSummary,
      ...entry.symptoms,
      ...entry.causes,
      ...(entry.searchAliases ?? []),
    ]
      .join(' ')
      .toLowerCase()
    return haystack.includes(q)
  })
}

export function getCareIssueById(id: string): CareIssueGuideEntry | undefined {
  return CARE_ISSUE_GUIDE.find((e) => e.id === id)
}

/** Shape a guide row like a future AI issue payload for previews and tests. */
export function careIssueGuideToResult(entry: CareIssueGuideEntry, imageUrl?: string): CareResult {
  return {
    kind: 'issue',
    imageUrl,
    issue: {
      isHealthy: false,
      issueName: entry.name,
      urgency: entry.urgencyDefault,
      whatWeNoticed: entry.beginnerSummary,
      whatToDoToday: entry.whatToDoToday,
      whatNotToDo: entry.whatNotToDo,
      whenToCheckAgain: entry.whenToCheckAgain,
      treatmentSteps: entry.treatmentSteps,
      preventionTips: entry.prevention,
    },
  }
}
