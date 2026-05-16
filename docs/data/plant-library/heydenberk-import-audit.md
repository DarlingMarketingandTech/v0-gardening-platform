# Heydenberk gardening-data → plant_library (Phase 9A audit)

Generated: 2026-05-16T03:31:28.361Z
Input directory: `reference\gardening-data\plants`

## Contract

**No Supabase writes occurred.** This report is produced from local JSON only. No migrations, no staging tables, no service role keys, and no network calls.

## Summary counts

- Total files in directory (any type): **40**
- JSON plant files considered (excluding index.json): **39**
- Rows mapped: **39**
- Parse / mapping failures: **0**
- Quality — high: **0**, medium: **30**, low: **3**, needs_review: **6**

## Recommendation

Do not run a bulk Supabase seed until `needs_review` rows are corrected or explicitly accepted.

## Source tooling inspected (reference only)

- `reference\gardening-data\tools\Cakefile`
- `reference\gardening-data\tools\scrape-usda-ndl.js`

## Records blocked from future import (`needs_review`)

- **beet** (`beet.json`)
- **bell-pepper** (`bell pepper.json`)
- **chili-pepper** (`chili pepper.json`)
- **head-lettuce** (`head lettuce.json`)
- **leaf-lettuce** (`leaf lettuce.json`)
- **turnip** (`turnip.json`)

## Records marked safe for future preview-branch import (`high` or `medium`)

- **artichoke** — medium
- **asparagus** — medium
- **basil** — medium
- **broccoli** — medium
- **brussel-sprout** — medium
- **cabbage** — medium
- **carrot** — medium
- **cauliflower** — medium
- **celery** — medium
- **collard-green** — medium
- **common-bean** — medium
- **cucumber** — medium
- **eggplant** — medium
- **garlic** — medium
- **kale** — medium
- **leek** — medium
- **mustard** — medium
- **okra** — medium
- **onion** — medium
- **parsley** — medium
- **parsnip** — medium
- **potato** — medium
- **pumpkin** — medium
- **radish** — medium
- **rhubarb** — medium
- **shallot** — medium
- **spinach** — medium
- **squash** — medium
- **sweet-corn** — medium
- **swiss-chard** — medium

## Per-record warnings

### artichoke (`artichoke.json`) — medium

| Column | Value |
| --- | --- |
| common_name | artichoke |
| scientific_name | Cynara scolymus |
| category | vegetable |
| edible | true |
| sunlight | part shade to full sun |
| water |  |
| spacing_inches | 72 |
| days_to_maturity | 56 |
| care_summary | Artichoke is an edible vegetable that grows in part shade to full sun. Space plants about 72 inches apart based on this source. |
| watch_out_for | Heavy feeder. Plan compost or richer soil support. Source data needs review before import. |

- **duration_unit_normalized**: Normalized duration unit in harvest.duration.
- **planting_duration_years_perennial**: Planting stage duration uses years; plausible for a perennial in this source but verify locally.

### asparagus (`asparagus.json`) — medium

| Column | Value |
| --- | --- |
| common_name | asparagus |
| scientific_name | Asparagus officinalis |
| category | vegetable |
| edible | true |
| sunlight | part shade to full sun |
| water |  |
| spacing_inches | 72 |
| days_to_maturity | 56 |
| care_summary | Asparagus is an edible vegetable that grows in part shade to full sun. Space plants about 72 inches apart based on this source. |
| watch_out_for | Heavy feeder. Plan compost or richer soil support. Source data needs review before import. |

- **duration_unit_normalized**: Normalized duration unit in harvest.duration.
- **planting_duration_years_perennial**: Planting stage duration uses years; plausible for a perennial in this source but verify locally.

### basil (`basil.json`) — medium

| Column | Value |
| --- | --- |
| common_name | basil |
| scientific_name | Ocimum basilicum |
| category | herb |
| edible | true |
| sunlight | part sun to full sun |
| water |  |
| spacing_inches | 6 |
| days_to_maturity | 84 |
| care_summary | Basil is an edible herb that grows in part sun to full sun. Space plants about 6 inches apart based on this source. |
| watch_out_for | Heavy feeder. Plan compost or richer soil support. |

