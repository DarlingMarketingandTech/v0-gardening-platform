# Guide corpus (builder-only)

This folder holds **normalized knowledge snippets** extracted via Firecrawl or hand-curated JSON.

- Do not render raw markdown dumps in the app UI.
- Import through `lib/knowledge/snippets.ts` or a future loader.
- Add `content/guide-corpus/raw/` to `.gitignore` if storing large crawl output locally.

Phase D workflow: Tavily discover → Firecrawl extract → normalize → merge into `lib/knowledge/snippets.ts`.
