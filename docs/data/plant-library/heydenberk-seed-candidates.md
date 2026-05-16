# Heydenberk plant_library seed candidates (Phase 9A.1)

Generated: 2026-05-16T03:31:32.926Z
Preview snapshot: 2026-05-16T03:31:28.361Z

## Contract

**No Supabase writes occurred.** This file is derived from local JSON only (preview + review overrides). No migrations, no service role keys, no network calls.

## Summary

- Total preview rows: **39**
- Included (status `included`): **30**
- Included with warning (status `included_with_warning`): **1**
- Excluded (status `excluded`): **8**
- Needs manual review (status `needs_manual_review`): **0**

## Included source_keys

- **artichoke**
- **asparagus**
- **basil**
- **broccoli**
- **brussel-sprout**
- **cabbage**
- **carrot**
- **cauliflower**
- **celery**
- **collard-green**
- **common-bean**
- **cucumber**
- **eggplant**
- **garlic**
- **kale**
- **leek**
- **mustard**
- **okra**
- **onion**
- **parsley**
- **parsnip**
- **potato**
- **pumpkin**
- **radish**
- **rhubarb**
- **shallot**
- **spinach**
- **squash**
- **sweet-corn**
- **swiss-chard**
- **tomato**

## Excluded / manual review (with reasons)

- **beet** (needs_review, excluded): Species appears to be artichoke (Cynara scolymus), not beet.
- **bell-pepper** (needs_review, excluded): Planting stage duration uses years; inconsistent with typical annual pepper crop modeling.
- **chili-pepper** (needs_review, excluded): Same year-scale planting duration concern as bell pepper.
- **head-lettuce** (needs_review, excluded): Year-scale planting duration flagged needs_review for this lettuce entry.
- **leaf-lettuce** (needs_review, excluded): Year-scale planting duration flagged needs_review for this lettuce entry.
- **pea** (low, excluded): Marked low: unknown soilImpact label (source typo heavy giver).
- **pole-pea** (low, excluded): Marked low: same soilImpact typo pattern as pea.json.
- **turnip** (needs_review, excluded): Year-scale planting duration flagged needs_review for turnip.

## Inputs

- Preview: `docs\data\plant-library\heydenberk-plant-library-preview.json`
- Overrides: `docs\data\plant-library\heydenberk-review-overrides.json`

## Output

- JSON: `docs\data\plant-library\heydenberk-seed-candidates.json`