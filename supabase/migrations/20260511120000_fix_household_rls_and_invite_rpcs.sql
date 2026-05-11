-- Fix infinite RLS recursion on household_members, tighten family_invites access,
-- add SECURITY DEFINER helpers and invite RPCs, household-scoped garden policies,
-- and seed/normalize Momma D's Garden invites.

-- Allow primary household "owner" role (was admin/editor/viewer only)
ALTER TABLE public.household_members DROP CONSTRAINT IF EXISTS household_members_role_check;
ALTER TABLE public.household_members ADD CONSTRAINT household_members_role_check
  CHECK (role = ANY (ARRAY['owner'::text, 'admin'::text, 'editor'::text, 'viewer'::text]));

ALTER TABLE public.family_invites DROP CONSTRAINT IF EXISTS family_invites_role_check;
ALTER TABLE public.family_invites ADD CONSTRAINT family_invites_role_check
  CHECK (role = ANY (ARRAY['owner'::text, 'admin'::text, 'editor'::text, 'viewer'::text]));

-- ---------------------------------------------------------------------------
-- Helper functions (SECURITY DEFINER bypasses RLS; no self-query in policies)
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.is_household_member(target_household_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.household_members hm
    WHERE hm.household_id = target_household_id
      AND hm.user_id = auth.uid()
  );
$$;

CREATE OR REPLACE FUNCTION public.is_household_owner_or_admin(target_household_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.household_members hm
    WHERE hm.household_id = target_household_id
      AND hm.user_id = auth.uid()
      AND hm.role IN ('owner', 'admin')
  );
$$;

