# Demo Repo Asset Audit — `reference/garden-app-v2`

Read-only reference audit for porting visual and interaction patterns into **Momma D's Garden**. The V2 repo is a Vite SPA with tab-based state routing; the current app is Next.js App Router with **Today → Garden → Plan → Care** under `/my-garden`.

**Rules for this reference tree**

- Do not import from `reference/garden-app-v2` in production code.
- Do not compile, lint, or typecheck the reference folder as part of the main app.
- Do not run `npm install` or start the Vite dev server inside `reference/`.
- Rename product language: use **Care**, not Doctor; avoid BioVision / Neural / Bio-Asset / BioSteward framing.

---

## Tooling isolation (verified)

| Check | Status | Notes |
|-------|--------|-------|
| `tsconfig.json` excludes `reference` | Done | Alongside `node_modules` and `.next`. |
| ESLint ignores `reference/**` | Done | Added to `eslint.config.mjs` global ignores. |
| Prettier | N/A | No root Prettier config; nothing to change. |
| Production imports from `reference/` | None | Repo-wide search found no imports. |
| `npm run typecheck` | Pass | |
| `npm run build` | Pass | |

---

## Cross-cutting reference vs current app

| Reference (V2) | Current app | Guidance |
|----------------|-------------|----------|
| Vite + client-only tabs | Next.js 16 + URL routes | Port UI patterns, not routing model. |
| `motion/react` everywhere | Minimal motion today | Add motion only where it helps; prefer CSS transitions first. |
| `TerraCard` + custom `@theme` tokens | shadcn `Card` + oklch tokens in `app/globals.css` | Merge **warm palette intent**, not duplicate card primitives. |
| `BioSteward`, BioVision, Bio-Asset | Momma D's Garden, Care, plantings/spaces | Rewrite all copy during port. |
| Inline `GARDEN_DATA` / `PLANT_DATABASE` | `lib/demo-garden.ts`, garden-os view models | Keep demo-first; align shapes with `spaces` / `plantings` direction. |
| `api.ts` → `/api/*` fetch | Server actions + `lib/plant-intelligence` | Do not copy V2 API routes; wire to existing server patterns. |
| AI diagnosis / identify / care sync | `identifyPlantAction`, Care view model (deterministic demo) | Borrow **layout** for identify; defer or simplify diagnosis per product guardrails. |

---

## File-by-file audit

### `reference/garden-app-v2/src/index.css`

**Reusable patterns**

- Warm background (`#faf6f0`), sage primary (`#4a7c59`), tertiary honey accent.
- Headline/body font pairing (Literata + Nunito Sans).
- `shadow-soft`, large radii (`rounded-2xl` / `3xl`), `.glass` utility.

**What to adapt**

- Map hex tokens to existing oklch CSS variables in `app/globals.css` rather than importing this file.
- Optional: add `--font-headline` / `--font-body` if typography polish is a later phase.

**What to ignore**

- Direct `@import` of Google Fonts in CSS (prefer `next/font` if fonts are adopted).
- Duplicate Tailwind `@theme` block that conflicts with shadcn semantic tokens.

**Target file(s)**

- `app/globals.css`
- Optionally `app/layout.tsx` for font loading

**Naming changes**

- `bg-bg-warm` → use `bg-background` or a named `--garden-warm` token.
- `font-headline` / `font-body` → align with design tokens, not V2 class names.

**Risk notes**

- Low. Token drift between oklch and hex is the main regression risk; test mobile contrast on Garden tab cards.

---

### `reference/garden-app-v2/src/components/TerraCard.tsx`

**Reusable patterns**

- Consistent padded surface: title row + optional icon, variant backgrounds (white / cream / tertiary).
- Light entrance animation (`opacity` + `y`).

**What to adapt**

- Extract a thin `GardenSurface` or extend shadcn `Card` with variant prop instead of copying `motion.div` wrapper.
- Use `CardHeader` / `CardTitle` where it matches existing dashboard components.

**What to ignore**

- Hard dependency on `motion/react` for every card.
- Literal cream/tertiary hex in component (use theme tokens).

**Target file(s)**

- `components/ui/card.tsx` (variants) **or** new `components/garden/garden-surface.tsx`
- Consumers: `components/dashboard/*`, `components/care/*`, `components/plan/*`

**Naming changes**

- `TerraCard` → `GardenSurface` or keep shadcn `Card` only.

**Risk notes**

- Low–medium. Widespread card API change touches many files; prefer incremental adoption on one tab first (Garden).

