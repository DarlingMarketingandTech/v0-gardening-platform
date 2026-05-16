# Setup route refresh (Garden V2 Phase 7A + 7B)

This document describes the **guided garden builder** for `/setup` (Phase **7A** UI) and **Phase 7B** setup-to-zone / forecast intelligence, while keeping the same persistence, completion behavior, and auth gate.

## Phase 7B — Setup-to-zone intelligence (summary)

- **Structured hints on built spaces:** Spaces produced by `buildSpacesFromProfile` attach optional `DemoGardenSpace.setupHints` (`templateId`, `areaTypeLabel`, `lightProfile`, `GardenSpaceForecastSensitivity`, `beginnerRecommendation`). Demo catalog spaces omit `setupHints`; Garden OS mappers fall back to description/title heuristics.
- **Profile JSON unchanged:** `GardenSetupProfile` remains `version: 1` with the same keys. `SetupSpaceDraft.templateId` may be missing on very old saves; builders infer template from the stable draft `id` (e.g. `raised-bed` → `raised`).
- **Garden + Today:** Zone cards and Today forecast rows read `setupHints` first for labels and weather copy; see `docs/design/garden-route-upgrade.md` and `docs/design/today-route-refresh.md`.

### Setup → forecast sensitivity (deterministic)

Implemented in [`lib/garden-setup/build-spaces.ts`](/lib/garden-setup/build-spaces.ts) (`forecastSensitivityForTemplate`):

| Template / group | `driesFast` | `rainExposed` | `heatSensitive` | `frostSensitive` | `protectedIndoor` |
|------------------|-------------|---------------|------------------|------------------|---------------------|
| Indoor (all) | — | — | — | — | yes |
| Patio, balcony, deck/porch containers | yes | — | yes | yes | — |
| Raised, backyard, in-ground, pollinator | — | yes | — | yes | — |
| Greenhouse | — | — | yes | — | — |

Exported helpers (for QA / mental model; no test runner in repo):

```ts
import {
  forecastSensitivityForTemplate,
  areaTypeLabelForSetupTemplate,
} from '@/lib/garden-setup/build-spaces'

// Examples (outdoor)
forecastSensitivityForTemplate('patio', 'outdoor')
// → { driesFast: true, heatSensitive: true, frostSensitive: true, rainExposed: false, protectedIndoor: false }

forecastSensitivityForTemplate('raised', 'outdoor')
// → { rainExposed: true, frostSensitive: true, … }

forecastSensitivityForTemplate('greenhouse', 'outdoor')
// → { heatSensitive: true, … }

areaTypeLabelForSetupTemplate('kitchen', 'indoor') // → "Kitchen windowsill"
areaTypeLabelForSetupTemplate('patio', 'outdoor') // → "Patio & porch pots"
```

## Setup hierarchy

1. **Your Space** — Welcome, where you grow (outdoor / indoor), zone picks, light per outdoor space, light per indoor spot.
2. **Conditions** — Location label (weather context) and gardening comfort level.
3. **Garden Rhythm** — Notification topics, channels, frequency, then summary.

Step order in `buildSetupSteps` was adjusted so stages read in this order (same fields as before; answers still map to `GardenSetupProfile` via `answersToProfile`).

## Component map

| File | Role |
| --- | --- |
| `app/setup/page.tsx` | Server gate: Supabase env, auth, household claim — **unchanged**. |
| `components/setup/setup-page-client.tsx` | Redirect when setup already complete — **unchanged**. |
| `components/setup/garden-setup-wizard.tsx` | Orchestrates steps, `localStorage` save on finish, layout shell. |
| `components/setup/setup-stage-header.tsx` | Stage name, explanation, unlocks line, then step title + hint. |
| `components/setup/setup-progress-rail.tsx` | Three named stage chips + overall progress bar. |
| `components/setup/setup-question-card.tsx` | `AppSurface` wrapper for the active question body. |
| `components/setup/setup-choice-grid.tsx` | Single- or multi-select choice tiles. |
| `components/setup/zone-template-card.tsx` | Zone template tile with lucide icon + “best for”. |
| `components/setup/light-selector.tsx` | Four light/sun options (includes `bright-indirect`). |
| `components/setup/setup-preview-card.tsx` | Live preview: growing mode, spaces, light snapshot, rhythm, payoff lines. |
| `components/setup/setup-summary-card.tsx` | Final recap + primary **Open my garden** action. |