-- ---------------------------------------------------------------------------
-- Invite checks / acceptance (avoid client reads on family_invites + households join)
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.check_family_invite(invite_email text)
RETURNS TABLE (
  invited boolean,
  household_id uuid,
  household_name text,
  role text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
BEGIN
  RETURN QUERY
  SELECT
    true,
    fi.household_id,
    h.name,
    fi.role::text
  FROM public.family_invites fi
  INNER JOIN public.households h ON h.id = fi.household_id
  WHERE lower(trim(fi.email)) = lower(trim(invite_email))
  LIMIT 1;

  IF NOT FOUND THEN
    RETURN QUERY
    SELECT false, NULL::uuid, NULL::text, NULL::text;
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION public.accept_family_invite(
  invite_email text,
  new_user_id uuid,
  display_name text
)
RETURNS TABLE (
  success boolean,
  household_id uuid,
  role text,
  error_message text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_auth_email text;
  v_household_id uuid;
  v_role text;
BEGIN
  IF auth.uid() IS NULL OR auth.uid() IS DISTINCT FROM new_user_id THEN
    RETURN QUERY SELECT false, NULL::uuid, NULL::text, 'Unauthorized'::text;
    RETURN;
  END IF;

  SELECT u.email INTO v_auth_email
  FROM auth.users u
  WHERE u.id = auth.uid();

  IF v_auth_email IS NULL THEN
    RETURN QUERY SELECT false, NULL::uuid, NULL::text, 'User not found'::text;
    RETURN;
  END IF;

  IF lower(trim(v_auth_email)) IS DISTINCT FROM lower(trim(invite_email)) THEN
    RETURN QUERY
    SELECT false, NULL::uuid, NULL::text, 'Email does not match this account'::text;
    RETURN;
  END IF;

  SELECT fi.household_id, fi.role::text
  INTO v_household_id, v_role
  FROM public.family_invites fi
  WHERE lower(trim(fi.email)) = lower(trim(invite_email))
  LIMIT 1;

  IF v_household_id IS NULL THEN
    RETURN QUERY SELECT false, NULL::uuid, NULL::text, 'No household invite found'::text;
    RETURN;
  END IF;

  v_role := COALESCE(NULLIF(trim(v_role), ''), 'editor');

  INSERT INTO public.household_members (household_id, user_id, role, display_name)
  VALUES (
    v_household_id,
    new_user_id,
    v_role,
    NULLIF(trim(display_name), '')
  )
  ON CONFLICT (household_id, user_id) DO UPDATE SET
    display_name = COALESCE(
      NULLIF(trim(excluded.display_name), ''),
      public.household_members.display_name
    );

  UPDATE public.family_invites
  SET accepted_at = COALESCE(accepted_at, now())
  WHERE lower(trim(email)) = lower(trim(invite_email));

  RETURN QUERY SELECT true, v_household_id, v_role, NULL::text;
END;
$$;

REVOKE ALL ON FUNCTION public.is_household_member(uuid) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.is_household_owner_or_admin(uuid) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.check_family_invite(text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.accept_family_invite(text, uuid, text) FROM PUBLIC;

GRANT EXECUTE ON FUNCTION public.is_household_member(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_household_owner_or_admin(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.check_family_invite(text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.accept_family_invite(text, uuid, text) TO authenticated;

-- ---------------------------------------------------------------------------
-- Drop recursive / broad policies
-- ---------------------------------------------------------------------------

DROP POLICY IF EXISTS household_members_own_access ON public.household_members;
DROP POLICY IF EXISTS households_own_access ON public.households;
DROP POLICY IF EXISTS family_invites_check_by_email ON public.family_invites;
DROP POLICY IF EXISTS care_tasks_household_access ON public.care_tasks;
DROP POLICY IF EXISTS garden_areas_household_access ON public.garden_areas;
DROP POLICY IF EXISTS plantings_household_access ON public.plantings;
DROP POLICY IF EXISTS observations_household_read ON public.observations;
DROP POLICY IF EXISTS observations_household_write ON public.observations;

-- ---------------------------------------------------------------------------
-- household_members
-- ---------------------------------------------------------------------------

CREATE POLICY household_members_select_own ON public.household_members
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY household_members_select_peers ON public.household_members
  FOR SELECT TO authenticated
  USING (public.is_household_member(household_id));

CREATE POLICY household_members_insert_admin ON public.household_members
  FOR INSERT TO authenticated
  WITH CHECK (public.is_household_owner_or_admin(household_id));

CREATE POLICY household_members_update_admin ON public.household_members
  FOR UPDATE TO authenticated
  USING (public.is_household_owner_or_admin(household_id))
  WITH CHECK (public.is_household_owner_or_admin(household_id));

CREATE POLICY household_members_delete_admin ON public.household_members
  FOR DELETE TO authenticated
  USING (public.is_household_owner_or_admin(household_id));

-- ---------------------------------------------------------------------------
-- households
-- ---------------------------------------------------------------------------

CREATE POLICY households_select_member ON public.households
  FOR SELECT TO authenticated
  USING (public.is_household_member(id));

CREATE POLICY households_update_admin ON public.households
  FOR UPDATE TO authenticated
  USING (public.is_household_owner_or_admin(id))
  WITH CHECK (public.is_household_owner_or_admin(id));

-- ---------------------------------------------------------------------------
-- family_invites: no broad SELECT; service role / migrations bypass RLS
-- ---------------------------------------------------------------------------

-- (RLS enabled with zero policies denies all for anon/auth — rely on RPCs.)

-- ---------------------------------------------------------------------------
-- Garden data tables
-- ---------------------------------------------------------------------------

CREATE POLICY garden_areas_household_member_all ON public.garden_areas
  FOR ALL TO authenticated
  USING (public.is_household_member(household_id))
  WITH CHECK (public.is_household_member(household_id));

CREATE POLICY plantings_household_member_all ON public.plantings
  FOR ALL TO authenticated
  USING (public.is_household_member(household_id))
  WITH CHECK (public.is_household_member(household_id));

CREATE POLICY care_tasks_household_member_all ON public.care_tasks
  FOR ALL TO authenticated
  USING (public.is_household_member(household_id))
  WITH CHECK (public.is_household_member(household_id));

CREATE POLICY observations_household_member_all ON public.observations
  FOR ALL TO authenticated
  USING (public.is_household_member(household_id))
  WITH CHECK (public.is_household_member(household_id));

-- ---------------------------------------------------------------------------
-- plant_library: read for signed-in users; writes for owner/admin of any household
-- ---------------------------------------------------------------------------

DROP POLICY IF EXISTS plant_library_read ON public.plant_library;

CREATE POLICY plant_library_select_authenticated ON public.plant_library
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY plant_library_insert_owner_admin ON public.plant_library
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.household_members hm
      WHERE hm.user_id = auth.uid()
        AND hm.role IN ('owner', 'admin')
    )
  );

CREATE POLICY plant_library_update_owner_admin ON public.plant_library
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.household_members hm
      WHERE hm.user_id = auth.uid()
        AND hm.role IN ('owner', 'admin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.household_members hm
      WHERE hm.user_id = auth.uid()
        AND hm.role IN ('owner', 'admin')
    )
  );

CREATE POLICY plant_library_delete_owner_admin ON public.plant_library
  FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.household_members hm
      WHERE hm.user_id = auth.uid()
        AND hm.role IN ('owner', 'admin')
    )
  );

-- ---------------------------------------------------------------------------
-- Seed / normalize invites (case-insensitive storage; canonical lowercase)
-- ---------------------------------------------------------------------------

UPDATE public.family_invites
SET email = lower(trim(email));

INSERT INTO public.family_invites (email, household_id, role)
SELECT 'ejdarling14@gmail.com', h.id, 'editor'
FROM public.households h
WHERE h.name = 'Momma D''s Garden'
ON CONFLICT (email) DO UPDATE SET
  household_id = EXCLUDED.household_id,
  role = EXCLUDED.role;

INSERT INTO public.family_invites (email, household_id, role)
SELECT 'hoosierdarling@gmail.com', h.id, 'owner'
FROM public.households h
WHERE h.name = 'Momma D''s Garden'
ON CONFLICT (email) DO UPDATE SET
  household_id = EXCLUDED.household_id,
  role = EXCLUDED.role;
