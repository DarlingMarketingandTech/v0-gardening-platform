# localStorage Audit

This document records the current `localStorage` usage in the demo-first Momma D garden app.

It is intentionally descriptive, not prescriptive. The goal for this pass is to classify current usage without changing behavior or introducing persistence work.

## Classification buckets

1. `harmless UI preference`
   Safe browser-local state that controls presentation or convenience, not garden records.
2. `demo-only prototype data`
   Browser-local state that supports the current prototype but should not be treated as a stable household record.
3. `real garden data candidate`
   Browser-local state that represents real garden information and should eventually move into the household-backed data model when persistence work is scheduled.

## Current usage

### `mommaGardens`

- File: `app/gardens/new/page.tsx`
- Classification: `real garden data candidate`
- Why:
  This stores user-created garden records with names, types, sizes, and locations. That is product data, not a UI preference.
- Future direction:
  When persistence work is in scope, this should align with the shared spaces model and household-backed garden area records.

### `gardenLog`

- File: `components/dashboard/garden-log.tsx`
- Classification: `real garden data candidate`
- Why:
  This stores dated garden notes, photo attachments, and event types. That maps to the product's log/history concept rather than temporary UI state.
- Future direction:
  When persistence work is in scope, these entries should move toward the `observations` model.

### `gardenTasks`

- File: `components/dashboard/task-list.tsx`
- Classification: `real garden data candidate`
- Why:
  This stores actionable garden work items and completion state. That is real care workflow, not a visual preference.
- Future direction:
  When persistence work is in scope, these entries should move toward the `care_tasks` model.

### `seedInventory`

- File: `components/dashboard/seed-inventory.tsx`
- Classification: `demo-only prototype data`
- Why:
  This is useful for previewing a seed-box experience, but it is not yet part of the current Today / Garden / Log / Guide persistence target and does not have a committed schema path in the current roadmap.
- Future direction:
  Keep this browser-local until the product explicitly chooses a long-term inventory model.

### `garden_notification_settings`

- File: `components/dashboard/notification-settings.tsx`
- Classification: `harmless UI preference`
- Why:
  This stores reminder toggles and notification preferences. It changes how the app behaves for one browser/device, but it does not store household garden records.
- Future direction:
  This can remain browser-local unless cross-device preference sync becomes a real requirement.

### `momma-garden-ui`

- File: `lib/profile-store.ts`
- Classification: `harmless UI preference`
- Why:
  This stores theme, collapsed sidebar state, and dismissed messages. These are presentation preferences only.
- Future direction:
  Keep browser-local unless account-level preference sync becomes necessary later.

## Summary

- `harmless UI preference`
  - `garden_notification_settings`
  - `momma-garden-ui`
- `demo-only prototype data`
  - `seedInventory`
- `real garden data candidate`
  - `mommaGardens`
  - `gardenLog`
  - `gardenTasks`

## Left intentionally untouched

- No `localStorage` usage was removed in this pass.
- No Supabase persistence was added.
- No navigation, auth, schema, or migration work was bundled into this audit.
