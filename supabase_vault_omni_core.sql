-- ============================================================
-- ESG GO | vault_omni_core — 萬能聖碑表 (Single Table)
-- 5T 誠信協議 · SHA-256 Hash Lock · Dimension Architecture
-- Version: 2.0.0 | 2026-05-25
-- Target: Supabase Cloud (yhwfmavnhaivvgzeuklx.supabase.co)
-- ============================================================

-- ── Prerequisites ───────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ── Main Table ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.vault_omni_core (
  uuid        TEXT        PRIMARY KEY
                          CHECK (length(uuid) > 0),
  dimension   TEXT        NOT NULL DEFAULT 'CORE'
                          CHECK (dimension IN ('IDENTITY','LOGIC','TRACE','CORE')),
  hash_lock   TEXT        NOT NULL
                          CHECK (length(hash_lock) = 64),    -- SHA-256 hex = 64 chars
  prev_hash   TEXT        CHECK (prev_hash IS NULL OR length(prev_hash) = 64),
  payload     JSONB       NOT NULL DEFAULT '{}',
  metadata    JSONB       NOT NULL DEFAULT '{}',
  actor_id    TEXT        NOT NULL DEFAULT 'system',          -- 操作者/節點 (5T - Identity)
  signature   TEXT,                                           -- 數位簽章 (5T - Trust)
  timestamp   BIGINT      NOT NULL
                          CHECK (timestamp > 0),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Comments ────────────────────────────────────────────────
COMMENT ON TABLE  public.vault_omni_core             IS 'ESG GO 萬能聖碑表 — 5T 誠信協議核心記錄';
COMMENT ON COLUMN public.vault_omni_core.uuid        IS '自定義唯一鍵 (可用 sha256 前綴或語義 ID)';
COMMENT ON COLUMN public.vault_omni_core.dimension   IS '資料維度: CORE/LOGIC/TRACE/IDENTITY';
COMMENT ON COLUMN public.vault_omni_core.hash_lock   IS 'SHA-256 雜湊鎖，64 字元十六進位';
COMMENT ON COLUMN public.vault_omni_core.prev_hash   IS '前一筆記錄的 hash_lock (鏈式防篡改)';
COMMENT ON COLUMN public.vault_omni_core.payload     IS '主資料體 (GRI 數據/公式/事件等)';
COMMENT ON COLUMN public.vault_omni_core.metadata    IS '版本/標準/UI 元資料';
COMMENT ON COLUMN public.vault_omni_core.actor_id    IS '操作者 ID (5T-Identity)';
COMMENT ON COLUMN public.vault_omni_core.signature   IS '數位簽章/憑證指紋 (5T-Trust)';
COMMENT ON COLUMN public.vault_omni_core.timestamp   IS 'Unix 毫秒時間戳';

-- ── Indexes ─────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_vault_omni_dimension  ON public.vault_omni_core (dimension);
CREATE INDEX IF NOT EXISTS idx_vault_omni_timestamp  ON public.vault_omni_core (timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_vault_omni_hash       ON public.vault_omni_core (hash_lock);
CREATE INDEX IF NOT EXISTS idx_vault_omni_prev_hash  ON public.vault_omni_core (prev_hash);
CREATE INDEX IF NOT EXISTS idx_vault_omni_actor      ON public.vault_omni_core (actor_id);
CREATE INDEX IF NOT EXISTS idx_vault_omni_created_at ON public.vault_omni_core (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_vault_omni_payload_gin
  ON public.vault_omni_core USING gin (payload jsonb_path_ops);
CREATE INDEX IF NOT EXISTS idx_vault_omni_metadata_gin
  ON public.vault_omni_core USING gin (metadata jsonb_path_ops);

-- ── Immutable created_at Guard Trigger ──────────────────────
CREATE OR REPLACE FUNCTION public.handle_vault_omni_immutable()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  -- created_at 不可修改
  NEW.created_at := OLD.created_at;
  -- hash_lock + timestamp 寫入後不可修改 (防篡改)
  IF NEW.hash_lock <> OLD.hash_lock THEN
    RAISE EXCEPTION 'vault_omni_core: hash_lock is immutable after insert';
  END IF;
  IF NEW.timestamp <> OLD.timestamp THEN
    RAISE EXCEPTION 'vault_omni_core: timestamp is immutable after insert';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS vault_omni_immutable_guard ON public.vault_omni_core;
CREATE TRIGGER vault_omni_immutable_guard
  BEFORE UPDATE ON public.vault_omni_core
  FOR EACH ROW EXECUTE FUNCTION public.handle_vault_omni_immutable();

-- ── RLS: deny public, allow only via SECURITY DEFINER RPCs ──
ALTER TABLE public.vault_omni_core ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "vault_omni_deny_all"        ON public.vault_omni_core;
DROP POLICY IF EXISTS "vault_omni_service_read"    ON public.vault_omni_core;

-- 全面封鎖 (讀寫都透過 SECURITY DEFINER 函數)
CREATE POLICY "vault_omni_deny_all"
  ON public.vault_omni_core
  FOR ALL TO public, anon, authenticated
  USING (false)
  WITH CHECK (false);

-- ── RPC 1: list_vault_omni ──────────────────────────────────
-- 分頁查詢，僅 service_role 可呼叫
CREATE OR REPLACE FUNCTION public.list_vault_omni(
  p_dimension TEXT    DEFAULT NULL,
  p_actor_id  TEXT    DEFAULT NULL,
  p_limit     INT     DEFAULT 50,
  p_offset    INT     DEFAULT 0
)
RETURNS SETOF public.vault_omni_core
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public AS $$
BEGIN
  RETURN QUERY
    SELECT * FROM public.vault_omni_core
    WHERE (p_dimension IS NULL OR dimension = p_dimension)
      AND (p_actor_id  IS NULL OR actor_id  = p_actor_id)
    ORDER BY timestamp DESC
    LIMIT  LEAST(p_limit, 200)   -- 最多 200 筆
    OFFSET p_offset;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.list_vault_omni FROM PUBLIC, anon, authenticated;
GRANT  EXECUTE ON FUNCTION public.list_vault_omni TO service_role;

-- ── RPC 2: insert_vault_omni ────────────────────────────────
-- 安全插入，service_role + authenticated 可呼叫
CREATE OR REPLACE FUNCTION public.insert_vault_omni(
  p_uuid      TEXT,
  p_dimension TEXT,
  p_hash_lock TEXT,
  p_prev_hash TEXT    DEFAULT NULL,
  p_payload   JSONB   DEFAULT '{}',
  p_metadata  JSONB   DEFAULT '{}',
  p_actor_id  TEXT    DEFAULT 'system',
  p_signature TEXT    DEFAULT NULL,
  p_timestamp BIGINT  DEFAULT NULL        -- NULL => 自動設為現在毫秒
)
RETURNS public.vault_omni_core
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public AS $$
DECLARE
  v_ts     BIGINT;
  v_record public.vault_omni_core;
BEGIN
  -- 基本驗證
  IF length(p_hash_lock) <> 64 THEN
    RAISE EXCEPTION 'insert_vault_omni: hash_lock must be 64 hex chars (got %)', length(p_hash_lock);
  END IF;
  IF p_dimension NOT IN ('IDENTITY','LOGIC','TRACE','CORE') THEN
    RAISE EXCEPTION 'insert_vault_omni: invalid dimension "%"', p_dimension;
  END IF;

  v_ts := COALESCE(p_timestamp, EXTRACT(EPOCH FROM NOW())::BIGINT * 1000);

  INSERT INTO public.vault_omni_core (
    uuid, dimension, hash_lock, prev_hash,
    payload, metadata, actor_id, signature, timestamp
  ) VALUES (
    p_uuid, p_dimension, p_hash_lock, p_prev_hash,
    p_payload, p_metadata, p_actor_id, p_signature, v_ts
  ) RETURNING * INTO v_record;

  RETURN v_record;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.insert_vault_omni FROM PUBLIC, anon;
GRANT  EXECUTE ON FUNCTION public.insert_vault_omni TO service_role, authenticated;

-- ── RPC 3: get_vault_chain ──────────────────────────────────
-- 取得某筆記錄的完整鏈路 (最多 50 層)
CREATE OR REPLACE FUNCTION public.get_vault_chain(p_uuid TEXT)
RETURNS TABLE (
  depth       INT,
  uuid        TEXT,
  dimension   TEXT,
  hash_lock   TEXT,
  prev_hash   TEXT,
  actor_id    TEXT,
  timestamp   BIGINT
)
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public AS $$
BEGIN
  RETURN QUERY
  WITH RECURSIVE chain AS (
    SELECT 0 AS depth, v.uuid, v.dimension, v.hash_lock, v.prev_hash, v.actor_id, v.timestamp
    FROM public.vault_omni_core v
    WHERE v.uuid = p_uuid
    UNION ALL
    SELECT c.depth + 1, v.uuid, v.dimension, v.hash_lock, v.prev_hash, v.actor_id, v.timestamp
    FROM public.vault_omni_core v
    JOIN chain c ON v.hash_lock = c.prev_hash
    WHERE c.depth < 49
  )
  SELECT * FROM chain ORDER BY depth;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.get_vault_chain FROM PUBLIC, anon;
GRANT  EXECUTE ON FUNCTION public.get_vault_chain TO service_role, authenticated;

-- ── Seed: Genesis Block (CORE) ──────────────────────────────
INSERT INTO public.vault_omni_core
  (uuid, dimension, hash_lock, prev_hash, payload, metadata, actor_id, timestamp)
VALUES
  (
    'seed-core-genesis',
    'CORE',
    'a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef12345678',
    '0000000000000000000000000000000000000000000000000000000000000000',
    '{
      "logic": {
        "formula": "範疇一 + 範疇二排放量",
        "isoStandard": "ISO 14064-1",
        "evidence": { "scope1_tCO2e": 1250, "scope2_tCO2e": 890, "total_tCO2e": 2140 }
      },
      "trace": {
        "sourceOrigin": "台電帳單 + ISO 14064-1 盤查清冊",
        "griReference": "GRI 305-1",
        "reportingYear": 2025
      }
    }',
    '{"version":"2.0.0","iso":"ISO 14064-1","ui":"liquid-glass","griReference":"GRI 305-1","chain":"genesis"}',
    'system-genesis',
    EXTRACT(EPOCH FROM NOW())::BIGINT * 1000
  ),
  (
    'seed-logic-gri401',
    'LOGIC',
    'b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456789a',
    'a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef12345678',
    '{
      "logic": {
        "formula": "當年度新進員工人數 ÷ 期初員工總數 × 100%",
        "isoStandard": "GRI 401-1",
        "evidence": { "newHires": 45, "totalStaff": 1250, "turnoverRate": 3.6 },
        "unit": "%",
        "result": 3.6
      },
      "trace": {
        "sourceOrigin": "人資系統匯出報表 (2025-Q4)",
        "griReference": "GRI 401-1",
        "reportingYear": 2025
      }
    }',
    '{"version":"2.0.0","iso":"GRI 401-1","ui":"liquid-glass","griReference":"GRI 401-1"}',
    'hr-admin-01',
    EXTRACT(EPOCH FROM NOW())::BIGINT * 1000 - 86400000
  ),
  (
    'seed-trace-apicall',
    'TRACE',
    'c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456789ab',
    'b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456789a',
    '{
      "event": "API_CALL",
      "endpoint": "/api/v1/carbon/calculate",
      "method": "POST",
      "statusCode": 200,
      "ip": "192.168.1.100",
      "userAgent": "ESG-GO-Client/2.0",
      "durationMs": 142
    }',
    '{"version":"2.0.0","type":"audit_log","severity":"INFO"}',
    'api-gateway',
    EXTRACT(EPOCH FROM NOW())::BIGINT * 1000 - 43200000
  ),
  (
    'seed-identity-admin',
    'IDENTITY',
    'd4e5f6789012345678901234567890abcdef1234567890abcdef123456789abcd',
    'c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456789ab',
    '{
      "role": "super_admin",
      "permissions": ["read:all","write:core","write:logic","admin:users"],
      "status": "active",
      "mfaEnabled": true,
      "lastLogin": "2025-05-24T17:00:00Z"
    }',
    '{"version":"2.0.0","auth_provider":"supabase","trust_level":"HIGH"}',
    'super-admin',
    EXTRACT(EPOCH FROM NOW())::BIGINT * 1000 - 21600000
  )
ON CONFLICT (uuid) DO NOTHING;

-- ── Verification ─────────────────────────────────────────────
SELECT
  dimension,
  COUNT(*)                                     AS records,
  MIN(to_timestamp(timestamp / 1000))::DATE    AS earliest,
  MAX(to_timestamp(timestamp / 1000))::DATE    AS latest
FROM public.vault_omni_core
GROUP BY dimension
ORDER BY dimension;