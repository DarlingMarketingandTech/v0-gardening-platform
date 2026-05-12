# Roadmap

This roadmap keeps the app focused, useful, and calm.

## Current state

The app has been reset to a design-first experience without an auth gate. That is good for shaping UX with harmless prototype data. The next work should not rebuild login. It should make the app easier and more valuable for Momma D.

Real persisted family garden data must be private and household-scoped before it is exposed through the app.

## Phase 1: Research-informed structure

Goal: make the app understandable before making it powerful.

Work:

- Use research from gardening apps to guide direction.
- Keep primary navigation around Today, Garden, Log, Guide.
- Make `/my-garden` feel like the daily home screen.
- Keep prototype data harmless and clearly non-private.
- Organize garden data around real backyard zones.

Success:

- Momma D can open the app and know what to tap first.
- The app does not require login, setup, or explanation to preview.
- The app feels made for her backyard.

## Phase 2: Navigation simplification

Goal: reduce overwhelm.

Primary navigation:

1. Today
2. Garden
3. Log
4. Guide

Move or hide for later:

- Seeds
- Alerts
- Local Pros
- Advanced pest lookup
- Complex settings
- Service provider directory

Success:

- The app feels calm on a phone.
- The user sees one clear next step.
- Advanced features stop competing for attention.

## Phase 3: Today screen

Goal: make the app useful in 10 seconds.

Work:

- One best action.
- Two secondary tasks.
- Weather-aware note.
- One watch-out.
- Quick log action.

Success:

- Today answers “What should I do now?”
- Each recommendation has one clear action.
- Science is available, but not forced.

## Phase 4: Garden spaces

Goal: make the app match Momma D's real backyard.

Start with space cards, not a complex map:

- Patio Pots
- Raised Bed + Trellis
- In-Ground Bed
- Pollinator Border

Use `spaces` as the product term while keeping `garden_areas` as the schema term for now.

Each space should show:

- What grows best here.
- What to watch for.
- Current plantings.
- This week's relevant action.

Success:

- Momma D understands where things belong.
- The app becomes backyard-specific without needing a complex layout editor.

## Phase 5: Placement helper

Goal: answer “Where should this go?”

Recommendation format:

1. Best place.
2. Why.
3. What to do next.
4. Caution.

Success:

- The app helps choose between pots, ground, raised bed, and trellis.
- Companion and spacing hints are useful but not overwhelming.

## Phase 6: Simple logging

Goal: let Momma D capture what happened without friction.

Work:

- Quick note.
- Photo-first log concept.
- Optional plant/zone association.
- Automatic date.

Success:

- Logging takes less than one minute.
- The log feels optional and useful, not like homework.

## Phase 7: Guide content

Goal: house education without overwhelming Today.

Guide content:

- How to use the app.
- Pots vs raised beds vs in-ground.
- Trellis basics.
- Watering basics.
- Tomato basics.
- Cucumber basics.
- Common problems.

Success:

- Deep science has a home.
- Daily use stays simple.

## Phase 8: Backend persistence

Goal: save the garden after the product shape is stable.

Work:

- Convert prototype garden data into Supabase schema.
- Add households, household_members, garden_areas, plant_library, plantings, care_tasks, and observations.
- Read real data into the same UI shapes.
- Restore private household access before exposing real family data.
- Add minimal create/update actions.

Success:

- The UI does not change drastically when persistence is added.
- Supabase supports the app instead of driving the UX.
- Real garden data is protected.

## Phase 9: Demo guide and onboarding

Goal: teach the finished core loop.

Build this only after Today, Garden, Log, and Guide exist.

Success:

- Momma D can explain the app in one sentence.
- The guide reduces anxiety instead of advertising complexity.

## Not now

Do not prioritize yet:

- complex AI chat
- full account system
- family/team management UI
- social sharing
- marketplace or service provider directory
- advanced analytics
- paid product flows
- too many tabs
- complex settings
- demo walkthrough before core screens exist

## Immediate next PRs

Recommended order:

1. Docs guardrails and research PR.
2. Navigation simplification PR: Today, Garden, Log, Guide.
3. Today screen PR.
4. Garden zones UI PR.
5. Placement helper PR.
6. Simple log PR.
7. Guide content PR.
8. Backend schema draft PR.
9. Demo guide/onboarding PR.

## Guiding question

Will this help Momma D know what to do in her garden today?

If the answer is not clearly yes, wait.
