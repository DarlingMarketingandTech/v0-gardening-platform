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

## Backend non-goals for v1

Do not prioritize:

- family account management
- complex roles and permissions
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

Auth should remain out of the critical path until the product is useful.

Possible later approach:

- single household garden
- simple magic link or passcode
- no complex invite flow initially
- service-role-only admin operations hidden from UI

## Data safety

When persistence returns:

- keep RLS simple
- avoid exposing SECURITY DEFINER RPCs casually
- separate public plant knowledge from private garden observations
- use server actions/API routes for sensitive operations

## Backend implementation order

1. Keep demo data until UI is stable.
2. Convert demo data shapes into schema draft.
3. Add Supabase tables for garden_zones, plantings, tasks, observations.
4. Read from Supabase without auth gate, using a single demo garden id if needed.
5. Add create/update actions only for the simplest log/task flows.
6. Add auth only after Momma D can use the core app.

## Backend principle

The database should remember the garden. The app should explain what matters. The user should not feel the database exists.
