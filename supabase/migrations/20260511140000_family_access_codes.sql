-- Hashed family access codes (no plaintext in DB). Join via SECURITY DEFINER RPCs only.

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;

CREATE TABLE public.family_access_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  household_id uuid NOT NULL REFERENCES public.households (id) ON DELETE CASCADE,
  code_hash text NOT NULL,
  role text NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  max_uses integer,
  use_count integer NOT NULL DEFAULT 0,
  expires_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT family_access_codes_role_check
    CHECK (role = ANY (ARRAY['owner'::text, 'admin'::text, 'editor'::text, 'viewer'::text])),
  CONSTRAINT family_access_codes_max_uses_check
    CHECK (max_uses IS NULL OR max_uses > 0),
  CONSTRAINT family_access_codes_use_count_check
    CHECK (use_count >= 0 AND (max_uses IS NULL OR use_count <= max_uses)),
  CONSTRAINT family_access_codes_code_hash_key UNIQUE (code_hash)
);

COMMENT ON COLUMN public.family_access_codes.code_hash IS
  'SHA-256 (hex) of UTF-8 bytes of lower(trim(user-entered code)). Plain codes are never stored.';

ALTER TABLE public.family_access_codes ENABLE ROW LEVEL SECURITY;

-- ---------------------------------------------------------------------------
-- Normalize + hash (shared by RPCs; not granted to clients)
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.family_access_code_hash(raw_code text)
RETURNS text
LANGUAGE sql
IMMUTABLE
SET search_path = public, extensions
AS $$
  SELECT encode(
    extensions.digest(convert_to(lower(trim(raw_code)), 'UTF8'), 'sha256'),
    'hex'
  );
$$;

REVOKE ALL ON FUNCTION public.family_access_code_hash(text) FROM PUBLIC;

-- ---------------------------------------------------------------------------
-- check_family_access_code: preview join eligibility (no use increment)
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.check_family_access_code(p_code text)
RETURNS TABLE (
  valid boolean,
  household_id uuid,
  household_name text,
  role text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
STABLE
AS $$
DECLARE
  v_hash text;
BEGIN
  v_hash := public.family_access_code_hash(p_code);

  RETURN QUERY
  SELECT
    true,
    fac.household_id,
    h.name,
    fac.role::text
  FROM public.family_access_codes fac
  INNER JOIN public.households h ON h.id = fac.household_id
  WHERE fac.code_hash = v_hash
    AND fac.is_active
    AND (fac.expires_at IS NULL OR fac.expires_at > now())
    AND (fac.max_uses IS NULL OR fac.use_count < fac.max_uses)
  LIMIT 1;

  IF NOT FOUND THEN
    RETURN QUERY
    SELECT false, NULL::uuid, NULL::text, NULL::text;
  END IF;
END;
$$;

-- ---------------------------------------------------------------------------
-- accept_family_access_code: add member and increment use_count
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.accept_family_access_code(
  p_code text,
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
SET search_path = public, extensions
AS $$
DECLARE
  v_hash text;
  v_fac_id uuid;
  v_household_id uuid;
  v_role text;
BEGIN
  IF auth.uid() IS NULL OR auth.uid() IS DISTINCT FROM new_user_id THEN
    RETURN QUERY SELECT false, NULL::uuid, NULL::text, 'Unauthorized'::text;
    RETURN;
  END IF;

  v_hash := public.family_access_code_hash(p_code);

  SELECT fac.id, fac.household_id, fac.role::text
  INTO v_fac_id, v_household_id, v_role
  FROM public.family_access_codes fac
  WHERE fac.code_hash = v_hash
    AND fac.is_active
    AND (fac.expires_at IS NULL OR fac.expires_at > now())
    AND (fac.max_uses IS NULL OR fac.use_count < fac.max_uses)
  FOR UPDATE OF fac;

  IF v_fac_id IS NULL THEN
    RETURN QUERY
    SELECT false, NULL::uuid, NULL::text, 'Invalid or expired access code'::text;
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

  UPDATE public.family_access_codes
  SET use_count = use_count + 1
  WHERE id = v_fac_id;

  RETURN QUERY SELECT true, v_household_id, v_role, NULL::text;
END;
$$;

REVOKE ALL ON FUNCTION public.check_family_access_code(text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.accept_family_access_code(text, uuid, text) FROM PUBLIC;

GRANT EXECUTE ON FUNCTION public.check_family_access_code(text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.accept_family_access_code(text, uuid, text) TO authenticated;

-- ---------------------------------------------------------------------------
-- Seed: editor access for Momma D's Garden (hash only; code distributed privately).
-- SHA-256 UTF-8 of lower(trim(...)) matches application + family_access_code_hash().
-- Canonical spelling: Momma-D-Youre-Done -> momma-d-youre-done
-- ---------------------------------------------------------------------------

INSERT INTO public.family_access_codes (
  household_id,
  code_hash,
  role,
  is_active,
  max_uses,
  expires_at
)
SELECT
  h.id,
  '6aff8d8d97df0c49490feba8bbdb4ddb6bfd2d849bbcfef471c55ed4e0fbbfc4',
  'editor',
  true,
  NULL,
  NULL
FROM public.households h
WHERE h.name = 'Momma D''s Garden'
ON CONFLICT (code_hash) DO UPDATE SET
  household_id = EXCLUDED.household_id,
  role = EXCLUDED.role,
  is_active = EXCLUDED.is_active,
  max_uses = EXCLUDED.max_uses,
  expires_at = EXCLUDED.expires_at;
