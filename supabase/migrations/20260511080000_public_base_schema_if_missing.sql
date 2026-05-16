-- Phase 9B.0: Greenfield-safe public base schema (idempotent).
-- Creates enums and core tables that later migrations assumed existed from out-of-repo DDL.
-- Timestamp is before 20260511120000 so replay succeeds on an empty preview branch.
-- Also backfills columns when this migration is applied after older partial DDL (e.g. 2026051600).
-- Does not seed data, change RLS policy definitions, or create access_requests (see 2026051500).

-- ---------------------------------------------------------------------------
-- Enum types (idempotent)
-- ---------------------------------------------------------------------------

do $$
begin
  create type public.household_role as enum (
    'owner', 'admin', 'member', 'editor', 'viewer'
  );
exception
  when duplicate_object then null;
end
$$;

do $$
begin
  create type public.space_kind as enum ('outdoor', 'indoor');
exception
  when duplicate_object then null;
end
$$;

do $$
begin
  create type public.planting_status as enum (
    'planned',
    'getting_started',
    'growing',
    'ready_soon',
    'harvesting',
    'finished'
  );
exception
  when duplicate_object then null;
end
$$;

do $$
begin
  create type public.observation_kind as enum (
    'note',
    'photo',
    'planted',
    'watered',
    'fertilized',
    'pruned',
    'pest',
    'disease',
    'harvest'
  );
exception
  when duplicate_object then null;
end
$$;

do $$
begin
  create type public.task_priority as enum ('low', 'normal', 'high');
exception
  when duplicate_object then null;
end
$$;

do $$
begin
  create type public.task_status as enum ('open', 'done', 'skipped');
exception
  when duplicate_object then null;
end
$$;

do $$
begin
  create type public.access_request_status as enum ('pending', 'approved', 'denied');
exception
  when duplicate_object then null;
end
$$;

-- ---------------------------------------------------------------------------
-- Core tables (create if missing; align with main Supabase shape)
-- ---------------------------------------------------------------------------

