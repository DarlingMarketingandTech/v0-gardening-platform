# Garden UI primitives (Phase 4)

Reusable visual building blocks for **Momma D's Garden** surface upgrades. They consume **Garden V2 CSS aliases** in `app/globals.css` (`--garden-*`) so screens stay aligned with the existing oklch semantic palette without a parallel theme system.

**Scope**

- Primitives only — no route redesign in this phase.
- No imports from `reference/garden-app-v2`.
- No expiring Figma asset URLs in production; reference Figma via deep links in design docs, not code.
- Copy uses **Care**, not Doctor; avoid BioVision / Neural / Bio-Asset language.

---

## Token aliases (`app/globals.css`)

| Token | Role |
|-------|------|
| `--garden-bg` | Page canvas → `--background` |
| `--garden-surface` | Default card fill → `--card` |
| `--garden-surface-elevated` | Lifted panels → `color-mix` above card |
| `--garden-surface-muted` | Inset / secondary panels → muted × card mix |
| `--garden-primary` | Sage CTA / emphasis → `--primary` |
| `--garden-primary-dark` | Pressed / stronger primary → primary × black mix |
| `--garden-primary-soft` | Tinted bands / chips → primary wash on card or muted |
| `--garden-water` | Water / hydration cues → `--chart-3` |
| `--garden-attention` | Amber “needs a look” → `--chart-4` |
| `--garden-danger` | Critical / destructive → `--destructive` |
| `--garden-text` | Primary text → `--foreground` |
| `--garden-text-muted` | Supporting text → `--muted-foreground` |
| `--garden-border` | Hairlines → `--border` |
| `--garden-shadow-soft` | Card elevation |
| `--garden-shadow-lifted` | Stronger elevation |
| `--garden-radius-card` | Default garden rounding (~16px) |
| `--garden-radius-pill` | Pills / bars |

Light and `.dark` sections both redefine these aliases so mixes stay readable.

---

## Component list

### `AppSurface`

**Purpose:** Base padded surface for cards, panels, and tap targets (Terra-style “garden card” without owning content semantics).

**Props (summary):** `variant?`, `padding?`, `radius?`, `interactive?`, `className?`, standard `div` props.

**When to use:** Any repeated bordered surface on Today, Garden, Care, Plan, or Setup when shadcn `Card` layout is too opinionated (fixed header slots, heavy py-6).

**When not to use:** Simple one-off layout where `rounded-2xl border bg-card` is enough; full-page backgrounds (use `bg-background` / shell).

---

### `StatusSurface`

**Purpose:** Status-aware panel (`stable`, `needs_water`, `attention`, `critical`) with optional title, description, icon, and action.

**Props:** `status?`, `title?`, `description?`, `icon?`, `action?`, `children?`, `className?`.

**When to use:** Water deficit callouts, Care reminders, weather watch strips, rare destructive confirmations — **one calm sentence + one action**.

**When not to use:** Neutral content blocks without status meaning (use `AppSurface`). Long forms.

---

### `MetricChip`

**Purpose:** Compact metric row (circle icon optional + label + optional value) matching plant-detail style chips from the design inventory.

**Props:** `label`, `value?`, `icon?`, `tone?`, `className?`.

**Tones:** `neutral`, `green`, `water`, `attention`, `danger`.

**When to use:** Humidity / height / temperature style facts; shortcut stats on Garden rows.

**When not to use:** Primary navigation or filters (use toggles / tabs). Long prose.

---

### `StateBadge`

**Purpose:** Tiny pill badge for planting or task state.

**Props:** `children`, `tone?`, `size?`, `className?`.

**When to use:** “Growing”, “Needs water”, “Watch”, inline next to titles.

**When not to use:** Clickable filters — prefer `ActionPill` or existing `Button` patterns.

---

### `ActionPill`

**Purpose:** Rounded CTA shell — primary pill for Setup / Care flows; can render as `button` or Next.js `Link` when `href` is set.

**Props:** `children`, `icon?`, `variant?`, `size?`, `disabled?`, `href?`, `prefetch?`, `type?`, `className?`.

**When to use:** Single prominent actions (“Continue”, “Identify a plant”, “Add to garden”) where full `Button` variants are visually heavy.

**When not to use:** Destructive confirms (use `Button` destructive). Inline text links (`Button` `link` variant).

---

### `SectionCard`

**Purpose:** Headed section scaffold: optional eyebrow, title, description, trailing `action`, then body `children`.

**When to use:** Grouping Today brief regions, Garden space sections, Care tool stacks.

**When not to use:** Entire page chrome — keep shell components separate.

---

### `ProgressMeter`

**Purpose:** Thin linear meter (default 3px track) for water level, light heuristic, task completion, or planting progress. Value is clamped; exposes `role="progressbar"`.

**Props:** `value`, `max?`, `label?`, `tone?`, `showValue?`, `className?`.

**When to use:** Garden list rows with breathing room; Setup / Care when a single numeric indicator helps.

**When not to use:** Dense lists — prefer `StateBadge` or plain copy.

---

### `PlantImageFrame`

**Purpose:** Bordered frame for plant thumbnails or hero crops with lazy `<img>` and local/demo-safe fallbacks (emoji default). **Does not** embed remote Figma URLs.

**Props:** `src?`, `alt` (required), `fallback?`, `size?` (`sm` \| `md` \| `lg` \| `wide`), `className?`.

**When to use:** Garden grids, Today reminders, Care identify previews backed by app/public or user uploads.

**When not to use:** Avatar stacks for people — use `Avatar`.

---

### `EmptyStatePanel`

**Purpose:** Centered empty pattern built on `components/ui/empty.tsx` with garden radius and muted surface.

**Props:** `title`, `description?`, `icon?`, `action?`, `children?`, `className?`.

**When to use:** No plantings, no tasks, Plan timeline gaps, Setup branches waiting for input.

**When not to use:** Inline “no results” inside a dense table row — keep compact copy only.

---

## Import path

```ts
import {
  ActionPill,
  AppSurface,
  EmptyStatePanel,
  MetricChip,
  PlantImageFrame,
  ProgressMeter,
  SectionCard,
  StateBadge,
  StatusSurface,
} from '@/components/garden-ui'
```

---

## Future route usage (examples only — not shipped in Phase 4)

### Today hero card

Use `AppSurface` (`variant="elevated"` or `tinted`) wrapping a `SectionCard` with eyebrow “Today” and `MetricChip` row for water/light/tasks; primary action via `ActionPill`.

### Garden zone card

`AppSurface` + `SectionCard` for space name; `PlantImageFrame` `size="sm"` in rows; `ProgressMeter` `tone="water"` when showing moisture hint; `StateBadge` `tone="stable"` for stage.

### Care scan entry card

`StatusSurface` `status="stable"` or tinted `AppSurface` mimicking the scan CTA band (`bg-[var(--garden-primary-soft)]` pattern already available via `AppSurface` `variant="tinted"`); `ActionPill` `variant="primary"` → `/my-garden/care` identify flow.

### Plan timeline card

`SectionCard` with seasonal eyebrow; `AppSurface` `variant="muted"` for each timeline step; `EmptyStatePanel` when no seasonal tips exist.

### Setup choice card

`AppSurface` `variant="default"` listing options; `ActionPill` for “Continue”; `EmptyStatePanel` if a branch has no spaces yet.

---

## Related docs

- `docs/design/garden-v2-design-system-map.md`
- `docs/design/figma-inventory.md`
- `docs/design/demo-repo-asset-audit.md`