- **duration_unit_normalized**: Normalized duration unit in harvest.duration.

### beet (`beet.json`) — needs_review

| Column | Value |
| --- | --- |
| common_name | beet |
| scientific_name | Cynara scolymus |
| category | vegetable |
| edible | true |
| sunlight | part shade to full sun |
| water |  |
| spacing_inches | 4 |
| days_to_maturity | 7 |
| care_summary | Beet is an edible vegetable that grows in part shade to full sun. Space plants about 4 inches apart based on this source. |
| watch_out_for | Light feeder. Avoid over-fertilizing unless soil tests suggest it. Source data needs review before import. |

- **duration_unit_normalized**: Normalized duration unit in harvest.duration.
- **species_name_suspicious**: Species does not look consistent with common name.

### bell-pepper (`bell pepper.json`) — needs_review

| Column | Value |
| --- | --- |
| common_name | bell pepper |
| scientific_name | Capsicum annuum |
| category | vegetable |
| edible | true |
| sunlight | full sun |
| water |  |
| spacing_inches | 12 |
| days_to_maturity | 119 |
| care_summary | Bell pepper is an edible vegetable that prefers full sun. Space plants about 12 inches apart based on this source. |
| watch_out_for | Heavy feeder. Plan compost or richer soil support. Source data needs review before import. |

- **duration_unit_normalized**: Normalized duration unit in harvest.duration.
- **planting_duration_suspicious**: Planting stage duration uses years; verify perennial vs crop data.

### broccoli (`broccoli.json`) — medium

| Column | Value |
| --- | --- |
| common_name | broccoli |
| scientific_name | Brassica oleracea |
| category | vegetable |
| edible | true |
| sunlight | part sun to full sun |
| water |  |
| spacing_inches | 15 |
| days_to_maturity | 42 |
| care_summary | Broccoli is an edible vegetable that grows in part sun to full sun. Space plants about 15 inches apart based on this source. |
| watch_out_for | Light feeder. Avoid over-fertilizing unless soil tests suggest it. |

- **duration_unit_normalized**: Normalized duration unit in harvest.duration.

### brussel-sprout (`brussel sprout.json`) — medium

| Column | Value |
| --- | --- |
| common_name | brussel sprout |
| scientific_name | Brassica oleracea |
| category | vegetable |
| edible | true |
| sunlight | part sun to full sun |
| water |  |
| spacing_inches | 18 |
| days_to_maturity | 84 |
| care_summary | Brussel sprout is an edible vegetable that grows in part sun to full sun. Space plants about 18 inches apart based on this source. |
| watch_out_for | Heavy feeder. Plan compost or richer soil support. |

- **duration_unit_normalized**: Normalized duration unit in harvest.duration.

### cabbage (`cabbage.json`) — medium

| Column | Value |
| --- | --- |
| common_name | cabbage |
| scientific_name | Brassica oleracea |
| category | vegetable |
| edible | true |
| sunlight | part sun to full sun |
| water |  |
| spacing_inches | 15 |
| days_to_maturity | 7 |
| care_summary | Cabbage is an edible vegetable that grows in part sun to full sun. Space plants about 15 inches apart based on this source. |
| watch_out_for | Heavy feeder. Plan compost or richer soil support. |

- **duration_unit_normalized**: Normalized duration unit in harvest.duration.

### carrot (`carrot.json`) — medium

| Column | Value |
| --- | --- |
| common_name | carrot |
| scientific_name | Daucus carota |
| category | vegetable |
| edible | true |
| sunlight | full sun |
| water |  |
| spacing_inches | 3 |
| days_to_maturity | 42 |
| care_summary | Carrot is an edible vegetable that prefers full sun. Space plants about 3 inches apart based on this source. |
| watch_out_for | Light feeder. Avoid over-fertilizing unless soil tests suggest it. |

