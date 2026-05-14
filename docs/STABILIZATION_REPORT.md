# Stabilization checkpoint report

Branch: `chore/stabilization-checkpoint`

## Phase 0 — Baseline (evidence)

### Install

- `npm ci` failed with `EPERM` unlink on `@tailwindcss/oxide-win32-x64-msvc` native binary (likely file lock / AV). Baseline used `npm install` instead; noted cleanup warnings for the same path pattern.

### `npm run build` (before build-honesty changes)

- **Exit:** success (exit 0).
- **TypeScript:** build log showed `Skipping validation of types` — `next.config.mjs` had `typescript.ignoreBuildErrors: true`, so the build did **not** enforce acceptance criterion (1) as written in the original mission.
- **Next.js:** warning: `The "middleware" file convention is deprecated. Please use "proxy" instead.` (Next 16.2.4, Turbopack). Deferred: switching to `proxy.ts` is a larger framework migration than this stabilization pass; not changed here unless required for green build.

### Known product / PWA issues (from code review, pre-fix)

- `public/manifest.json`: `start_url` pointed at `/dashboard`; `screenshots` referenced missing `/screenshots/dashboard.png`.
- `public/sw.js`: cached and opened `/dashboard`; no cache-bust version bump after route fixes.

### Async dynamic APIs (pre-fix scan)

- App Router pages using `params` / `searchParams` already used `Promise<...>` + `await` where applicable (`app/gardens/[id]/page.tsx`, `app/auth/error/page.tsx`). `lib/supabase/server.ts` already `await cookies()`.

---

## Later sections

_Filled in as work completes: build honesty, middleware, PWA, deps, UX, verification._
