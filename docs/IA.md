# Information Architecture

Deprecated: this early IA sketch is no longer the source of truth.

Use `docs/INFORMATION_ARCHITECTURE.md` for the current mobile-first app structure: `/my-garden` centered on **Today / Garden / Log / Guide**. This file is kept only as historical context for older route and data-model ideas.

## Historical sketch below

The notes below predate the current demo-first direction and may conflict with the active app.

## Global navigation

- **Today** `/my-garden`
- **Garden Areas** `/gardens`
- **Plants** `/plants`

## Screens

### Today

- Overview card: location, climate zone, last frost date (when known)
- "Do this next" card: 1 primary task
- Tasks list: watering, feeding, pruning, pest check, harvest
- Notes: quick observation log

### Garden Areas

- List of areas grouped by type
  - Pots
  - In ground beds
  - Raised beds
- Area detail
  - Summary: sun exposure, size, soil notes
  - Plants in this area
  - Care schedule
  - Observations

### Plants

- Library browse + search + filters
- Plant detail
  - Basics: sun, water, temperature
  - "Doctorate depth" accordion: botany, physiology, common issues
  - Add to an area

### Planner

- Season timeline
- Upcoming harvests
- Monthly checklists

## Data relationships (high level)

- Household -> Garden Areas -> Plantings -> Care Tasks + Observations

## UX guardrails

- Never show more than 3 "important" items at once.
- Use accordions for deeper science.
- Keep primary actions at the bottom of the screen on mobile.