- **duration_unit_normalized**: Normalized duration unit in harvest.duration.

### cauliflower (`cauliflower.json`) — medium

| Column | Value |
| --- | --- |
| common_name | cauliflower |
| scientific_name | Brassica oleracea |
| category | vegetable |
| edible | true |
| sunlight | full sun |
| water |  |
| spacing_inches | 72 |
| days_to_maturity | 7 |
| care_summary | Cauliflower is an edible vegetable that prefers full sun. Space plants about 72 inches apart based on this source. |
| watch_out_for | Heavy feeder. Plan compost or richer soil support. |

- **duration_unit_normalized**: Normalized duration unit in harvest.duration.

### celery (`celery.json`) — medium

| Column | Value |
| --- | --- |
| common_name | celery |
| scientific_name | Apium graveolens |
| category | vegetable |
| edible | true |
| sunlight | full sun |
| water |  |
| spacing_inches | 6 |
| days_to_maturity | 7 |
| care_summary | Celery is an edible vegetable that prefers full sun. Space plants about 6 inches apart based on this source. |
| watch_out_for | Heavy feeder. Plan compost or richer soil support. |

- **duration_unit_normalized**: Normalized duration unit in harvest.duration.

### chili-pepper (`chili pepper.json`) — needs_review

| Column | Value |
| --- | --- |
| common_name | chili pepper |
| scientific_name | Capsicum annuum |
| category | vegetable |
| edible | true |
| sunlight | full sun |
| water |  |
| spacing_inches | 12 |
| days_to_maturity | 119 |
| care_summary | Chili pepper is an edible vegetable that prefers full sun. Space plants about 12 inches apart based on this source. |
| watch_out_for | Heavy feeder. Plan compost or richer soil support. Source data needs review before import. |

- **duration_unit_normalized**: Normalized duration unit in harvest.duration.
- **planting_duration_suspicious**: Planting stage duration uses years; verify perennial vs crop data.

### collard-green (`collard green.json`) — medium

| Column | Value |
| --- | --- |
| common_name | collard green |
| scientific_name | Brassica oleracea |
| category | vegetable |
| edible | true |
| sunlight | part shade to full sun |
| water |  |
| spacing_inches | 12 |
| days_to_maturity | 168 |
| care_summary | Collard green is an edible vegetable that grows in part shade to full sun. Space plants about 12 inches apart based on this source. |
| watch_out_for | Light feeder. Avoid over-fertilizing unless soil tests suggest it. |

- **duration_unit_normalized**: Normalized duration unit in harvest.duration.

### common-bean (`common bean.json`) — medium

| Column | Value |
| --- | --- |
| common_name | common bean |
| scientific_name | Phaseolus vulgaris |
| category | vegetable |
| edible | true |
| sunlight | part sun to full sun |
| water |  |
| spacing_inches | 6 |
| days_to_maturity | 84 |
| care_summary | Common bean is an edible vegetable that grows in part sun to full sun. Space plants about 6 inches apart based on this source. |
| watch_out_for | Heavy feeder. Plan compost or richer soil support. |

- **duration_unit_normalized**: Normalized duration unit in harvest.duration.
- **yield_units_normalized**: Yield used units instead of unit; normalized to unit.

### cucumber (`cucumber.json`) — medium

| Column | Value |
| --- | --- |
| common_name | cucumber |
| scientific_name | Cucumis sativus |
| category | vegetable |
| edible | true |
| sunlight | part sun to full sun |
| water |  |
| spacing_inches | 12 |
| days_to_maturity | 98 |
| care_summary | Cucumber is an edible vegetable that grows in part sun to full sun. Space plants about 12 inches apart based on this source. |
| watch_out_for | Heavy feeder. Plan compost or richer soil support. |

- **duration_unit_normalized**: Normalized duration unit in harvest.duration.
- **yield_units_normalized**: Yield used units instead of unit; normalized to unit.

