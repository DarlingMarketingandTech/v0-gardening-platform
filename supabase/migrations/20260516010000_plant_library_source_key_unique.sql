-- Phase 9B: plant_library columns needed for Heydenberk reference upserts + unique (source, source_key).
-- Idempotent; intended for preview/dev branches first. Does not change RLS policies.
-- Does not alter existing plant_library column definitions beyond ADD COLUMN IF NOT EXISTS.
-- Runs after 2026051600_garden_core_tables_if_missing.sql (table must exist).

alter table public.plant_library add column if not exists source text;
alter table public.plant_library add column if not exists source_key text;
alter table public.plant_library add column if not exists edible boolean not null default false;
alter table public.plant_library add column if not exists sunlight text;
alter table public.plant_library add column if not exists water text;
alter table public.plant_library add column if not exists spacing_inches integer;
alter table public.plant_library add column if not exists days_to_maturity integer;
alter table public.plant_library add column if not exists watch_out_for text;
alter table public.plant_library add column if not exists metadata jsonb not null default '{}'::jsonb;

create unique index if not exists plant_library_source_source_key_uidx
  on public.plant_library (source, source_key);
