# Figma Design Inventory — Momma D Gardening (Phase 3B)

Scoped, deep inventory for **Garden V2** implementation phases. Maps P0/P1 frames from team Figma community files to Momma D routes and future `components/garden-ui/*` primitives.

**Predecessor:** [figma-relevance-check.md](./figma-relevance-check.md) (Phase 3B-Lite relevance pass). This document supersedes it for frame-level detail.

**Constraints**

- No production UI changes in this phase.
- No imports from `reference/garden-app-v2`.
- Use **Care**, not Doctor; avoid BioVision / Neural / Bio-Asset language.
- Product IA stays **Today → Garden → Plan → Care** under `/my-garden`.
- Do not paste Figma MCP Tailwind output into production components.
- Do not commit expiring MCP asset URLs — use Figma deep links + node IDs; re-fetch screenshots via `get_design_context` before implementation sprints.

---

## MCP inspection summary

| Check | Result |
|-------|--------|
| Figma MCP auth (`whoami`) | `jacob@darlingmt.com` — Darling Martech team, Full/Expert seat |
| Plant Care App `fMBBsQOQxCw3t2VS2qOTuk` | Readable — 2 screens on Page 1 |
| Gardening App `qxr6Eyc9rWzUFSNZLGEZDX` | Readable — ~26 numbered frames on Page 1 |
| Frames inspected (design context) | 8 frames (6 required + 2 optional) |
| Production code changed | None (docs only) |

---

## Source files

