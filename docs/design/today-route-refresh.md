# Today route refresh — Phase 5B (weather-first)

Visual and information hierarchy refresh for **`/my-garden/today`**: weather and forecast context lead the page; space-level forecast checks live inside the weather region; hero, tasks, and insights follow without duplicating forecast material.

No Supabase migrations, no reference repo imports, no remote Figma asset URLs, no task mutations.

---

## Weather-first hierarchy

1. **Header** — Title **Today** + personalized greeting (`TodayViewModel.greeting`).
2. **Weather accordion** — Premium card (`AppSurface` elevated + soft garden gradient): **Today’s Weather** summary, expandable **Forecast Check** (current conditions, sun band, 3-day watering grid via `GardenWeatherForecastBody`), **Spaces to watch** (`TodaysSpacesForecastCheck`), **What this means for your garden** (`weatherBrief.forecastImpact`).
3. **More for Today** — `SectionCard` wrapping **TodayHeroCard** (best next step) and **TaskStack** (secondary tasks).
4. **Insights** — **TodayInsightsRow**: Watch out, Progress, Upcoming (deduped vs forecast space rows where possible).
5. **Quick capture** — **QuickCaptureBar** (placeholder actions + **Start Care check** → `/my-garden/care`).

---

## What moved into the weather accordion

- **Forecast details** that previously lived in a lower collapsible on the old **Today** mega-card (temperature, humidity, wind, UV, sunlight, 3-day watering hints) — now inside **Forecast Check**, reused via `GardenWeatherForecastBody` from `components/dashboard/weather-widget.tsx` (`showTip={false}` so “Mom’s Tip” is not duplicated).
- **Space-specific watch / water / wind / rain framing** — expressed per space in **Spaces to watch** (`TodayForecastSpaceCheck[]` from `map-today-weather-brief.ts`), driven by hydrated spaces + `GardenWeatherData`.
- **Forecast-sensitive guidance line** — `getGardenWeatherTipMessage` → `TodayWeatherBrief.forecastImpact` in **What this means for your garden**.
- **Forecast snapshot chips** — humidity, wind, rain/dry/warm/cool labels in **ConditionStrip** / `WeatherImpactChip`.

**Not duplicated lower on the page:** raw weather stats and per-space forecast copy are not repeated in Insights; **Watch out** is replaced with a generic line when it would repeat a space row in the accordion (`buildTodayInsightsRow`).

---

## Garden UI primitives used

| Surface | Primitives |
|---------|------------|
| Weather accordion shell | `AppSurface` (elevated) |
| Space rows | `AppSurface` (muted), `SectionCard`, `StateBadge` |
| Forecast meaning | `AppSurface` (muted) |
| More for Today | `SectionCard` |
| Hero | `StatusSurface`, `StateBadge`, `AppSurface` (muted), `ActionPill` |
| Tasks | `AppSurface`, `StateBadge`, `ActionPill` |
| Insights | `AppSurface` (muted) |
| Quick capture | `AppSurface` (glass), `ActionPill` |
| Forecast chips | `WeatherImpactChip` (lightweight chip; pairs with `MetricChip`-style rhythm elsewhere) |
| Empty / error forecast | `EmptyStatePanel` |

---

## Component mapping (`components/today/`)

| File | Role |
|------|------|
| `today-page-client.tsx` | Composes sections; hydrates via `useHydratedTodayViewModel`. |
| `today-weather-accordion.tsx` | `<details>` weather-first card; embeds forecast body + spaces + guidance. |
| `todays-spaces-forecast-check.tsx` | Lists `TodayForecastSpaceCheck` rows (name, area type, impact, recommendation, tone, counts). |
| `weather-impact-chip.tsx` | Small botanical chip for forecast tags. |
| `condition-strip.tsx` | Wraps chips from `weatherBrief.chips`. |
| `today-hero-card.tsx` | Best next step + why + placeholder primary + Care link. |
| `task-stack.tsx` | Secondary tasks list. |
| `task-card.tsx` | Single follow-up with placeholder actions. |
| `today-insights-row.tsx` | Watch / Progress / Upcoming compact cards. |
| `quick-capture-bar.tsx` | Add note / water / photo (soon) + Care check. |
| `today-brief-parts.tsx` | `todayBriefIcons` map for hero/tasks. |

**Removed from this route:** `today-brief-card.tsx`, `today-need-help-strip.tsx` (Care entry consolidated into hero + quick capture).

**Dashboard:** `components/dashboard/weather-widget.tsx` exports **`GardenWeatherForecastBody`** for shared forecast layout; **WeatherWidgetContent** still wraps it in the dashboard card.

---

## View-model changes (`lib/garden-os`)

| Type / function | Purpose |
|-----------------|--------|
| `TodayForecastSpaceTone` | `stable` \| `watch` \| `water` \| `attention` |
| `TodayForecastSpaceCheck` | Per-space forecast row for UI. |
| `TodayWeatherBrief` | `headline`, `summary`, `forecastImpact`, `chips`, `spaceChecks`. |
| `TodayInsightCard` / `TodayInsightsRowModel` | Three insight cards (watch / progress / upcoming). |
| `TodayViewModel` | Adds **`weatherBrief`** and **`insights`** (existing `brief`, `greeting`, `weatherState` unchanged in spirit). |
| `map-today-weather-brief.ts` | Builds `TodayWeatherBrief` + `buildTodayInsightsRow`; uses `derive-zone-from-space` for condition labels and open tasks. |
| `map-brief-to-today-view-model.ts` | Assembles brief, weather brief, and insights in one pass. |

`assembleTodayViewModel` / `getTodayViewModel` / `useHydratedTodayViewModel` behavior: **unchanged** aside from richer `TodayViewModel`; client reassembly on localStorage space changes still passes `weatherState` through.

---

## Manual QA

- [ ] `/my-garden/today`: header → weather accordion (default **open**) → More for Today → Insights → Quick capture.
- [ ] Demo user: weather loads or graceful empty state; **Demo** badge on accordion when `location.source === 'demo'`.
- [ ] Personalized household: change spaces in Garden; return to Today — space rows and brief update (hydration).
- [ ] Collapse accordion: summary still shows headline + summary; expand shows full forecast + spaces.
- [ ] Insights **Watch out** does not repeat patio/rain/wind copy already shown in space rows (spot-check hot + dry + patio).
- [ ] Care links: **Start Care check** in hero and quick capture go to `/my-garden/care`.
- [ ] Mobile width: spacing readable; no horizontal scroll on chips row.
- [ ] No console errors.

---

## Follow-up (out of scope)

- Wire **Done soon** / **Snooze soon** / **Next step** to real task state and optional Log / observation writes.
- Replace placeholder quick-capture actions with Log routes or dialogs when product-ready.
- Optional: share `TodayForecastSpaceCheck` derivation with Garden zone card condition for perfect parity.

---

## Related

- `docs/design/garden-ui-primitives.md`
- `docs/design/garden-route-upgrade.md` (Phase 5A Garden)
- `lib/garden-os/mappers/map-today-weather-brief.ts`