### eggplant (`eggplant.json`) — medium

| Column | Value |
| --- | --- |
| common_name | eggplant |
| scientific_name | Solanum melongena |
| category | vegetable |
| edible | true |
| sunlight | full sun |
| water |  |
| spacing_inches | 18 |
| days_to_maturity | 91 |
| care_summary | Eggplant is an edible vegetable that prefers full sun. Space plants about 18 inches apart based on this source. |
| watch_out_for | Light feeder. Avoid over-fertilizing unless soil tests suggest it. |

- **duration_unit_normalized**: Normalized duration unit in harvest.duration.
- **yield_units_normalized**: Yield used units instead of unit; normalized to unit.

### garlic (`garlic.json`) — medium

| Column | Value |
| --- | --- |
| common_name | garlic |
| scientific_name | Allium sativum |
| category | vegetable |
| edible | true |
| sunlight | full sun |
| water |  |
| spacing_inches | 4 |
| days_to_maturity | 7 |
| care_summary | Garlic is an edible vegetable that prefers full sun. Space plants about 4 inches apart based on this source. |
| watch_out_for | Light feeder. Avoid over-fertilizing unless soil tests suggest it. |

- **duration_unit_normalized**: Normalized duration unit in harvest.duration.
- **yield_units_normalized**: Yield used units instead of unit; normalized to unit.

### head-lettuce (`head lettuce.json`) — needs_review

| Column | Value |
| --- | --- |
| common_name | head lettuce |
| scientific_name | Lactuca sativa |
| category | vegetable |
| edible | true |
| sunlight | part shade to part sun |
| water |  |
| spacing_inches | 8 |
| days_to_maturity | 21 |
| care_summary | Head lettuce is an edible vegetable that grows in part shade to part sun. Space plants about 8 inches apart based on this source. |
| watch_out_for | Light feeder. Avoid over-fertilizing unless soil tests suggest it. Source data needs review before import. |

- **duration_unit_normalized**: Normalized duration unit in harvest.duration.
- **yield_units_normalized**: Yield used units instead of unit; normalized to unit.
- **planting_duration_suspicious**: Planting stage duration uses years; verify perennial vs crop data.

### kale (`kale.json`) — medium

| Column | Value |
| --- | --- |
| common_name | kale |
| scientific_name | Brassica oleracea |
| category | vegetable |
| edible | true |
| sunlight | part sun to full sun |
| water |  |
| spacing_inches | 15 |
| days_to_maturity | 133 |
| care_summary | Kale is an edible vegetable that grows in part sun to full sun. Space plants about 15 inches apart based on this source. |
| watch_out_for | Heavy feeder. Plan compost or richer soil support. |

- **duration_unit_normalized**: Normalized duration unit in harvest.duration.
- **yield_units_normalized**: Yield used units instead of unit; normalized to unit.

### leaf-lettuce (`leaf lettuce.json`) — needs_review

| Column | Value |
| --- | --- |
| common_name | leaf lettuce |
| scientific_name | Lactuca sativa |
| category | vegetable |
| edible | true |
| sunlight | part shade to part sun |
| water |  |
| spacing_inches | 8 |
| days_to_maturity | 21 |
| care_summary | Leaf lettuce is an edible vegetable that grows in part shade to part sun. Space plants about 8 inches apart based on this source. |
| watch_out_for | Light feeder. Avoid over-fertilizing unless soil tests suggest it. Source data needs review before import. |

- **duration_unit_normalized**: Normalized duration unit in harvest.duration.
- **yield_units_normalized**: Yield used units instead of unit; normalized to unit.
- **planting_duration_suspicious**: Planting stage duration uses years; verify perennial vs crop data.

### leek (`leek.json`) — medium

| Column | Value |
| --- | --- |
| common_name | leek |
| scientific_name | Allium porrum |
| category | vegetable |
| edible | true |
| sunlight | part sun to full sun |
| water |  |
| spacing_inches | 6 |
| days_to_maturity | 7 |
| care_summary | Leek is an edible vegetable that grows in part sun to full sun. Space plants about 6 inches apart based on this source. |
| watch_out_for | Light feeder. Avoid over-fertilizing unless soil tests suggest it. |

