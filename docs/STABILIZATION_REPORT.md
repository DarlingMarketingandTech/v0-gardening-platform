# Stabilization checkpoint report

Branch: `chore/stabilization-checkpoint`

## Phase 0 — Baseline (evidence)

### Install

- `npm ci` failed with `EPERM` unlink on `@tailwindcss/oxide-win32-x64-msvc` native binary (likely file lock / AV). Baseline used `npm install` instead; noted cleanup warnings for the same path pattern.

### `npm run build` (before build-honesty changes)

- **Exit:** success (exit 0).
- **TypeScript:** build log showed `Skipping validation of types` — `next.config.mjs` had `typescript.ignoreBuildErrors: true`, so the build did **not** enforce strict TypeScript during `next build`.
- **Next.js:** warning: `The "middleware" file convention is deprecated. Please use "proxy" instead.` (Turbopack). **Still present after upgrades** — migrating to `proxy.ts` is deferred (framework-wide change).

### Known product / PWA issues (from code review, pre-fix)

- `public/manifest.json`: `start_url` pointed at `/dashboard`; `screenshots` referenced missing `/screenshots/dashboard.png`.
- `public/sw.js`: cached and opened `/dashboard`; no cache-bust version bump after route fixes.

### Async dynamic APIs (pre-fix scan)

- App Router pages using `params` / `searchParams` already used `Promise<...>` + `await` where applicable (`app/gardens/[id]/page.tsx`, `app/auth/error/page.tsx`). `lib/supabase/server.ts` already `await cookies()`.

---

## Phase 1 — Build honesty and verify scripts

### Changes

- Removed `typescript.ignoreBuildErrors` from `next.config.mjs` so `next build` runs **Running TypeScript**.
- Added scripts: `typecheck` (`tsc --noEmit`), `verify` (`npm run lint && npm run typecheck && npm run build`).
- Added `eslint.config.mjs` with `typescript-eslint` (recommended rules); `no-unused-vars` and `no-explicit-any` set to **warn** so legacy debt does not block verify while still surfacing signal.
- Installed devDependencies: `eslint`, `@eslint/js`, `typescript-eslint`.

### Result

- `npm run typecheck`: pass.
- `npm run verify`: pass (lint warnings only, 0 errors).

---

## Phase 2 — Async dynamic API warnings

- Re-verified via build and repo scan: no additional sync `params` / `searchParams` / `cookies()` issues found beyond existing correct patterns.
- **No dedicated code commit** for this item (nothing to change).

---

## Phase 3 — Demo vs auth parity (no `POST /auth/login`)

### Framing

- **Demo path:** `/my-garden` (and other public demo routes) must not require Supabase env or middleware session refresh.
- **Auth path:** Login/sign-up show a clear **not configured** state when `NEXT_PUBLIC_SUPABASE_*` is missing instead of failing mysteriously.

### Changes

- [`lib/env/supabase-public.ts`](lib/env/supabase-public.ts): `hasPublicSupabaseEnv()` helper (booleans only, no secrets).
- [`lib/supabase/middleware.ts`](lib/supabase/middleware.ts): early `NextResponse.next` for public demo paths and `/api/health`; `/dashboard` redirect without Supabase; instantiate `createServerClient` only when env exists and route needs it; protected routes without env redirect to `/auth/login?error=configuration`; `/auth/callback` without env returns `503` JSON.
- [`app/auth/login/page.tsx`](app/auth/login/page.tsx) / [`app/auth/sign-up/page.tsx`](app/auth/sign-up/page.tsx): guard `createClient()` when env missing; friendly copy + link to `/my-garden`.
- [`app/api/health/route.ts`](app/api/health/route.ts): `{ ok, supabasePublicEnv, nodeEnv }` for previews and ops.

### Manual acceptance (recommended)

- Temporarily unset `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` and load `/my-garden`: page should render; middleware must not throw.

---

## Phase 4 — PWA / static assets

### Changes

- [`public/manifest.json`](public/manifest.json): `start_url` → `/my-garden`; removed `screenshots` block (no placeholder file added).
- [`public/sw.js`](public/sw.js): precache `/my-garden` instead of `/dashboard`; notification click opens `/my-garden`; **`CACHE_NAME` / `CACHE_VERSION` bumped to `momma-d-garden-v2`** so old caches are discarded on activate.

### Smoke note

- After SW changes, do **one hard reload** or **Clear site data** for `localhost` / preview origin once; otherwise an old service worker can still serve stale `/dashboard` cache entries.

---

## Phase 5 — Dependency remediation (pinned)

| Package   | Before   | After    | Notes                                      |
| --------- | -------- | -------- | ------------------------------------------ |
| `next`    | `16.2.4` | `16.2.6` | Patched per `npm audit` advisory range     |
| `postcss` | `^8.5`   | `8.5.10` | Exact dev pin; addresses PostCSS advisory |

- Added `overrides.postcss: "8.5.10"` so nested `next/node_modules/postcss` resolves to a safe version (`npm audit` → **0 vulnerabilities** after install).

---

## Phase 6 — `/my-garden` UX (calm card + accordion)

### Measurable rules (self-check)

1. **Mobile-first screen:** Today tab shows title **Today**, best next step (`BriefActionCard`), and **Log a note** / **View spaces** before any `<details>` blocks (extra context and weather stay collapsed by default).
2. **Progressive disclosure:** Garden **Spaces** use a single `Accordion` (`type="single"`, `collapsible`) with **no default open value** — only section titles + summaries until expanded.

### Files

- [`lib/demo-garden.ts`](lib/demo-garden.ts): `demoSpacesAccordionSections` + `getDemoGardenSpaceById` for five product groups (outdoor beds, containers, indoor plants, seed starting, problem plants).
- [`components/dashboard/garden-spaces.tsx`](components/dashboard/garden-spaces.tsx): accordion layout.
- [`components/dashboard/dashboard-client.tsx`](components/dashboard/dashboard-client.tsx): slimmer greeting, Today card with `<details>` for “More for today” and “Weather”, **Need help?** strip (four actions → Guide).

---

## Verification (final)

- Command: `npm run verify` — **pass** (lint warnings only).
- **Service worker:** bump `CACHE_VERSION` in `public/sw.js` when changing precache URLs again.

---

## Intentionally deferred

- Migrate `middleware.ts` → Next 16 `proxy.ts` convention (docs link in build output).
- Legacy Supabase data paths / RLS / migrations — follow [`docs/LEGACY_SUPABASE_PATH_AUDIT.md`](docs/LEGACY_SUPABASE_PATH_AUDIT.md); no schema work in this branch.
- Competitor feature teardown and larger Guide content pass.
- Clearing ESLint warning backlog (currently warnings-only policy).

---

## Commit sequence (this branch)

1. `docs: capture stabilization baseline`
2. `chore: enable TypeScript on build, add verify scripts and ESLint`
3. `fix(deploy): skip Supabase on demo paths, auth not-configured UI, health API`
4. `chore(pwa): canonical /my-garden start_url, sw cache v2, drop missing screenshot`
5. `chore(deps): pin next 16.2.6, postcss 8.5.10, override for clean audit`
6. `feat(ux): calm Today card, Spaces accordion, Need help strip`
