# Figma Relevance Check — Momma D Gardening (Phase 3B-Lite)

High-level inventory via Figma MCP against team duplicate files. This is a **relevance check only** — not a full design-system extraction or implementation pass.

**Frame-level detail:** See [figma-inventory.md](./figma-inventory.md) (Phase 3B scoped inventory).

**MCP auth:** `jacob@darlingmt.com` (Darling Martech, Full seat)

**Product rules:** Care not Doctor; no BioVision / Neural / Bio-Asset language; do not import from `reference/garden-app-v2`.

---

## Access summary

| File | `fileKey` | Pages | MCP result |
|------|-----------|-------|------------|
| Plant Tracker - App Concept (Community) | `ndhaxwzq62jLf7eJsK1f6D` | Cover | Readable |
| Plant Care App (Community) | `fMBBsQOQxCw3t2VS2qOTuk` | Page 1 | Readable |
| Gardening App (Community) | `qxr6Eyc9rWzUFSNZLGEZDX` | Page 1 | Readable |

**Design context captured** (screenshots via MCP) for: `2:9471`, `2:9348`, `19:63`, `40:932`, `123:514`, `13:82`.

Asset URLs from MCP expire in ~7 days; re-fetch before implementation sprints.

---

## File 1: Plant Tracker - App Concept (Community)

- **URL:** https://www.figma.com/design/ndhaxwzq62jLf7eJsK1f6D/Plant-Tracker---App-Concept--Community-
- **fileKey:** `ndhaxwzq62jLf7eJsK1f6D`
- **Pages:** Cover only (`1:43`)

| Frame | Node ID | Screenshot / context | Maps to | Rating | Rec. | Priority | Notes |
|-------|---------|-------------------|---------|--------|------|----------|-------|
| Plugin / file cover | `1:44` | Marketing cover with phone mockups | — | **Ignore** | ignore | — | Portfolio/presentation only; not app screens |
| Phone Perspective (instances) | `2:74`, `2:90`, etc. | Thumbnail previews on cover | — | **Ignore** | ignore | Mood reference only |

**Typography / color / cards:** Cover uses Literata-style headline on green field — useful only as **mood** (warm green, editorial headline). No extractable app components.

**Verdict for this file:** **Mood-only.** Do not drive implementation.

---

## File 2: Plant Care App (Community)

- **URL:** https://www.figma.com/design/fMBBsQOQxCw3t2VS2qOTuk/Plant-Care-App--Community-
- **fileKey:** `fMBBsQOQxCw3t2VS2qOTuk`
- **Pages:** Page 1 — single artboard `Plant Care App (Dribbble shot)` containing **2 mobile screens**

Community description: plant care tips + identify plants in a snap (Nickelfox).

| Frame | Node ID | Screenshot / context | Maps to | Rating | Rec. | Priority | Notes |
|-------|---------|-------------------|---------|--------|------|----------|-------|
| Homepage | `2:9471` | My Plants home: header, scan CTA, popular plants carousel, room categories, alerts list, bottom nav (Home/Saved/Explore/Profile) | Today (partial), Garden (categories), Care (scan CTA) | **Useful** | adapt | P0 | Strongest file for Momma D tone: soft green `#61af2b`, DM Sans-like type, rounded cards. **Ignore** bottom nav IA (not Today/Garden/Plan/Care). Map alerts → Today brief rows |
| Scan (identify) | `2:9348` | Full-screen camera, dashed scan line, shutter, gallery thumb | Care → `plant-identify-panel.tsx` | **Useful** | adapt | P0 | Good identify flow layout; rename "Identify the plant" (not neural/sci-fi). No diagnosis path |
| Dribbble decorative bg | `2:98` + vectors | Leaf pattern background | — | **Ignore** | ignore | — | Not for production UI |

**Design tokens observed (Homepage + Scan):**

| Token | Figma value | Momma D target |
|-------|-------------|----------------|
| Primary green | `#61af2b` | Map to `--primary` oklch sage (close) |
| Muted text | `#628093`, `#8c8c8c` | `--muted-foreground` |
| Card radius | `12px` (`rounded-xl`) | Align with `rounded-2xl` garden surfaces |
| Scan CTA band | `#eef7e8` | `--primary/10` tint |
| Typography | DM Sans family | Keep system sans unless adding one display font later |

**Navigation:** 4-tab bar (Home / Explore / Saved / Profile) — **do not copy**; keep canonical 4-tab shell.

**Empty states:** Not shown in this file.

---

## File 3: Gardening App (Community) — primary source

- **URL:** https://www.figma.com/design/qxr6Eyc9rWzUFSNZLGEZDX/Gardening-App--Community-
- **fileKey:** `qxr6Eyc9rWzUFSNZLGEZDX`
- **Pages:** Page 1 — **~26 numbered mobile frames** (`1`–`26`) plus symbols; branded **Plantio** (third-party app shell)

Frames are numbered, not named — mapping uses visible titles from layer text.

### Useful frames (inspected via metadata + design context)

