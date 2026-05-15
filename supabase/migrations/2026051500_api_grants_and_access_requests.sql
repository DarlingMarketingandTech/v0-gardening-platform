grant usage on schema public to authenticated;

grant select, insert, update, delete
on table
  public.profiles,
  public.households,
  public.household_members,
  public.family_invites,
  public.garden_areas,
  public.plantings,
  public.observations,
  public.care_tasks
to authenticated;

grant select
on table public.plant_library
to anon, authenticated;

do $$
begin
  create type public.access_request_status as enum ('pending', 'approved', 'denied');
exception
  when duplicate_object then null;
end $$;

create table if not exists public.access_requests (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  email text not null,
  display_name text,
  status public.access_request_status not null default 'pending',
  requested_at timestamptz not null default now(),
  reviewed_by uuid references auth.users(id),
  reviewed_at timestamptz,
  review_note text,
  unique (household_id, user_id)
);

alter table public.access_requests enable row level security;

grant select, insert, update, delete
on table public.access_requests
to authenticated;

drop policy if exists access_requests_own_insert on public.access_requests;
create policy access_requests_own_insert
on public.access_requests
for insert
to authenticated
with check (
  user_id = auth.uid()
  and status = 'pending'
);

drop policy if exists access_requests_own_read on public.access_requests;
create policy access_requests_own_read
on public.access_requests
for select
to authenticated
using (
  user_id = auth.uid()
  or public.is_household_owner_or_admin(household_id)
);

drop policy if exists access_requests_admin_update on public.access_requests;
create policy access_requests_admin_update
on public.access_requests
for update
to authenticated
using (public.is_household_owner_or_admin(household_id))
with check (public.is_household_owner_or_admin(household_id));

create or replace function public.request_household_access(
  p_household_id uuid,
  p_display_name text default null
)
returns uuid
language plpgsql
security definer
set search_path = public, auth, pg_catalog
as $$
declare
  v_user_id uuid;
  v_email text;
  v_request_id uuid;
begin
  v_user_id := auth.uid();

  if v_user_id is null then
    raise exception 'Not authenticated';
  end if;

  select email
  into v_email
  from auth.users
  where id = v_user_id;

  if exists (
    select 1
    from public.household_members hm
    where hm.household_id = p_household_id
      and hm.user_id = v_user_id
  ) then
    return p_household_id;
  end if;

  insert into public.access_requests (
    household_id,
    user_id,
    email,
    display_name,
    status
  )
  values (
    p_household_id,
    v_user_id,
    coalesce(v_email, ''),
    nullif(p_display_name, ''),
    'pending'
  )
  on conflict (household_id, user_id)
  do update set
    email = excluded.email,
    display_name = coalesce(excluded.display_name, public.access_requests.display_name)
  returning id into v_request_id;

  return v_request_id;
end;
$$;

create or replace function public.approve_access_request(
  p_request_id uuid,
  p_role public.household_role default 'member'
)
returns uuid
language plpgsql
security definer
set search_path = public, auth, pg_catalog
as $$
declare
  v_request public.access_requests%rowtype;
  v_reviewer uuid;
begin
  v_reviewer := auth.uid();

  if v_reviewer is null then
    raise exception 'Not authenticated';
  end if;

  select *
  into v_request
  from public.access_requests
  where id = p_request_id
  for update;

  if v_request.id is null then
    raise exception 'Access request not found';
  end if;

  if not public.is_household_owner_or_admin(v_request.household_id) then
    raise exception 'Not allowed';
  end if;

  update public.access_requests
  set
    status = 'approved',
    reviewed_by = v_reviewer,
    reviewed_at = now()
  where id = p_request_id;

  insert into public.household_members (
    household_id,
    user_id,
    role,
    invited_by
  )
  values (
    v_request.household_id,
    v_request.user_id,
    p_role,
    v_reviewer
  )
  on conflict (household_id, user_id)
  do update set role = excluded.role;

  return v_request.household_id;
end;
$$;

create or replace function public.deny_access_request(
  p_request_id uuid,
  p_review_note text default null
)
returns boolean
language plpgsql
security definer
set search_path = public, auth, pg_catalog
as $$
declare
  v_request public.access_requests%rowtype;
  v_reviewer uuid;
begin
  v_reviewer := auth.uid();

  if v_reviewer is null then
    raise exception 'Not authenticated';
  end if;

  select *
  into v_request
  from public.access_requests
  where id = p_request_id
  for update;

  if v_request.id is null then
    raise exception 'Access request not found';
  end if;

  if not public.is_household_owner_or_admin(v_request.household_id) then
    raise exception 'Not allowed';
  end if;

  update public.access_requests
  set
    status = 'denied',
    reviewed_by = v_reviewer,
    reviewed_at = now(),
    review_note = p_review_note
  where id = p_request_id;

  return true;
end;
$$;

revoke execute on function public.request_household_access(uuid, text) from anon;
revoke execute on function public.approve_access_request(uuid, public.household_role) from anon;
revoke execute on function public.deny_access_request(uuid, text) from anon;

grant execute on function public.request_household_access(uuid, text) to authenticated;
grant execute on function public.approve_access_request(uuid, public.household_role) to authenticated;
grant execute on function public.deny_access_request(uuid, text) to authenticated;
