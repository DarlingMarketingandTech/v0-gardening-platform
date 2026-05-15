# Garden V2 Design System Map

Unified token and component map for **Momma D's Garden** UI phases. Combines:

1. **Figma community sources** (Momma D Gardening project files — visual intent)
2. **`reference/garden-app-v2` audit** (`docs/design/demo-repo-asset-audit.md`)
3. **Current app** (`app/globals.css`, shadcn UI, garden shell)

This document guides implementation; it does not change production code.

---

## Design principles (all sources agree)

- Mobile-first, calm, warm, Momma-D-readable.
- One clear action per screen region; depth via Care and Guide, not extra tabs.
- **Care** language only — no Doctor, BioVision, Neural, or Bio-Asset terms.
- Demo-first tokens in code until Figma team variables are confirmed via MCP.

**Phase 3B:** Measured values below come from scoped MCP `get_design_context` on frames listed in [figma-inventory.md](./figma-inventory.md). Code source of truth remains `app/globals.css`.

---

## Figma-informed tokens (Phase 3B)

Consolidated from Plant Care (`fMBBsQOQxCw3t2VS2qOTuk`) and Gardening App (`qxr6Eyc9rWzUFSNZLGEZDX`) P0/P1 frames. Hex values are **reference** — implement via existing oklch semantic tokens.

### Colors

| Figma value | Frames | Momma D target |
|-------------|--------|----------------|
| `#61af2b` | `2:9471` | `--primary` (Plant Care green; close to oklch sage) |
| `#5b8e55`, `#61b458` | `19:63`, `123:514`, `40:932` | `--primary` / primary buttons |
| `#eef7e8` | `2:9471` | `bg-primary/10` — scan CTA band, category tints |
| `#eaf3ea` | `123:514` | Toggle track / muted primary surface |
| `#333`, `#12121d` | `2:9471`, `19:63` | `--foreground` |
| `#628093`, `#8c8c8c`, `#969c96`, `#9ca199` | Multiple | `--muted-foreground` |
| `#fafafa`, `#f6f8f5` | `19:63`, `13:82` | `--background` / sheet base |
| `#ffffff` | Cards | `--card` |
| `#f8f8f8` | `2:9471` | Popular plant card fill → `bg-muted/30` |
| Category tints `#fcf1e3`, `#e6eafa`, `#f8e8f8` | `2:9471` | Space icon circles — map to `primary/10`, `accent/10`, custom muted hues |
| Task fills `#e7bdbb`, `#e7c2a0` | `40:932` | **Ignore** — use neutral card + status chip |
| Metric teal `#91d0cc`, `#5fbab4` | `13:82` | **Ignore** — use primary/muted palette |

### Typography

| Role | Figma (measured) | Momma D target |
|------|------------------|----------------|
| Screen title | 28px bold, accent word in primary (`19:63`, `40:932`, `123:514`) | `text-xl md:text-2xl font-bold`; optional `text-primary` span |
| Section title | 18px medium (`2:9471`) | `text-lg font-semibold` |
| Card title | 16–18px medium/semibold | `text-base font-semibold` |
| Row title | 14px bold (`2:9471`) | `text-sm font-medium` |
| Subtitle / helper | 12–14px regular, muted | `text-sm text-muted-foreground` |
| Eyebrow / link | 12px medium primary, underline | `text-xs text-primary` |
| Font families | DM Sans (Plant Care), SF UI Display (Gardening) | **Keep system sans** — no new font deps in Phase 4 |

### Spacing

| Pattern | Figma | Target |
|---------|-------|--------|
| Page horizontal padding | 20–37px | `px-4` (16px) mobile, `px-5` where needed |
| Section gap | ~47px between major blocks | `space-y-6` to `space-y-8` |
| Card internal padding | 12–32px | `p-4` default garden cards |
| List row height | ~66px alert rows | `min-h-14` touch targets |
| Metric shortcut diameter | 63px | `size-14` or `size-16` circles |
| Alert thumb | 50px | `size-12` rounded-md |

### Radii

| Element | Figma | Target |
|---------|-------|--------|
| Garden cards | 12–22px | `rounded-2xl` (16px) — standard garden surface |
| Inputs / small controls | 8–11px | `rounded-lg` |
| Thumbnails | 6–15px | `rounded-md` to `rounded-xl` |
| Pills / ADD CTA | 31–39px | `rounded-full` |
| Bottom sheet (future) | — | `rounded-3xl` top corners |
| Camera gallery thumb | 9px | `rounded-lg` |

