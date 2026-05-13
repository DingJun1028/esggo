-- ============================================================
-- ESG GO | Omni_Terminal — Schema v5.0 (Complete)
-- Run AFTER v4.1 — adds missing tables for full platform
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── social_metrics ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.social_metrics (
  id           UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id   TEXT        DEFAULT 'default',
  category     TEXT        NOT NULL,
  metric_name  TEXT        NOT NULL,
  metric_value NUMERIC,
  unit         TEXT,
  year         INTEGER     DEFAULT EXTRACT(YEAR FROM NOW())::INTEGER,
  gri_standard TEXT,
  source_origin TEXT,
  verified     BOOLEAN     DEFAULT FALSE,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ─── governance_metrics ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.governance_metrics (
  id           UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id   TEXT        DEFAULT 'default',
  category     TEXT        NOT NULL,
  metric_name  TEXT        NOT NULL,
  metric_value NUMERIC,
  unit         TEXT,
  year         INTEGER     DEFAULT EXTRACT(YEAR FROM NOW())::INTEGER,
  gri_standard TEXT,
  source_origin TEXT,
  verified     BOOLEAN     DEFAULT FALSE,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ─── roadmap_milestones ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.roadmap_milestones (
  id            UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id    TEXT        DEFAULT 'default',
  title         TEXT        NOT NULL,
  description   TEXT,
  target_year   INTEGER     NOT NULL,
  category      TEXT        DEFAULT 'Carbon',
  target_value  NUMERIC,
  current_value NUMERIC,
  unit          TEXT,
  status        TEXT        DEFAULT 'planned' CHECK (status IN ('planned','in_progress','achieved','missed')),
  sbti_aligned  BOOLEAN     DEFAULT FALSE,
  gri_reference TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ─── advisory_sessions ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.advisory_sessions (
  id         UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    TEXT        NOT NULL DEFAULT 'default',
  persona    TEXT        NOT NULL DEFAULT 'compliance',
  title      TEXT,
  messages   JSONB       DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── published_reports ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.published_reports (
  id           UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id   TEXT        DEFAULT 'default',
  title        TEXT        NOT NULL,
  year         INTEGER     NOT NULL,
  framework    TEXT[]      DEFAULT '{}',
  status       TEXT        DEFAULT 'draft' CHECK (status IN ('draft','reviewing','published')),
  page_count   INTEGER,
  word_count   INTEGER,
  gri_coverage NUMERIC,
  zkp_verified BOOLEAN     DEFAULT FALSE,
  zkp_hash     TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Triggers ─────────────────────────────────────────────────
DO $$
DECLARE
  t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY['social_metrics','governance_metrics','roadmap_milestones','advisory_sessions','published_reports']
  LOOP
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_' || t || '_updated_at') THEN
      EXECUTE format(
        'CREATE TRIGGER set_%I_updated_at BEFORE UPDATE ON public.%I FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at()',
        t, t
      );
    END IF;
  END LOOP;
END $$;

-- ─── Indexes ──────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_social_metrics_category     ON public.social_metrics(category);
CREATE INDEX IF NOT EXISTS idx_governance_metrics_category ON public.governance_metrics(category);
CREATE INDEX IF NOT EXISTS idx_roadmap_milestones_year     ON public.roadmap_milestones(target_year);
CREATE INDEX IF NOT EXISTS idx_advisory_sessions_user      ON public.advisory_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_published_reports_status    ON public.published_reports(status);

-- ─── RLS ──────────────────────────────────────────────────────
ALTER TABLE public.social_metrics      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.governance_metrics  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roadmap_milestones  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.advisory_sessions   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.published_reports   ENABLE ROW LEVEL SECURITY;

DO $$
DECLARE
  t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY['social_metrics','governance_metrics','roadmap_milestones','advisory_sessions','published_reports']
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS "allow_all_%I" ON public.%I', t, t);
    EXECUTE format(
      'CREATE POLICY "allow_all_%I" ON public.%I FOR ALL USING (TRUE) WITH CHECK (TRUE)',
      t, t
    );
  END LOOP;
END $$;

-- ─── Verification ─────────────────────────────────────────────
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('social_metrics','governance_metrics','roadmap_milestones','advisory_sessions','published_reports')
ORDER BY table_name;

SELECT 'social_metrics'     AS table_name, COUNT(*) AS rows FROM public.social_metrics
UNION ALL
SELECT 'governance_metrics' AS table_name, COUNT(*) AS rows FROM public.governance_metrics
UNION ALL
SELECT 'roadmap_milestones' AS table_name, COUNT(*) AS rows FROM public.roadmap_milestones
UNION ALL
SELECT 'advisory_sessions'  AS table_name, COUNT(*) AS rows FROM public.advisory_sessions
UNION ALL
SELECT 'published_reports'  AS table_name, COUNT(*) AS rows FROM public.published_reports;