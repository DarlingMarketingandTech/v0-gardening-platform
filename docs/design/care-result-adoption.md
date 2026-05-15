# Care result adoption (Plant Identify)

This note tracks how the shared **Care** result model and `CareResultCard` are wired for Plant Identify and related scan flows. It is UI and mapping only — no live AI beyond existing PlantNet/Trefle server actions, no new model dependencies, and no database migrations.

## Where `CareResultCard` is used

| Surface | Notes |
| --- | --- |
| **Care → Plant Identify** (`components/guide/plant-identify-panel.tsx`) | Success path maps `IdentifyAndEnrichResult` to `CareResult` (`kind: 'identity'`) and renders `CareResultCard`. |
| **Care → Issue-style flows** | Issue-shaped `CareResult` (`kind: 'issue'`) continues to use the same card (e.g. from care tooling / guides as introduced in Phase 6B). |

## Legacy dashboard entry (Phase 6D)

- **`components/dashboard/plant-identifier.tsx`** no longer opens a separate “coming soon” identify dialog or implies a second result model.
- It shows a short note from `getCareCopy().sections.dashboardIdentifyHint` and an **Open Plant Identify** action (`sections.openPlantIdentify`) linking to **`/my-garden/care`**, where users scroll to **Plant Identify** and get the shared `CareResultCard` flow.

## How Plant Identify maps into `CareResult`

- **Mapper:** `lib/care/map-plant-identify-to-care-result.ts`
  - `mapPlantIdentifyToCareResult(result, imageUrl?)` returns `CareResult` with `kind: 'identity'` when `identification.topMatch` is present; otherwise `null` (caller shows a no-match message).
  - Optional `imageUrl` should be the same data URL the user is seeing in the panel (including captures from `CameraOverlayShell` via `pendingIdentifyImage` → `initialImageDataUrl`).
  - **What we noticed:** Built from match position vs other candidates plus the server `disclaimer` string (no change to identify API).
  - **Care details:** When enrichment exists, family, genus, and growth notes are folded into the **Upkeep** row of `careDetails` so the “Care details” block stays honest and readable without inventing light/water fields.
  - **Confidence:** Taken from the top candidate’s `confidence` (already on a 0–100 style scale from PlantNet); `CareResultCard` normalizes display.

- **Types:** `lib/care/care-result-types.ts` — `CarePlantIdentity` includes optional `whatWeNoticed` for identity flows; `CareResultCard` renders it under the label from `getCareCopy().sections.whatWeNoticed`.

- **Copy:** User-facing labels come from `lib/care/care-copy.ts` (e.g. “What we noticed”, “Care details”, “Match confidence”, “Save to garden soon”). Avoid clinical framing in new strings.

## What remains mocked or offline

- **PlantNet / Trefle not configured:** `identifyFromImageBase64` returns `topMatch: null` and `provenance: 'unavailable'`. The panel shows `identifyNoMatchBody` and an optional **sample card** (`buildSamplePlantIdentifyCareResult`) that omits confidence and is labeled as sample-only.
- **Sample card:** `buildSamplePlantIdentifyCareResult` is deterministic Momma-D-toned copy for layout teaching — not a real identification and not tied to the user’s photo beyond optional preview context.

## Camera overlay (Phase 6A polish)

- `components/care/camera-overlay-shell.tsx`: title is centered in a three-column grid between flash and close; when the stream is live, an “Upload from library instead” action uses copy from `care-copy` and reuses the same fallback path as before (stop stream → host opens the file picker).

## Future AI integration notes

- Keep **`CareResult` as the stable render contract** for any new scan or model output.
- **Validate model JSON** on the server before mapping into `CareResult`; fail closed to a friendly message instead of rendering half-parsed fields.
- Preserve **English internal keys / types** while localizing only user-facing strings via `getCareCopy` (or a future i18n layer).
- **Never imply certainty from a single image** — continue to surface disclaimers and conservative confidence behavior.

## QA checklist

- [ ] Care → Plant Identify: choose photo → Identify → with API configured, `CareResultCard` shows match, optional “Other possible matches” collapsible when there are multiple candidates.
- [ ] With no PlantNet key: Identify returns no top match → friendly body + disclaimer + “See a sample card” → sample banner + sample `CareResultCard` without fake confidence.
- [ ] Camera scan: capture from overlay still fills Plant Identify preview (`pendingIdentifyImage` → `initialImageDataUrl`).
- [ ] Upload: “Tap to add a photo”, ref `openFilePicker` from Care entry, and overlay “Upload from library instead” all still open the file input / picker path.
- [ ] `npm run typecheck`, `npm run build`, `npm run lint` pass.
- [ ] Dashboard **Plant Identifier** card: opens Care at `/my-garden/care` via **Open Plant Identify** (no duplicate identify UI).

## Related docs

- `docs/design/care-issue-guide.md` — issue guide and checklist patterns (Phase 6B).