### Shadows

| Name | Figma | Target |
|------|-------|--------|
| Garden card | `5px 21px 52px -9px rgba(0,0,0,0.08)` (`19:63`, `123:514`) | Optional `.shadow-garden` in `globals.css` or `shadow-sm` |
| Nav bar | `0px -4px 14px rgba(0,0,0,0.1)` (`2:9471`) | `border-t` + `bg-card/95 backdrop-blur` (existing) |
| Presentation frame | `0px 60px 140px rgba(31,31,31,0.1)` | **Ignore** — device mockup only |

### Card surfaces

Default garden card recipe (from `2:9471`, `19:63`):

```
rounded-2xl border border-primary/10 bg-card shadow-sm
```

| Variant | Use |
|---------|-----|
| Inset panel | `rounded-xl border border-border/80 bg-muted/10` |
| CTA band | `rounded-lg bg-primary/10` + primary text |
| Popular plant tile | `rounded-xl bg-muted/30` + overlapping photo |
| Care schedule row | White card, garden shadow, 65px icon square `rounded-xl bg-primary` |

### Plant image treatments

| Pattern | Figma | Target |
|---------|-------|--------|
| Grid thumb | 11px radius, object-cover | `rounded-lg overflow-hidden aspect-square` |
| List thumb | 15px radius, ~123×105 | `rounded-xl size-28 object-cover` |
| Alert thumb | 6px radius, 50px | `rounded-md size-12` |
| Hero | Full-width, sheet overlap | `aspect-[4/3]` + bottom sheet `rounded-t-3xl` |
| Overlap on card | Photo extends above card edge | Optional decorative — defer |

### Status / progress indicators

| Pattern | Source | Guidance |
|---------|--------|----------|
| Progress bar | `19:63` | 3px height, grey track, primary fill — optional; prefer chip when crowded |
| Status chip | `13:82` | Circle icon + label + value row |
| “Fits well” label | `2:9471` | Small primary text badge on plant cards |
| “New” pill | `12:12` | `rounded-full bg-primary text-primary-foreground text-xs px-2` |
| Task completion | `40:932` | Check icon in circle — muted, not colored card backgrounds |

### Task / reminder cards

| Element | Figma source | Structure |
|---------|--------------|-----------|
| Alert row | `2:9471` | thumb \| title + subtitle \| chevron |
| Task row | `40:932` | thumb \| title + meta \| action (check/drop) |
| Date header | `40:932` | Bold date line above task group |

Use **muted** `bg-card` rows, not saturated pink/peach blocks.

### Scan / camera treatment

From `2:9348`:

| Element | Spec |
|---------|------|
| Background | Full-bleed camera with dark gradient scrims |
| Scan line | Horizontal white line, ~50% width, centered vertically |
| Top bar | Flash (optional), centered title 16px white, close control |
| Shutter | 70px white ring, centered bottom |
| Gallery | 48px thumb, bottom-left, `rounded-lg` |
| Secondary | Rotate control bottom-right — optional |

Copy: “Identify a plant” — not neural/sci-fi framing.

### Empty states

No dedicated empty frames in scoped inventory. Prescribe:

- One calm sentence + one CTA (e.g. “No plantings yet” → “Add a space”)
- Optional small `lucide-react` icon, no illustration overload
- Use `EmptyStatePanel` wrapper over `components/ui/empty.tsx`

### Icon direction

| Figma | Momma D |
|-------|---------|
| vuesax linear/bulk PNGs | `lucide-react` — Home, Search, Plus, Scan, Droplet, Sun, Leaf, ChevronRight, Camera, X, RotateCcw |
| FAB scan brackets | `Scan` or `ScanLine` icon in `garden-quick-action-menu.tsx` |
| Active nav | Filled primary icon + label; inactive muted |

Do not import vuesax assets.

### Motion / interactions

| Pattern | Guidance |
|---------|----------|
| Toggle switches | `123:514` — use shadcn `Switch`; CSS transition only |
| Carousel dots | `13:82` — optional for photo gallery; defer |
| Card press | Subtle `active:scale-[0.98]` or opacity — CSS only |
| Page transitions | No Figma motion specs — avoid adding `motion` lib in Phase 4 unless needed |

---

## Component candidates (Phase 4+)

Specs only — **do not create files** until implementation phase. New primitives live under `components/garden-ui/` to avoid collision with legacy `components/garden-card.tsx`.

