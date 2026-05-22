-- ============================================================
-- ESG GO | vault_omni_core — 萬能聖碑表 (Single Table)
-- 5T 誠信協議 · SHA-256 Hash Lock · Dimension Architecture
-- Run in Supabase SQL Editor
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── Main Table ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.vault_omni_core (
  uuid        TEXT        PRIMARY KEY,
  dimension   TEXT        NOT NULL DEFAULT 'CORE'
                          CHECK (dimension IN ('IDENTITY','LOGIC','TRACE','CORE')),
  hash_lock   TEXT        NOT NULL,
  payload     JSONB       NOT NULL DEFAULT '{}',
  metadata    JSONB       NOT NULL DEFAULT '{}',
  timestamp   BIGINT      NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── Indexes ────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_vault_omni_dimension  ON public.vault_omni_core(dimension);
CREATE INDEX IF NOT EXISTS idx_vault_omni_timestamp  ON public.vault_omni_core(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_vault_omni_hash       ON public.vault_omni_core(hash_lock);
CREATE INDEX IF NOT EXISTS idx_vault_omni_payload_gri
  ON public.vault_omni_core USING gin (payload jsonb_path_ops);

-- ── updated_at trigger ─────────────────────────────────────
CREATE OR REPLACE FUNCTION public.handle_vault_omni_updated()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.created_at = COALESCE(OLD.created_at, NOW());
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS vault_omni_created_guard ON public.vault_omni_core;
CREATE TRIGGER vault_omni_created_guard
  BEFORE UPDATE ON public.vault_omni_core
  FOR EACH ROW EXECUTE FUNCTION public.handle_vault_omni_updated();

-- ── RLS: deny public, allow service_role ──────────────────
ALTER TABLE public.vault_omni_core ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "vault_omni_deny_all" ON public.vault_omni_core;
CREATE POLICY "vault_omni_deny_all"
  ON public.vault_omni_core
  FOR ALL TO public
  USING (false)
  WITH CHECK (false);

-- ── RPC: list_vault_omni (service_role only) ──────────────
CREATE OR REPLACE FUNCTION public.list_vault_omni(p_limit INT DEFAULT 50)
RETURNS SETOF public.vault_omni_core
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public AS $$
BEGIN
  RETURN QUERY
    SELECT * FROM public.vault_omni_core
    ORDER BY timestamp DESC
    LIMIT p_limit;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.list_vault_omni FROM PUBLIC, anon, authenticated;
GRANT  EXECUTE ON FUNCTION public.list_vault_omni TO service_role;

-- ── Seed: 2 example records ────────────────────────────────
INSERT INTO public.vault_omni_core (uuid, dimension, hash_lock, payload, metadata, timestamp)
VALUES
  (
    'seed-env-001',
    'CORE',
    'a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef12345678',
    '{"logic":{"formula":"範疇一 + 範疇二排放量","isoStandard":"ISO 14064-1","evidence":{"scope1":1250,"scope2":890}},"trace":{"sourceOrigin":"台電帳單 + ISO 14064-1 盤查清冊","actorId":"環安衛主任","griReference":"GRI 305-1"}}',
    '{"version":"1.0.0","iso":"ISO 14064-1","ui":"liquid-glass","griReference":"GRI 305-1"}',
    EXTRACT(EPOCH FROM NOW())::BIGINT * 1000
  ),
  (
    'seed-soc-001',
    'CORE',
    'b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456789a',
    '{"logic":{"formula":"當年度新進員工人數 ÷ 期初員工總數 × 100%","isoStandard":"GRI 401-1","evidence":{"newHires":45,"totalStaff":1250}},"trace":{"sourceOrigin":"人資系統匯出報表","actorId":"人資部","griReference":"GRI 401-1"}}',
    '{"version":"1.0.0","iso":"GRI 401-1","ui":"liquid-glass","griReference":"GRI 401-1"}',
    EXTRACT(EPOCH FROM NOW())::BIGINT * 1000 - 86400000
  )
ON CONFLICT (uuid) DO NOTHING;

-- ── Verification ───────────────────────────────────────────
SELECT uuid, dimension, hash_lock, timestamp
FROM public.vault_omni_core
ORDER BY timestamp DESC;