# Plant library import plan (Heydenberk → Supabase)

This document describes how Momma D's Garden will bootstrap `plant_library` from local reference JSON (`heydenberk/gardening-data`) in a **review-first** way. Phase 9A is **local-only**; Phase 9A.1 adds **human review overrides** and a **seed candidate list**; **Phase 9B** adds a **guarded Supabase preview-branch upsert** (no production seed, no UI wiring).

## Phase 9B.0 — Greenfield migration repair

**Problem**

- Preview databases replay only what is in `supabase/migrations/`. Several migrations assumed core `public` tables and enums already existed because they had been created earlier on main **outside** this migration stack.
- In particular, `20260515000000_api_grants_and_access_requests.sql` issued `GRANT` on `public.profiles`, `public.households`, and other tables before those relations existed on an empty branch, which aborted the chain (`relation "public.profiles" does not exist`).
- Production main was fine because historical DDL predated or sidestepped the repo order; preview branches start empty, so the folder was not greenfield-safe.

**Fix (repo-only, no seed data)**

- New idempotent migration `supabase/migrations/20260511080000_public_base_schema_if_missing.sql` runs **before** `20260511120000_fix_household_rls_and_invite_rpcs.sql` (lexicographic order). It creates missing enum types and base tables (`profiles`, `households`, `household_members`, `family_invites`, `plant_library`, `garden_areas`, `plantings`, `observations`, `care_tasks`) plus indexes and RLS enablement so later migrations can attach policies and grants safely.
- The timestamp is intentionally **before** `20260511120000`, not only before `20260515000000`, because the household RLS migration alters those tables on the first statement and would fail on an empty database if base DDL were inserted only immediately before the grant migration.
- `20260515000000_api_grants_and_access_requests.sql` now grants table privileges only when each relation exists, so a partial replay does not fail on missing tables.
- Migration filenames use standard **14-digit** Supabase timestamps (`YYYYMMDDHHmmss`); five files were renamed from short prefixes (`2026051500`, `2026051502`, …) via `git mv` so lexicographic replay order matches intent.
- **No application data** is written in this phase; no change to product UI; RLS policy definitions in later files are unchanged. `20260516010000_plant_library_source_key_unique.sql` remains the Phase 9B unique index migration.

**Table / enum dependency order (which migrations assume what)**

| Assumption | First touched in repo (approx.) | Notes |
| --- | --- | --- |
| `public.household_role` enum (used as RPC arg type) | `20260515000000_api_grants_and_access_requests.sql` | Enum must exist before `approve_access_request`; base migration creates it with values compatible with text role checks (`owner`, `admin`, `member`, `editor`, `viewer`). |
| `public.profiles`, `public.households`, `public.household_members`, `public.family_invites`, `public.garden_areas`, `public.plantings`, `public.observations`, `public.care_tasks`, `public.plant_library` | `20260511120000_fix_household_rls_and_invite_rpcs.sql` (policies), `20260515000000` (grants + `access_requests` FKs), `20260515020000` / `20260515040000` (RPCs inserting into these tables), `20260511140000_family_access_codes.sql` (`households`, `household_members`) | Base migration creates shells + columns so `ALTER` / `GRANT` / RPC bodies resolve. |
| `public.access_requests` | `20260515000000` | Still created in `20260515000000` (not in base); requires `households` to exist for FK (provided by base). |
| `private.beta_allowlist` + `public.claim_private_beta_household` | `20260515020000`, `20260515030000`, `20260515040000` | Depends on `households`, `household_members`, `profiles`. |
| Core garden tables (alternate minimal shape) | `20260516000000_garden_core_tables_if_missing.sql` | Uses `CREATE TABLE IF NOT EXISTS`; no-ops when base migration already created richer tables. |
| `plant_library` Heydenberk columns + unique `(source, source_key)` | `20260516010000_plant_library_source_key_unique.sql` | Runs after `20260516000000`; idempotent `ADD COLUMN IF NOT EXISTS` + unique index. |

**Enum types created in base (idempotent)**

- `household_role`, `space_kind`, `planting_status`, `observation_kind`, `task_priority`, `task_status`, `access_request_status` (the last is also ensured by `20260515000000` with duplicate-safe `DO` blocks).

## Phase 9B — Preview-branch `plant_library` seed (Heydenberk)

**Scope**