## Data / lib

| File | Role |
| --- | --- |
| `lib/garden-setup/questions.ts` | Step builder, copy, defaults, `answersToProfile` — step order updated; outdoor/indoor option lists expanded. |
| `lib/garden-setup/setup-stages.ts` | Stage ids, marketing copy, `setupStageForStep`. |
| `lib/garden-setup/zone-templates.ts` | Icon + description + “best for” per `templateId`. |
| `lib/garden-setup/types.ts` | `SunLevel`, `GardenSetupProfile`; `SetupSpaceDraft.templateId` optional for legacy JSON reads. |
| `lib/garden-setup/build-spaces.ts` | Builds `DemoGardenSpace` + **`setupHints`** (template, area label, light profile, forecast flags, beginner line); exports **`forecastSensitivityForTemplate`**, **`areaTypeLabelForSetupTemplate`**. |
| `lib/demo-garden.ts` | **`GardenSpaceSetupHints`**, **`GardenSpaceForecastSensitivity`**, optional **`setupHints`** on `DemoGardenSpace`. |
| `lib/garden-setup/store.ts` | **Unchanged** — same `localStorage` key and `saveGardenSetupProfile` / `loadGardenSetupProfile`. |

## What changed visually

- Warm botanical-style page background and soft radial wash.
- Header with **Garden setup** eyebrow and **SetupProgressRail** (Your Space / Conditions / Garden Rhythm).
- **SetupStageHeader** ties each screen to a stage plus “Unlocks” line.
- **SetupPreviewCard** updates as answers change (no persistence until finish).
- Outdoor/indoor picks use **ZoneTemplateCard** with lucide icons (no remote assets).
- Light steps use **LightSelector** (four plain-English options, gentle warnings where helpful).
- Summary uses **SetupSummaryCard** + **ActionPill** primary finish.

## What stayed the same (behavior)

- **Auth / gate:** `app/setup/page.tsx` still requires Supabase public env, signed-in user, and household membership (or claim).
- **Completion:** `saveGardenSetupProfile(householdId, profile)` then `router.replace('/my-garden')` + `router.refresh()`.
- **localStorage:** Same key prefix `momma-garden-setup-v1:${householdId}` and `GardenSetupProfile` v1 shape (with extended `SunLevel` strings allowed in JSON).
- **Demo / no-env:** Still redirects away from `/setup` when `hasPublicSupabaseEnv()` is false.
- **Skip for now:** First step still links to `/my-garden` without saving.

## Future persistence notes

- Setup profile should eventually sync to **Supabase `garden_profiles`** (or equivalent) — **not in this phase**.
- Selected spaces should eventually create **`garden_areas`** rows from the same answers — **not in this phase**.
- Reminder preferences should eventually map to **`notification_preferences`** — **not in this phase**.
- Keep validating loaded JSON before trusting profile fields when cloud sync ships.

## QA checklist

- [ ] `/setup` with a test account: complete all stages; confirm **Open my garden** saves profile and lands on `/my-garden` with personalized spaces when expected.
- [ ] Toggle outdoor + indoor, pick multiple zone cards, set mixed light levels — preview and summary reflect choices.
- [ ] `bright-indirect` choice persists in profile JSON and appears in built space light labels (`setupHints.lightProfile` / fallback description parsing).
- [ ] Back navigation across dynamic outdoor/indoor sun steps does not lose answers.
- [ ] Skip for still works from step 0.
- [ ] Already-complete setup still redirects off `/setup` from `SetupPageClient`.
- [ ] **Phase 7B:** After setup, **Garden** zone cards show specific area types (e.g. “Patio & porch pots”, “Kitchen windowsill”) and light lines that match chosen sun/light — not only “Outdoor zone”.
- [ ] **Phase 7B:** **Today** weather accordion space rows: patio/balcony vs kitchen vs greenhouse vs bed copy stays sensible; indoor rows never use frost/rain panic language; outdoor rows do not use kitchen-sill rotation advice.
- [ ] **Phase 7B:** Strip `templateId` from one space in saved JSON (simulate old profile), reload — space still maps via draft `id` and renders without crashing.
- [ ] `npm run typecheck`, `npm run build`, `npm run lint`.

## Related docs

- `docs/design/garden-route-upgrade.md`, `today-route-refresh.md`, `care-route-refresh.md` — sibling V2 surface refreshes.
- `docs/design/garden-ui-primitives.md` — primitives used here.
