# Information Architecture

This document keeps the app small enough to use and structured enough to grow.

## Navigation principle

Do not start with a large app navigation. Start with a home-centered experience and let secondary tools appear from context.

Recommended primary navigation for v1:

1. Today
2. Garden
3. Log
4. Guide

Avoid more than four primary navigation items for the first usable version.

## 1. Today

Purpose: answer “What should I do right now?”

Content:

- Today’s garden brief
- Weather-aware reminders
- Urgent watch-outs
- 1 to 3 most important tasks
- Next harvest or milestone

Design rules:

- This should be the default landing screen.
- It should never be a giant dashboard.
- It should use short cards and direct language.

Example cards:

- “Check patio pots tonight.”
- “Train cucumber vines this week.”
- “Basil is ready for a pinch harvest.”

## 2. Garden

Purpose: answer “What is growing where?”

Content:

- Garden zones
- Plantings by zone
- Best-placement guidance
- Simple map/list hybrid

Recommended zones:

- Patio Pots
- Raised Bed + Trellis
- In-Ground Bed
- Pollinator Border

Design rules:

- Start as cards, not a complex drag-and-drop map.
- Each zone should have a short “best for” explanation.
- Each plant should show only the most important care status.

## 3. Log

Purpose: answer “What happened in the garden?”

Content:

- Quick note
- Photo entry
- Observation type
- Plant or zone association

Observation types:

- planted
- watered
- fertilized
- pruned
- pest spotted
- disease concern
- harvested
- photo update
- general note

Design rules:

- Logging should take less than one minute.
- Photo-first logging should be supported later.
- The app should not punish skipped logs.

## 4. Guide

Purpose: answer “How do I use this and get more out of it?”

Content:

- App walkthrough
- Garden basics
- How to use zones
- How to read recommendations
- Seasonal rhythm
- Common garden questions

Design rules:

- This is the safe place for education.
- Keep deep science here unless directly needed in Today/Garden.
- Use friendly short lessons.

## Secondary screens

Secondary screens can exist, but they should not dominate navigation.

Possible secondary screens:

- Plant Library
- Individual Plant Detail
- Zone Detail
- Task Detail
- Seasonal Plan
- Settings

## Screens to avoid early

Avoid building these until the core loop is proven:

- Large analytics dashboard
- Complex settings center
- Multi-user family management
- Marketplace/provider directory
- Full inventory system
- Social sharing
- Notifications configuration maze

## App home recommendation

The app’s `/my-garden` screen should eventually become the Today screen.

It should show:

1. Greeting
2. Today’s best action
3. Weather/garden condition summary
4. Top 3 tasks
5. Quick log button
6. Link to Garden zones

## Garden zone detail template

Each zone page/card should answer:

- What is this zone?
- What grows best here?
- What should Mom watch out for?
- What is currently planted here?
- What should happen this week?

## Plant detail template

Each plant page/card should answer:

- What is it?
- Where is it planted?
- What stage is it in?
- What does it need now?
- When might it harvest?
- What can go wrong?
- What is the simple science behind the advice?

## Content density rule

If a card needs more than 120 words, split it or collapse the science details.

The app should whisper helpful guidance, not throw a seed catalog at her face.