- Apply **only** on a Supabase **preview or development** database branch after the Phase 9B migration has been applied there.
- Consumes **only** `docs/data/plant-library/heydenberk-seed-candidates.json` → `candidates[]` (never the raw `reference/` tree at runtime or in app code).
- **Does not** change `/plants` or `/my-garden`, **does not** change RLS policies, **does not** add images, **does not** enable extensions (`http`, `pg_net`, wrappers, `vector`, `pg_cron`, `pgmq`, S3 Vectors, `pg_jsonschema`, etc.).

**Schema**

- Migration (idempotent): `supabase/migrations/20260516010000_plant_library_source_key_unique.sql`
  - Adds Heydenberk-shaped columns to `public.plant_library` if missing (`source`, `source_key`, `edible`, `sunlight`, `water`, `spacing_inches`, `days_to_maturity`, `watch_out_for`, `metadata`).
  - Adds unique index `plant_library_source_source_key_uidx` on `(source, source_key)` so `on conflict (source, source_key)` is well-defined.
- Apply this migration on the **preview branch** first (e.g. Supabase branching / linked preview DB). **Do not** assume it is applied to production until you intentionally promote migrations there.

**Environment (local only; never commit values)**

| Variable | When | Purpose |
| --- | --- | --- |
| `SUPABASE_URL` | `--apply` only | Preview-branch project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | `--apply` only | Service role for server-side upsert (never use anon/public keys for writes) |
| `GARDEN_PLANT_LIBRARY_SEED_BLOCKED_HOSTS` | optional | Comma-separated hostnames; script refuses `--apply` if `SUPABASE_URL` host matches any |
| `GARDEN_SUPABASE_MAIN_PROJECT_HOST` | optional | If set, script refuses `--apply` when URL hostname equals this value (guard against pasting prod URL) |

**Commands**

Dry-run (default — no network; reads JSON only; still writes local reports):

```bash
npm run plant-library:seed:heydenberk
```

If `SUPABASE_URL` is set in the environment, the dry-run report records the **hostname only** (still no writes without `--apply`).

Apply (preview branch only — requires both flags):

```bash
npm run plant-library:seed:heydenberk -- --apply --confirm-preview
```

The script prints the **target URL host** immediately before writing. It **never** prints the service role key.

**Outputs**

- `docs/data/plant-library/heydenberk-seed-report.json`
- `docs/data/plant-library/heydenberk-seed-report.md`

**Verification SQL (preview branch)**

- Snippets: `docs/data/plant-library/heydenberk-seed-verification.sql`

**Rollback / reset (preview)**

- To remove Heydenberk rows from a preview DB: `delete from public.plant_library where source = 'heydenberk/gardening-data';` (preview only; confirm RLS/service-role context first).
- To revert schema on a throwaway preview branch, reset or recreate the branch per Supabase docs — **do not** run ad hoc DDL against production to “undo” casually.

**Production**

- **No bulk production seed** in Phase 9B. Promote migrations and run apply against production only after explicit review and a separate decision.

## Phase 9A.1 — Review overrides + seed candidates

**Inputs**

- `docs/data/plant-library/heydenberk-plant-library-preview.json` (Phase 9A mapper output)
- `docs/data/plant-library/heydenberk-review-overrides.json` (per-`source_key` decisions)

**Outputs**

- `docs/data/plant-library/heydenberk-seed-candidates.json` — rows approved for Phase 9B upsert, plus resolution audit trail
- `docs/data/plant-library/heydenberk-seed-candidates.md` — short human-readable report

**Selection rules (defaults)**

| Audit `sourceQuality` | Default seed decision |
| --- | --- |
| `high` or `medium` | **Include** (unless an override says `exclude` or `needs_manual_review`) |
| `low` | **Exclude** unless an override uses `include` or `include_with_warning` |
| `needs_review` | **Exclude** unless an override uses `include` or `include_with_warning` (use sparingly) |

**Why `low` and `needs_review` are excluded by default**

- `needs_review` signals data that is likely wrong or unsafe to treat as reference truth (wrong species, impossible timelines).
- `low` signals important caveats (suspicious harvest, unknown labels); the first seed should stay conservative until a human opts in via `include` / `include_with_warning`.

**Commands**

```bash
npm run plant-library:audit:heydenberk
npm run plant-library:seed-candidates:heydenberk
```

