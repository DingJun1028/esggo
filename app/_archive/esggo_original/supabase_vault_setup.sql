-- ============================================================
-- ESG GO | Evidence Vault — Supabase Vault + RLS Setup
-- Run in Supabase SQL Editor
-- ============================================================

-- 1. Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "supabase_vault";

-- 2. Ensure evidence_vault table has needed columns
ALTER TABLE public.evidence_vault
  ADD COLUMN IF NOT EXISTS company_id   TEXT DEFAULT 'default',
  ADD COLUMN IF NOT EXISTS source_url   TEXT,
  ADD COLUMN IF NOT EXISTS file_size    NUMERIC,
  ADD COLUMN IF NOT EXISTS is_sealed    BOOLEAN DEFAULT FALSE;

-- 3. RLS — deny ALL for public/authenticated (service_role bypasses RLS)
ALTER TABLE public.evidence_vault ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "evidence_vault_deny_all" ON public.evidence_vault;
CREATE POLICY "evidence_vault_deny_all"
  ON public.evidence_vault
  FOR ALL
  TO public
  USING (false)
  WITH CHECK (false);

-- 4. RPC: create_evidence_seal (service_role only)
CREATE OR REPLACE FUNCTION public.create_evidence_seal(
  p_secret      TEXT,
  p_name        TEXT,
  p_description TEXT DEFAULT ''
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, vault
AS $$
DECLARE
  v_secret_id UUID;
  v_role TEXT;
BEGIN
  v_role := coalesce(
    current_setting('request.jwt.claims', true)::json->>'role',
    current_user
  );

  IF v_role = 'authenticated' OR v_role = 'anon' THEN
    RAISE EXCEPTION 'Access denied: service_role only.';
  END IF;

  -- Check if secret with same name exists; update or create
  SELECT id INTO v_secret_id FROM vault.secrets WHERE name = p_name LIMIT 1;

  IF v_secret_id IS NOT NULL THEN
    UPDATE vault.secrets
      SET secret = p_secret, description = p_description
      WHERE id = v_secret_id;
  ELSE
    INSERT INTO vault.secrets (secret, name, description)
      VALUES (p_secret, p_name, p_description)
      RETURNING id INTO v_secret_id;
  END IF;

  RETURN v_secret_id;
END;
$$;

-- 5. RPC: get_decrypted_seal (service_role only)
CREATE OR REPLACE FUNCTION public.get_decrypted_seal(p_name TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, vault
AS $$
DECLARE
  v_decrypted TEXT;
  v_role TEXT;
BEGIN
  v_role := coalesce(
    current_setting('request.jwt.claims', true)::json->>'role',
    current_user
  );

  IF v_role = 'authenticated' OR v_role = 'anon' THEN
    RAISE EXCEPTION 'Access denied: service_role only.';
  END IF;

  SELECT decrypted_secret INTO v_decrypted
    FROM vault.decrypted_secrets
    WHERE name = p_name
    LIMIT 1;

  RETURN v_decrypted;
END;
$$;

-- 6. Revoke public execute on RPC functions
REVOKE EXECUTE ON FUNCTION public.create_evidence_seal FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.get_decrypted_seal   FROM PUBLIC, anon, authenticated;
GRANT  EXECUTE ON FUNCTION public.create_evidence_seal TO service_role;
GRANT  EXECUTE ON FUNCTION public.get_decrypted_seal   TO service_role;

-- 7. Verify setup
SELECT routine_name, security_type
  FROM information_schema.routines
  WHERE routine_schema = 'public'
    AND routine_name IN ('create_evidence_seal', 'get_decrypted_seal');