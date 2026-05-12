# Legacy Supabase Path Audit

This note documents the old Supabase data paths that still exist outside the current `/my-garden` demo-first loop.

No runtime behavior changed in this audit. These routes and components remain legacy surfaces until a dedicated persistence migration is scheduled.

## Current legacy paths

### `app/gardens/[id]/page.tsx`

- Reads from `gardens`.
- Reads from `garden_plants`.
- Joins `garden_plants` to the old generic `plants` table.
- Reads all old generic `plants` rows for the add-plant dialog.

Future direction:

- `gardens` should become household-scoped `garden_areas`.
- `garden_plants` should become household-scoped `plantings`.
- Joined `plants` references should become `plant_library`.
- Notes or timeline details that later appear on this route should use `observations`.
- Care status or recurring work should use `care_tasks` when the product needs task records beyond planting status.

### `app/planner/page.tsx`

- Reads old generic `plants` for seasonal recommendations.
- Reads `garden_plants`.
- Joins `garden_plants` to old generic `plants`.
- Joins `garden_plants` to `gardens` for display names.

Future direction:

- Recommendation source data should come from `plant_library`.
- Active garden plants should come from `plantings`.
- Space labels should come from `garden_areas`.
- Harvest notes, photos, or dated garden events should use `observations`.
- Planned care work should use `care_tasks`.

### `components/add-plant-dialog.tsx`

- Receives old generic `plants` rows.
- Writes new rows to `garden_plants`.
- Stores notes directly on the legacy garden-plant row.

Future direction:

- The selected plant should reference `plant_library`.
- The plant-in-place record should be inserted into `plantings`.
- Freeform notes should move to `observations` if they represent dated garden history.
- Follow-up work created from the dialog should use `care_tasks`.

### `components/garden-plants-list.tsx`

- Receives `garden_plants` rows joined to old generic `plants`.
- Updates `garden_plants.status`.
- Deletes rows from `garden_plants`.

Future direction:

- Display rows should come from `plantings` joined to `plant_library`.
- Space context should come from `garden_areas` when needed.
- Status changes should update `plantings` only if they describe the plant-in-place state.
- Actual work reminders or completed care should use `care_tasks`.
- Removal should be designed as a household-scoped `plantings` lifecycle decision, not a broad data cleanup.

## Migration notes

- Do not migrate these paths opportunistically while `/my-garden` UX is still stabilizing.
- Do not add migrations or RLS changes as part of this audit.
- Keep the product language as `spaces` in UI copy even though the table target is `garden_areas`.
- Treat `docs/PROJECT_HANDOFF.md` as future persistence context, not current product authority.
- Preserve demo usability until a dedicated backend-persistence issue is approved.
