-- ESG GO | Omni_Terminal — Schema v3.0 (Additional Tables)
-- Run this in Supabase SQL Editor AFTER supabase_setup.sql

-- ============================================================
-- TABLE: environmental_data
-- ============================================================
CREATE TABLE IF NOT EXISTS public.environmental_data (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id TEXT NOT NULL DEFAULT 'default',
  category TEXT NOT NULL CHECK (category IN ('GHG','Energy','Water','Waste')),
  metric_name TEXT NOT NULL,
  metric_value NUMERIC,
  unit TEXT,
  year INTEGER DEFAULT EXTRACT(YEAR FROM NOW())::INTEGER,
  gri_standard TEXT,
  source_origin TEXT,
  target_value NUMERIC,
  achievement_rate NUMERIC,
  verified BOOLEAN DEFAULT FALSE,
  hash_lock TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABLE: social_data
-- ============================================================
CREATE TABLE IF NOT EXISTS public.social_data (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id TEXT NOT NULL DEFAULT 'default',
  category TEXT NOT NULL CHECK (category IN ('Workforce','Safety','Training','Supply')),
  metric_name TEXT NOT NULL,
  metric_value NUMERIC,
  unit TEXT,
  year INTEGER DEFAULT EXTRACT(YEAR FROM NOW())::INTEGER,
  gri_standard TEXT,
  source_origin TEXT,
  verified BOOLEAN DEFAULT FALSE,
  hash_lock TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABLE: governance_data
-- ============================================================
CREATE TABLE IF NOT EXISTS public.governance_data (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id TEXT NOT NULL DEFAULT 'default',
  category TEXT NOT NULL CHECK (category IN ('Board','Ethics','Tax','Risk')),
  metric_name TEXT NOT NULL,
  metric_value NUMERIC,
  unit TEXT,
  year INTEGER DEFAULT EXTRACT(YEAR FROM NOW())::INTEGER,
  gri_standard TEXT,
  source_origin TEXT,
  verified BOOLEAN DEFAULT FALSE,
  hash_lock TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABLE: roadmap_milestones
-- ============================================================
CREATE TABLE IF NOT EXISTS public.roadmap_milestones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id TEXT NOT NULL DEFAULT 'default',
  title TEXT NOT NULL,
  description TEXT,
  target_year INTEGER NOT NULL,
  category TEXT DEFAULT 'Carbon' CHECK (category IN ('Carbon','Energy','Water','Waste','Social','Governance')),
  target_value NUMERIC,
  current_value NUMERIC,
  unit TEXT,
  status TEXT DEFAULT 'planned' CHECK (status IN ('planned','in_progress','achieved','missed')),
  sbti_aligned BOOLEAN DEFAULT FALSE,
  gri_reference TEXT,
  hash_lock TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABLE: advisory_sessions
-- ============================================================
CREATE TABLE IF NOT EXISTS public.advisory_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL DEFAULT 'default',
  persona TEXT NOT NULL DEFAULT 'compliance',
  messages JSONB DEFAULT '[]',
  title TEXT,
  total_tokens INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABLE: published_reports
-- ============================================================
CREATE TABLE IF NOT EXISTS public.published_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id TEXT NOT NULL DEFAULT 'default',
  title TEXT NOT NULL,
  year INTEGER,
  framework TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft','reviewing','published')),
  zkp_hash TEXT,
  zkp_verified BOOLEAN DEFAULT FALSE,
  page_count INTEGER DEFAULT 0,
  word_count INTEGER DEFAULT 0,
  gri_coverage NUMERIC DEFAULT 0,
  hash_lock TEXT,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- Triggers
-- ============================================================
DROP TRIGGER IF EXISTS set_environmental_data_updated_at ON public.environmental_data;
CREATE TRIGGER set_environmental_data_updated_at
  BEFORE UPDATE ON public.environmental_data
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_social_data_updated_at ON public.social_data;
CREATE TRIGGER set_social_data_updated_at
  BEFORE UPDATE ON public.social_data
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_governance_data_updated_at ON public.governance_data;
CREATE TRIGGER set_governance_data_updated_at
  BEFORE UPDATE ON public.governance_data
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_roadmap_milestones_updated_at ON public.roadmap_milestones;
CREATE TRIGGER set_roadmap_milestones_updated_at
  BEFORE UPDATE ON public.roadmap_milestones
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_advisory_sessions_updated_at ON public.advisory_sessions;
CREATE TRIGGER set_advisory_sessions_updated_at
  BEFORE UPDATE ON public.advisory_sessions
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_published_reports_updated_at ON public.published_reports;
CREATE TRIGGER set_published_reports_updated_at
  BEFORE UPDATE ON public.published_reports
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================
-- Indexes
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_env_data_company ON public.environmental_data(company_id);
CREATE INDEX IF NOT EXISTS idx_env_data_category ON public.environmental_data(category);
CREATE INDEX IF NOT EXISTS idx_social_data_company ON public.social_data(company_id);
CREATE INDEX IF NOT EXISTS idx_gov_data_company ON public.governance_data(company_id);
CREATE INDEX IF NOT EXISTS idx_roadmap_company ON public.roadmap_milestones(company_id);
CREATE INDEX IF NOT EXISTS idx_roadmap_year ON public.roadmap_milestones(target_year);

-- ============================================================
-- RLS Policies
-- ============================================================
ALTER TABLE public.environmental_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.governance_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roadmap_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.advisory_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.published_reports ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "allow_all_environmental_data" ON public.environmental_data;
DROP POLICY IF EXISTS "allow_all_social_data" ON public.social_data;
DROP POLICY IF EXISTS "allow_all_governance_data" ON public.governance_data;
DROP POLICY IF EXISTS "allow_all_roadmap_milestones" ON public.roadmap_milestones;
DROP POLICY IF EXISTS "allow_all_advisory_sessions" ON public.advisory_sessions;
DROP POLICY IF EXISTS "allow_all_published_reports" ON public.published_reports;

CREATE POLICY "allow_all_environmental_data" ON public.environmental_data FOR ALL USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "allow_all_social_data" ON public.social_data FOR ALL USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "allow_all_governance_data" ON public.governance_data FOR ALL USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "allow_all_roadmap_milestones" ON public.roadmap_milestones FOR ALL USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "allow_all_advisory_sessions" ON public.advisory_sessions FOR ALL USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "allow_all_published_reports" ON public.published_reports FOR ALL USING (TRUE) WITH CHECK (TRUE);

-- ============================================================
-- Seed Data
-- ============================================================
INSERT INTO public.environmental_data (company_id, category, metric_name, metric_value, unit, year, gri_standard, source_origin, target_value, achievement_rate, verified)
VALUES
  ('default','GHG','範疇一直接排放量',1250,'tCO2e',2024,'GRI 305-1','ISO 14064-1 盤查清冊',1000,80,TRUE),
  ('default','GHG','範疇二間接排放量',890,'tCO2e',2024,'GRI 305-2','台電帳單',800,89,TRUE),
  ('default','GHG','範疇三其他排放量',3200,'tCO2e',2024,'GRI 305-3','供應鏈調查',3000,94,FALSE),
  ('default','Energy','總用電量',2800,'MWh',2024,'GRI 302-1','台電帳單',2600,93,TRUE),
  ('default','Energy','再生能源使用量',1064,'MWh',2024,'GRI 302-1','T-REC 憑證',1200,89,TRUE),
  ('default','Energy','化石燃料使用量',450,'GJ',2024,'GRI 302-1','油資發票',400,89,FALSE),
  ('default','Water','總取水量',15600,'m³',2024,'GRI 303-3','自來水帳單',14000,90,FALSE),
  ('default','Water','廢水排放量',8200,'m³',2024,'GRI 303-4','廢水處理廠報告',7500,91,FALSE),
  ('default','Water','水資源回收率',47,'%',2024,'GRI 303-3','內部統計',60,78,FALSE),
  ('default','Waste','有害廢棄物總量',12,'噸',2024,'GRI 306-3','廢棄物清運聯單',10,83,TRUE),
  ('default','Waste','一般廢棄物總量',180,'噸',2024,'GRI 306-3','廢棄物清運聯單',160,89,TRUE),
  ('default','Waste','廢棄物回收率',62,'%',2024,'GRI 306-4','回收商合法執照',75,83,FALSE)
ON CONFLICT DO NOTHING;

INSERT INTO public.social_data (company_id, category, metric_name, metric_value, unit, year, gri_standard, source_origin, verified)
VALUES
  ('default','Workforce','員工總數',342,'人',2024,'GRI 2-7','人資系統',TRUE),
  ('default','Workforce','女性員工比例',41,'%',2024,'GRI 405-1','人資系統',TRUE),
  ('default','Workforce','女性主管比例',34,'%',2024,'GRI 405-1','人資系統',TRUE),
  ('default','Workforce','新進員工離職率',8.2,'%',2024,'GRI 401-1','人資系統',FALSE),
  ('default','Safety','失能傷害頻率(FR)',0.8,'FR',2024,'GRI 403-9','勞保局職災申報單',TRUE),
  ('default','Safety','失能傷害嚴重率(SR)',12,'SR',2024,'GRI 403-9','工安事件調查報告',TRUE),
  ('default','Safety','職業安全訓練覆蓋率',98,'%',2024,'GRI 403-5','教育訓練記錄',TRUE),
  ('default','Training','平均每人受訓時數',32,'小時/人',2024,'GRI 404-1','線上課程完課紀錄',FALSE),
  ('default','Training','績效考核覆蓋率',100,'%',2024,'GRI 404-3','績效考核系統',TRUE),
  ('default','Supply','在地採購比例',68,'%',2024,'GRI 204-1','採購系統',FALSE),
  ('default','Supply','簽署永續承諾書之供應商比例',45,'%',2024,'GRI 308-1','供應商行為準則簽署書',FALSE)
ON CONFLICT DO NOTHING;

INSERT INTO public.governance_data (company_id, category, metric_name, metric_value, unit, year, gri_standard, source_origin, verified)
VALUES
  ('default','Board','獨立董事比例',42,'%',2024,'GRI 2-9','董事會名冊',TRUE),
  ('default','Board','女性董事比例',25,'%',2024,'GRI 405-1','董事會名冊',TRUE),
  ('default','Board','董事平均年齡',58,'歲',2024,'GRI 2-9','董事會名冊',TRUE),
  ('default','Ethics','貪腐事件數',0,'件',2024,'GRI 205-3','內部稽核報告',TRUE),
  ('default','Ethics','違反法規罰款總額',0,'TWD',2024,'GRI 2-27','法務裁罰通知書',TRUE),
  ('default','Tax','有效稅率',18.5,'%',2024,'GRI 207-4','財報',TRUE),
  ('default','Tax','政府補貼金額',2800000,'TWD',2024,'GRI 201-4','財報',FALSE),
  ('default','Risk','氣候相關財務風險識別',1,'項',2024,'GRI 201-2','TCFD 報告',FALSE)
ON CONFLICT DO NOTHING;

INSERT INTO public.roadmap_milestones (company_id, title, description, target_year, category, target_value, current_value, unit, status, sbti_aligned, gri_reference)
VALUES
  ('default','基準年碳盤查完成','完成 ISO 14064-1 認證',2024,'Carbon',2140,2140,'tCO2e','achieved',TRUE,'GRI 305-1'),
  ('default','再生能源占比 50%','採購 T-REC 綠電憑證',2025,'Energy',50,38,'%','in_progress',TRUE,'GRI 302-1'),
  ('default','範疇一減碳 30%','導入電動車輛與節能設備',2026,'Carbon',875,1250,'tCO2e','planned',TRUE,'GRI 305-1'),
  ('default','供應鏈 ESG 稽核 80%','對前 50 大供應商進行 ESG 評估',2026,'Social',80,45,'%','in_progress',FALSE,'GRI 308-1'),
  ('default','碳中和宣告','Scope 1+2 淨零 + 碳抵換',2030,'Carbon',0,2140,'tCO2e','planned',TRUE,'GRI 305-1'),
  ('default','科學基礎減量目標認證','通過 SBTi 1.5°C 路徑認證',2027,'Carbon',NULL,NULL,NULL,'planned',TRUE,'GRI 305-1'),
  ('default','淨零供應鏈','100% 供應商加入淨零承諾',2035,'Carbon',0,NULL,'tCO2e','planned',FALSE,'GRI 305-3')
ON CONFLICT DO NOTHING;

-- Verification
SELECT table_name, COUNT(*) as rows FROM (
  SELECT 'environmental_data' as table_name FROM public.environmental_data
  UNION ALL SELECT 'social_data' FROM public.social_data
  UNION ALL SELECT 'governance_data' FROM public.governance_data
  UNION ALL SELECT 'roadmap_milestones' FROM public.roadmap_milestones
) t GROUP BY table_name ORDER BY table_name;