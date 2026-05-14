# Schema Alignment

This document maps current product language to the intended Supabase schema direction without changing the current demo-first app shape.

## Product to schema mapping

- Product term `Space` maps to the `garden_areas` table.
- Outdoor zones and indoor rooms should share one UI and data pattern under `garden_areas`.
- Product term `Plant in the garden` maps to the `plantings` table.
- Generic plant reference data maps to the `plant_library` table.
- Notes, photos, and timeline entries map to the `observations` table.
- Care work, reminders, and recurring maintenance map to the `care_tasks` table.

## Indoor room model for v1 planning

Indoor plant support should reuse the same `Space -> Planting -> Observation / Care Task` model already planned for outdoor zones.

- An indoor room or surface still counts as a `Space`, so it maps to `garden_areas`.
- A plant growing in that room still maps to `plantings`.
- Generic plant facts still belong in `plant_library`.
- Notes, progress photos, and dated updates still belong in `observations`.
- Watering, rotation, pruning, and pest-check reminders still belong in `care_tasks`.

Example indoor spaces:

- Kitchen Window
- Living Room Plant Shelf
- Bathroom Fern Corner
- Bedroom Windowsill

This keeps the product focused on “what is growing where?” instead of splitting outdoor gardening and indoor plant care into parallel systems.

## Garden tab direction

The Garden tab can eventually group the same reusable space cards into:

- Outdoor Spaces
- Indoor Spaces

Each card should keep the same simple pattern:

- Best for
- Growing here
- Watch for
- This week

## Route and UI notes

- The canonical in-app route remains `/my-garden`.
- The main product loop remains `Today -> Garden -> Log -> Guide`.
- User-facing copy should prefer `spaces` over schema-first labels like `garden areas`.
- The current `/plants` route is best treated as a demo plant reference surface that will eventually read from `plant_library`.

## Database impact for v1 indoor support

No new database tables are required for v1 indoor support.

Indoor rooms should reuse the same planned tables as outdoor zones:

- `garden_areas` for the space itself
- `plantings` for plants placed in that space
- `plant_library` for reusable plant knowledge
- `observations` for notes, photos, and timeline updates
- `care_tasks` for follow-up work and recurring care

The main future choice is grouping and copy in the product UI, not introducing a separate indoor schema.

## Smallest safe future PR

The smallest implementation PR after the outdoor zone flow is stable should be demo-only and should reuse the current space card pattern.

Scope:

1. Add a few indoor demo spaces to the existing prototype garden data.
2. Group Garden screen cards into `Outdoor Spaces` and `Indoor Spaces`.
3. Reuse the existing space card sections: `Best for`, `Growing here`, `Watch for`, and `This week`.
4. Optionally attach a few demo plantings to those indoor spaces using the same display model.

Out of scope for that PR:

- new database tables
- Supabase persistence changes
- a separate indoor navigation flow
- AI photo diagnosis

## Scope guardrails for this alignment pass

- Do not redesign routes just to match future persistence.
- Do not add new product features while aligning names.
- Do not treat `docs/PROJECT_HANDOFF.md` as current product authority; use it only as historical or future persistence context.
