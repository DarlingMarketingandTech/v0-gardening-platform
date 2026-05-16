-- Heydenberk Phase 9B — verification snippets for a Supabase *preview* branch only.
-- Do not run against production unless explicitly instructed.

-- Row count for this source
select count(*) as heydenberk_row_count
from public.plant_library
where source = 'heydenberk/gardening-data';

-- Sample rows
select source_key, common_name, scientific_name, category, source
from public.plant_library
where source = 'heydenberk/gardening-data'
order by source_key
limit 10;

-- Rows carrying import warnings in metadata
select source_key, metadata->'importWarnings' as import_warnings
from public.plant_library
where source = 'heydenberk/gardening-data'
  and jsonb_array_length(coalesce(metadata->'importWarnings', '[]'::jsonb)) > 0;
