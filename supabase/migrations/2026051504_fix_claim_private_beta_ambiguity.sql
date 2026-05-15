-- Fix ambiguous household_id in claim_private_beta_household (RETURNS TABLE vs column name).

create or replace function public.claim_private_beta_household()
returns table (
  success boolean,
  household_id uuid,
  role text,
  error_message text
)
language plpgsql
security definer
set search_path = public, private, auth, pg_catalog
as $$
declare
  v_user_id uuid;
  v_email text;
  v_display_name text;
  v_allowlist private.beta_allowlist%rowtype;
  v_household_id uuid;
  v_existing_role text;
begin
  v_user_id := auth.uid();

  if v_user_id is null then
    return query
    select false, null::uuid, null::text, 'Not authenticated'::text;
    return;
  end if;

  select
    u.email,
    coalesce(
      nullif(u.raw_user_meta_data ->> 'full_name', ''),
      split_part(u.email, '@', 1)
    )
  into
    v_email,
    v_display_name
  from auth.users u
  where u.id = v_user_id;

  if v_email is null then
    return query
    select false, null::uuid, null::text, 'No email found for user'::text;
    return;
  end if;

  select
    hm.household_id,
    hm.role::text
  into
    v_household_id,
    v_existing_role
  from public.household_members hm
  where hm.user_id = v_user_id
  order by hm.created_at asc
  limit 1;

  if v_household_id is not null then
    update private.beta_allowlist ba
    set
      claimed_at = coalesce(ba.claimed_at, now()),
      claimed_by = coalesce(ba.claimed_by, v_user_id),
      household_id = coalesce(ba.household_id, v_household_id)
    where lower(ba.email) = lower(v_email);

    return query
    select true, v_household_id, coalesce(v_existing_role, 'owner')::text, null::text;
    return;
  end if;

  select *
  into v_allowlist
  from private.beta_allowlist
  where lower(email) = lower(v_email)
    and is_enabled = true
  limit 1
  for update;

  if v_allowlist.email is null then
    return query
    select false, null::uuid, null::text, 'This email is not on the private beta allowlist yet.'::text;
    return;
  end if;

  insert into public.households (
    name,
    location_label,
    city,
    state,
    country,
    timezone,
    growing_zone,
    notes,
    created_by
  )
  values (
    coalesce(
      nullif(v_allowlist.household_name, ''),
      concat(coalesce(nullif(v_allowlist.display_name, ''), v_display_name), '''s Garden')
    ),
    v_allowlist.location_label,
    v_allowlist.city,
    v_allowlist.state,
    coalesce(v_allowlist.country, 'US'),
    coalesce(v_allowlist.timezone, 'America/New_York'),
    v_allowlist.growing_zone,
    v_allowlist.notes,
    v_user_id
  )
  returning id into v_household_id;

  insert into public.household_members (
    household_id,
    user_id,
    role,
    invited_by
  )
  values (
    v_household_id,
    v_user_id,
    'owner',
    v_user_id
  )
  on conflict (household_id, user_id)
  do update set role = 'owner';

  insert into public.profiles (
    user_id,
    email,
    display_name
  )
  values (
    v_user_id,
    v_email,
    coalesce(nullif(v_allowlist.display_name, ''), v_display_name)
  )
  on conflict (user_id)
  do update set
    email = excluded.email,
    display_name = coalesce(
      nullif(public.profiles.display_name, ''),
      excluded.display_name
    ),
    updated_at = now();

  update private.beta_allowlist ba
  set
    claimed_at = now(),
    claimed_by = v_user_id,
    household_id = v_household_id
  where lower(ba.email) = lower(v_email);

  return query
  select true, v_household_id, 'owner'::text, null::text;
exception
  when others then
    return query
    select false, null::uuid, null::text, sqlerrm::text;
end;
$$;
