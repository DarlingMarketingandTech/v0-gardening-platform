# Garden route upgrade — Phase 5A (zones)

Visual upgrade for **`/my-garden/garden`**: zone overview header, zone cards, zone detail panel, optional grouped accordion fallback. Built on Phase 4 [`components/garden-ui`](/components/garden-ui/) primitives and the Garden OS view model ([`GardenViewModel`](/lib/garden-os/types.ts)).

No Supabase migrations, no reference repo imports, no Figma asset URLs in code.

---

## Files touched

| Area | Files |
|------|--------|
| Types / assembly | [`lib/garden-os/types.ts`](/lib/garden-os/types.ts), [`lib/garden-os/assemble/assemble-garden-view-model.ts`](/lib/garden-os/assemble/assemble-garden-view-model.ts), [`lib/garden-os/mappers/map-space-to-zone-card.ts`](/lib/garden-os/mappers/map-space-to-zone-card.ts), [`lib/garden-os/mappers/derive-zone-from-space.ts`](/lib/garden-os/mappers/derive-zone-from-space.ts) |
| Route UI | [`components/garden/garden-page-client.tsx`](/components/garden/garden-page-client.tsx) |
| Zone components | [`zone-overview-header.tsx`](/components/garden/zone-overview-header.tsx), [`zone-card.tsx`](/components/garden/zone-card.tsx), [`zone-detail-panel.tsx`](/components/garden/zone-detail-panel.tsx), [`planting-chip-list.tsx`](/components/garden/planting-chip-list.tsx), [`zone-condition-badge.tsx`](/components/garden/zone-condition-badge.tsx) |
| Fallback | [`components/dashboard/garden-spaces.tsx`](/components/dashboard/garden-spaces.tsx) — unchanged; embedded under `<details>` |

[`get-garden-view-model.ts`](/lib/garden-os/queries/get-garden-view-model.ts) stays thin; overview is assembled server- and client-side via `assembleGardenViewModel`.

---

## Primitive mapping

| Zone / route surface | Garden UI primitive |
|---------------------|---------------------|
| Zone cards | [`AppSurface`](/components/garden-ui/app-surface.tsx) `elevated`, [`MetricChip`](/components/garden-ui/metric-chip.tsx), [`ActionPill`](/components/garden-ui/action-pill.tsx), [`PlantingChipList`](/components/garden/planting-chip-list.tsx) → [`PlantImageFrame`](/components/garden-ui/plant-image-frame.tsx) |
| Condition | [`ZoneConditionBadge`](/components/garden/zone-condition-badge.tsx) → [`StateBadge`](/components/garden-ui/state-badge.tsx) |
| Overview metrics | [`MetricChip`](/components/garden-ui/metric-chip.tsx) |
| Detail header / sections | [`SectionCard`](/components/garden-ui/section-card.tsx), [`StatusSurface`](/components/garden-ui/status-surface.tsx), [`AppSurface`](/components/garden-ui/app-surface.tsx) tinted tip |
| Rhythm meter | [`ProgressMeter`](/components/garden-ui/progress-meter.tsx) |
| Empty zones | [`EmptyStatePanel`](/components/garden-ui/empty-state-panel.tsx) |

---

## View-model additions

### `GardenZoneCard`

Derived in [`map-space-to-zone-card`](/lib/garden-os/mappers/map-space-to-zone-card.ts) using [`derive-zone-from-space`](/lib/garden-os/mappers/derive-zone-from-space.ts):

| Field | Meaning |
|-------|---------|
| `areaTypeLabel` | “Outdoor zone” / “Indoor zone” |
| `lightExposureLabel` | Parsed from setup wizard description (`Sun/Light is mostly low|mid|high`) or demo keyword heuristics |
| `condition` | `stable` \| `needs_water` \| `attention` \| `critical` |
| `conditionLabel` | User-facing: Stable, Needs water, Needs attention, Needs urgent care |
| `openTaskCount` | Non-blooming planting rows each count as one gentle check, plus `1` when `weeklyAction` is non-empty |

### `GardenOverviewSummary` (`GardenViewModel.overview`)

| Field | Meaning |
|-------|---------|
| `gardenLabel` | Setup `displayName` or `locationLabel`, else null (UI falls back) |
| `zoneCount` | `zoneCards.length` |
| `plantingCount` | Sum of plantings across spaces |
| `openTaskCount` | Sum of `zone.openTaskCount` |
| `activeCareCaseCount` | Count of zones where `condition !== 'stable'` (zones that would benefit from a Care check soon — **not** persisted cases) |
| `summaryLine` | Friendly one-line overview |

---

## Deterministic rules (reference)

**Condition priority** (first match wins):

1. **critical** — Rare: indoor + dryness language in `watchFor` + both `ready-soon` and `getting-started` plantings present.
2. **needs_water** — Outdoor containers / patio-style ids or copy about drying, soaking, or hollow pots.
3. **attention** — Any `ready-soon` planting; or majority `getting-started`; or spread / weed / vine watch copy.
4. **stable** — Default.

**Light labels** — Regex on personalized descriptions from [`buildSpacesFromProfile`](/lib/garden-setup/build-spaces.ts); otherwise calm keyword buckets on demo copy.

---

## Layout / behavior

- **Desktop (`md+`):** Two columns — zone grid + sticky detail.
- **Mobile:** List-first (`mobileShowList`): overview + cards; tapping a zone hides the list and shows detail with **Back to zones**. Desktop ignores that flag.
- **Selection:** `selectedZoneId` defaults to the first zone when the list changes; Back only toggles mobile list visibility (does not fight hydration).
- **Grouped fallback:** Collapsible **Grouped spaces view** renders legacy [`GardenSpaces`](/components/dashboard/garden-spaces.tsx) accordion.
- **Setup / demo CTAs:** Same rules as before (`DEMO_HOUSEHOLD_ID`, `isGardenSetupComplete`, `isPersonalized`).

---

## Manual QA checklist

- [ ] Demo user (`householdId` null): zones render with demo data; “Demo zones…” disclaimer when not personalized.
- [ ] Signed-in + personalized: header uses location/display name when present; metrics update after localStorage-driven space changes (household only).
- [ ] Mobile: list → zone detail → Back returns to list.
- [ ] Care pill links to `/my-garden/care` without triggering card selection (`stopPropagation`).
- [ ] Empty personalized garden (zero spaces): empty state + setup CTA path still sane.
- [ ] No console errors; images only from optional `imageUrl` (demo omits).

---

## Follow-up work

- Real task list integration (not derived counts).
- Plant thumbnails (`GardenZoneCardPlanting.imageUrl`) from uploads or library.
- “Add plant” action wired to add-planting flow when product-ready.
- Optional: reduce duplicate headings inside grouped `GardenSpaces` when nested under `<details>`.

---

## See also

- [`docs/design/garden-ui-primitives.md`](./garden-ui-primitives.md)
- [`docs/design/garden-v2-design-system-map.md`](./garden-v2-design-system-map.md)
