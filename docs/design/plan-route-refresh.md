# Plan route refresh — Garden V2 Phase 8A

Visual and planning-intelligence upgrade for **`/my-garden/plan`**: seasonal hero, opportunity cards tied to real spaces, per-space fit notes, a starter timeline (not a full crop calendar), crop-window summaries, and light companion-style hints. Uses **demo spaces**, **localStorage setup–built spaces** (`setupHints`), and **profile location** only — no weather API requirement, no Supabase writes, no new AI dependencies.

---

## Page hierarchy

1. **Header** — Title **Plan** + one-line positioning.
2. **SeasonStatusHero** — `StatusSurface` + `MetricChip` row (growing mode, optional location, next focus) + `ProgressMeter` “year rhythm” (decorative, not weather).
3. **Metadata hint** (conditional) — When spaces exist but fewer than half carry `setupHints`, a muted `AppSurface` nudges completing setup on this device.
4. **OpportunityPanel** — 3–5 `AppSurface` cards from `PlanOpportunity` (`ActionPill` **Add to plan soon**, disabled — placeholder).
5. **Space fit** — `SectionCard` + grid of **SpaceFitCard** (per space: area type, light, best for, watch for, planning suggestion).
6. **PlantingTimeline** — `SectionCard` + **TimelineRow** list (this week → later this season).
7. **Crop windows** — `SectionCard` + **CropPlanCard** grid (two soft lanes by season).
8. **Companion hints** — `SectionCard` + **CompanionInsightCard** grid (pairing / spacing / water / pollinator tone — hints only).
9. **Footer** — `AppSurface` tinted with persistence note (`PlanViewModel.footerNote`).
10. **Setup CTA** (optional) — `ActionPill` link to `/setup` when household is real, not personalized, and setup incomplete.

**Empty spaces:** rare with default demo data; if `spaceFits` is empty, **EmptyStatePanel** + setup link when applicable.

---

## Component map (`components/plan/`)

| File | Role |
|------|------|
| `plan-page-client.tsx` | Client shell, `useHydratedPlanViewModel`, section order, setup CTA logic. |
| `season-status-hero.tsx` | Season + location + growing mode + next focus + confidence badge + rhythm meter. |
| `opportunity-panel.tsx` | Grid of opportunity cards. |
| `space-fit-card.tsx` | One space: indoor/outdoor badge, light chip, best/watch, planning suggestion. |
| `planting-timeline.tsx` | Wraps ordered **TimelineRow** list. |
| `timeline-row.tsx` | Single window row + confidence badge. |
| `crop-plan-card.tsx` | One crop-window lane with `PlantImageFrame` fallback icon. |
| `companion-insight-card.tsx` | Lightweight planning hint card. |
| `plan-confidence-badge.tsx` | Maps `PlanConfidence` → `StateBadge` label. |

**Garden UI primitives used:** `AppSurface`, `SectionCard`, `StatusSurface`, `MetricChip`, `StateBadge`, `ActionPill`, `ProgressMeter`, `PlantImageFrame`, `EmptyStatePanel`.

---

## View model & data flow

| Piece | Location |
|-------|----------|
| Assembly | `lib/garden-os/engines/plan-engine.ts` — `buildPlanViewModel(context, spacesSource)` |
| Space fit lines | `lib/garden-os/engines/space-fit-engine.ts` — `buildPlanSpaceFits`, `effectiveTemplateIdForPlan` |
| Server entry | `lib/garden-os/queries/get-plan-view-model.ts` — `getPlanViewModel`, `buildPlanPlaceholderViewModel` |
| Client hydration | `lib/garden-os/hooks/use-hydrated-plan-view-model.ts` — mirrors Garden/Today when `localStorage` spaces differ from server snapshot |
| Types | `lib/garden-os/types.ts` — `PlanSeasonSummary`, `PlanOpportunity`, `PlanSpaceFit`, `PlanTimelineRow`, `PlanCompanionHint`, extended **`PlanViewModel`** |

**Spaces source:** `resolveSpacesSourceForContext` (server) + `useHydratedSpacesSource` (client) — same pattern as Today/Garden. Personalized setup-built spaces include **`setupHints`**, which improve template detection for opportunities and planning copy.

**Demo mode:** Always receives demo `DemoGardenSpace[]`; heuristics infer template ids from titles/ids when `setupHints` is absent.

---

## How `setupHints` influence Plan

- **Rich metadata flag:** `PlanViewModel.hasRichSpaceMetadata` is true when at least half of spaces have `setupHints` (typical after completing setup on this device).
- **Opportunities:** Matched via `effectiveTemplateIdForPlan` (prefers `setupHints.templateId`).
- **Space fit:** Uses `mapSpaceToZoneCard` (already setup-aware for labels/light) plus template-specific **planning suggestion** strings in `space-fit-engine.ts`.

---

## Placeholders (explicit)

- **Add to plan soon** — no persistence; no `timeline_events` or `plantings` writes.
- **Crop calendar / frost API** — not implemented; timeline is four qualitative windows only.
- **Companion database** — static hint cards only.

---

## Future persistence (do not implement in this phase)

- Plan events may later map to **`timeline_events`** (or equivalent).
- Selected crops / intentions may later map to **`plantings`** or a plan table.
- Space recommendations may later join **`plant_library`** and real weather windows.
- **No Supabase migrations** in Phase 8A.

---

## QA checklist

- [ ] `/my-garden/plan` reads as a finished V2 surface (hero → opportunities → spaces → timeline → crop windows → hints → footer).
- [ ] Demo user (`householdId` null): useful content from demo spaces; no errors.
- [ ] Signed-in user with setup on device: after completing setup, return to Plan — space list and opportunities update without full refresh (hydration).
- [ ] Metadata hint appears when spaces exist but setup hints are sparse; disappears when most spaces carry `setupHints`.
- [ ] No Care/Doctor/BioVision/diagnostic-engine wording in new copy.
- [ ] No remote Figma asset URLs; icons are Lucide + `PlantImageFrame` fallback only.
- [ ] `npm run typecheck`, `npm run build`, `npm run lint`.

---

## Related docs

- `docs/design/garden-route-upgrade.md`, `today-route-refresh.md`, `setup-route-refresh.md`
- `docs/design/garden-ui-primitives.md`, `garden-v2-design-system-map.md`