| Candidate | Figma source | Props / structure (draft) | Target home |
|-----------|--------------|---------------------------|-------------|
| `GardenCard` | `19:63` | `title`, `subtitle?`, `imageUrl?`, `progress?`, `onPress?` — white card, garden shadow | `garden-ui/garden-card.tsx` |
| `PlantPhotoCard` | `19:63`, `13:82` | `name`, `image`, `badge?`, `variant: 'grid' \| 'list' \| 'hero'` | `garden-spaces.tsx`, future detail |
| `CareTaskCard` | `40:932` | `title`, `meta`, `completed`, `onToggle` — neutral surface | `today-brief-parts.tsx` |
| `TodayReminderRow` | `2:9471` | `thumb`, `title`, `subtitle`, `href?` | `today-brief-card.tsx` |
| `GardenMetricShortcut` | `19:63` | `icon`, `label`, `onPress?` — circle + label | `garden-page-client.tsx` |
| `ScanEntryCard` | `2:9471` | `onScan` — primary/10 band, bold CTA | `care-page-client.tsx` |
| `CameraOverlayShell` | `2:9348` | `onCapture`, `onGallery`, `onClose` | `plant-identify-panel.tsx` |
| `LocationCategoryCard` | `2:9471` | `icon`, `tint`, `name`, `count` — adapt to **spaces** | `garden-spaces.tsx` |
| `StatusChip` | `13:82`, `19:63` | `icon`, `label`, `value` | `garden-ui/status-chip.tsx` |
| `ProgressMeter` | `19:63` | `value` 0–1, `label?` — thin bar | Planting rows (optional) |
| `EmptyStatePanel` | Synthesized | `title`, `description`, `action` | Wrap `components/ui/empty.tsx` |

### Implementation ticket ordering

1. Shared card primitives + token aliases (`globals.css`, `garden-ui` surfaces)
2. Garden dashboard card refresh (`garden-spaces.tsx`)
3. Today reminder / task-card refresh (`today-brief-*`)
4. Care scan entry + camera overlay shell (`plant-identify-panel.tsx`)
5. Setup / Plan empty states + category cards (`garden-setup-wizard.tsx`, `plan-page-client.tsx`)

---

## Color tokens

### Current app (source of truth today)

Defined in `app/globals.css` as oklch semantic tokens (Tailwind v4 `@theme inline`).

| Token | Light (approx.) | Role |
|-------|-----------------|------|
| `--background` | Warm near-white | Page canvas |
| `--foreground` | Deep green-gray | Body text |
| `--primary` | Sage green | CTAs, active nav, icons |
| `--primary-foreground` | White | Text on primary |
| `--secondary` | Warm sand | Secondary surfaces |
| `--accent` | Honey / wheat | Highlights, badges |
| `--muted` | Soft gray-green | Inset panels |
| `--muted-foreground` | Mid gray-green | Helper text |
| `--destructive` | Red | Errors only |
| `--border` | Light sage border | Cards, dividers |
| `--card` | Slightly warm white | Card fill |

### Figma community (inferred)

| Pattern | Typical hex in plant apps | Map to |
|---------|---------------------------|--------|
| Page background | `#FAF6F0` – `#F5F1EA` | `--background` / warm gradient shells |
| Primary green | `#4A7C59` – `#5B8A67` | `--primary` (already close in oklch) |
| Accent gold | `#F8E0A8` / `#705C30` text | `--accent` / `--accent-foreground` |
| Card white | `#FFFFFF` | `--card` |
| Text primary | `#292524` (stone-800) | `--foreground` |
| Text muted | stone-400–500 | `--muted-foreground` |

### Demo repo reference (`reference/garden-app-v2/src/index.css`)

| V2 token | Value | Action |
|----------|-------|--------|
| `--color-primary` | `#4a7c59` | **Adapt** → verify against `--primary` oklch |
| `--color-primary-dark` | `#3a6245` | **Add** optional `--primary-dark` for hover/pressed |
| `--color-bg-warm` | `#faf6f0` | **Adapt** → `--background` or shell gradient |
| `--color-tertiary` | `#705c30` | **Adapt** → `--accent-foreground` |
| `--color-tertiary-light` | `#f8e0a8` | **Adapt** → `--accent` |
| Synergy green / conflict red | Tailwind green/red-200 borders | **Adapt** → status tokens below |

### Recommended status colors (new semantic aliases)

Add in a future UI phase to `app/globals.css` (names illustrative):