- **duration_unit_normalized**: Normalized duration unit in harvest.duration.
- **yield_units_normalized**: Yield used units instead of unit; normalized to unit.

### mustard (`mustard.json`) — medium

| Column | Value |
| --- | --- |
| common_name | mustard |
| scientific_name | Brassica juncea |
| category | vegetable |
| edible | true |
| sunlight | part shade to full sun |
| water |  |
| spacing_inches | 6 |
| days_to_maturity | 56 |
| care_summary | Mustard is an edible vegetable that grows in part shade to full sun. Space plants about 6 inches apart based on this source. |
| watch_out_for | Heavy feeder. Plan compost or richer soil support. |

- **duration_unit_normalized**: Normalized duration unit in harvest.duration.
- **yield_units_normalized**: Yield used units instead of unit; normalized to unit.

### okra (`okra.json`) — medium

| Column | Value |
| --- | --- |
| common_name | okra |
| scientific_name | Abelmoschus esculentus |
| category | vegetable |
| edible | true |
| sunlight | full sun |
| water |  |
| spacing_inches | 12 |
| days_to_maturity | 91 |
| care_summary | Okra is an edible vegetable that prefers full sun. Space plants about 12 inches apart based on this source. |
| watch_out_for | Heavy feeder. Plan compost or richer soil support. |

- **duration_unit_normalized**: Normalized duration unit in harvest.duration.
- **yield_units_normalized**: Yield used units instead of unit; normalized to unit.

### onion (`onion.json`) — medium

| Column | Value |
| --- | --- |
| common_name | onion |
| scientific_name | Allium cepa |
| category | vegetable |
| edible | true |
| sunlight | part shade to full sun |
| water |  |
| spacing_inches | 4 |
| days_to_maturity | 7 |
| care_summary | Onion is an edible vegetable that grows in part shade to full sun. Space plants about 4 inches apart based on this source. |
| watch_out_for | Light feeder. Avoid over-fertilizing unless soil tests suggest it. |

- **duration_unit_normalized**: Normalized duration unit in harvest.duration.
- **yield_units_normalized**: Yield used units instead of unit; normalized to unit.

### parsley (`parsley.json`) — medium

| Column | Value |
| --- | --- |
| common_name | parsley |
| scientific_name | Petroselinum crispum |
| category | herb |
| edible | true |
| sunlight | part sun to full sun |
| water |  |
| spacing_inches | 4 |
| days_to_maturity | 182 |
| care_summary | Parsley is an edible herb that grows in part sun to full sun. Space plants about 4 inches apart based on this source. |
| watch_out_for | Heavy feeder. Plan compost or richer soil support. Source data needs review before import. |

- **edible_part_typo_normalized**: Normalized edible part typo "leaft".
- **duration_unit_normalized**: Normalized duration unit in harvest.duration.

### parsnip (`parsnip.json`) — medium

| Column | Value |
| --- | --- |
| common_name | parsnip |
| scientific_name | Pastinaca sativa |
| category | vegetable |
| edible | true |
| sunlight | part sun to full sun |
| water |  |
| spacing_inches | 4 |
| days_to_maturity | 7 |
| care_summary | Parsnip is an edible vegetable that grows in part sun to full sun. Space plants about 4 inches apart based on this source. |
| watch_out_for | Light feeder. Avoid over-fertilizing unless soil tests suggest it. |

- **duration_unit_normalized**: Normalized duration unit in harvest.duration.

### pea (`pea.json`) — low

| Column | Value |
| --- | --- |
| common_name | pea |
| scientific_name | Pisum sativum |
| category | vegetable |
| edible | true |
| sunlight | part shade to full sun |
| water |  |
| spacing_inches | 4 |
| days_to_maturity | 84 |
| care_summary | Pea is an edible vegetable that grows in part shade to full sun. Space plants about 4 inches apart based on this source. |
| watch_out_for | Source data needs review before import. |