---

### `reference/garden-app-v2/src/components/Navigation.tsx`

**Reusable patterns**

- Mobile bottom bar with active indicator (`layoutId` dot).
- Desktop top nav with brand mark and tab highlights.
- Frosted glass headers (`backdrop-blur`, semi-transparent white).

**What to adapt**

- Visual polish for `GardenBottomNav` / `GardenTopNav` / `GardenShellHeader` (spacing, active state, blur).
- Do **not** replace tab IA: keep **Today, Garden, Plan, Care** from `lib/garden-os/constants/navigation.ts`.

**What to ignore**

- Tab set: Dashboard, Garden, Vision, Planner, Calendar.
- Brand name **BioSteward** and dicebear placeholder avatar pattern.
- `setActiveTab` state machine (use Next.js `Link` + `usePathname`).

**Target file(s)**

- `components/garden-shell/garden-bottom-nav.tsx`
- `components/garden-shell/garden-top-nav.tsx`
- `components/garden-shell/garden-shell-header.tsx`

**Naming changes**

- Tab labels must stay product-canonical (Today / Garden / Plan / Care).
- Log lives at `/my-garden/log` but is not a primary bottom-nav item in current IA—do not add Vision/Planner top-level tabs.

**Risk notes**

- **High** if navigation structure is changed. Scope to styling and micro-interactions only.

---

### `reference/garden-app-v2/src/components/PlantCatalogModal.tsx`

**Reusable patterns**

- Two-step flow: search/filter → configure planting (stage, space, date, method).
- Category chips, dense selectable list, segmented controls.
- Bottom sheet on mobile / centered modal on desktop.

**What to adapt**

- Step UX and layout using shadcn `Dialog` / `Sheet`.
- Copy: “Add plant” / “Add to space”, not “Add Bio-Asset” or “Initialize Bio-Asset”.
- Wire selections to `spaces` + demo plantings in `lib/demo-garden.ts` (later: `plant_library` / `plantings`).

**What to ignore**

- “Search biology database”, “Evolution Phase”, “Cultivation Zone”, “SYNCED” telemetry copy.
- `calculateEHD` display as “Autumn 2026” placeholder without real data.
- `onAdd: (plant: any)` loose typing.

**Target file(s)**

- New: `components/garden/add-planting-dialog.tsx` (future phase)
- Data helpers: `lib/demo-garden.ts`, later `lib/garden-os/data/*`
- Harvest math reference only: see `plantService.ts` audit below

**Naming changes**

- `PlantCatalogModal` → `AddPlantingDialog` or `PlantPickerSheet`
- `GrowthStage` → align with product statuses (`getting-started`, `growing`, etc.) or documented `plantings` stage enum
- `location` → `spaceId` / space name from `DemoGardenSpace`

**Risk notes**

- Medium. Easy to over-build before schema alignment; keep demo-only and local state until backend phase.
- Do not add default AI diagnosis in this flow.

---

### `reference/garden-app-v2/src/pages/MyGarden.tsx`

**Reusable patterns**

- Three-level drill-down: spaces overview → space detail → plant detail.
- Space cards with plant emoji stack and task sidebar.
- Companion/antagonist border hints on plant rows.
- Progress bars and task checklist in sidebar `TerraCard`s.

**What to adapt**

- **Overview + space list** patterns into `GardenSpaces` / `/my-garden/garden`.
- Optional future: plant detail drawer (not in current IA as deep route—could be modal on Garden tab).
- Task sidebar visual language → `components/dashboard/task-list.tsx` or Today tab.

**What to ignore**

- “My Domains”, “Cognitive Care Protocol”, “Neural Health”, “Bio-Metrics”, “Real-time Telemetry”.
- `api.getGrowthCareAdvice` AI sync loop (product prefers deterministic Care guidance).
- Hardcoded `GARDEN_DATA` structure as source of truth.
- Full plant detail page with journal/telemetry fiction.

**Target file(s)**

- `components/dashboard/garden-spaces.tsx`
- `app/my-garden/garden/page.tsx`
- `components/dashboard/dashboard-client.tsx` (orchestration only if needed)
- `lib/demo-garden.ts` for space/planting shape inspiration

**Naming changes**

- `GardenArea` → `DemoGardenSpace` / `spaces`
- `Plant` → `DemoGardenPlanting` or future `planting`
- `aiCareAdvice` → `careNote` / Care tips (static or rule-based)

**Risk notes**

