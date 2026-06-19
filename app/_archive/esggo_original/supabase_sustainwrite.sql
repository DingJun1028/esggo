-- ESG GO | SustainWrite Sections Table
-- Run this in Supabase SQL Editor

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS public.sustainwrite_sections (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  chapter_id  TEXT NOT NULL,
  section_id  TEXT NOT NULL,
  section_code TEXT NOT NULL,
  data        JSONB DEFAULT '{}'::jsonb NOT NULL,
  notes       TEXT,
  hash_lock   TEXT,
  status      TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'saved', 'locked')),
  company_id  TEXT NOT NULL DEFAULT 'default',
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT uq_sustainwrite_company_section UNIQUE (company_id, section_id)
);

DROP TRIGGER IF EXISTS set_sustainwrite_sections_updated_at ON public.sustainwrite_sections;
CREATE TRIGGER set_sustainwrite_sections_updated_at
  BEFORE UPDATE ON public.sustainwrite_sections
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE INDEX IF NOT EXISTS idx_sustainwrite_company ON public.sustainwrite_sections(company_id);
CREATE INDEX IF NOT EXISTS idx_sustainwrite_section ON public.sustainwrite_sections(section_id);

ALTER TABLE public.sustainwrite_sections ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "allow_all_sustainwrite" ON public.sustainwrite_sections;
CREATE POLICY "allow_all_sustainwrite" ON public.sustainwrite_sections FOR ALL USING (TRUE) WITH CHECK (TRUE);