| Frame | Node ID | Screenshot / context | Maps to | Rating | Rec. | Priority | Notes |
|-------|---------|-------------------|---------|--------|------|----------|-------|
| My Garden home | `19:63` | "My Garden" header; Water/Light/Plants icon row; plant image grid; list cards with water-level progress; center FAB with scan brackets; bottom nav (home/book/people/shop) | Garden (`garden-spaces.tsx`), partial Today | **Useful** | adapt | P0 | Rename "Create an Aepod" placeholder copy. **Ignore** shop tab & e-commerce. Progress bar → planting status chip |
| Water Plants (task list) | `40:932` | Colored task rows, checkmarks, date header "Saturday, May 21", green FAB | Today (`today-brief-card.tsx`, tasks) | **Useful** | adapt | P1 | Task-card colors are loud; borrow list + check pattern only. Not "Create with Gardening App" copy |
| Add plant form | `123:514` | Photo upload, name/type/location fields, Watering/Sunlight/Nutrients toggle rows, ADD CTA | Setup / future `add-planting-dialog` | **Useful** | adapt | P1 | Strong 4-question planting flow (maps to demo repo PlantCatalogModal). Fix "Nutreints" if reused as copy only in Figma |
| Plant detail (hero + metrics) | `13:82` | Hero image, title, description, Humidity/Height/Temperature stat chips | Garden plant detail (future modal) | **Maybe useful** | adapt | P2 | Hero + metric chips only; ignore lorem and "Aepod" branding |
| New on Plantio (feed) | `12:12` | Promo banner, product grid, My Garden/My Plants segment | Today (secondary) | **Maybe useful** | adapt | P2 | Marketing tiles — simplify for Today "seasonal tips" not commerce |
| Frame `5` | `12:12` | Same family as above | Plan (seasonal cards) | **Maybe useful** | adapt | P2 | Card grid rhythm only |

### Maybe useful (metadata only — not design-context sampled)

| Frame | Node ID | Inferred from layer text | Maps to | Rating | Rec. | Priority | Notes |
|-------|---------|------------------------|---------|--------|------|----------|-------|
| Login / Register | `31:756`, `2:9` | Plantio auth | — | **Ignore** | ignore | — | Out of scope; demo uses `/setup` wizard |
| Shop Plants / Indoor Plants | `7:74`, `30:651`, `14` | E-commerce grid, prices | — | **Ignore** | ignore | — | Not Momma D product |
| Water Plants (alt) | `123:514` | Same as `8` — add form | Care / Setup | **Useful** | adapt | P1 | Duplicate of row above |
| Calendar / groups / social | `121:1912`, `121:2068`, `124:1002`, etc. | Groups, messages, articles | — | **Ignore** | ignore | — | Social/commerce noise |
| Frame `22` | `124:1002` | Contains "Today" label in sublayers | Today | **Maybe useful** | adapt | P3 | Inspect deeper only if calendar phase needs Figma parity |

### Shared UI / design system (Gardening App)

| Pattern | Node examples | Maps to | Rating | Rec. | Priority | Notes |
|---------|---------------|---------|--------|------|----------|-------|
| Bottom nav + center FAB | `Group 12` variants on many frames | `garden-bottom-nav.tsx`, `garden-quick-action-menu.tsx` | **Maybe useful** | adapt | P2 | **Do not** copy 5-icon shop nav. Consider FAB cutout + scan affordance only |
| Sage primary | `#5b8e55`, `#61b458` | `app/globals.css` | **Useful** | adapt | P0 | Aligns with existing oklch primary |
| Card shadow | `5px 21px 52px -9px rgba(0,0,0,0.08)` | Card components | **Useful** | adapt | P1 | Soft elevation for garden cards |
| Status chips | `$ 65.00` price chips on shop frames | — | **Ignore** | ignore | — | E-commerce only |
| Plant thumbnails | Rounded rects ~15–20px radius | `garden-spaces.tsx` plantings | **Useful** | adapt | P1 | Photo-forward planting rows |
| Icon set | vuesax linear icons | lucide-react (existing) | **Maybe useful** | adapt | P2 | Map semantically, don't import vuesax assets |
| Empty states | Not explicit | `components/ui/empty.tsx` | — | — | — | No dedicated empty frames found |

**Typography (Gardening App):** SF UI Display / SF Pro — close to current system stack. Bold 28px screen titles with green accent word (`My **Garden**`, `Water **Plants**`).

---

## Cross-file pattern summary

| Pattern | Best source | Momma D use |
|---------|-------------|-------------|
| Today brief + alerts | Plant Care `2:9471` | Alert rows, primary CTA band |
| Garden spaces + plant cards | Gardening `19:63` | Grid + list + progress/status |
| Care identify | Plant Care `2:9348` | Camera sheet layout |
| Setup / add planting | Gardening `123:514` | 4-step planting form |
| Plan seasonal hero | Gardening `40:932`, `12:12` | Hero band + timeline cards (already in plan client) |
| Bottom nav polish | Gardening `19:63` | FAB + tab bar shape only — **not** tab labels |
| Tokens (green + radius + shadow) | All three | Consolidate in `garden-v2-design-system-map.md` when doing full inventory |