| Display name | `fileKey` | Figma URL |
|--------------|-----------|-----------|
| Plant Care App (Community) | `fMBBsQOQxCw3t2VS2qOTuk` | [Plant Care App](https://www.figma.com/design/fMBBsQOQxCw3t2VS2qOTuk/Plant-Care-App--Community-) |
| Gardening App (Community) | `qxr6Eyc9rWzUFSNZLGEZDX` | [Gardening App](https://www.figma.com/design/qxr6Eyc9rWzUFSNZLGEZDX/Gardening-App--Community-) |

**Screenshot policy:** Re-fetch via `get_design_context` with `fileKey` + `nodeId`. Example deep link format: `?node-id=2-9471` → node `2:9471`.

---

## Scoped inventory table

| Priority | File | Frame name (Figma) | Node ID | App mapping | Rec. | Target code (reference) |
|----------|------|-------------------|---------|-------------|------|-------------------------|
| P0 | Plant Care | Homepage | `2:9471` | Today, Garden, Care, Shared UI | adapt | `today-brief-card.tsx`, `garden-spaces.tsx`, `care-page-client.tsx` |
| P0 | Plant Care | Scan | `2:9348` | Care | adapt | `plant-identify-panel.tsx` |
| P0 | Gardening | 6 (My Garden) | `19:63` | Garden, Today, Shared UI | adapt | `garden-spaces.tsx`, `garden-page-client.tsx` |
| P1 | Gardening | 7 (Water Plants) | `40:932` | Today | adapt | `today-brief-card.tsx`, `today-brief-parts.tsx` |
| P1 | Gardening | 8 (Add plant form) | `123:514` | Setup, Care | adapt | `garden-setup-wizard.tsx`, future add-planting dialog |
| P1 | Gardening | 11 (Plant detail) | `13:82` | Garden (future detail) | adapt | Future planting detail modal |
| P2 | Gardening | 5 (New on Plantio) | `12:12` | Plan, Today | adapt | `plan-page-client.tsx` |
| P2 | Gardening | 22 (calendar sub-screen) | — | — | **Skipped** | Optional frame not inspected — no new tokens beyond `40:932` date header |

---

## Frame-by-frame notes

### Plant Care — Homepage (`2:9471`)

**Figma link:** [Homepage](https://www.figma.com/design/fMBBsQOQxCw3t2VS2qOTuk/Plant-Care-App--Community-?node-id=2-9471)

| Field | Detail |
|-------|--------|
| **Primary mapping** | Today (alerts), Garden (categories), Care (scan CTA), Shared UI |
| **Useful patterns** | Scan CTA band (`#eef7e8` + `#61af2b` text); horizontal popular-plant cards; 2×2 category grid with tinted icon circles; alert rows (50px thumb + title + subtitle + chevron); section headers with green “View all” |
| **Patterns to avoid** | Bottom nav Home/Explore/Saved/Profile; “My Plants” as page title (use Momma D branding); vuesax icon assets; bookmark/saved affordances |
| **Token observations** | Primary `#61af2b`; text `#333` / muted `#628093` / inactive `#8c8c8c`; CTA tint `#eef7e8`; card radius `12px`; thumb radius `6px`; DM Sans 24/18/16/14/12px |
| **Component candidates** | `ScanEntryCard`, `TodayReminderRow`, `LocationCategoryCard`, `PlantPhotoCard` (carousel variant) |
| **Target files** | `components/today/today-brief-card.tsx`, `components/today/today-brief-parts.tsx`, `components/dashboard/garden-spaces.tsx`, `components/care/care-page-client.tsx` |

---

### Plant Care — Scan (`2:9348`)

**Figma link:** [Scan](https://www.figma.com/design/fMBBsQOQxCw3t2VS2qOTuk/Plant-Care-App--Community-?node-id=2-9348)

| Field | Detail |
|-------|--------|
| **Primary mapping** | Care |
| **Useful patterns** | Full-bleed camera preview; top bar with flash-off + centered title + close; horizontal white scan guide line; bottom controls: gallery thumb (48px, `9px` radius), white shutter ring (70px), rotate control |
| **Patterns to avoid** | Literal “Identify the plant” without Momma D tone (prefer “Identify a plant” or “What is this plant?”); sci-fi/neural framing |
| **Token observations** | White UI on dark overlay; title 16px bold; gradient scrims top/bottom; home indicator pill |
| **Component candidates** | `CameraOverlayShell` |
| **Target files** | `components/guide/plant-identify-panel.tsx` |

---

### Gardening — My Garden (`19:63`)

**Figma link:** [Frame 6](https://www.figma.com/design/qxr6Eyc9rWzUFSNZLGEZDX/Gardening-App--Community-?node-id=19-63)

| Field | Detail |
|-------|--------|
| **Primary mapping** | Garden, partial Today, Shared UI |
| **Useful patterns** | Split title “My **Garden**” (28px bold, accent word); Water/Light/Plants metric shortcut row (63px circles); plant photo grid (`11px` radius); list cards with thumb + progress bar; soft card shadow; center FAB with scan brackets |
| **Patterns to avoid** | “Create an Aepod” copy; shop tab in bottom nav; 5-icon nav (home/book/people/shop); Plantio branding |
| **Token observations** | Canvas `#fafafa`; primary `#5b8e55` / `#61b458`; title `#12121d`; body `#394434`; muted `#9ca199`; shadow `5px 21px 52px -9px rgba(0,0,0,0.08)`; card radius `22px`; progress track `#e2e2e2`, fill `#61b458` (3px height) |
| **Component candidates** | `GardenCard`, `PlantPhotoCard`, `GardenMetricShortcut`, `ProgressMeter`, `StatusChip` |
| **Target files** | `components/dashboard/garden-spaces.tsx`, `components/garden/garden-page-client.tsx`, `components/garden-shell/garden-quick-action-menu.tsx` |

---

### Gardening — Water Plants (`40:932`)

**Figma link:** [Frame 7](https://www.figma.com/design/qxr6Eyc9rWzUFSNZLGEZDX/Gardening-App--Community-?node-id=40-932)

| Field | Detail |
|-------|--------|
| **Primary mapping** | Today |
| **Useful patterns** | Date section header (“Saturday, May 21”, ~28px); task row structure (plant thumb + title + volume + action circle); checkmark vs water-drop completion states |
| **Patterns to avoid** | Loud background fills (`#e7bdbb`, `#e7c2a0`, pink border `#ffa8a8`); “Create with Gardening App” placeholder copy; literal color blocks for task types |
| **Token observations** | Title split “Water **Plants**”; row height ~114px, radius `20px`; FAB green `#5b8e55`; settings icon top-right |
| **Component candidates** | `CareTaskCard` (muted variant), date header pattern for Today |
| **Target files** | `components/today/today-brief-card.tsx`, `components/today/today-brief-parts.tsx` |

---

### Gardening — Add plant form (`123:514`)

**Figma link:** [Frame 8](https://www.figma.com/design/qxr6Eyc9rWzUFSNZLGEZDX/Gardening-App--Community-?node-id=123-514)

| Field | Detail |
|-------|--------|
| **Primary mapping** | Setup, Care (care toggles) |
| **Useful patterns** | Photo upload placeholder with green border; name/type/location fields; three care schedule cards (Watering, Sunlight, Nutrients) with icon square + label + frequency + toggle; pill ADD CTA |
| **Patterns to avoid** | “Nutreints” typo in production copy; “Water Plants” screen title for add flow (use “Add planting” / “Add to garden”) |
| **Token observations** | Inputs `11px` radius, border `#61b458`; care cards `22px` radius, shadow garden; toggle on `#61b458`, track `#eaf3ea`; ADD button `#5b8e55`, `31px` radius pill |
| **Component candidates** | Care schedule row (future), add-planting form sections |
| **Target files** | `components/setup/garden-setup-wizard.tsx`, future `components/garden-ui/add-planting-dialog.tsx` |

---

### Gardening — Plant detail (`13:82`)

**Figma link:** [Frame 11](https://www.figma.com/design/qxr6Eyc9rWzUFSNZLGEZDX/Gardening-App--Community-?node-id=13-82)

| Field | Detail |
|-------|--------|
| **Primary mapping** | Garden (future planting detail modal) |
| **Useful patterns** | Hero image with back affordance; overlapping white sheet (`#f6f8f5`); carousel dots; description block; three metric chips (Humidity, Height, Temperature) with circular icon + label + value |
| **Patterns to avoid** | “Create an Aepod”; lorem ipsum; teal metric palette (`#91d0cc` / `#5fbab4`) — map to sage primary/muted instead |
| **Token observations** | Title 32px green; subtitle `#9ca199`; body `#60655d` 16px/28px line-height; chip circles ~36px |
| **Component candidates** | `StatusChip`, `PlantPhotoCard` (hero variant) |
| **Target files** | Future garden planting detail (no route in v1) |

---

### Gardening — New on Plantio (`12:12`) — optional

**Figma link:** [Frame 5](https://www.figma.com/design/qxr6Eyc9rWzUFSNZLGEZDX/Gardening-App--Community-?node-id=12-12)

| Field | Detail |
|-------|--------|
| **Primary mapping** | Plan (seasonal hero), Today (secondary tips) |
| **Useful patterns** | Large promo hero with gradient overlay; 2-column product/plant grid; “New” pill badge (`#61b458`, 17px radius); My Garden / My Plants segment chips |
| **Patterns to avoid** | E-commerce framing; “New on Plantio”; shop nav; “Create plans with Gardening App” marketing copy |
| **Token observations** | Hero `11px` radius; grid cards ~168×167px; segment labels 16px primary green |
| **Component candidates** | `GardenHero` (Plan), seasonal tip card |
| **Target files** | `components/plan/plan-page-client.tsx` |

---

## Screenshots / design references

| fileKey | nodeId | Screen | Re-fetch |
|---------|--------|--------|----------|
| `fMBBsQOQxCw3t2VS2qOTuk` | `2:9471` | Homepage | `get_design_context` |
| `fMBBsQOQxCw3t2VS2qOTuk` | `2:9348` | Scan / identify | `get_design_context` |
| `qxr6Eyc9rWzUFSNZLGEZDX` | `19:63` | My Garden | `get_design_context` |
| `qxr6Eyc9rWzUFSNZLGEZDX` | `40:932` | Water Plants tasks | `get_design_context` |
| `qxr6Eyc9rWzUFSNZLGEZDX` | `123:514` | Add plant form | `get_design_context` |
| `qxr6Eyc9rWzUFSNZLGEZDX` | `13:82` | Plant detail | `get_design_context` |
| `qxr6Eyc9rWzUFSNZLGEZDX` | `12:12` | Promo / seasonal feed | `get_design_context` |

---

## App route mapping

| Product tab | Route | Frames informing UI | Primary client |
|-------------|-------|---------------------|----------------|
| Today | `/my-garden/today` | `2:9471`, `40:932` | `today-page-client.tsx`, `today-brief-card.tsx` |
| Garden | `/my-garden/garden` | `19:63`, `13:82` | `garden-page-client.tsx`, `garden-spaces.tsx` |
| Plan | `/my-garden/plan` | `12:12` (hero rhythm) | `plan-page-client.tsx` |
| Care | `/my-garden/care` | `2:9471`, `2:9348`, `123:514` | `care-page-client.tsx`, `plant-identify-panel.tsx` |
| Setup | `/setup` | `123:514` | `garden-setup-wizard.tsx` |
| Shared UI | — | All frames | `garden-bottom-nav.tsx`, `app/globals.css`, future `garden-ui/*` |

---

## Pattern recommendations (cross-frame)

| Pattern | Best source | Momma D implementation |
|---------|-------------|------------------------|
| Alert / reminder row | `2:9471` | 50px thumb, 14px bold title, 12px muted subtitle, chevron — no room names in subtitle when space model exists |
| Scan entry CTA | `2:9471` | `bg-primary/10` band, primary text, scan icon — link to Care identify |
| Space category row | `2:9471` | Tinted icon circle + plant count + space name — map to **spaces**, not “Living Room” |
| Garden list card | `19:63` | White card, soft shadow, photo thumb, optional progress — prefer status chip over bar when crowded |
| Task checklist | `40:932` | Muted card rows, check/water icon — **not** pink/peach/grey loud fills |
| Add planting form | `123:514` | Photo → name → type → space → care toggles |
| Camera shell | `2:9348` | Full-screen, scan line, shutter, gallery thumb |
| Plan hero | `12:12` | Gradient overlay band — seasonal tips, not commerce |
| Bottom nav shape | `19:63` | FAB cutout + scan affordance only — **not** tab labels or shop icon |

---

## Ignore list

| Item | Reason |
|------|--------|
| Plant Tracker cover (`ndhaxwzq62jLf7eJsK1f6D`) | Mood-only; no app screens |
| Shop / e-commerce frames | Not Momma D product |
| Auth (Login/Register) | Demo uses `/setup` wizard |
| Social / messaging / groups | Out of scope |
| Wrong 4-tab nav (Home/Explore/Saved/Profile) | Keep Today/Garden/Plan/Care |
| Wrong 5-tab nav (home/book/people/shop) | Same |
| Plantio, Aepod, “Create with Gardening App” copy | Third-party branding |
| vuesax icon PNG imports | Use `lucide-react` |
| AI diagnosis / neural / BioVision language | Product guardrails |
| Raw Figma MCP asset URLs in repo | Expire in ~7 days |
| Frame `124:1002` deep pass | Deferred — calendar patterns covered by task list + Plan client |

---

## Risks and licensing

| Risk | Mitigation |
|------|------------|
| Community file license | Files by Nickelfox (Plant Care) and pawan Kumar (Gardening App) — verify Figma Community license before pixel-close ship; prefer **adapt** over **copy** |
| Non-transferable assets | Plant photos, vuesax icons, and embedded imagery are not licensed for production — use Momma D photos, emoji demo thumbs, or licensed stock |
| IA drift | Every implementation ticket must re-check `docs/INFORMATION_ARCHITECTURE.md` |
| Naming collision | Legacy `components/garden-card.tsx` ≠ future `components/garden-ui/garden-card.tsx` |
| Token drift | Code source of truth remains `app/globals.css` oklch — Figma hex is reference only |

---

## Final recommendations

### What should influence Garden UI primitives?

- Rounded cards: `rounded-2xl`, `border-primary/10`, `shadow-sm` or `.shadow-garden` from `19:63`
- Horizontal rows: thumb + title + subtitle + chevron from `2:9471`
- Metric shortcut circles from `19:63` (Water/Light/Plants → adapt to garden metrics)
- Progress bar optional; prefer `StatusChip` text when space is tight

### What should influence Today?

- “Alerts for today” list structure from `2:9471`
- Date header + muted task rows from `40:932` (structure only, not colors)
- Single primary action per brief region

### What should influence Care?

- Scan CTA band from `2:9471` on Care landing
- Full camera overlay from `2:9348`
- Care schedule toggle rows from `123:514` (deterministic copy, not AI diagnosis)

### What should influence Setup?

- Field order from `123:514`: photo → name → type → space → care preferences
- Pill primary CTA pattern

### What should influence Plan?

- Hero band + grid card rhythm from `12:12` (seasonal, not commerce)
- Existing `plan-page-client.tsx` gradient header is already aligned — light polish only

### What should be ignored?

- All items in [Ignore list](#ignore-list) above
- Literal Figma-generated React/Tailwind from MCP

### First implementation tickets (ordered)

1. **Shared card primitives and tokens** — `app/globals.css` aliases (`.shadow-garden`, status tokens), `components/garden-ui/` surfaces
2. **Garden dashboard card refresh** — `garden-spaces.tsx` using `GardenCard`, `PlantPhotoCard`, `ProgressMeter`
3. **Today reminder / task-card refresh** — `today-brief-*` using `TodayReminderRow`, `CareTaskCard`
4. **Care scan entry + camera overlay shell** — `plant-identify-panel.tsx`, Care landing `ScanEntryCard`
5. **Setup / Plan empty states and category cards** — `garden-setup-wizard.tsx`, `plan-page-client.tsx`, `LocationCategoryCard`, `EmptyStatePanel`

---

## Phase 3B acceptance

| Criterion | Status |
|-----------|--------|
| Scoped P0/P1 inventory with node IDs | Done |
| Frame-by-frame notes | Done (8 frames) |
| Figma deep links (no expiring assets) | Done |
| App route mapping | Done |
| Pattern recommendations + ignore list | Done |
| Licensing notes | Done |
| Production code unchanged | Done |
| `garden-v2-design-system-map.md` updated | See design-system map Phase 3B section |

---

## Validation

| Check | Result |
|-------|--------|
| Production code changed | None (docs only) |
| `npm run typecheck` | Pass |
| `npm run build` | Pass |
| `npm run lint` | Pass (0 errors, 34 pre-existing warnings) |

---

## Related docs

- [figma-relevance-check.md](./figma-relevance-check.md) — Phase 3B-Lite scope and decision
- [garden-v2-design-system-map.md](./garden-v2-design-system-map.md) — consolidated tokens and component candidates
- [demo-repo-asset-audit.md](./demo-repo-asset-audit.md) — code reference patterns (read-only)
- [INFORMATION_ARCHITECTURE.md](../INFORMATION_ARCHITECTURE.md) — canonical tab loop