- Medium–high for scope creep. Current Garden tab is accordion-based, not card grid + drill-down; migrating UX is a deliberate phase, not a copy-paste.
- Companion logic can be demo-only static pairs, not a new data model.

---

### `reference/garden-app-v2/src/pages/Vision.tsx`

**Reusable patterns**

- Mode switcher (identify / diagnose / light meter).
- Image capture card + results layout.
- Light meter: camera preview, brightness heuristic, placement hint banner.

**What to adapt**

- **Identify** flow layout → `components/dashboard/plant-identifier.tsx` + `app/actions/identify-plant.ts`.
- **Light meter** only, as a simple Care or Garden helper (no AR/sci-fi overlay).
- Sheet/modal structure and loading states.

**What to ignore**

- Entire **BioVision Suite** branding and “Pathogen Intel” / “Neural Core” copy.
- **Diagnosis** mode unless explicitly requested later (guardrails: no default AI diagnosis).
- Canvas heatmap overlay, “photon flux”, “spectral signature” language.
- V2 `/api/identify` and `/api/diagnose` client shape.

**Target file(s)**

- `components/dashboard/plant-identifier.tsx`
- `app/my-garden/care/page.tsx` or Care sub-section (light placement tip only)
- `lib/plant-intelligence/*` (server), not `reference/.../api.ts`

**Naming changes**

- `Vision` → not a top-level tab; use “Identify a plant” / “Check light” under Care or Guide-adjacent depth.
- `IdentityResult` → `IdentifyAndEnrichResult` (existing)

**Risk notes**

- **High** for diagnosis/AI scope. Medium for camera permissions on mobile browsers.
- Light meter is educational demo only; label as approximate, not telemetry.

---

### `reference/garden-app-v2/src/pages/Planner.tsx`

**Reusable patterns**

- Companion/antagonist grid placement with visual synergy dots.
- Sidebar catalog + “Discover varieties” entry to modal.
- Earth-tone grid canvas (`#e8e4db`) with dot background.

**What to adapt**

- Grid + legend UX into Plan tab (`components/plan/plan-page-client.tsx`).
- Companion hints as static copy or small rule set tied to demo plants.

**What to ignore**

- “Spatial Layout Engine”, “3D Render ON”, “Layout Protocol V3.1.2”.
- `Reorder` drag API unless Plan phase explicitly needs reorder.
- Fake HUD metrics (12.4m², 88% light coverage).

**Target file(s)**

- `app/my-garden/plan/page.tsx`
- `components/plan/plan-page-client.tsx`
- Optional shared: `components/garden/add-planting-dialog.tsx` (catalog entry)

**Naming changes**

- `Planner` → **Plan** (matches nav label).
- `GardenItem` → plan grid cell type local to Plan feature.
- `Asset Library` → `Plant list` or `Varieties`

**Risk notes**

- Medium. Plan tab may already have content—merge, don’t duplicate `/planner` legacy route without IA check.
- Companion matrix is not in SCHEMA_ALIGNMENT yet; keep client-only demo.

---

### `reference/garden-app-v2/src/pages/Onboarding.tsx`

**Reusable patterns**

- Multi-step wizard with conditional steps (indoor/outdoor/both).
- Large type, primary CTA, chip selections for environment/skill/alerts.
- Progress through welcome → location → environment details → finish.

**What to adapt**

- Step rhythm and mobile layout into `components/setup/garden-setup-wizard.tsx`.
- Conditional branching for indoor vs outdoor spaces (aligns with shared `spaces` model).

**What to ignore**

- “BioSteward”, “Ecosystem Calibrated”, “Geographic Context”, “Sync Connections”.
- Client-only `onComplete` with no persistence contract (current app uses `lib/garden-setup/store` + Supabase path).
- Duplicate of `/setup` auth gate logic.

**Target file(s)**

- `components/setup/garden-setup-wizard.tsx`
- `components/setup/setup-page-client.tsx`
- `app/setup/page.tsx`
- `components/my-garden/my-garden-setup-gate.tsx` (redirect only; don’t merge wizard here)

**Naming changes**

- `Onboarding` → **Garden setup** / **Setup wizard**
- `environment: indoor | outdoor | both` → maps to `DemoGardenSpaceGroup` / user space groups

**Risk notes**

- Medium. Must not break Supabase setup persistence or demo bypass for `DEMO_HOUSEHOLD_ID`.
- Do not expand auth/invite flows while polishing UI.

---

### `reference/garden-app-v2/src/services/plantService.ts`

**Reusable patterns**

