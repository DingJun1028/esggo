-- ======================================================
-- InfoOne v8.1.0 - Supabase Database Schema
-- Goal: 5T Protocol Integration & Impact Nexus Foundation
-- ======================================================

-- 1.1 evidence_vault（永恆宮殿 - 不可篡改數據存儲）
CREATE TABLE IF NOT EXISTS evidence_vault (
  uuid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  timestamp BIGINT NOT NULL,                    -- [Trackable] Unix 時間戳
  formula TEXT NOT NULL,                        -- [Transparent] 公開算法公式
  impact_metric JSONB NOT NULL,                 -- [Tangible] 具體影響指標
  hash_lock TEXT NOT NULL UNIQUE,               -- [Trustworthy] SHA-256 雜湊鎖
  source_origin TEXT NOT NULL,                  -- [Traceable] 數據來源
  lifecycle_stage TEXT NOT NULL,                -- [Trackable] 生命週期階段
  metadata JSONB DEFAULT '{}',
  CONSTRAINT check_hash_lock_format CHECK (hash_lock ~ '^[a-f0-9]{64}$'),
  CONSTRAINT check_lifecycle_stage CHECK (lifecycle_stage IN ('draft', 'verified', 'published', 'archived'))
);

-- 不可篡改觸發器
CREATE OR REPLACE FUNCTION prevent_evidence_update()
RETURNS TRIGGER AS $$
BEGIN
  RAISE EXCEPTION 'Evidence Vault 資料不可修改，這是 5T 協議的 Trustworthy 保證';
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS immutable_evidence_trigger ON evidence_vault;
CREATE TRIGGER immutable_evidence_trigger
BEFORE UPDATE ON evidence_vault
FOR EACH ROW EXECUTE FUNCTION prevent_evidence_update();

-- 1.2 sustainability_reports（永續報告主表）
CREATE TABLE IF NOT EXISTS sustainability_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  title TEXT NOT NULL,
  company_name TEXT NOT NULL,
  reporting_year INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft',
  report_data JSONB NOT NULL DEFAULT '{}',
  compliance_score INTEGER CHECK (compliance_score >= 0 AND compliance_score <= 100),
  version INTEGER NOT NULL DEFAULT 1,
  published_at TIMESTAMPTZ,
  created_by UUID, -- REFERENCES auth.users(id) - assuming Supabase Auth
  CONSTRAINT check_status CHECK (status IN ('draft', 'review', 'published', 'archived'))
);

-- 自動更新 updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_sustainability_reports_updated_at ON sustainability_reports;
CREATE TRIGGER update_sustainability_reports_updated_at
BEFORE UPDATE ON sustainability_reports
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 1.3 benchmark_data（標竿分析數據）
CREATE TABLE IF NOT EXISTS benchmark_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  company_name TEXT NOT NULL,
  industry TEXT NOT NULL,
  region TEXT NOT NULL,
  metrics JSONB NOT NULL,
  best_practices TEXT[],
  compliance_frameworks TEXT[],
  overall_score INTEGER CHECK (overall_score >= 0 AND overall_score <= 100),
  data_source TEXT NOT NULL,
  evidence_vault_refs UUID[] DEFAULT ARRAY[]::UUID[],
  CONSTRAINT check_industry CHECK (industry IN ('tech', 'finance', 'manufacturing', 'energy', 'retail', 'other'))
);

-- 1.4 compliance_checks（合規檢查記錄）
CREATE TABLE IF NOT EXISTS compliance_checks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  report_id UUID NOT NULL REFERENCES sustainability_reports(id) ON DELETE CASCADE,
  framework TEXT NOT NULL,
  check_category TEXT NOT NULL,
  check_result TEXT NOT NULL,
  details JSONB NOT NULL,
  score INTEGER CHECK (score >= 0 AND score <= 100),
  CONSTRAINT check_framework CHECK (framework IN ('GRI', 'SASB', 'TCFD', 'IFRS_S1', 'IFRS_S2', 'UN_SDGs')),
  CONSTRAINT check_result_status CHECK (check_result IN ('passed', 'failed', 'warning', 'info'))
);

-- 1.5 audit_trail（審計日誌）
CREATE TABLE IF NOT EXISTS audit_trail (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  action TEXT NOT NULL,
  table_name TEXT NOT NULL,
  record_id UUID NOT NULL,
  user_id UUID,
  ip_address INET,
  user_agent TEXT,
  old_data JSONB,
  new_data JSONB,
  CONSTRAINT check_action CHECK (action IN ('CREATE', 'READ', 'UPDATE', 'DELETE', 'EXPORT'))
);

-- RLS Policies
ALTER TABLE evidence_vault ENABLE ROW LEVEL SECURITY;
ALTER TABLE sustainability_reports ENABLE ROW LEVEL SECURITY;

-- Evidence Vault Policies
DROP POLICY IF EXISTS "Evidence Vault 公開可讀" ON evidence_vault;
CREATE POLICY "Evidence Vault 公開可讀" ON evidence_vault FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "Evidence Vault 僅系統可寫" ON evidence_vault;
CREATE POLICY "Evidence Vault 僅系統可寫" ON evidence_vault FOR INSERT TO authenticated WITH CHECK (true);

-- Sustainability Reports Policies
DROP POLICY IF EXISTS "使用者僅能讀取自己的報告" ON sustainability_reports;
CREATE POLICY "使用者僅能讀取自己的報告" ON sustainability_reports FOR SELECT TO authenticated USING (created_by = auth.uid());

-- Helper Functions
CREATE OR REPLACE FUNCTION calculate_hash_lock(data JSONB)
RETURNS TEXT AS $$
  -- Assuming pgcrypto extension is available for digest
  SELECT encode(digest(data::TEXT, 'sha256'), 'hex');
$$ LANGUAGE SQL IMMUTABLE;

CREATE OR REPLACE FUNCTION verify_hash_lock(uuid_val UUID)
RETURNS BOOLEAN AS $$
DECLARE
  record_data JSONB;
  stored_hash TEXT;
  computed_hash TEXT;
BEGIN
  SELECT 
    jsonb_build_object(
      'uuid', uuid,
      'timestamp', timestamp,
      'formula', formula,
      'impact_metric', impact_metric
    ),
    hash_lock
  INTO record_data, stored_hash
  FROM evidence_vault
  WHERE uuid = uuid_val;
 
  computed_hash := calculate_hash_lock(record_data);
 
  RETURN computed_hash = stored_hash;
END;
$$ LANGUAGE plpgsql;
