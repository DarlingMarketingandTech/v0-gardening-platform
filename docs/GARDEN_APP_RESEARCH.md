# Garden App Research and Strategic Implementation Plan

This document summarizes useful patterns from popular gardening apps and translates them into a careful, phased plan for Momma D's Garden.

## Research summary

### Planter

Useful ideas:

- Garden layout planning.
- Square-foot grid spacing.
- Companion and combative plant guidance.
- Planting calendar for seed starting and transplanting.
- Custom plants and varieties.

What we should borrow:

- Simple placement intelligence.
- Companion warnings.
- Spacing and timing guidance.

What we should not copy yet:

- Full drag-and-drop garden grid.
- Too many plant database details on the main screen.

### Seedtime

Useful ideas:

- Calendar-based planting plan.
- Automatically compiled daily or weekly task lists.
- Journal entries with notes and photos.
- Layout planning for raised beds, containers, and custom spaces.
- Filtering tasks to reduce complexity.

What we should borrow:

- Weekly brief.
- Task list generated from plantings and season.
- Journal/log tied to plants or zones.
- Later: simple layout planning.

What we should not copy yet:

- Full calendar complexity.
- Market-garden-level planning workflows.

### Gardenize

Useful ideas:

- Organizes by plants, garden areas, and diary.
- Notes events like trimming, fertilizing, and harvesting.
- Uses photos and dates to make a searchable garden memory.
- Helps users remember plant names and where things were planted.

What we should borrow:

- Garden areas/zones as a first-class concept.
- Simple garden diary/log.
- Photo-forward memory system.

What we should not copy yet:

- Large plant database browsing as a primary experience.
- Social/public garden features.

### Gardener Planner / ZemiGrow-style patterns

Useful ideas:

- Location-aware planning.
- Local climate and frost-window guidance.
- Companion planting and crop rotation.
- Drag-and-drop bed planning.
- Weather and frost alerts.

What we should borrow:

- Indianapolis-specific timing.
- Weather-aware garden brief.
- Crop placement and companion logic.

What we should not copy yet:

- Heavy crop rotation tools.
- Community features.
- Advanced alert system before basic tasks work.

## Best patterns for Momma D's Garden

The most useful patterns are:

1. Today-first experience.
2. Garden organized by physical spaces.
3. Simple task list generated from plantings, weather, and season.
4. Photo/note garden log.
5. Placement recommendations.
6. Optional science explanations.
7. Plant library as supporting resource, not the main interface.

## Repo audit

### Current useful foundation

The app currently renders `/my-garden` with demo garden data, which makes it safe to shape the experience before wiring persistence.

### Current UX risk

The dashboard currently exposes too many primary areas at once. Items like Seeds, Alerts, Local Pros, Pest Lookup, Weather, Moon Phase, Plant Library, Tasks, and Log are all useful someday, but they should not all compete for attention in the primary navigation.

### Current backend strategy risk

The app is temporarily design-first and demo-friendly, but the existing project handoff defines real garden data as private, household-scoped, and invite-only. The correct distinction is:

- Prototype/demo data can be public.
- Real Momma D garden data must be private and protected.
- Auth should not block design iteration, but it must return before private persisted data is exposed.

### Current product risk

A demo walkthrough should not be built before the actual core screens exist. First build the simple app shape. Then teach it.

## Strategic rollout

### Phase 1: Navigation simplification

Goal: reduce overwhelm.

Primary navigation should become:

1. Today
2. Garden
3. Log
4. Guide

Hide or demote:

- Seeds
- Alerts
- Local Pros
- Complex settings
- Advanced pest lookup
- Service provider directory

Implementation:

- Keep existing components where useful.
- Move advanced tools behind secondary links.
- Make `/my-garden` feel like Today.

### Phase 2: Today screen

Goal: make the app useful in 10 seconds.

Today should show:

- One best action.
- Two secondary tasks.
- Weather-aware note.
- One watch-out.
- Quick log action.

Example:

> Check patio pots this evening. Containers dry faster than garden beds after hot days. Water deeply if the top inch is dry.

### Phase 3: Garden zones

Goal: make the app match Momma D's real backyard.

Start with zone cards, not a complex map:

- Patio Pots
- Raised Bed + Trellis
- In-Ground Bed
- Pollinator Border

Each zone should show:

- What grows best here.
- What to watch for.
- Current plantings.
- This week's relevant action.

### Phase 4: Placement helper

Goal: answer “Where should this go?”

Recommendation format:

1. Best place.
2. Why.
3. What to do next.
4. Caution.

Example:

- Best place: Raised Bed + Trellis.
- Why: Cucumbers climb, gain airflow, and become easier to harvest.
- Do next: Train young vines every few days.
- Caution: Keep moisture consistent to avoid bitter fruit.

### Phase 5: Simple log

Goal: let Momma D capture memories and observations without homework.

First version:

- Add note.
- Add photo placeholder.
- Optional plant or zone.
- Date automatically captured.

Do not require full forms.

### Phase 6: Guide content

Goal: house education without overwhelming Today.

Guide should include:

- How to use the app.
- Pots vs raised beds vs in-ground.
- Trellis basics.
- Watering basics.
- Tomato basics.
- Cucumber basics.
- Common problems.

This is where deeper science belongs.

### Phase 7: Backend persistence

Goal: save real garden data after the interface is proven.

Order:

1. garden_zones
2. plant_library
3. plantings
4. tasks
5. observations
6. recommendations

Real persisted data must be private and household-scoped.

### Phase 8: Guided demo/onboarding

Goal: teach the finished core loop.

Do this after Today, Garden, Log, and Guide exist.

The guide should explain the core loop, not advertise every feature.

## Easy wins from research

Good early additions:

- Weekly garden brief.
- Zone cards.
- Placement helper.
- Task cards with “why this matters.”
- Photo-first garden log.
- Plant detail summary cards.
- Companion warnings.
- Frost/season windows.

Good later additions:

- Visual drag-and-drop garden map.
- Plant identification.
- Push notifications.
- AI chat.
- Advanced calendar filtering.
- Export/print garden plan.
- Community/social sharing.

## Strategic principle

Borrow the best app ideas, but shrink them until they are Momma D-sized.

The goal is not to build the biggest garden app. The goal is to build the garden app she will actually open, understand, and enjoy.
