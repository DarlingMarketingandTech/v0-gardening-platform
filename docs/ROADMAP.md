# Roadmap

This roadmap keeps the app focused, useful, and calm.

## Current state

The app has been reset to a design-first experience without an auth gate. That is good. The next work should not rebuild login. It should make the app easier and more valuable for Momma D.

## Phase 1: Clarity and structure

Goal: make the app understandable before making it powerful.

Work:

- Define the primary navigation around Today, Garden, Log, Guide.
- Make `/my-garden` feel like the daily home screen.
- Keep demo data, but make it look intentional.
- Add a simple demo/onboarding guide.
- Organize garden data around real backyard zones.

Success:

- Momma D can open the app and know what to tap first.
- The app does not require login, setup, or explanation to preview.
- The app feels made for her backyard.

## Phase 2: Garden intelligence prototype

Goal: add smart recommendations without overwhelming the interface.

Work:

- Add simple zone cards.
- Add plant placement recommendations.
- Add a weekly garden brief.
- Add short “why this matters” explanations.
- Keep science collapsed or secondary.

Success:

- The app gives useful advice in plain English.
- Each recommendation has one clear action.
- The user can ignore advanced science and still benefit.

## Phase 3: Simple logging

Goal: let Momma D capture what happened without friction.

Work:

- Add quick note flow.
- Add photo-oriented log concept.
- Associate logs with a zone or plant only when easy.
- Show recent notes in a simple timeline.

Success:

- Logging takes less than one minute.
- The log feels optional and useful, not like homework.

## Phase 4: Backend persistence

Goal: save the garden after the product shape is stable.

Work:

- Convert demo garden data into Supabase schema.
- Add garden_zones, plantings, tasks, observations.
- Read real data into the same UI shapes.
- Add minimal create/update actions.

Success:

- The UI does not change drastically when persistence is added.
- Supabase supports the app instead of driving the UX.

## Phase 5: Access and auth

Goal: protect the garden only after the app is worth protecting.

Work:

- Add simple access pattern.
- Avoid complex invite flows.
- Consider one household passcode or simple magic link later.
- Keep auth out of the daily-use experience.

Success:

- Momma D can access the app easily.
- Auth does not become the project again.

## Not now

Do not prioritize yet:

- complex AI chat
- full account system
- family/team management
- social sharing
- marketplace or service provider directory
- advanced analytics
- paid product flows
- too many tabs
- complex settings

## Immediate next PRs

Recommended order:

1. Docs guardrails PR.
2. Navigation simplification PR: Today, Garden, Log, Guide.
3. Demo guide/onboarding PR.
4. Garden zones UI PR.
5. Weekly brief PR.
6. Simple log PR.
7. Backend schema draft PR.

## Guiding question

Will this help Momma D know what to do in her garden today?

If the answer is not clearly yes, wait.