---

## Screenshots / design-context references

Captured via `get_design_context` (includes embedded screenshot in MCP response):

| fileKey | nodeId | Screen |
|---------|--------|--------|
| `fMBBsQOQxCw3t2VS2qOTuk` | `2:9471` | Homepage |
| `fMBBsQOQxCw3t2VS2qOTuk` | `2:9348` | Scan / identify |
| `qxr6Eyc9rWzUFSNZLGEZDX` | `19:63` | My Garden |
| `qxr6Eyc9rWzUFSNZLGEZDX` | `40:932` | Water Plants tasks |
| `qxr6Eyc9rWzUFSNZLGEZDX` | `123:514` | Add plant form |
| `qxr6Eyc9rWzUFSNZLGEZDX` | `13:82` | Plant detail |

Re-run before implementation: `get_design_context` with `fileKey` + `nodeId` from tables above.

---

## Decision

### Should we do a full Figma inventory?

**Yes — but scoped**, not exhaustive node export.

- **Yes** for: `fMBBsQOQxCw3t2VS2qOTuk` (2 screens) + `qxr6Eyc9rWzUFSNZLGEZDX` (~8–10 frames listed above).
- **No** for: `ndhaxwzq62jLf7eJsK1f6D` (cover only), shop/auth/social frames, and full symbol/component libraries.

A full inventory should add **node IDs**, **screenshots**, and token tables — extend `docs/design/garden-v2-design-system-map.md` when that phase starts.

### Frames to inspect deeper (next MCP pass)

| Priority | fileKey | nodeId | Why |
|----------|---------|--------|-----|
| P0 | `fMBBsQOQxCw3t2VS2qOTuk` | `2:9471` | Today + Garden category/alerts patterns |
| P0 | `fMBBsQOQxCw3t2VS2qOTuk` | `2:9348` | Care identify |
| P0 | `qxr6Eyc9rWzUFSNZLGEZDX` | `19:63` | Garden home |
| P1 | `qxr6Eyc9rWzUFSNZLGEZDX` | `123:514` | Add planting dialog |
| P1 | `qxr6Eyc9rWzUFSNZLGEZDX` | `40:932` | Today task list styling |
| P2 | `qxr6Eyc9rWzUFSNZLGEZDX` | `13:82` | Plant detail metrics |
| P2 | `qxr6Eyc9rWzUFSNZLGEZDX` | `12:12` | Seasonal/promo cards |
| P3 | `qxr6Eyc9rWzUFSNZLGEZDX` | `124:1002` | Calendar/today sub-screen if needed |

### Patterns → Garden UI primitives (`components/garden-ui/*`)

- Rounded **card** with soft shadow (`rounded-2xl`, light border, `shadow-sm`)
- **Horizontal list row**: thumb + title + subtitle + chevron (alerts, plantings)
- **Segmented room/category row** with icon in tinted circle (adapt to **spaces**, not rooms)
- **Progress / status bar** for planting health (optional; prefer text chips per guardrails)
- **Primary CTA band** (light green tint + bold label) for scan/identify entry
- **FAB / center action** shape from Gardening nav (optional; align with `garden-quick-action-menu.tsx`)

### Patterns → Care

- **Scan screen** layout from `2:9348` → `components/guide/plant-identify-panel.tsx`
- Toggle **care schedule rows** from `123:514` → future care tips / placement helpers (deterministic copy, not AI diagnosis)
- Metric chips (humidity/temperature) from `13:82` only if we add plant detail — low priority

### Patterns → Setup / Plan

- **Add planting form** field order from `123:514` → `components/setup/garden-setup-wizard.tsx` / future dialog (name, type, space, care toggles)
- **Plan hero band** already exists in code; optional polish from `40:932` date header + colored task rows (subtle only)

### Patterns → Today

- **Alerts for today** list from `2:9471` → `today-brief-card.tsx` / `today-brief-parts.tsx`
- Task checklist rows from `40:932` (muted colors, not literal pink/peach blocks)

### Mood-only (do not drive implementation)

- **Plant Tracker** cover (`ndhaxwzq62jLf7eJsK1f6D`) — editorial/mood only
- Plantio branding, shop/e-commerce frames, social/messaging frames in Gardening App
- Literal "Plantio", "Aepod", price tags, VR/gradient marketing art on some frames

---

## Validation (this phase)

| Check | Result |
|-------|--------|
| Production code changed | None (docs only) |
| `npm run typecheck` | Pass |
| `npm run build` | Pass |
| `npm run lint` | Pass (pre-existing warnings only) |

---

## Related docs

- `docs/design/demo-repo-asset-audit.md` — code reference patterns (read-only)
- `docs/design/garden-v2-design-system-map.md` — token map draft (update after deeper frame pass)
- `docs/design/figma-inventory.md` — earlier provisional inventory (pre–team fileKey access)