- Small in-memory `PLANT_DATABASE` with thumbnails and `baseDTM`.
- `calculateEHD` deterministic harvest estimate from stage, method, and planted date.
- Clear types: `PlantSpecies`, `GrowthStage`, `CultivationMethod`.

**What to adapt**

- Port **calculation logic** (pure function) to something like `lib/garden/calculate-harvest-window.ts` when adding planting dates to demo.
- Category filters for plant picker.

**What to ignore**

- Using this file as the canonical plant library (future: `plant_library` table).
- “Environmental drag” fiction (+5 stress days) unless replaced with real weather later.
- Unsplash URLs as long-term assets.

**Target file(s)**

- `lib/demo-garden.ts` (enrichment only)
- Future: `lib/garden-os/data/plant-library.ts` or Supabase-backed queries

**Naming changes**

- `calculateEHD` → `estimateHarvestDate` or `calculateHarvestWindow`
- `PlantSpecies` → `PlantLibraryEntry` (when aligned to schema docs)
- `baseDTM` → `daysToMaturity`

**Risk notes**

- Low for pure function extraction.
- Medium if demo dates confuse Momma D—prefer plain language (“about 10 weeks”) over raw dates in UI.

---

### `reference/garden-app-v2/src/lib/api.ts`

**Reusable patterns**

- Thin client grouping identify / diagnose / care-advice / sensor fetch.
- Consistent JSON POST + error handling.

**What to adapt**

- Pattern only: server actions and route handlers already exist; extend **care advice** as deterministic helpers, not V2 fetch URLs.

**What to ignore**

- All endpoint paths (`/api/sensor-data`, `/api/care-advice`, etc.)—not part of current Next app surface.
- Importing this module anywhere.

**Target file(s)**

- `app/actions/identify-plant.ts` (identify — exists)
- Future server actions under `app/actions/` if needed
- `lib/plant-intelligence/*`
- Care content: `lib/garden-os/queries/get-care-view-model.ts`

**Naming changes**

- `getGrowthCareAdvice` → static Care tips or `getCareSuggestions` (non-AI)

**Risk notes**

- High if V2 AI endpoints are recreated without guardrail review.
- No new API routes in a design-only phase.

---

### `reference/garden-app-v2/src/types.ts`

**Reusable patterns**

- Typed identify/diagnose results and sensor/weather alert shapes.
- Useful field names: `commonName`, `scientificName`, `treatmentPlan`, `confidence`.

**What to adapt**

- Compare with `lib/plant-intelligence` result types; extend only missing fields needed for UI.
- Weather/alert shapes may inform Today tab widgets later.

**What to ignore**

- `SensorData` telemetry fiction (vitality, neural metrics) unless real sensors exist.
- `DiagnosisResult` until product explicitly approves diagnosis feature.

**Target file(s)**

- `lib/plant-intelligence` types (primary for identify)
- `lib/types.ts` or `lib/garden-os/types/*` for domain types
- `components/dashboard/weather-widget.tsx` for alert-like UX only

**Naming changes**

- Avoid “IdentityResult” in UI copy; use “Plant match” / “Identification”.
- `GardenAction` → `CareTask` or align with `care_tasks` schema naming when persisted.

**Risk notes**

- Low for type-only borrowing.
- Medium if diagnosis types encourage shipping diagnosis UI early.

---

## Suggested port order (design-only; no behavior change in this pass)

1. **Tokens / surfaces** — `index.css` + `TerraCard` patterns → `globals.css` + card variant.
2. **Shell polish** — `Navigation.tsx` visuals → garden shell components (IA frozen).
3. **Garden tab** — `MyGarden.tsx` overview cards → `garden-spaces.tsx` (demo data only).
4. **Add planting UX** — `PlantCatalogModal` + `plantService.ts` math → new dialog + pure helper.
5. **Plan grid** — `Planner.tsx` → Plan tab client.
6. **Identify / light** — `Vision.tsx` (identify + meter only) → `plant-identifier.tsx` / Care helper.
7. **Setup wizard** — `Onboarding.tsx` → `garden-setup-wizard.tsx`.

---

## Acceptance checklist (this task)

- [x] `docs/design/demo-repo-asset-audit.md` exists
- [x] `tsconfig.json` excludes `reference/`
- [x] ESLint ignores `reference/**`
- [x] No production imports from `reference/`
- [x] `npm run typecheck` passes
- [x] `npm run build` passes
- [x] No production behavior changes (tooling + documentation only)