| Token | Use | Notes |
|-------|-----|-------|
| `--status-growing` | `growing`, healthy | `primary/10` bg + `primary` text |
| `--status-ready` | `ready soon`, harvest | `accent/20` bg |
| `--status-watch` | weather / pest watch | amber-50/amber-700 (Today brief) |
| `--status-conflict` | companion clash (Plan grid) | red-100 border only, rare |

---

## Typography tokens

### Current app

| Role | Implementation | Notes |
|------|----------------|-------|
| UI sans | `--font-sans` system stack | No remote font fetch (build-safe) |
| Mono | `--font-mono` system stack | Rare; logs/debug only |
| Page title | `text-xl md:text-2xl font-bold` | Today, Garden headers |
| Card title | `text-base md:text-lg font-semibold` | CardHeader |
| Eyebrow | `text-xs uppercase tracking-wide text-primary` | Plan season label |
| Helper | `text-sm text-muted-foreground` | Subtitles |

### Figma / demo repo (adapt later)

| V2 / Figma pattern | Value | Target |
|--------------------|-------|--------|
| `font-headline` | Literata serif | Optional `next/font` for H1 only — **defer** until performance reviewed |
| `font-body` | Nunito Sans | Stay on system sans unless brand requires |
| Label caps | `text-[10px] font-black uppercase tracking-widest` | **Adapt** → `text-[11px] font-medium uppercase tracking-wide` (less aggressive) |

---

## Radius scale

### Current app (`globals.css`)

| Token | Value | Usage |
|-------|-------|-------|
| `--radius` | `0.625rem` (10px) | Base |
| `--radius-sm` | base − 4px | Chips, small controls |
| `--radius-md` | base − 2px | Inputs |
| `--radius-lg` | base | Default shadcn |
| `--radius-xl` | base + 4px | Large buttons |

### Figma / demo repo

| Pattern | Value | Target |
|---------|-------|--------|
| Cards | `rounded-2xl` (16px) | **Copy** — default garden card radius |
| Modals / sheets | `rounded-[2.5rem]` | **Adapt** → `rounded-3xl` for bottom sheets |
| Pills / nav | `rounded-full` / `rounded-2xl` | **Copy** — bottom nav items |
| Grid cells | `rounded-3xl` | Plan grid (future) |

**Recommendation:** Standardize garden surfaces on `rounded-2xl`; reserve `rounded-3xl` for modals and hero bands.

---

## Shadow / elevation scale

### Current app

Mostly `shadow-sm` on cards; shell uses `backdrop-blur` not heavy shadow.

### Figma / demo repo

| Name | V2 | Target utility |
|------|-----|----------------|
| Soft card | `0 4px 20px rgba(46,50,48,0.06)` | `shadow-sm` or custom `.shadow-garden` in `globals.css` |
| Elevated CTA | `shadow-xl shadow-primary/20` | Primary button only |
| Nav bar | `shadow-soft` + border | `border-t` + `bg-card/95 backdrop-blur` (already in bottom nav) |

**Recommendation:** Max two elevations — `shadow-sm` (cards), `shadow-md` (FAB/menu). Avoid double shadows on nested cards.

---

## Surface styles

| Surface | Classes (target) | Used in |
|---------|------------------|---------|
| Page | `bg-background` or shell gradient `from-primary/5 via-background to-accent/5` | `garden-app-shell.tsx` |
| Default card | `rounded-2xl border border-primary/10 bg-card shadow-sm` | Today, Garden, Plan, Care |
| Hero band | `rounded-2xl border border-primary/15 bg-linear-to-br from-primary/10 via-card to-accent/20` | `plan-page-client.tsx` |
| Inset panel | `rounded-xl border border-border/80 bg-muted/10` | Today “More for today” |
| Dark emphasis | `bg-stone-800 text-white` (demo sidebar) | **Defer** — use only if contrast needed for task panel |
| Glass (V2) | `bg-white/20 backdrop-blur-md` | **Ignore** for v1 — use solid card + blur nav only |

### Future `components/garden-ui/`

Planned thin wrappers (not created in Phase 3B):

| Component | Purpose | Based on |
|-----------|---------|----------|
| `GardenSurface` | Card variant + optional title row | TerraCard audit |
| `GardenHero` | Season / page intro band | Plan header, Figma hero frames |
| `GardenChip` | Filter / stage selection | PlantCatalogModal chips |
| `GardenStatusBadge` | Planting status | Badge + demo statuses |

---

## Navigation patterns

