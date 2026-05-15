# Care issue guide & result model (Phase 6B)

This note captures how Momma D’s Garden borrowed **patterns** from the read-only Plangt Scan reference under `reference/plangt-scan`, what we **did not** port, and how we will hook **future AI** without breaking tone or data contracts.

## What we adapted (ideas, not code)

- **Structured “result” shape**: identity vs issue, confidence, urgency, and human-readable sections (“what we noticed”, “what to do today”, …) inspired by Plangt’s identify/diagnose JSON style, renamed for our Care vocabulary.
- **Issue library**: a small curated list with symptoms, causes, prevention, and starter treatment steps—similar in spirit to `data-diseases.ts`, rewritten in plain, reassuring language.
- **Result presentation**: modal/sheet-style deep read inspired by `PlantResultModal` / `DiseaseGuide`, implemented with our **Garden UI** primitives (`AppSurface`, `SectionCard`, `StatusSurface`, `StateBadge`, `MetricChip`, `ProgressMeter`, `PlantImageFrame`, `ActionPill`) and a Radix **Sheet** for mobile-first reading.
- **Checklist affordance**: step list with local completion state (no persistence), echoing Plangt’s “what to do next” flow without implying lab-grade certainty.

## What we intentionally did not port

- **No imports, builds, or routes** from `reference/plangt-scan` into production code.
- **No Firebase**, **no Supabase migrations**, and **no new AI SDK dependencies**.
- **No live image diagnosis** or Gemini/Firebase wiring—Care stays demo-first and honest about limits.
- **No clinical / sci-fi tone** (avoid “diagnostic engine”, “specimen”, “neural”, “BioVision”, etc.).
- **No duplicate Pest Lookup**: Pest Lookup remains the **web search** path; the issue guide is **offline starter notes** with a short cross-link in copy only.

## Copy tone rules

- Speak like **Momma D’s notebook**: practical, warm, short sentences.
- Prefer **“Care”** language over “doctor” framing; we are helping a home gardener, not issuing a verdict.
- **Never promise certainty from a photo alone**—offline note in the detail sheet repeats that.
- Use **spaces** and family-garden vocabulary consistent with product guardrails.

## Multilingual foundation (`lib/care/care-copy.ts`)

- `getCareCopy(locale?)` returns English or Spanish strings for Care UI labels (sections, issue guide chrome, urgency labels, sample card copy).
- **Not a full i18n framework**—just a typed dictionary and a tiny locale sniff (`es*` → Spanish) where we use it in the Plant Issue Guide client.
- Future: pass the same locale object into any AI prompt as **requested output language**, while keeping **stable English-ish schema keys** in JSON for parsing.

## Future AI integration notes

- Keep **JSON field names stable** (`whatWeNoticed`, `whatToDoToday`, `urgency`, …) so client rendering does not churn when models change.
- Pass **`locale`** as the desired **response language** for user-facing strings; keep internal IDs (`issueName` slugs, `kind`) predictable.
- **Validate AI JSON** against `CareResult` / `CareIssueResult` shapes before rendering; fall back to a calm error state if parsing fails.
- **Never guarantee plant health** from imagery alone—pair model output with disclaimers and optional nursery follow-up.
- Map model output into **`CareResult`** so `CareResultCard` remains the single presentation layer.

## Source files (production)

- Types: `lib/care/care-result-types.ts`
- Seed guide + search helpers: `lib/care/care-issue-guide.ts`
- Copy: `lib/care/care-copy.ts`
- UI: `components/care/care-result-card.tsx`, `treatment-checklist.tsx`, `plant-issue-card.tsx`, `plant-issue-detail-sheet.tsx`, `plant-issue-guide.tsx`
- Care page entry: `components/care/care-page-client.tsx`