- **duration_unit_normalized**: Normalized duration unit in harvest.duration.
- **soil_impact_unknown**: Unknown soilImpact label.

### pole-pea (`pole pea.json`) — low

| Column | Value |
| --- | --- |
| common_name | pole pea |
| scientific_name | Pisum sativum |
| category | vegetable |
| edible | true |
| sunlight | part shade to full sun |
| water |  |
| spacing_inches | 4 |
| days_to_maturity | 84 |
| care_summary | Pole pea is an edible vegetable that grows in part shade to full sun. Space plants about 4 inches apart based on this source. |
| watch_out_for | Source data needs review before import. |

- **duration_unit_normalized**: Normalized duration unit in harvest.duration.
- **soil_impact_unknown**: Unknown soilImpact label.

### potato (`potato.json`) — medium

| Column | Value |
| --- | --- |
| common_name | potato |
| scientific_name | Solanum tuberosum |
| category | vegetable |
| edible | true |
| sunlight | full sun |
| water |  |
| spacing_inches | 9 |
| days_to_maturity | 7 |
| care_summary | Potato is an edible vegetable that prefers full sun. Space plants about 9 inches apart based on this source. |
| watch_out_for | Light feeder. Avoid over-fertilizing unless soil tests suggest it. |

- **duration_unit_normalized**: Normalized duration unit in harvest.duration.

### pumpkin (`pumpkin.json`) — medium

| Column | Value |
| --- | --- |
| common_name | pumpkin |
| scientific_name | Cucurbita maxima |
| category | vegetable |
| edible | true |
| sunlight | full sun |
| water |  |
| spacing_inches | 18 |
| days_to_maturity | 7 |
| care_summary | Pumpkin is an edible vegetable that prefers full sun. Space plants about 18 inches apart based on this source. |
| watch_out_for | Light feeder. Avoid over-fertilizing unless soil tests suggest it. |

- **duration_unit_normalized**: Normalized duration unit in harvest.duration.

### radish (`radish.json`) — medium

| Column | Value |
| --- | --- |
| common_name | radish |
| scientific_name | Rhaphanus sativus |
| category | vegetable |
| edible | true |
| sunlight | full sun |
| water |  |
| spacing_inches | 1 |
| days_to_maturity | 7 |
| care_summary | Radish is an edible vegetable that prefers full sun. Space plants about 1 inches apart based on this source. |
| watch_out_for | Light feeder. Avoid over-fertilizing unless soil tests suggest it. |

- **duration_unit_normalized**: Normalized duration unit in harvest.duration.

### rhubarb (`rhubarb.json`) — medium

| Column | Value |
| --- | --- |
| common_name | rhubarb |
| scientific_name | Rheum rhabarbarum |
| category | vegetable |
| edible | true |
| sunlight | full sun |
| water |  |
| spacing_inches | 24 |
| days_to_maturity | 7 |
| care_summary | Rhubarb is an edible vegetable that prefers full sun. Space plants about 24 inches apart based on this source. |
| watch_out_for | Heavy feeder. Plan compost or richer soil support. Source data needs review before import. |

- **duration_unit_normalized**: Normalized duration unit in harvest.duration.
- **planting_duration_years_perennial**: Planting stage duration uses years; plausible for a perennial in this source but verify locally.

### shallot (`shallot.json`) — medium

| Column | Value |
| --- | --- |
| common_name | shallot |
| scientific_name | Allium cepa |
| category | vegetable |
| edible | true |
| sunlight | part shade to full sun |
| water |  |
| spacing_inches | 4 |
| days_to_maturity | 7 |
| care_summary | Shallot is an edible vegetable that grows in part shade to full sun. Space plants about 4 inches apart based on this source. |
| watch_out_for | Light feeder. Avoid over-fertilizing unless soil tests suggest it. |

