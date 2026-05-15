export interface KnowledgeSnippet {
  id: string
  title: string
  summary: string
  action: string
  sourceUrl: string
  fetchedAt: string
  tags: string[]
}

/** Curated starter corpus — expand via Firecrawl in Phase D without exposing raw crawl in UI. */
export const knowledgeSnippets: KnowledgeSnippet[] = [
  {
    id: 'container-dry-fast',
    title: 'Containers dry faster than beds',
    summary: 'Pots on patios lose moisture quickly on hot, windy days.',
    action: 'Check the lightest pot before evening. Water deeply only if the top inch is dry.',
    sourceUrl: 'https://extension.psu.edu/container-gardening',
    fetchedAt: '2026-05-01',
    tags: ['water', 'containers'],
  },
  {
    id: 'tomato-lower-leaves',
    title: 'Tomato airflow',
    summary: 'Lower leaves touching soil can invite splash issues.',
    action: 'Trim leaves that drag in the dirt and keep mulch slightly away from the stem.',
    sourceUrl: 'https://extension.umn.edu/vegetables/growing-tomatoes',
    fetchedAt: '2026-05-01',
    tags: ['tomato', 'disease-prevention'],
  },
  {
    id: 'aphids-blast',
    title: 'Soft-bodied pests',
    summary: 'A strong water spray can knock down early aphids on tender growth.',
    action: 'Inspect new growth weekly. Repeat a gentle spray if pests return.',
    sourceUrl: 'https://extension.umd.edu/resource/aphids-vegetables',
    fetchedAt: '2026-05-01',
    tags: ['pest', 'vegetables'],
  },
  {
    id: 'indoor-saucer',
    title: 'Indoor saucer check',
    summary: 'Standing water in saucers stresses roots.',
    action: 'After watering, pour off excess from the saucer within an hour.',
    sourceUrl: 'https://extension.oregonstate.edu/houseplants',
    fetchedAt: '2026-05-01',
    tags: ['indoor', 'water'],
  },
]

export function snippetsForTag(tag: string): KnowledgeSnippet[] {
  return knowledgeSnippets.filter((s) => s.tags.includes(tag))
}
