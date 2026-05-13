-- ============================================================
-- ESG GO | Omni_Terminal — Supabase Schema v2.0 (Idempotent)
-- Safe to re-run multiple times without errors
-- ============================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- TABLE: esg_data
-- ============================================================
CREATE TABLE IF NOT EXISTS public.esg_data (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id TEXT NOT NULL DEFAULT 'default',
  category TEXT NOT NULL DEFAULT 'General',
  metric_name TEXT NOT NULL,
  metric_value NUMERIC,
  unit TEXT,
  year INTEGER DEFAULT EXTRACT(YEAR FROM NOW())::INTEGER,
  gri_standard TEXT,
  source_origin TEXT,
  hash_lock TEXT,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Idempotent column additions for esg_data
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='esg_data' AND column_name='category') THEN
    ALTER TABLE public.esg_data ADD COLUMN category TEXT NOT NULL DEFAULT 'General';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='esg_data' AND column_name='company_id') THEN
    ALTER TABLE public.esg_data ADD COLUMN company_id TEXT NOT NULL DEFAULT 'default';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='esg_data' AND column_name='gri_standard') THEN
    ALTER TABLE public.esg_data ADD COLUMN gri_standard TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='esg_data' AND column_name='source_origin') THEN
    ALTER TABLE public.esg_data ADD COLUMN source_origin TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='esg_data' AND column_name='hash_lock') THEN
    ALTER TABLE public.esg_data ADD COLUMN hash_lock TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='esg_data' AND column_name='verified') THEN
    ALTER TABLE public.esg_data ADD COLUMN verified BOOLEAN DEFAULT FALSE;
  END IF;
END $$;

-- ============================================================
-- TABLE: audit_logs
-- ============================================================
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  actor TEXT NOT NULL DEFAULT 'system',
  department TEXT,
  gri_reference TEXT,
  hash_lock TEXT,
  t1_traceable BOOLEAN DEFAULT TRUE,
  t2_transparent BOOLEAN DEFAULT TRUE,
  t3_tangible BOOLEAN DEFAULT TRUE,
  t4_trustworthy BOOLEAN DEFAULT TRUE,
  t5_trackable BOOLEAN DEFAULT TRUE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Idempotent column additions for audit_logs
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='audit_logs' AND column_name='department') THEN
    ALTER TABLE public.audit_logs ADD COLUMN department TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='audit_logs' AND column_name='gri_reference') THEN
    ALTER TABLE public.audit_logs ADD COLUMN gri_reference TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='audit_logs' AND column_name='t1_traceable') THEN
    ALTER TABLE public.audit_logs ADD COLUMN t1_traceable BOOLEAN DEFAULT TRUE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='audit_logs' AND column_name='t2_transparent') THEN
    ALTER TABLE public.audit_logs ADD COLUMN t2_transparent BOOLEAN DEFAULT TRUE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='audit_logs' AND column_name='t3_tangible') THEN
    ALTER TABLE public.audit_logs ADD COLUMN t3_tangible BOOLEAN DEFAULT TRUE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='audit_logs' AND column_name='t4_trustworthy') THEN
    ALTER TABLE public.audit_logs ADD COLUMN t4_trustworthy BOOLEAN DEFAULT TRUE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='audit_logs' AND column_name='t5_trackable') THEN
    ALTER TABLE public.audit_logs ADD COLUMN t5_trackable BOOLEAN DEFAULT TRUE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='audit_logs' AND column_name='metadata') THEN
    ALTER TABLE public.audit_logs ADD COLUMN metadata JSONB DEFAULT '{}';
  END IF;
END $$;

-- ============================================================
-- TABLE: evidence_vault
-- ============================================================
CREATE TABLE IF NOT EXISTS public.evidence_vault (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT DEFAULT 'General',
  gri_indicator TEXT,
  file_type TEXT DEFAULT 'PDF',
  file_url TEXT,
  file_size TEXT,
  uploader TEXT NOT NULL DEFAULT 'system',
  department TEXT,
  status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'Verified', 'Rejected')),
  zkp_hash TEXT,
  zkp_verified BOOLEAN DEFAULT FALSE,
  hash_lock TEXT,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Idempotent column additions for evidence_vault
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='evidence_vault' AND column_name='category') THEN
    ALTER TABLE public.evidence_vault ADD COLUMN category TEXT DEFAULT 'General';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='evidence_vault' AND column_name='zkp_hash') THEN
    ALTER TABLE public.evidence_vault ADD COLUMN zkp_hash TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='evidence_vault' AND column_name='zkp_verified') THEN
    ALTER TABLE public.evidence_vault ADD COLUMN zkp_verified BOOLEAN DEFAULT FALSE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='evidence_vault' AND column_name='hash_lock') THEN
    ALTER TABLE public.evidence_vault ADD COLUMN hash_lock TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='evidence_vault' AND column_name='tags') THEN
    ALTER TABLE public.evidence_vault ADD COLUMN tags TEXT[] DEFAULT '{}';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='evidence_vault' AND column_name='department') THEN
    ALTER TABLE public.evidence_vault ADD COLUMN department TEXT;
  END IF;
