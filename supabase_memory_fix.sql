-- ============================================================
-- ESG GO | Memory System Fix Script (Idempotent)
-- Run this in Supabase SQL Editor
-- ============================================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── user_memory ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.user_memory (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       TEXT NOT NULL DEFAULT 'default',
  company_id    TEXT NOT NULL DEFAULT 'default',
  memory_type   TEXT NOT NULL DEFAULT 'preference',
  memory_key    TEXT NOT NULL,
  memory_value  JSONB NOT NULL DEFAULT '{}',
  context       JSONB DEFAULT '{}',
  hash_lock     TEXT,
  version       INTEGER DEFAULT 1,
  last_accessed TIMESTAMPTZ DEFAULT NOW(),
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Add unique constraint idempotently
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'user_memory_user_id_company_id_memory_type_memory_key_key'
    AND conrelid = 'public.user_memory'::regclass
  ) THEN
    ALTER TABLE public.user_memory
    ADD CONSTRAINT user_memory_user_id_company_id_memory_type_memory_key_key
    UNIQUE (user_id, company_id, memory_type, memory_key);
  END IF;
END $$;

-- ── sustainwrite_sections ────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.sustainwrite_sections (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id      TEXT NOT NULL DEFAULT 'default',
  chapter_id      TEXT NOT NULL,
  chapter_name    TEXT NOT NULL,
  content         TEXT DEFAULT '',
  content_md      TEXT DEFAULT '',
  field_values    JSONB DEFAULT '{}',
  notes           TEXT DEFAULT '',
  documents_state JSONB DEFAULT '{}',
  status          TEXT DEFAULT 'draft',
  chapter_order   INTEGER DEFAULT 0,
  gri_references  TEXT[] DEFAULT '{}',
  evidence_ids    TEXT[] DEFAULT '{}',
  hash_lock       TEXT,
  input_snapshot  JSONB DEFAULT '{}',
  evidence        JSONB DEFAULT '[]',
  version         VARCHAR(20) DEFAULT 'v1.0.0',
  timestamp       TIMESTAMPTZ DEFAULT NOW(),
  hash_value      TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'sustainwrite_sections_company_id_chapter_id_key'
    AND conrelid = 'public.sustainwrite_sections'::regclass
  ) THEN
    ALTER TABLE public.sustainwrite_sections
    ADD CONSTRAINT sustainwrite_sections_company_id_chapter_id_key
    UNIQUE (company_id, chapter_id);
  END IF;
END $$;

-- ── user_sessions ────────────────────────────────────────────
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
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'user_sessions_user_id_session_key_key'
    AND conrelid = 'public.user_sessions'::regclass
  ) THEN
    ALTER TABLE public.user_sessions
    ADD CONSTRAINT user_sessions_user_id_session_key_key
    UNIQUE (user_id, session_key);
  END IF;
END $$;

-- ── ai_memory ─────────────────────────────────────────────────
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
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'ai_memory_user_id_company_id_persona_key'
    AND conrelid = 'public.ai_memory'::regclass
  ) THEN
    ALTER TABLE public.ai_memory
    ADD CONSTRAINT ai_memory_user_id_company_id_persona_key
    UNIQUE (user_id, company_id, persona);
  END IF;
END $$;

-- ── Triggers ──────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END; $$;

DO $$ DECLARE t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'user_memory','sustainwrite_sections',
    'user_sessions','ai_memory'
  ] LOOP
    EXECUTE format('DROP TRIGGER IF EXISTS set_%I_updated_at ON public.%I', t, t);
    EXECUTE format(
      'CREATE TRIGGER set_%I_updated_at BEFORE UPDATE ON public.%I FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at()',
      t, t
    );
  END LOOP;
END $$;

-- ── Indexes ───────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_user_memory_user      ON public.user_memory(user_id, company_id);
CREATE INDEX IF NOT EXISTS idx_user_memory_type      ON public.user_memory(memory_type);
CREATE INDEX IF NOT EXISTS idx_user_memory_accessed  ON public.user_memory(last_accessed DESC);
CREATE INDEX IF NOT EXISTS idx_sw_company            ON public.sustainwrite_sections(company_id);
CREATE INDEX IF NOT EXISTS idx_sw_chapter            ON public.sustainwrite_sections(chapter_id);
CREATE INDEX IF NOT EXISTS idx_sessions_user         ON public.user_sessions(user_id, is_active);
CREATE INDEX IF NOT EXISTS idx_ai_memory_user        ON public.ai_memory(user_id, company_id);

-- ── RLS ───────────────────────────────────────────────────────
DO $$ DECLARE t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'user_memory','sustainwrite_sections',
    'user_sessions','ai_memory'
  ] LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format('DROP POLICY IF EXISTS "allow_all_%I" ON public.%I', t, t);
    EXECUTE format(
      'CREATE POLICY "allow_all_%I" ON public.%I FOR ALL USING (TRUE) WITH CHECK (TRUE)',
      t, t
    );
  END LOOP;
END $$;

-- ── Seed ──────────────────────────────────────────────────────
INSERT INTO public.user_memory
  (user_id, company_id, memory_type, memory_key, memory_value)
VALUES
  ('default','default','company_profile','basic_info',
   '{"company_name":"善向永續股份有限公司","industry":"科技業","employees":250,"revenue":15,"reporting_year":2024}'),
  ('default','default','preference','sidebar_collapsed','{"value":false}'),
  ('default','default','esg_target','net_zero','{"year":2050,"sbti":true,"reduction_2030":46}')
ON CONFLICT (user_id, company_id, memory_type, memory_key) DO NOTHING;

-- ── Verification ──────────────────────────────────────────────
SELECT table_name, COUNT(*) AS rows FROM (
  SELECT 'user_memory'             AS table_name FROM public.user_memory
  UNION ALL SELECT 'sustainwrite_sections'       FROM public.sustainwrite_sections
  UNION ALL SELECT 'user_sessions'               FROM public.user_sessions
  UNION ALL SELECT 'ai_memory'                   FROM public.ai_memory
) t GROUP BY table_name ORDER BY table_name;