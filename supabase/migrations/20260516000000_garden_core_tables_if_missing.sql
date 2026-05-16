-- Phase E: ensure core garden tables exist (idempotent for repos missing base DDL).
-- RLS policies may already exist from 20260511120000; this migration only creates tables.

create table if not exists public.garden_areas (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households(id) on delete cascade,
  name text not null,
  group_type text not null default 'outdoor' check (group_type in ('outdoor', 'indoor')),
  description text,
  best_for text,
  watch_for text,
  weekly_action text,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists garden_areas_household_id_idx on public.garden_areas (household_id);

create table if not exists public.plant_library (
  id uuid primary key default gen_random_uuid(),
  common_name text not null,
  scientific_name text,
  category text,
  care_summary text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.plantings (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households(id) on delete cascade,
  garden_area_id uuid not null references public.garden_areas(id) on delete cascade,
  plant_library_id uuid references public.plant_library(id) on delete set null,
  nickname text not null,
  status text not null default 'growing',
  care_note text,
  planted_at date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists plantings_household_id_idx on public.plantings (household_id);
create index if not exists plantings_garden_area_id_idx on public.plantings (garden_area_id);

create table if not exists public.observations (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households(id) on delete cascade,
  garden_area_id uuid references public.garden_areas(id) on delete set null,
  planting_id uuid references public.plantings(id) on delete set null,
  note text not null,
  photo_url text,
  entry_type text not null default 'general',
  observed_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists observations_household_id_idx on public.observations (household_id);

create table if not exists public.care_tasks (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households(id) on delete cascade,
  garden_area_id uuid references public.garden_areas(id) on delete set null,
  planting_id uuid references public.plantings(id) on delete set null,
  title text not null,
  reason text,
  due_date date,
  priority text not null default 'normal',
  status text not null default 'open',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists care_tasks_household_id_idx on public.care_tasks (household_id);

alter table public.garden_areas enable row level security;
alter table public.plantings enable row level security;
alter table public.observations enable row level security;
alter table public.care_tasks enable row level security;
alter table public.plant_library enable row level security;