create table if not exists public.profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  email text,
  display_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.households (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  location_label text,
  city text,
  state text,
  country text default 'US',
  timezone text,
  latitude double precision,
  longitude double precision,
  growing_zone text,
  notes text,
  created_by uuid references auth.users (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.plant_library (
  id uuid primary key default gen_random_uuid(),
  source text not null,
  source_key text not null,
  common_name text not null,
  scientific_name text,
  category text,
  edible boolean,
  sunlight text,
  water text,
  spacing_inches integer,
  days_to_maturity integer,
  care_summary text,
  watch_out_for text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.household_members (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  role text not null default 'member',
  display_name text,
  invited_by uuid references auth.users (id),
  created_at timestamptz not null default now()
);

create table if not exists public.family_invites (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households (id) on delete cascade,
  email text not null,
  role text not null default 'member',
  invited_by uuid references auth.users (id),
  token text,
  accepted_at timestamptz,
  accepted_by uuid references auth.users (id),
  expires_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.garden_areas (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households (id) on delete cascade,
  parent_area_id uuid references public.garden_areas (id) on delete set null,
  name text not null,
  kind public.space_kind not null default 'outdoor'::public.space_kind,
  area_type text not null default 'bed',
  light_profile text,
  soil_notes text,
  water_notes text,
  best_for text,
  watch_for text,
  sort_order integer not null default 0,
  archived_at timestamptz,
  created_by uuid references auth.users (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.plantings (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households (id) on delete cascade,
  garden_area_id uuid not null references public.garden_areas (id) on delete cascade,
  plant_library_id uuid references public.plant_library (id) on delete set null,
  nickname text,
  variety text,
  status public.planting_status not null default 'planned'::public.planting_status,
  planted_on date,
  expected_harvest_start date,
  expected_harvest_end date,
  care_note text,
  created_by uuid references auth.users (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.observations (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households (id) on delete cascade,
  garden_area_id uuid references public.garden_areas (id) on delete set null,
  planting_id uuid references public.plantings (id) on delete set null,
  kind public.observation_kind not null,
  note text,
  photo_url text,
  photo_storage_key text,
  ai_summary text,
  observed_at timestamptz not null default now(),
  created_by uuid references auth.users (id),
  created_at timestamptz not null default now()
);

create table if not exists public.care_tasks (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households (id) on delete cascade,
  garden_area_id uuid references public.garden_areas (id) on delete set null,
  planting_id uuid references public.plantings (id) on delete set null,
  title text not null,
  reason text,
  due_date date,
  priority public.task_priority not null default 'normal'::public.task_priority,
  status public.task_status not null default 'open'::public.task_status,
  completed_at timestamptz,
  created_by uuid references auth.users (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Additive column backfill (late-applied migration / older 2026051600 shapes)
-- ---------------------------------------------------------------------------

alter table public.profiles
  add column if not exists email text,
  add column if not exists display_name text,
  add column if not exists avatar_url text,
  add column if not exists created_at timestamptz default now(),
  add column if not exists updated_at timestamptz default now();

alter table public.households
  add column if not exists location_label text,
  add column if not exists city text,
  add column if not exists state text,
  add column if not exists country text default 'US',
  add column if not exists timezone text,
  add column if not exists latitude double precision,
  add column if not exists longitude double precision,
  add column if not exists growing_zone text,
  add column if not exists notes text,
  add column if not exists created_by uuid references auth.users (id),
  add column if not exists created_at timestamptz default now(),
  add column if not exists updated_at timestamptz default now();

alter table public.plant_library
  add column if not exists source text,
  add column if not exists source_key text,
  add column if not exists common_name text,
  add column if not exists scientific_name text,
  add column if not exists category text,
  add column if not exists edible boolean,
  add column if not exists sunlight text,
  add column if not exists water text,
  add column if not exists spacing_inches integer,
  add column if not exists days_to_maturity integer,
  add column if not exists care_summary text,
  add column if not exists watch_out_for text,
  add column if not exists metadata jsonb default '{}'::jsonb,
  add column if not exists created_at timestamptz default now(),
  add column if not exists updated_at timestamptz default now();

alter table public.household_members
  add column if not exists display_name text,
  add column if not exists invited_by uuid references auth.users (id),
  add column if not exists created_at timestamptz default now();

alter table public.family_invites
  add column if not exists token text,
  add column if not exists accepted_at timestamptz,
  add column if not exists accepted_by uuid references auth.users (id),
  add column if not exists expires_at timestamptz,
  add column if not exists created_at timestamptz default now();

alter table public.garden_areas
  add column if not exists parent_area_id uuid references public.garden_areas (id) on delete set null,
  add column if not exists kind public.space_kind default 'outdoor'::public.space_kind,
  add column if not exists area_type text default 'bed',
  add column if not exists light_profile text,
  add column if not exists soil_notes text,
  add column if not exists water_notes text,
  add column if not exists best_for text,
  add column if not exists watch_for text,
  add column if not exists sort_order integer default 0,
  add column if not exists archived_at timestamptz,
  add column if not exists created_by uuid references auth.users (id),
  add column if not exists created_at timestamptz default now(),
  add column if not exists updated_at timestamptz default now();

-- Map legacy group_type (2026051600) into space_kind when that column exists.
do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'garden_areas'
      and column_name = 'group_type'
  ) then
    update public.garden_areas ga
    set kind = 'indoor'::public.space_kind
    where ga.group_type = 'indoor'
      and ga.kind is not distinct from 'outdoor'::public.space_kind;
  end if;
end
$$;

alter table public.plantings
  add column if not exists plant_library_id uuid references public.plant_library (id) on delete set null,
  add column if not exists variety text,
  add column if not exists planted_on date,
  add column if not exists expected_harvest_start date,
  add column if not exists expected_harvest_end date,
  add column if not exists care_note text,
  add column if not exists created_by uuid references auth.users (id),
  add column if not exists created_at timestamptz default now(),
  add column if not exists updated_at timestamptz default now();

-- Enum-backed status when legacy text "status" column is absent (greenfield / new tables).
do $$
begin
  if not exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'plantings'
      and column_name = 'status'
  ) then
    alter table public.plantings
      add column status public.planting_status not null default 'planned'::public.planting_status;
  end if;
end
$$;

alter table public.observations
  add column if not exists garden_area_id uuid references public.garden_areas (id) on delete set null,
  add column if not exists planting_id uuid references public.plantings (id) on delete set null,
  add column if not exists photo_url text,
  add column if not exists photo_storage_key text,
  add column if not exists ai_summary text,
  add column if not exists observed_at timestamptz default now(),
  add column if not exists created_by uuid references auth.users (id),
  add column if not exists created_at timestamptz default now();

do $$
begin
  if not exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'observations'
      and column_name = 'kind'
  ) then
    alter table public.observations
      add column kind public.observation_kind not null default 'note'::public.observation_kind;
  end if;
end
$$;

alter table public.observations
  add column if not exists note text;

alter table public.care_tasks
  add column if not exists garden_area_id uuid references public.garden_areas (id) on delete set null,
  add column if not exists planting_id uuid references public.plantings (id) on delete set null,
  add column if not exists reason text,
  add column if not exists due_date date,
  add column if not exists completed_at timestamptz,
  add column if not exists created_by uuid references auth.users (id),
  add column if not exists created_at timestamptz default now(),
  add column if not exists updated_at timestamptz default now();

do $$
begin
  if not exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'care_tasks'
      and column_name = 'priority'
  ) then
    alter table public.care_tasks
      add column priority public.task_priority not null default 'normal'::public.task_priority;
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'care_tasks'
      and column_name = 'status'
  ) then
    alter table public.care_tasks
      add column status public.task_status not null default 'open'::public.task_status;
  end if;
end
$$;

-- ---------------------------------------------------------------------------
-- Indexes & defaults
-- ---------------------------------------------------------------------------

alter table public.household_members
  alter column role set default 'member';

create unique index if not exists household_members_household_user_uidx
  on public.household_members (household_id, user_id);

create index if not exists household_members_household_id_idx
  on public.household_members (household_id);

create index if not exists household_members_user_id_idx
  on public.household_members (user_id);

create unique index if not exists family_invites_email_uidx
  on public.family_invites (email);

create index if not exists family_invites_household_id_idx
  on public.family_invites (household_id);

create index if not exists garden_areas_household_id_idx
  on public.garden_areas (household_id);

create index if not exists plantings_household_id_idx
  on public.plantings (household_id);

create index if not exists plantings_garden_area_id_idx
  on public.plantings (garden_area_id);

create index if not exists observations_household_id_idx
  on public.observations (household_id);

create index if not exists care_tasks_household_id_idx
  on public.care_tasks (household_id);

-- ---------------------------------------------------------------------------
-- RLS: later migrations attach policies; tables must have RLS enabled first
-- ---------------------------------------------------------------------------

alter table public.profiles enable row level security;
alter table public.households enable row level security;
alter table public.household_members enable row level security;
alter table public.family_invites enable row level security;
alter table public.garden_areas enable row level security;
alter table public.plantings enable row level security;
alter table public.observations enable row level security;
alter table public.care_tasks enable row level security;
alter table public.plant_library enable row level security;
