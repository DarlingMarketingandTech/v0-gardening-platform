# Backend Plan

The backend should support the simple garden loop first. It should not recreate enterprise project management for vegetables.

## Backend goals

The backend should eventually store:

- garden spaces
- plantings
- tasks
- observations
- photos
- seasonal recommendations
- lightweight user preferences

It should power helpful guidance without requiring Momma D to configure a complex system.

## Prototype data versus real data

There are two separate modes:

1. Prototype/demo mode
2. Real persisted family garden mode

Prototype/demo data can be public while we are shaping the UX. It should not contain private family notes, real user identifiers, private photos, or household data.

Real persisted Momma D garden data must be private, household-scoped, and protected before it is exposed through the app.

This distinction matters because the current design-first reset removed the auth gate to speed up product shaping. That does not mean real private garden data should ever be public.

## Backend non-goals for v1

Do not prioritize:

- family account management screens
- complex roles and permissions UI
- marketplace/provider data
- full notification automation
- complex analytics
- social sharing
- paid subscriptions
- multi-garden business logic

## Recommended data model v1

### gardens

Represents Momma D's garden as a whole.

Fields:

- id
- name
- location_label
- city
- state
- growing_zone
- notes
- created_at
- updated_at

### garden_zones

Represents physical spaces.

Fields:

- id
- garden_id
- name
- type: container, in_ground, raised_bed, raised_bed_trellis, pollinator_border
- sunlight
- soil_notes
- water_notes
- best_for
- caution_notes
- sort_order

### plants

Reusable plant/crop knowledge.

Fields:

- id
- common_name
- scientific_name
- category
- sun_needs
- water_needs
- spacing_inches
- days_to_harvest
- care_summary
- common_risks

### plantings

A plant in a specific place for a specific season.

Fields:

- id
- garden_id
- zone_id
- plant_id
- nickname
- status
- planted_date
- expected_harvest_start
- expected_harvest_end
- notes

### tasks

Actionable work.

Fields:

- id
- garden_id
- zone_id
- planting_id
- title
- reason
- due_date
- priority
- status
- created_from_rule_id

### observations

Garden log entries.

Fields:

- id
- garden_id
- zone_id
- planting_id
- type
- note
- photo_url
- observed_at

### recommendations

Generated or curated advice.

Fields:

- id
- garden_id
- zone_id
- planting_id
- title
- summary
- action
- science_note
- priority
- valid_from
- valid_until
- status

## Rule data

Rules should start simple and transparent.

Example rule categories:

- placement_rules
- watering_rules
- pruning_rules
- pest_watch_rules
- harvest_rules
- seasonal_timeline_rules

Rules should produce plain-language advice.

## Intelligence approach

Start with deterministic rules before adding advanced AI.

Good first rules:

- If zone type is container and temperature is hot, remind to check moisture.
- If crop is cucumber and zone has trellis, remind to train vines early.
- If plant is basil and status is growing, remind to pinch before flowering.
- If tomato is planted, remind to mulch and watch lower leaves.

AI can later help summarize observations, answer questions, and generate explanations. It should not be required for the app to work.

## Auth direction

Auth should remain out of the prototype critical path until the product shape is useful.

Auth must return before real persisted family garden data is exposed.

Possible later approach:

- single household garden
- simple invite-only access
- simple magic link or household passcode if appropriate
- no complex invite-management UI initially
- service-role-only admin operations hidden from UI

## Data safety

When persistence returns:

- keep RLS simple
- protect real family garden data behind household access
- avoid exposing SECURITY DEFINER RPCs casually
- separate public plant knowledge from private garden observations
- use server actions/API routes for sensitive operations
- never expose private notes, photos, household ids, or user ids in public demo views

## Backend implementation order

1. Keep prototype data until UI is stable.
2. Convert prototype data shapes into schema draft.
3. Add Supabase tables for garden_zones, plantings, tasks, observations.
4. Read only harmless prototype data publicly while UX is still being shaped.
5. Before reading real family garden data, restore private household access.
6. Add create/update actions only for the simplest log/task flows.
7. Add fuller auth flows only after Momma D can use the core app.

## Backend principle

The database should remember the garden. The app should explain what matters. The user should not feel the database exists.
