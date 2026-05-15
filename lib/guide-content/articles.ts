export type GuideArticleId =
  | 'using-the-app'
  | 'pots-vs-beds'
  | 'watering-basics'
  | 'trellis-basics'
  | 'tomato-basics'
  | 'cucumber-basics'
  | 'common-problems'

export interface GuideArticle {
  id: GuideArticleId
  title: string
  summary: string
  sections: Array<{ heading: string; body: string }>
}

export const guideArticles: GuideArticle[] = [
  {
    id: 'using-the-app',
    title: 'How to use Momma D\'s Garden',
    summary: 'Today, Garden, Log, and Guide — one calm loop.',
    sections: [
      {
        heading: 'Start with Today',
        body: 'Open the app and read the best next step. That is enough for most days.',
      },
      {
        heading: 'Garden shows where things live',
        body: 'Spaces are your patio pots, beds, trellis, and indoor spots. Tap a group to expand.',
      },
      {
        heading: 'Log when something happens',
        body: 'A quick note or photo builds memory without feeling like homework.',
      },
    ],
  },
  {
    id: 'pots-vs-beds',
    title: 'Pots vs raised beds vs in-ground',
    summary: 'Match the container to how much attention you want to give.',
    sections: [
      {
        heading: 'Containers',
        body: 'Pots dry faster and reward frequent small checks. Great for herbs near the door.',
      },
      {
        heading: 'Raised beds',
        body: 'Warmer soil, easier reach, and room for trellises. Watch drainage after heavy rain.',
      },
      {
        heading: 'In-ground',
        body: 'More root room for big summer crops. Weed the edges before weeds seed.',
      },
    ],
  },
  {
    id: 'watering-basics',
    title: 'Watering basics',
    summary: 'Finger depth beats a rigid schedule.',
    sections: [
      {
        heading: 'Check before you pour',
        body: 'Stick a finger in the top inch. Dry means water; cool and damp means wait.',
      },
      {
        heading: 'Morning is kinder in summer',
        body: 'Deep morning water helps roots before afternoon heat.',
      },
      {
        heading: 'Saucers and pots',
        body: 'Pour off standing water so roots do not sit soggy overnight.',
      },
    ],
  },
  {
    id: 'trellis-basics',
    title: 'Trellis basics',
    summary: 'Train vines early while stems are still soft.',
    sections: [
      {
        heading: 'Start gentle',
        body: 'Tuck one runner at a time. Loose ties beat tight ones.',
      },
      {
        heading: 'Windy weeks',
        body: 'After wind, look for bent stems and re-tie before they harden sideways.',
      },
    ],
  },
  {
    id: 'tomato-basics',
    title: 'Tomato basics',
    summary: 'Steady moisture and airflow keep fruit coming.',
    sections: [
      {
        heading: 'Support early',
        body: 'Stake or cage when the plant is small so you do not damage roots later.',
      },
      {
        heading: 'Lower leaves',
        body: 'Trim leaves touching soil to reduce splash-borne issues.',
      },
    ],
  },
  {
    id: 'cucumber-basics',
    title: 'Cucumber basics',
    summary: 'Pick often so the plant keeps producing.',
    sections: [
      {
        heading: 'Harvest size',
        body: 'Slicers taste best before they get oversized and seedy.',
      },
      {
        heading: 'Vertical space',
        body: 'Trellising saves room and keeps fruit cleaner.',
      },
    ],
  },
  {
    id: 'common-problems',
    title: 'Common problems',
    summary: 'Most issues are water, light, or timing — not failure.',
    sections: [
      {
        heading: 'Yellow leaves',
        body: 'Often too much or too little water. Check soil at root depth, not just the surface.',
      },
      {
        heading: 'Leggy indoor plants',
        body: 'Usually reaching for light. Move closer to the window or add a gentle grow light.',
      },
      {
        heading: 'When to ask for help',
        body: 'Use Identify in Guide for a photo guess, then compare with your space and season.',
      },
    ],
  },
]

export function getGuideArticle(id: GuideArticleId): GuideArticle | undefined {
  return guideArticles.find((a) => a.id === id)
}
