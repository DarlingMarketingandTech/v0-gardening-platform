# Momma D's Garden - Project Handoff

Last updated: 2026-05-11

Deprecated as current product direction: this handoff captured a persistence/auth-heavy stabilization pass and is no longer authoritative for the active demo-first app. Use `AGENTS.md`, `docs/PRODUCT_GUARDRAILS.md`, `docs/INFORMATION_ARCHITECTURE.md`, and `docs/ROADMAP.md` for current direction.

Current direction:

- Demo-first for now with harmless prototype data.
- Mobile-first for Momma D.
- Primary `/my-garden` flow: **Today / Garden / Log / Guide**.
- Local development convention: `http://localhost:3005` via `npm run dev:3005`.

The notes below are historical and should be treated as future persistence/auth context, not an instruction to rebuild auth or Supabase wiring during prototype UX work.

## Purpose

This is a private family gardening app for a small group of relatives. It should not be treated like a public SaaS app. The goal is a simple, low-click garden notebook for tracking one shared family garden.

Shared garden name:

- Momma D's Garden

Default garden areas:

- Raised Bed
- Ground
- Pots

## Core direction

Future persisted family garden data should use Supabase as the source of truth.

Do not use localStorage for real private app data such as gardens, garden areas, plants, plantings, garden log entries, observations, care tasks, reminders, or profile data.

localStorage is acceptable only for harmless UI preferences such as dismissed onboarding messages, theme, or last selected tab.

## Target data model

Use a household-based model so multiple family members can log in with their own accounts while sharing the same garden data.

Recommended tables:

- households
- household_members
- family_invites
- garden_areas
- plant_library
- plantings
- care_tasks
- observations

All private garden data should be scoped by household_id.

A user should only read or write data for a household if they are a member of that household.

## Auth and access model

Historical/future target: auth should not block the current demo-first product shaping loop. Revisit this section before exposing real private family garden data.

The persisted family app should be invite-only.

Use roles such as:

- owner
- editor
- viewer

Non-invited users should not be allowed to create accounts or access garden data.

When real private data is exposed, app-data routes should require authentication, including:

- /my-garden
- /dashboard
- /gardens
- /garden-areas
- /plants
- /planner
- /profile
- /settings
- /today
- /add-plant

## Known issue pattern from v0 work

v0 has repeatedly mixed old and new models. Watch for code using any of these old or demo patterns:

- gardens
- garden_plants
- plants as old app table instead of plant_library
- mommaGardens
- SAMPLE_PLANTS
- defaultEntries
- mockActiveCrops
- localStorage.getItem('gardenLog')
- localStorage.setItem('gardenLog', ...)
- static dashboard stats like 12 Growing, 3 Need Sun, 5 Need Water

These should be removed or migrated.

## Immediate stabilization checklist

1. Make sure the app builds locally.
2. Search for duplicate component exports caused by v0 merges.
3. Search for remaining real-data localStorage usage.
4. Convert old garden detail routes from gardens / garden_plants to garden_areas / plantings.
5. Ensure Add Plant writes to plantings, not garden_plants.
6. Ensure Garden Log uses observations, not demo entries or localStorage.
7. Ensure dashboard numbers are real Supabase counts, not hardcoded.
8. Ensure default garden areas are not recreated after intentional deletion.
9. Verify RLS policies are committed in Supabase migrations.
10. Verify invited users can access the same shared household.

## Recently fixed or confirmed

The GardenLog duplicate export error was diagnosed as a v0 merge problem. The file should contain exactly one component export:

```tsx
export function GardenLog({ householdId }: GardenLogProps) {
```

If a build complains that GardenLog is missing props, update callers to pass:

```tsx
<GardenLog householdId={householdId} />
```

## PermaPeople integration guidance

PermaPeople should be used only as a read-only plant reference source.

Allowed uses:

- plant search
- plant details
- plant library enrichment
- companion planting hints
- care guidance

Do not send private family data to PermaPeople.

Never send user identifiers, household identifiers, garden notes, planted dates, photos, or family account data.

PermaPeople should receive only generic plant queries such as tomato, basil, or pepper.

When a PermaPeople result is selected:

1. Upsert the plant into plant_library.
2. Link the real family planting to that plant via plant_library_id.
3. Save the actual planting in Supabase with household_id.

Custom plants should still work if PermaPeople fails.

## Recommended local workflow

Clone the repo locally:

```bash
git clone https://github.com/DarlingMarketingandTech/v0-gardening-platform.git
cd v0-gardening-platform
npm install
npm run build
npm run dev:3005
```

Then use Codex or local edits instead of relying on v0 for broad refactors.

## Useful grep commands

```bash
grep -R "localStorage" -n app components lib --exclude-dir=node_modules

grep -R "mommaGardens\|SAMPLE_PLANTS\|defaultEntries\|mockActiveCrops" -n app components lib --exclude-dir=node_modules

grep -R "garden_plants\|from('gardens')\|from(\"gardens\")" -n app components lib --exclude-dir=node_modules

grep -R "export function GardenLog" -n components/dashboard/garden-log.tsx
```

## Next high-value tasks

Historical list: verify against `docs/ROADMAP.md` before using this as an implementation plan.

### Task 1: Build fix pass

Run:

```bash
npm run build
```

Fix any TypeScript, duplicate export, missing prop, or import errors first.

### Task 2: Data-source cleanup

Remove all real-data localStorage usage and demo arrays.

### Task 3: Household schema hardening

Make sure migrations exist for household tables, invite-only signup, garden areas, plantings, care tasks, observations, plant library, and RLS policies.

### Task 4: UX simplification

Deprecated target. Current primary navigation is:

- Today
- Garden
- Log
- Guide

Secondary or later:

- Plant Library
- Settings

Hide Seeds, Alerts, Local Pros, and advanced features until the app foundation is stable.

## Codex prompt to start local stabilization

```text
Audit this Next.js Supabase gardening app and stabilize it for local development.

This app is a private family app called Momma D's Garden. It is invite-only and household-based. Supabase must be the single source of truth for real garden data.

First, run the build and fix compile errors. Then audit the repo for stale v0-generated code that still uses localStorage, demo arrays, old gardens/garden_plants tables, or duplicate component declarations.

Prioritize:
1. App must build.
2. No duplicate component exports.
3. Add Plant must save to plantings with household_id.
4. Garden Log must use observations with household_id.
5. Garden Areas must use garden_areas with household_id.
6. Dashboard stats must use real Supabase counts or show empty states.
7. Auth routes must remain private and invite-only.
8. Do not add AI or weather features yet.

Keep changes small and verify with npm run build after each meaningful fix.
```

## Philosophy

Make the soil stable before adding fancy trellises.

The foundation is one shared household, one source of truth, no demo ghosts, no localStorage for real data, simple navigation, and reliable saving after reload.