| Pattern | Spec | File |
|---------|------|------|
| Mobile bottom tabs | 4 items: Today, Garden, Plan, Care | `garden-bottom-nav.tsx`, `lib/garden-os/constants/navigation.ts` |
| Desktop top nav | Same four links, horizontal | `garden-top-nav.tsx` |
| Header | Brand + subtitle, sticky | `garden-shell-header.tsx` |
| Quick actions | FAB or menu → Log, identify | `garden-quick-action-menu.tsx` |
| Back drill-down | Text + arrow, not new tab | Future Garden modal only |

**Do not import from Figma files:** Dashboard, Vision, Planner, Calendar as top-level tabs.

---

## Card patterns

| Pattern | Structure | Target component |
|---------|-----------|------------------|
| Brief / Today | Header (title + context) → primary action → secondary CTAs → collapsible details | `today-brief-card.tsx` |
| Space accordion | Section icon + title → space rows → planting list | `garden-spaces.tsx` |
| Tool section (Care) | Intro card → stacked tool panels | `care-page-client.tsx` |
| Plan timeline | Hero → dashed step rows | `plan-page-client.tsx` |
| Setup step | Progress → question → chips/input → Continue | `garden-setup-wizard.tsx` |

---

## Icon & image usage

| Type | Source | Guidance |
|------|--------|----------|
| UI icons | `lucide-react` | 16–24px; `text-primary` when active |
| Space icons | Mapped in `garden-spaces.tsx` | Consistent per `DemoGardenSpaceId` |
| Plant thumbs | Emoji (demo) or photo URL later | Avoid stock-heavy grids |
| Weather | `weather-widget.tsx` | Small, factual, no sensational alerts |
| Identify upload | Camera / Upload icons | Large touch target in `plant-identify-panel.tsx` |

**Ignore from Figma/reference:** AR overlays, fake telemetry icons, “neural” sparkles as default decoration.

---

## Target file matrix

| Area | Route | Page (server) | Client | Shell / UI |
|------|-------|---------------|--------|------------|
| Today | `/my-garden/today` | `app/my-garden/today/page.tsx` | `components/today/*` | `garden-app-shell.tsx` |
| Garden | `/my-garden/garden` | `app/my-garden/garden/page.tsx` | `components/garden/garden-page-client.tsx`, `components/dashboard/garden-spaces.tsx` | same |
| Plan | `/my-garden/plan` | `app/my-garden/plan/page.tsx` | `components/plan/plan-page-client.tsx` | same |
| Care | `/my-garden/care` | `app/my-garden/care/page.tsx` | `components/care/care-page-client.tsx`, `components/guide/*` | same |
| Setup | `/setup` | `app/setup/page.tsx` | `components/setup/garden-setup-wizard.tsx` | Minimal chrome |
| Tokens | — | — | — | `app/globals.css` |
| Primitives | — | — | — | `components/ui/*` |
| Future garden UI | — | — | — | `components/garden-ui/*` (planned) |

**Tailwind config:** No separate `tailwind.config.*`; tokens live in `app/globals.css` via Tailwind v4 `@theme inline`.

---

## Source precedence when implementing

When sources conflict, use this order:

1. `docs/PRODUCT_GUARDRAILS.md` and `docs/INFORMATION_ARCHITECTURE.md`
2. Current `app/globals.css` + working `/my-garden` UI
3. **Phase 3B Figma frame measurements** ([figma-inventory.md](./figma-inventory.md))
4. `docs/design/demo-repo-asset-audit.md` (layout/UX only, not copy or IA)
5. Community Figma thumbnails and tags (palette/mood only)

---

## Implementation phases (design → code)

| Phase | Focus | Primary files |
|-------|--------|---------------|
| 4A | Tokens + `GardenSurface` | `app/globals.css`, `components/garden-ui/` |
| 4B | Shell polish | `components/garden-shell/*` |
| 4C | Today + Garden cards | `components/today/*`, `garden-spaces.tsx` |
| 4D | Plan + add planting dialog | `plan-page-client.tsx`, `garden-ui/add-planting-dialog` |
| 4E | Care identify + tools layout | `care-page-client.tsx`, `guide/*` |
| 4F | Setup wizard visual pass | `garden-setup-wizard.tsx` |

---

## MCP follow-up (design ops)

To sync this map with real Figma variables:

1. Open team duplicate → Dev Mode → enable MCP.
2. `get_variable_defs` per file (team `fileKey`).
3. Update color/radius tables above with exact variable names.
4. Link variables to CSS custom properties in `app/globals.css` (single source in code).

---

## Related

- `docs/design/figma-inventory.md` — per-frame inventory and priorities
- `docs/design/demo-repo-asset-audit.md` — reference code patterns
