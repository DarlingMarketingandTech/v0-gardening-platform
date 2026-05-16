# Heydenberk plant_library seed report (Phase 9B)

Generated: **2026-05-16T03:31:40.624Z**
Mode: **dry-run**
Target host: **(dry-run — no network)**

## Safety contract

- **No UI changes** — `/plants` and `/my-garden` remain demo/local as before.
- **RLS / read model unchanged** by this script; verify policies before any UI reads from `plant_library`.
- **Excluded seed candidates** were validated and are **not** present in the upsert payload.
- **Service role key** is never printed; use local env only for `--apply`.

## Summary

| Metric | Value |
| --- | --- |
| Candidates in file | 31 |
| Approved for upsert | 31 |
| Attempted rows | 31 |
| Chunk size | 50 |
| Chunks run | 0 |
| Rows returned from PostgREST upsert | n/a |
| Warning rows (included_with_warning) | 1 |
| Excluded resolutions (from file) | 8 |

### included_with_warning

- **tomato**

### Source counts (payload)

- `heydenberk/gardening-data`: **31**

## Notes

- Production bulk seed is deferred until after human review; Phase 9B targets preview/dev branches only.
- SUPABASE_URL not set — dry-run only (no network).

## Inputs

- Seed candidates: `docs\data\plant-library\heydenberk-seed-candidates.json`
- Preview generated at (from file): `2026-05-16T03:31:28.361Z`