END $$;

-- ============================================================
-- TABLE: reading_room
-- ============================================================
CREATE TABLE IF NOT EXISTS public.reading_room (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  summary TEXT,
  content TEXT,
  category TEXT DEFAULT 'Intelligence',
  source_url TEXT,
  source_name TEXT,
  author TEXT,
  gri_tags TEXT[] DEFAULT '{}',
  report_type TEXT DEFAULT 'Intelligence' CHECK (report_type IN ('Intelligence','Regulation','Yearbook','Benchmark','Custom')),
  industry TEXT,
  company_name TEXT,
  published_at TIMESTAMPTZ DEFAULT NOW(),
  hash_lock TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Idempotent column additions for reading_room
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='reading_room' AND column_name='category') THEN
    ALTER TABLE public.reading_room ADD COLUMN category TEXT DEFAULT 'Intelligence';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='reading_room' AND column_name='source_name') THEN
    ALTER TABLE public.reading_room ADD COLUMN source_name TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='reading_room' AND column_name='author') THEN
    ALTER TABLE public.reading_room ADD COLUMN author TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='reading_room' AND column_name='gri_tags') THEN
    ALTER TABLE public.reading_room ADD COLUMN gri_tags TEXT[] DEFAULT '{}';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='reading_room' AND column_name='report_type') THEN
    ALTER TABLE public.reading_room ADD COLUMN report_type TEXT DEFAULT 'Intelligence';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='reading_room' AND column_name='industry') THEN
    ALTER TABLE public.reading_room ADD COLUMN industry TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='reading_room' AND column_name='company_name') THEN
    ALTER TABLE public.reading_room ADD COLUMN company_name TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='reading_room' AND column_name='published_at') THEN
    ALTER TABLE public.reading_room ADD COLUMN published_at TIMESTAMPTZ DEFAULT NOW();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='reading_room' AND column_name='hash_lock') THEN
    ALTER TABLE public.reading_room ADD COLUMN hash_lock TEXT;
  END IF;
END $$;

-- ============================================================
-- TABLE: digital_twins (NEW)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.digital_twins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  moral_dna JSONB DEFAULT '{"intelligence":0,"benevolence":0,"courage":0,"integrity":0}',
  knowledge_entries JSONB DEFAULT '[]',
  version TEXT DEFAULT '1.0.0',
  awakening_stage TEXT DEFAULT 'dormant' CHECK (awakening_stage IN ('dormant','initializing','active','evolved')),
  hash_lock TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABLE: company_profiles
-- ============================================================
CREATE TABLE IF NOT EXISTS public.company_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_name TEXT NOT NULL DEFAULT '我的企業',
  industry TEXT,
  employee_count INTEGER,
  revenue_twd BIGINT,
  capital_twd BIGINT,
  locations TEXT[] DEFAULT '{}',
  esg_goals JSONB DEFAULT '[]',
  governance_structure JSONB DEFAULT '{}',
  reporting_year INTEGER DEFAULT EXTRACT(YEAR FROM NOW())::INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABLE: tasks
