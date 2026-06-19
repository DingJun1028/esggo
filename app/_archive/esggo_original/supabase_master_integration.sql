-- ============================================================================
-- ESG GO | Master Integration Schema v1.2
-- 5T 誠信協議 · 全域數據連通 · 自我成長架構
-- ============================================================================

-- 1. 環境數據表 (Environmental Hub)
CREATE TABLE IF NOT EXISTS public.environmental_data (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id    TEXT NOT NULL DEFAULT 'default',
  category      TEXT NOT NULL CHECK (category IN ('GHG', 'Energy', 'Water', 'Waste')),
  metric_name   TEXT NOT NULL,
  metric_value  NUMERIC,
  unit          TEXT NOT NULL,
  year          INTEGER NOT NULL,
  gri_standard  TEXT,
  source_origin TEXT,
  verified      BOOLEAN DEFAULT false,
  hash_lock     TEXT, -- T4/T5 SHA-256
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- 2. 社會指標表 (Social Hub)
CREATE TABLE IF NOT EXISTS public.social_metrics (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id    TEXT NOT NULL DEFAULT 'default',
  category      TEXT NOT NULL,
  metric_name   TEXT NOT NULL,
  metric_value  NUMERIC,
  unit          TEXT NOT NULL,
  year          INTEGER NOT NULL,
  gri_standard  TEXT,
  source_origin TEXT,
  verified      BOOLEAN DEFAULT false,
  zkp_sealed    BOOLEAN DEFAULT false,
  hash_lock     TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- 3. 公司治理表 (Governance Hub)
CREATE TABLE IF NOT EXISTS public.governance_metrics (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id    TEXT NOT NULL DEFAULT 'default',
  category      TEXT NOT NULL,
  metric_name   TEXT NOT NULL,
  metric_value  NUMERIC,
  unit          TEXT NOT NULL,
  year          INTEGER NOT NULL,
  gri_standard  TEXT,
  source_origin TEXT,
  verified      BOOLEAN DEFAULT false,
  hash_lock     TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- 4. 任務中心 (Tasks & Collaboration)
CREATE TABLE IF NOT EXISTS public.tasks (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id    TEXT NOT NULL DEFAULT 'default',
  title         TEXT NOT NULL,
  description   TEXT,
  status        TEXT NOT NULL DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'review', 'done')),
  priority      TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  assignee      TEXT,
  department    TEXT,
  gri_reference TEXT,
  due_date      DATE,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- 5. 證據金庫 (Evidence Vault)
CREATE TABLE IF NOT EXISTS public.evidence_vault (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id    TEXT NOT NULL DEFAULT 'default',
  file_name     TEXT NOT NULL,
  file_type     TEXT,
  category      TEXT,
  gri_reference TEXT,
  uploader      TEXT,
  status        TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'rejected')),
  zkp_proof     BOOLEAN DEFAULT false,
  hash_lock     TEXT NOT NULL,
  file_url      TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- 6. 全域審計日誌 (Global Audit Logs)
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id    TEXT NOT NULL DEFAULT 'default',
  action        TEXT NOT NULL, -- CREATE, UPDATE, DELETE, SEAL, VERIFY
  resource      TEXT NOT NULL, -- e.g., 'GRI 305-1', 'User Profile'
  user_name     TEXT,
  department    TEXT,
  gri_reference TEXT,
  t5_tag        TEXT, -- T1, T2, T3, T4, T5
  hash_lock     TEXT, -- SHA-256 of the event
  details       TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- 7. 淨零里程碑 (Roadmap Milestones)
CREATE TABLE IF NOT EXISTS public.roadmap_milestones (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id    TEXT NOT NULL DEFAULT 'default',
  title         TEXT NOT NULL,
  description   TEXT,
  target_year   INTEGER NOT NULL,
  category      TEXT,
  target_value  NUMERIC,
  current_value NUMERIC,
  unit          TEXT,
  status        TEXT NOT NULL DEFAULT 'planned' CHECK (status IN ('planned', 'in_progress', 'achieved', 'missed')),
  sbti_aligned  BOOLEAN DEFAULT false,
  gri_reference TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- 8. 智慧洞察與自生長存儲 (AI Meta-Analysis)
CREATE TABLE IF NOT EXISTS public.ai_insights (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id    TEXT NOT NULL DEFAULT 'default',
  context       TEXT NOT NULL, -- e.g., 'dashboard_overview', 'ghg_trend'
  insight_text  TEXT NOT NULL,
  score         NUMERIC, -- Confidence score or improvement impact
  action_item_id UUID, -- Optional link to a generated task
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ── Triggers for updated_at ────────────────────────────────
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DO $$ 
DECLARE 
  t text;
BEGIN
  FOR t IN SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name IN ('environmental_data', 'social_metrics', 'governance_metrics', 'tasks', 'evidence_vault', 'roadmap_milestones')
  LOOP
    EXECUTE format('DROP TRIGGER IF EXISTS set_updated_at ON public.%I', t);
    EXECUTE format('CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.%I FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at()', t);
  END LOOP;
END $$;

-- ── RLS for all tables ──────────────────────────────────────
DO $$ 
DECLARE 
  t text;
BEGIN
  FOR t IN SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name IN ('environmental_data', 'social_metrics', 'governance_metrics', 'tasks', 'evidence_vault', 'audit_logs', 'roadmap_milestones', 'ai_insights')
  LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format('DROP POLICY IF EXISTS "allow_all" ON public.%I', t);
    EXECUTE format('CREATE POLICY "allow_all" ON public.%I FOR ALL USING (TRUE) WITH CHECK (TRUE)', t);
  END LOOP;
END $$;