Phase 9B should consume **only** `heydenberk-seed-candidates.json` → `candidates[]` (or an equivalent filtered list), never the raw `reference/` tree at runtime.

## Why heydenberk first

- Small, self-contained JSON already vendored under `reference/gardening-data/plants/`.
- Deterministic offline transforms with explicit warnings and preview rows.
- Good enough to seed spacing, sun, harvest hints, and nutrition maps for early product thinking.

## Why OpenFarm later

- OpenFarm can improve common names, guides, and imagery once licensing and provenance are audited.
- Heydenberk is a starter layer, not canonical taxonomy.

## Why no Supabase Wrappers / external ETL yet

- The first bootstrap is small enough for explicit TypeScript mapping and chunked upserts.
- Wrappers, Airbyte, Fivetran, and similar add moving parts without helping the first hundred rows.

## Why no `http`, `pg_net`, or in-database fetching for this import

- The import must remain **deterministic** and reviewable from files checked into the repo.
- In-database HTTP clients are powerful elsewhere, but they are the wrong tool for a one-time seed.

## Why no S3 Vectors Wrapper / `vector` for seed import

- Vector search may help future assistant or search features; it is unrelated to first-pass reference rows.
- Keep Phase 9B focused on relational upserts and RLS/read-model verification.

## Why no image ingestion in Phase 9A

- Sample JSON in `heydenberk/gardening-data` does not ship plant imagery suitable for direct product use.
- Hotlinking external plant photos is unsafe for licensing, availability, and layout stability.
- If image-like URLs appear in source JSON, Phase 9A preserves them only under `metadata.sourceImageCandidates` and marks them **unaudited**.

## Table mapping (source → `plant_library`)

| `plant_library` column   | Heydenberk source                                                                 |
| ------------------------- | ----------------------------------------------------------------------------------- |
| `source`                  | Constant `heydenberk/gardening-data`                                                |
| `source_key`              | Slug of JSON file name (fallback: slug of `name`)                                  |
| `common_name`             | `name`                                                                              |
| `scientific_name`         | Trimmed `species`                                                                   |
| `category`                | `cultivationCategory`                                                               |
| `edible`                  | `true` when normalized `edibleParts` is non-empty                                   |
| `sunlight`                | Readable range from `sun.min` / `sun.max`                                           |
| `water`                   | `null` in Phase 9A (nutrition `content.water` is not irrigation guidance)             |
| `spacing_inches`          | Largest plausible inch spacing found across `plantings`                             |
| `days_to_maturity`        | Derived from `harvest.duration` when units are day/week; `null` for year-scale data |
| `care_summary`            | Short generated sentence from category, sun, spacing                              |
| `watch_out_for`           | Soil impact + validation caveats                                                    |
| `metadata`                | Raw + normalized slices, warnings, quality, optional `sourceImageCandidates`        |

## Quality rules (audit)

| `sourceQuality` | Meaning                                                         |
| ---------------- | --------------------------------------------------------------- |
| `high`           | Clean enough for import with at most cosmetic normalization   |
| `medium`         | Minor normalization (units, typos) with low risk                |
| `low`            | Usable but important caveats; review spacing/harvest carefully  |
| `needs_review`   | Do not bulk upsert until corrected or explicitly accepted       |

Blocking examples in the sample pack:

- `beet.json` ships the wrong `species` for a beet (artichoke binomial) → `needs_review`.
- `bell pepper.json` includes a planting stage measured in years → `needs_review` (annual crop context).
- Some lettuces and `turnip.json` also carry year-scale planting durations in the source → `needs_review` until reconciled.
- `tomato.json` has a very short harvest window in weeks → warned, commonly `low` quality until reviewed.
- `parsley.json` uses `leaft` → normalized to `leaf` with a warning.
- `cucumber.json` uses `yield.units` instead of `yield.unit` → normalized with drift warning.
- `swiss chard.json` has trailing whitespace in `species` → trimmed with warning.

Year-scale **planting** durations are expected for a small set of perennials (for example artichoke, asparagus, rhubarb); those emit `planting_duration_years_perennial` instead of blocking `needs_review`.

## RLS / access warning

- `plant_library` is conceptually shared reference data, but **current RLS and read paths must be verified** before any UI reads it.
- Do not assume anonymous users can read `plant_library`.
- Prefer a server-side read model or an explicit public read policy later.
- **Phase 9A does not change RLS.**