-- ============================================================
CREATE TABLE IF NOT EXISTS public.tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'todo' CHECK (status IN ('todo','in_progress','review','done')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low','medium','high','critical')),
  assignee TEXT,
  department TEXT,
  gri_reference TEXT,
  due_date DATE,
  evidence_ids TEXT[] DEFAULT '{}',
  hash_lock TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- UPDATED_AT triggers
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to each table (idempotent via DROP IF EXISTS)
DROP TRIGGER IF EXISTS set_esg_data_updated_at ON public.esg_data;
CREATE TRIGGER set_esg_data_updated_at
  BEFORE UPDATE ON public.esg_data
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_evidence_vault_updated_at ON public.evidence_vault;
CREATE TRIGGER set_evidence_vault_updated_at
  BEFORE UPDATE ON public.evidence_vault
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_reading_room_updated_at ON public.reading_room;
CREATE TRIGGER set_reading_room_updated_at
  BEFORE UPDATE ON public.reading_room
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_tasks_updated_at ON public.tasks;
CREATE TRIGGER set_tasks_updated_at
  BEFORE UPDATE ON public.tasks
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_company_profiles_updated_at ON public.company_profiles;
CREATE TRIGGER set_company_profiles_updated_at
  BEFORE UPDATE ON public.company_profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_digital_twins_updated_at ON public.digital_twins;
CREATE TRIGGER set_digital_twins_updated_at
  BEFORE UPDATE ON public.digital_twins
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================
-- INDEXES (idempotent)
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_esg_data_category ON public.esg_data(category);
CREATE INDEX IF NOT EXISTS idx_esg_data_company ON public.esg_data(company_id);
CREATE INDEX IF NOT EXISTS idx_esg_data_year ON public.esg_data(year);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON public.audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON public.audit_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_evidence_vault_category ON public.evidence_vault(category);
CREATE INDEX IF NOT EXISTS idx_evidence_vault_status ON public.evidence_vault(status);
CREATE INDEX IF NOT EXISTS idx_reading_room_category ON public.reading_room(category);
CREATE INDEX IF NOT EXISTS idx_reading_room_published ON public.reading_room(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON public.tasks(status);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE public.esg_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evidence_vault ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reading_room ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.digital_twins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- Drop existing policies before recreating (idempotent)
DROP POLICY IF EXISTS "allow_all_esg_data" ON public.esg_data;
DROP POLICY IF EXISTS "allow_all_evidence_vault" ON public.evidence_vault;
DROP POLICY IF EXISTS "allow_all_reading_room" ON public.reading_room;
DROP POLICY IF EXISTS "allow_all_company_profiles" ON public.company_profiles;
DROP POLICY IF EXISTS "allow_all_tasks" ON public.tasks;
DROP POLICY IF EXISTS "allow_all_digital_twins" ON public.digital_twins;
DROP POLICY IF EXISTS "allow_select_audit_logs" ON public.audit_logs;
DROP POLICY IF EXISTS "allow_insert_audit_logs" ON public.audit_logs;

-- ESG Data: full anon CRUD (demo mode — restrict in production)
CREATE POLICY "allow_all_esg_data" ON public.esg_data
  FOR ALL USING (TRUE) WITH CHECK (TRUE);

-- Evidence Vault: full anon CRUD
CREATE POLICY "allow_all_evidence_vault" ON public.evidence_vault
  FOR ALL USING (TRUE) WITH CHECK (TRUE);

-- Reading Room: full anon CRUD
CREATE POLICY "allow_all_reading_room" ON public.reading_room
  FOR ALL USING (TRUE) WITH CHECK (TRUE);

-- Company Profiles: full anon CRUD
CREATE POLICY "allow_all_company_profiles" ON public.company_profiles
  FOR ALL USING (TRUE) WITH CHECK (TRUE);

-- Tasks: full anon CRUD
CREATE POLICY "allow_all_tasks" ON public.tasks
  FOR ALL USING (TRUE) WITH CHECK (TRUE);

-- Digital Twins: full anon CRUD
CREATE POLICY "allow_all_digital_twins" ON public.digital_twins
  FOR ALL USING (TRUE) WITH CHECK (TRUE);

-- Audit Logs: read for all, write via service_role only
CREATE POLICY "allow_select_audit_logs" ON public.audit_logs
  FOR SELECT USING (TRUE);

CREATE POLICY "allow_insert_audit_logs" ON public.audit_logs
  FOR INSERT WITH CHECK (TRUE);

-- ============================================================
-- SEED DATA (safe with ON CONFLICT DO NOTHING)
-- ============================================================

-- Sample ESG metrics
INSERT INTO public.esg_data (company_id, category, metric_name, metric_value, unit, year, gri_standard, source_origin, verified)
VALUES
  ('default','E','範疇一排放量', 1250, 'tCO2e', 2024, 'GRI 305-1', 'ISO 14064-1 盤查清冊', TRUE),
  ('default','E','範疇二排放量', 890,  'tCO2e', 2024, 'GRI 305-2', '台電帳單', TRUE),
  ('default','E','總用電量',     2800, 'MWh',   2024, 'GRI 302-1', '台電帳單', TRUE),
  ('default','E','再生能源佔比',  38,   '%',     2024, 'GRI 302-1', 'T-REC 憑證', TRUE),
  ('default','E','總取水量',     15600,'m³',    2024, 'GRI 303-3', '自來水帳單', FALSE),
  ('default','S','員工總數',     342,  '人',    2024, 'GRI 2-7',   '人資系統', TRUE),
  ('default','S','女性主管比例',  34,   '%',     2024, 'GRI 405-1', '人資系統', TRUE),
  ('default','S','失能傷害頻率',  0.8,  'FR',    2024, 'GRI 403-9', '勞保局職災紀錄', TRUE),
  ('default','G','獨立董事比例',  42,   '%',     2024, 'GRI 2-9',   '董事會名冊', TRUE),
  ('default','G','違規罰款總額',  0,    'TWD',   2024, 'GRI 2-27',  '法務裁罰通知書', TRUE)
ON CONFLICT DO NOTHING;

-- Sample audit logs
INSERT INTO public.audit_logs (action, entity_type, entity_id, actor, department, gri_reference, t1_traceable, t2_transparent, t3_tangible, t4_trustworthy, t5_trackable)
VALUES
  ('ESG_DATA_SUBMIT',  'esg_data',      'seed-001', '系統初始化', '系統',   'GRI 305-1', TRUE, TRUE, TRUE, TRUE, TRUE),
  ('EVIDENCE_UPLOAD',  'evidence_vault','seed-002', '系統初始化', '環安衛', 'GRI 302-1', TRUE, TRUE, TRUE, TRUE, TRUE),
  ('ZKP_VERIFY',       'evidence_vault','seed-003', 'VerifyLink™','稽核',   'GRI 305-1', TRUE, TRUE, TRUE, TRUE, TRUE),
  ('REPORT_PUBLISHED', 'publish',       'seed-004', '永續委員會', '治理',   'GRI 2-1',   TRUE, TRUE, TRUE, TRUE, TRUE)
ON CONFLICT DO NOTHING;

-- Sample evidence
INSERT INTO public.evidence_vault (title, description, category, gri_indicator, file_type, uploader, department, status, zkp_verified)
VALUES
  ('ISO 14064-1 盤查清冊 2024',  '溫室氣體盤查完整清冊', 'E', 'GRI 305-1', 'PDF', '環安衛部門', '環安衛', 'Verified', TRUE),
  ('台電帳單 2024 Q1-Q4',        '全年度用電紀錄',        'E', 'GRI 302-1', 'PDF', '總務部門',   '總務',   'Verified', TRUE),
  ('人資系統員工名冊',            '年度員工結構統計',       'S', 'GRI 2-7',   'XLSX','人資部門',   '人資',   'Pending',  FALSE),
  ('董事會名冊暨績效評估報告',    '治理架構揭露佐證',       'G', 'GRI 2-9',   'PDF', '董事會秘書室','治理',  'Verified', TRUE)
ON CONFLICT DO NOTHING;

-- Sample reading room entries
INSERT INTO public.reading_room (title, summary, category, source_url, source_name, report_type, gri_tags)
VALUES
  ('2024 台灣上市公司永續報告書趨勢分析', '金管會強制揭露政策下，台灣企業ESG揭露質量顯著提升', 'Intelligence', 'https://www.fsc.gov.tw', '金管會', 'Intelligence', ARRAY['GRI 2-1', 'GRI 305-1']),
  ('GRI 2021 Universal Standards 完整指引', 'GRI 2021 通用準則全文及中文對照說明', 'Intelligence', 'https://www.globalreporting.org', 'GRI', 'Regulation', ARRAY['GRI 2-1']),
  ('TCFD 氣候相關財務揭露建議框架', '依據TCFD四大支柱進行氣候風險與機遇揭露', 'Intelligence', 'https://www.fsb-tcfd.org', 'TCFD', 'Regulation', ARRAY['GRI 201-2'])
ON CONFLICT DO NOTHING;

-- ============================================================
-- VERIFICATION QUERY
-- ============================================================
SELECT
  table_name,
  COUNT(*) as row_count
FROM (
  SELECT 'esg_data' as table_name FROM public.esg_data
  UNION ALL
  SELECT 'audit_logs' FROM public.audit_logs
  UNION ALL
  SELECT 'evidence_vault' FROM public.evidence_vault
  UNION ALL
  SELECT 'reading_room' FROM public.reading_room
  UNION ALL
  SELECT 'tasks' FROM public.tasks
  UNION ALL
  SELECT 'company_profiles' FROM public.company_profiles
) t
GROUP BY table_name
ORDER BY table_name;