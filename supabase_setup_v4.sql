-- ============================================================
-- ESG GO | Omni_Terminal — Schema v4.0 (Fixed)
-- Run this in Supabase SQL Editor
-- ============================================================

-- ------------------------------------------------------------
-- Extensions
-- ------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------
-- UPDATED_AT trigger function
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- ============================================================
-- TABLE: tasks
-- ============================================================
CREATE TABLE IF NOT EXISTS public.tasks (
  id            UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  title         TEXT        NOT NULL,
  description   TEXT,
  status        TEXT        DEFAULT 'todo'   CHECK (status   IN ('todo','in_progress','review','done')),
  priority      TEXT        DEFAULT 'medium' CHECK (priority IN ('low','medium','high','critical')),
  assignee      TEXT,
  department    TEXT,
  gri_reference TEXT,
  due_date      DATE,
  evidence_ids  UUID[]      DEFAULT '{}',
  hash_lock     TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABLE: company_profiles
-- ============================================================
CREATE TABLE IF NOT EXISTS public.company_profiles (
  id                   UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_name         TEXT        NOT NULL DEFAULT '我的企業',
  industry             TEXT,
  employee_count       INTEGER,
  revenue_twd          BIGINT,
  capital_twd          BIGINT,
  locations            TEXT[]      DEFAULT '{}',
  esg_goals            JSONB       DEFAULT '[]',
  governance_structure JSONB       DEFAULT '{}',
  reporting_year       INTEGER     DEFAULT EXTRACT(YEAR FROM NOW())::INTEGER,
  created_at           TIMESTAMPTZ DEFAULT NOW(),
  updated_at           TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABLE: digital_twins
-- ============================================================
CREATE TABLE IF NOT EXISTS public.digital_twins (
  id                UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id           TEXT        NOT NULL DEFAULT 'default',
  name              TEXT        NOT NULL DEFAULT '我的數位分身',
  description       TEXT,
  moral_dna         JSONB       DEFAULT '{"intelligence":70,"benevolence":70,"courage":70,"integrity":70}',
  awakening_stage   TEXT        DEFAULT 'dormant' CHECK (awakening_stage IN ('dormant','initializing','active','evolved')),
  knowledge_entries JSONB       DEFAULT '[]',
  version           TEXT        DEFAULT '1.0.0',
  hash_lock         TEXT,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- Triggers
-- ============================================================
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
-- Indexes
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_tasks_status       ON public.tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_assignee     ON public.tasks(assignee);
CREATE INDEX IF NOT EXISTS idx_digital_twins_user ON public.digital_twins(user_id);

-- ============================================================
-- RLS
-- ============================================================
ALTER TABLE public.tasks            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.digital_twins    ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "allow_all_tasks"            ON public.tasks;
DROP POLICY IF EXISTS "allow_all_company_profiles" ON public.company_profiles;
DROP POLICY IF EXISTS "allow_all_digital_twins"    ON public.digital_twins;

CREATE POLICY "allow_all_tasks"            ON public.tasks            FOR ALL USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "allow_all_company_profiles" ON public.company_profiles FOR ALL USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "allow_all_digital_twins"    ON public.digital_twins    FOR ALL USING (TRUE) WITH CHECK (TRUE);

-- ============================================================
-- Unique constraint for safe re-run seed
-- ============================================================
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'tasks_title_unique'
    AND conrelid = 'public.tasks'::regclass
  ) THEN
    ALTER TABLE public.tasks ADD CONSTRAINT tasks_title_unique UNIQUE (title);
  END IF;
END $$;

-- ============================================================
-- Seed Tasks
-- ============================================================
INSERT INTO public.tasks (title, description, status, priority, assignee, department, gri_reference, due_date)
VALUES
  ('完成溫室氣體範疇一盤查',  '收集直接排放源數據，準備 ISO 14064-1 盤查清冊',      'in_progress', 'critical', '環安衛主任',  '環安衛', 'GRI 305-1', '2024-12-31'),
  ('提交台電帳單至證據金庫',  '上傳最近 12 個月電費帳單作為 GRI 302-1 佐證',         'todo',        'high',     '總務部門',    '總務',   'GRI 302-1', '2024-11-30'),
  ('完成利害關係人問卷調查',  '設計並發放利害關係人問卷，蒐集 ESG 重大性評估資料',   'review',      'high',     '永續委員會',  '企劃',   'GRI 3-1',   '2024-12-15'),
  ('建立供應商 ESG 稽核機制', '對前 20 大供應商執行 ESG 評估並要求簽署永續承諾書',   'todo',        'medium',   '採購部門',    '採購',   'GRI 308-1', '2025-03-31'),
  ('完成董事會 ESG 培訓',     '安排董事會成員參加 ESG 專項培訓課程',                 'done',        'medium',   '董事會秘書室','治理',   'GRI 2-9',   '2024-10-31')
ON CONFLICT (title) DO NOTHING;

-- ============================================================
-- Step 1: Verify tables exist in public schema
-- ============================================================
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('tasks', 'company_profiles', 'digital_twins')
ORDER BY table_name;

-- ============================================================
-- Step 2: Verify row counts per table
-- ============================================================
SELECT 'tasks'            AS table_name, COUNT(*) AS rows FROM public.tasks
UNION ALL
SELECT 'company_profiles' AS table_name, COUNT(*) AS rows FROM public.company_profiles
UNION ALL
SELECT 'digital_twins'    AS table_name, COUNT(*) AS rows FROM public.digital_twins;