- **duration_unit_normalized**: Normalized duration unit in harvest.duration.

### spinach (`spinach.json`) — medium

| Column | Value |
| --- | --- |
| common_name | spinach |
| scientific_name | Cynara scolymus |
| category | vegetable |
| edible | true |
| sunlight | full sun |
| water |  |
| spacing_inches | 6 |
| days_to_maturity | 7 |
| care_summary | Spinach is an edible vegetable that prefers full sun. Space plants about 6 inches apart based on this source. |
| watch_out_for | Heavy feeder. Plan compost or richer soil support. |

- **duration_unit_normalized**: Normalized duration unit in harvest.duration.

### squash (`squash.json`) — medium

| Column | Value |
| --- | --- |
| common_name | squash |
| scientific_name | Cucurbita moschata |
| category | vegetable |
| edible | true |
| sunlight | full sun |
| water |  |
| spacing_inches | 15 |
| days_to_maturity | 126 |
| care_summary | Squash is an edible vegetable that prefers full sun. Space plants about 15 inches apart based on this source. |
| watch_out_for | Heavy feeder. Plan compost or richer soil support. |

- **duration_unit_normalized**: Normalized duration unit in harvest.duration.

### sweet-corn (`sweet corn.json`) — medium

| Column | Value |
| --- | --- |
| common_name | sweet corn |
| scientific_name | Zea mays |
| category | vegetable |
| edible | true |
| sunlight | full sun |
| water |  |
| spacing_inches | 15 |
| days_to_maturity | 7 |
| care_summary | Sweet corn is an edible vegetable that prefers full sun. Space plants about 15 inches apart based on this source. |
| watch_out_for | Heavy feeder. Plan compost or richer soil support. |

- **duration_unit_normalized**: Normalized duration unit in harvest.duration.

### swiss-chard (`swiss chard.json`) — medium

| Column | Value |
| --- | --- |
| common_name | swiss chard |
| scientific_name | Beta vulgaris |
| category | vegetable |
| edible | true |
| sunlight | full sun |
| water |  |
| spacing_inches | 8 |
| days_to_maturity | 336 |
| care_summary | Swiss chard is an edible vegetable that prefers full sun. Space plants about 8 inches apart based on this source. |
| watch_out_for | Heavy feeder. Plan compost or richer soil support. |

- **scientific_name_trimmed**: Trimmed trailing/leading whitespace from species.
- **duration_unit_normalized**: Normalized duration unit in harvest.duration.

### tomato (`tomato.json`) — low

| Column | Value |
| --- | --- |
| common_name | tomato |
| scientific_name | Lycopersicon esculentum |
| category | vegetable |
| edible | true |
| sunlight | full sun |
| water |  |
| spacing_inches | 4 |
| days_to_maturity | 7 |
| care_summary | Tomato is an edible vegetable that prefers full sun. Space plants about 4 inches apart based on this source. |
| watch_out_for | Light feeder. Avoid over-fertilizing unless soil tests suggest it. Source data needs review before import. Hardiness and harvest fields may need local adjustment. |

- **duration_unit_normalized**: Normalized duration unit in harvest.duration.
- **harvest_suspicious**: Tomato harvest window may be unrealistically short in this source.
- **harvest_suspicious**: Derived days_to_maturity from harvest is very short for this crop.

### turnip (`turnip.json`) — needs_review

| Column | Value |
| --- | --- |
| common_name | turnip |
| scientific_name | Brassica rapa |
| category | vegetable |
| edible | true |
| sunlight | part sun to full sun |
| water |  |
| spacing_inches | 18 |
| days_to_maturity | 91 |
| care_summary | Turnip is an edible vegetable that grows in part sun to full sun. Space plants about 18 inches apart based on this source. |
| watch_out_for | Heavy feeder. Plan compost or richer soil support. Source data needs review before import. |

- **duration_unit_normalized**: Normalized duration unit in harvest.duration.
- **planting_duration_suspicious**: Planting stage duration uses years; verify perennial vs crop data.
