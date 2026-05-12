# Schema Alignment

This document maps current product language to the intended Supabase schema direction without changing the current demo-first app shape.

## Product to schema mapping

- Product term `Space` maps to the `garden_areas` table.
- Outdoor zones and indoor rooms should share one UI and data pattern under `garden_areas`.
- Product term `Plant in the garden` maps to the `plantings` table.
- Generic plant reference data maps to the `plant_library` table.
- Notes, photos, and timeline entries map to the `observations` table.
- Care work, reminders, and recurring maintenance map to the `care_tasks` table.

## Route and UI notes

- The canonical in-app route remains `/my-garden`.
- The main product loop remains `Today -> Garden -> Log -> Guide`.
- User-facing copy should prefer `spaces` over schema-first labels like `garden areas`.
- The current `/plants` route is best treated as a demo plant reference surface that will eventually read from `plant_library`.

## Scope guardrails for this alignment pass

- Do not redesign routes just to match future persistence.
- Do not add new product features while aligning names.
- Do not treat `docs/PROJECT_HANDOFF.md` as current product authority; use it only as historical or future persistence context.
