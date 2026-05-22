-- ============================================================================
-- ESG GO | 持久記憶系統 (Persistent Memory System)
-- 核心哲學: 5T 誠信協議 | IComponentCore | T4 Trustworthy
-- ============================================================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- 1. 用戶記憶主表 (User Memory Core)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.user_memory (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       TEXT NOT NULL DEFAULT 'default',
  company_id    TEXT NOT NULL DEFAULT 'default',
  memory_type   TEXT NOT NULL CHECK (memory_type IN (
    'field_value',       -- 欄位填寫記憶
    'chapter_progress',  -- 章節進度記憶
    'preference',        -- 使用者偏好
    'document_state',    -- 文件狀態記憶
    'session_context',   -- 工作階段上下文
    'ai_conversation',   -- AI 對話記憶
    'company_profile',   -- 企業基本資料
    'esg_target',        -- ESG 目標設定
    'template_usage',    -- 模板使用記憶
    'search_history'     -- 搜尋歷史
  )),
  memory_key    TEXT NOT NULL,   -- 記憶鍵值 (e.g., 'editor.ghg.scope1')
  memory_value  JSONB NOT NULL DEFAULT '{}',  -- 記憶內容
  context       JSONB DEFAULT '{}',           -- 上下文附加資料
  hash_lock     TEXT,                         -- T4: SHA-256 指紋
  version       INTEGER DEFAULT 1,            -- 版本號 (用於樂觀鎖)
  last_accessed TIMESTAMPTZ DEFAULT NOW(),
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, company_id, memory_type, memory_key)
);

CREATE INDEX IF NOT EXISTS idx_user_memory_user ON public.user_memory(user_id, company_id);
CREATE INDEX IF NOT EXISTS idx_user_memory_type ON public.user_memory(memory_type);
CREATE INDEX IF NOT EXISTS idx_user_memory_key ON public.user_memory(memory_key);
CREATE INDEX IF NOT EXISTS idx_user_memory_accessed ON public.user_memory(last_accessed DESC);

-- ============================================================================
-- 2. SustainWrite 章節內容表 (Enhanced)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.sustainwrite_sections (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  uuid            UUID DEFAULT uuid_generate_v4(),
  version         VARCHAR(20) DEFAULT 'v1.0.0',
  timestamp       TIMESTAMPTZ DEFAULT NOW(),
  evidence        JSONB DEFAULT '[]',
  company_id      TEXT NOT NULL DEFAULT 'default',
  chapter_id      TEXT NOT NULL,
  chapter_name    TEXT NOT NULL,
  content         TEXT DEFAULT '',
  content_md      TEXT DEFAULT '',
  input_snapshot  JSONB DEFAULT '{}',
  field_values    JSONB DEFAULT '{}',
  notes           TEXT DEFAULT '',
  documents_state JSONB DEFAULT '{}',
  status          TEXT DEFAULT 'draft' CHECK (status IN ('empty','draft','reviewing','completed')),
  chapter_order   INTEGER DEFAULT 0,
  gri_references  TEXT[] DEFAULT '{}',
  evidence_ids    TEXT[] DEFAULT '{}',
  hash_value      TEXT,
  hash_lock       TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(company_id, chapter_id)
);

CREATE INDEX IF NOT EXISTS idx_sw_company ON public.sustainwrite_sections(company_id);
CREATE INDEX IF NOT EXISTS idx_sw_chapter ON public.sustainwrite_sections(chapter_id);
CREATE INDEX IF NOT EXISTS idx_sw_status ON public.sustainwrite_sections(status);

-- ============================================================================
-- 3. 用戶工作階段表 (Session State)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.user_sessions (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       TEXT NOT NULL DEFAULT 'default',
  company_id    TEXT NOT NULL DEFAULT 'default',
  session_key   TEXT NOT NULL,
  state         JSONB DEFAULT '{}',
  page_context  TEXT,
  last_route    TEXT,
  is_active     BOOLEAN DEFAULT true,
  started_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, session_key)
);

CREATE INDEX IF NOT EXISTS idx_sessions_user ON public.user_sessions(user_id, is_active);

-- ============================================================================
-- 4. AI 對話記憶表
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.ai_memory (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       TEXT NOT NULL DEFAULT 'default',
  company_id    TEXT NOT NULL DEFAULT 'default',
  persona       TEXT NOT NULL DEFAULT 'compliance',
  messages      JSONB DEFAULT '[]',
  summary       TEXT,
  key_insights  JSONB DEFAULT '[]',
  context_tags  TEXT[] DEFAULT '{}',
  token_count   INTEGER DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, company_id, persona)
);

CREATE INDEX IF NOT EXISTS idx_ai_memory_user ON public.ai_memory(user_id, company_id);

-- ============================================================================
-- 5. Updated_at Triggers
-- ============================================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_user_memory_updated_at ON public.user_memory;
CREATE TRIGGER set_user_memory_updated_at
  BEFORE UPDATE ON public.user_memory
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_sw_sections_updated_at ON public.sustainwrite_sections;
CREATE TRIGGER set_sw_sections_updated_at
  BEFORE UPDATE ON public.sustainwrite_sections
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_sessions_updated_at ON public.user_sessions;
CREATE TRIGGER set_sessions_updated_at
  BEFORE UPDATE ON public.user_sessions
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_ai_memory_updated_at ON public.ai_memory;
CREATE TRIGGER set_ai_memory_updated_at
  BEFORE UPDATE ON public.ai_memory
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================================
-- 6. RLS (Row Level Security) - Open for Demo
-- ============================================================================
ALTER TABLE public.user_memory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sustainwrite_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_memory ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "allow_all_user_memory" ON public.user_memory;
DROP POLICY IF EXISTS "allow_all_sw_sections" ON public.sustainwrite_sections;
DROP POLICY IF EXISTS "allow_all_user_sessions" ON public.user_sessions;
DROP POLICY IF EXISTS "allow_all_ai_memory" ON public.ai_memory;

CREATE POLICY "allow_all_user_memory" ON public.user_memory FOR ALL USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "allow_all_sw_sections" ON public.sustainwrite_sections FOR ALL USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "allow_all_user_sessions" ON public.user_sessions FOR ALL USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "allow_all_ai_memory" ON public.ai_memory FOR ALL USING (TRUE) WITH CHECK (TRUE);

-- ============================================================================
-- 7. Seed: 初始化預設企業記憶
-- ============================================================================
INSERT INTO public.user_memory (user_id, company_id, memory_type, memory_key, memory_value)
VALUES
  ('default','default','company_profile','basic_info', '{"company_name":"善向永續股份有限公司","industry":"科技業","employees":250,"revenue":15,"reporting_year":2024}'),
  ('default','default','preference','sidebar_collapsed','{"value":false}'),
  ('default','default','preference','active_theme','{"value":"berkeley"}'),
  ('default','default','esg_target','net_zero','{"year":2050,"sbti":true,"reduction_2030":46}')
ON CONFLICT (user_id, company_id, memory_type, memory_key) DO NOTHING;

-- Verification
SELECT table_name, COUNT(*) AS rows
FROM (
  SELECT 'user_memory' AS table_name FROM public.user_memory
  UNION ALL SELECT 'sustainwrite_sections' FROM public.sustainwrite_sections
  UNION ALL SELECT 'user_sessions' FROM public.user_sessions
  UNION ALL SELECT 'ai_memory' FROM public.ai_memory
) t GROUP BY table_name ORDER BY table_name;