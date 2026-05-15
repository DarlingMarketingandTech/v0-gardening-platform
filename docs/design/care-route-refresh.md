# Care route refresh (Garden V2 Phase 6A)

## Hierarchy

1. **Header** — Title `Care` (from view model headline) and short friendly summary for Momma D.
2. **Scan entry band** — `CareScanEntryCard`: tinted surface, primary “Identify a plant” (opens camera overlay shell), secondary “Upload a photo” (scrolls to Plant Identify and opens the file picker).
3. **Tools** — `CareToolGrid`: ordered tiles driven by `CareViewModel.tools` (Plant check, Symptom check, Pest lookup, Plant Identify). Each tile scrolls to the matching in-page panel.
4. **Tool panels** — Existing panels unchanged in behavior; anchored with `id="care-tool-{toolId}"` for scroll targets.
5. **Reading room** — Articles (`GuideArticlesPanel`) in a muted, dashed `AppSurface` so tools stay visually primary.
6. **Snippets** — Symptom check panel already hosts knowledge snippets; no duplicate section.

## Component map

| Piece | File |
| --- | --- |
| Care page composition | `components/care/care-page-client.tsx` |
| Scan CTA band | `components/care/care-scan-entry-card.tsx` |
| Tool grid | `components/care/care-tool-grid.tsx` |
| Camera overlay shell | `components/care/camera-overlay-shell.tsx` |
| Plant Identify integration | `components/guide/plant-identify-panel.tsx` (ref + optional initial image data URL) |
| Tool labels / ordering | `lib/garden-os/mappers/map-guide-tools-to-care-view-model.ts` |
| Garden UI primitives | `components/garden-ui/*` (`AppSurface`, `ActionPill`, etc.) |

## Figma patterns adapted

From `docs/design/figma-inventory.md`:

- **Plant Care Homepage (2:9471)** — Scan CTA band: strong primary + secondary actions on a tinted hero-style strip; replicated with `AppSurface variant="tinted"` and `ActionPill`s (no remote artwork).
- **Plant Care Scan (2:9348)** — Full-screen scan overlay: top bar (flash placeholder, title, close), horizontal guide line in the viewport center, bottom row (gallery, shutter, rotate). Implemented with `lucide-react`, CSS tokens, and portal render to `document.body`.

## Intentionally ignored / deferred

- **Different IA / nav** — Figma may imply alternate tab models; this phase keeps the canonical Today → Garden → Log → Guide shell.
- **Vuesax / bespoke icon set** — Replaced with Lucide for consistency with the rest of the app.
- **Gallery thumb / rotate / flash behavior** — Placeholder controls only (disabled or preview-only); no new capture pipelines beyond a single JPEG frame from `getUserMedia` when available.
- **AI diagnosis** — No new diagnosis flows; Plant Identify continues to use existing server action behavior where configured.

## QA notes

- **`/my-garden/care`** — Confirm scan band visible above tools; tools grid scrolls each panel into view (mobile and desktop).
- **Identify a plant** — Opens overlay; shutter captures when preview is ready; closing returns without errors; **Escape** closes overlay.
- **Camera denied / unsupported** — Overlay shows friendly copy and “Upload a photo”; action closes overlay, scrolls to Plant Identify, opens file picker.
- **Upload a photo** (scan band) — Same upload path without opening overlay.
- **Demo / localStorage** — Care view model hydration unchanged (`useHydratedCareViewModel`).
- **Regression** — Pest lookup, placement helper, snippets, articles still render and function as before.

## Validation commands

```bash
npm run typecheck
npm run build
npm run lint
```
