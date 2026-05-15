-- Upgrade allowlist from first 2026051502 draft (claimed_household_id) to full schema.
-- Safe no-op when 2026051502 already created the final table shape.

alter table private.beta_allowlist
  add column if not exists city text,
  add column if not exists state text,
  add column if not exists country text default 'US',
  add column if not exists growing_zone text,
  add column if not exists notes text,
  add column if not exists is_enabled boolean not null default true,
  add column if not exists claimed_at timestamptz,
  add column if not exists claimed_by uuid references auth.users(id),
  add column if not exists household_id uuid references public.households(id);

do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'private'
      and table_name = 'beta_allowlist'
      and column_name = 'claimed_household_id'
  ) then
    update private.beta_allowlist
    set household_id = claimed_household_id
    where household_id is null
      and claimed_household_id is not null;

    alter table private.beta_allowlist drop column claimed_household_id;
  end if;
end $$;

alter table private.beta_allowlist alter column household_name drop not null;

create unique index if not exists beta_allowlist_email_lower_idx
on private.beta_allowlist (lower(email));

alter table private.beta_allowlist enable row level security;

revoke all on schema private from public;
revoke all on schema private from anon;
revoke all on schema private from authenticated;

revoke all on table private.beta_allowlist from public;
revoke all on table private.beta_allowlist from anon;
revoke all on table private.beta_allowlist from authenticated;