## Branch-first import workflow

1. Ensure **Phase 9B.0** base migration `20260511080000_public_base_schema_if_missing.sql` is applied on the preview branch (it should run automatically when replaying the full `supabase/migrations` folder from empty).
2. Run `npm run plant-library:audit:heydenberk` locally (writes Markdown + preview JSON under `docs/data/plant-library/`).
3. Edit `heydenberk-review-overrides.json` for any row that should be forced in/out of the first seed (especially `low` and `needs_review` rows).
4. Run `npm run plant-library:seed-candidates:heydenberk` to regenerate `heydenberk-seed-candidates.json` + `.md`.
5. Review `needs_review` / `low` exclusions in the candidate report with a human gardener lens.
6. **Phase 9B (preview branch only):** replay migrations (including `20260516010000_plant_library_source_key_unique.sql`), then run `npm run plant-library:seed:heydenberk -- --apply --confirm-preview` with preview `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` (local env only).
7. Chunk upserts are handled inside the seed script (default chunk size 50) with `on conflict (source, source_key)`.
8. Verify with `docs/data/plant-library/heydenberk-seed-verification.sql` on the same preview branch.
9. Keep `/plants` and `/my-garden` on demo data until read models and policies are settled.

## How to run the dry-run audit

```bash
npm install
npm run plant-library:audit:heydenberk
# optional custom folder (supports spaces in file names):
# node --import tsx scripts/plant-library/audit-heydenberk-import.mjs --from "C:\path\to\plants"
```

Outputs:

- `docs/data/plant-library/heydenberk-import-audit.md`
- `docs/data/plant-library/heydenberk-plant-library-preview.json`

## Phase 9B seed script (implemented)

- **Runner:** `scripts/plant-library/seed-heydenberk-plant-library.mjs` → `seed-heydenberk-plant-library.ts`
- **Input:** `heydenberk-seed-candidates.json` only; validates that **excluded** resolutions never appear in `candidates[]`.
- **Default:** dry-run (no `--apply` → no PostgREST writes). Missing Supabase env vars are OK for dry-run.
- **Apply:** requires `--apply`, `--confirm-preview`, `SUPABASE_URL`, and `SUPABASE_SERVICE_ROLE_KEY`.
- **Optional guards:** `GARDEN_PLANT_LIBRARY_SEED_BLOCKED_HOSTS`, `GARDEN_SUPABASE_MAIN_PROJECT_HOST` (see Phase 9B table above).

## Future image enrichment plan

1. Audit every candidate URL for license, attribution, and longevity; prefer CC0, public domain, or owned photography.
2. Store approved binaries in **Supabase Storage** with stable paths.
3. Add explicit columns when ready: `image_alt`, `image_source`, `image_license`, `image_attribution`, `image_storage_path`.
4. Use existing `PlantImageFrame` fallbacks until assets exist.
5. Do **not** use the S3 Vectors Wrapper for simple image hosting; vectors are for search/assistant features, not static delivery.

## Future UI exposure plan

- Read through server components or RPC that enforce the right policy surface.
- Keep client bundles free of service keys and free of import-side effects from `reference/`.
- Present library rows as calm reference cards inside Guide or setup flows once IA approves.

## Supabase extensions note

- `http` and `pg_net` are useful for operational automations elsewhere, not for this deterministic file import.
- `vector` and S3-related wrappers may matter later for semantic search, not for the first relational seed.
- Avoid enabling extensions speculatively; Phase 9A adds **none**.

## Related files

- Types and transforms: `lib/plant-library/import/*`
- Audit runner: `scripts/plant-library/audit-heydenberk-import.mjs` + `scripts/plant-library/audit-heydenberk-audit.ts`
- Seed candidates builder: `scripts/plant-library/build-heydenberk-seed-candidates.mjs` + `scripts/plant-library/build-heydenberk-seed-candidates.ts`
- Seed runner: `scripts/plant-library/seed-heydenberk-plant-library.mjs` + `scripts/plant-library/seed-heydenberk-plant-library.ts`
- Verification SQL: `docs/data/plant-library/heydenberk-seed-verification.sql`
- Reference guardrails: `reference/gardening-data/REFERENCE_ONLY.md`, `.cursor/rules/reference-folders.mdc`
