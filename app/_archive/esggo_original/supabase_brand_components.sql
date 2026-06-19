-- ============================================================
-- ESG GO | 萬能元件品牌原子資料庫 Schema
-- Run this in Supabase SQL Editor
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Brand Components Table
CREATE TABLE IF NOT EXISTS public.brand_components (
  id            UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id    TEXT        NOT NULL DEFAULT 'default',
  name          TEXT        NOT NULL,
  category      TEXT        NOT NULL,
  variant       TEXT,
  props         JSONB       DEFAULT '{}',
  description   TEXT,
  usage_example TEXT,
  tags          TEXT[]      DEFAULT '{}',
  is_favorite   BOOLEAN     DEFAULT false,
  version       TEXT        DEFAULT '1.0.0',
  hash_lock     TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(company_id, name, category)
);

-- Brand Tokens Table
CREATE TABLE IF NOT EXISTS public.brand_tokens (
  id         UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id TEXT        NOT NULL DEFAULT 'default',
  token_key  TEXT        NOT NULL,
  token_value TEXT       NOT NULL,
  category   TEXT        NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(company_id, token_key)
);

-- Component Usage Logs Table
CREATE TABLE IF NOT EXISTS public.component_usage_logs (
  id           UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  component_id UUID        REFERENCES public.brand_components(id) ON DELETE CASCADE,
  company_id   TEXT        DEFAULT 'default',
  page_path    TEXT,
  action       TEXT,
  metadata     JSONB       DEFAULT '{}',
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END; $$;

DROP TRIGGER IF EXISTS set_brand_components_updated_at ON public.brand_components;
CREATE TRIGGER set_brand_components_updated_at
  BEFORE UPDATE ON public.brand_components
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_brand_tokens_updated_at ON public.brand_tokens;
CREATE TRIGGER set_brand_tokens_updated_at
  BEFORE UPDATE ON public.brand_tokens
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Indexes
CREATE INDEX IF NOT EXISTS idx_brand_components_company ON public.brand_components(company_id);
CREATE INDEX IF NOT EXISTS idx_brand_components_category ON public.brand_components(category);
CREATE INDEX IF NOT EXISTS idx_brand_tokens_company ON public.brand_tokens(company_id);
CREATE INDEX IF NOT EXISTS idx_component_usage_logs_company ON public.component_usage_logs(company_id);

-- RLS
ALTER TABLE public.brand_components     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brand_tokens         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.component_usage_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "allow_all_brand_components"     ON public.brand_components;
DROP POLICY IF EXISTS "allow_all_brand_tokens"         ON public.brand_tokens;
DROP POLICY IF EXISTS "allow_all_component_usage_logs" ON public.component_usage_logs;

CREATE POLICY "allow_all_brand_components"     ON public.brand_components     FOR ALL USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "allow_all_brand_tokens"         ON public.brand_tokens         FOR ALL USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "allow_all_component_usage_logs" ON public.component_usage_logs FOR ALL USING (TRUE) WITH CHECK (TRUE);

-- Seed: Default Brand Tokens
INSERT INTO public.brand_tokens (company_id, token_key, token_value, category, description) VALUES
  ('default', 'berkeleyBlue',   '#003262', 'color', 'Berkeley Blue — 主品牌色'),
  ('default', 'californiaGold', '#FDB515', 'color', 'California Gold — 金色強調色'),
  ('default', 'deepBlue',       '#001F3F', 'color', 'Deep Blue — 深藍背景'),
  ('default', 'midBlue',        '#005DAA', 'color', 'Mid Blue — 中藍'),
  ('default', 'lightBlue',      '#3B7EA1', 'color', 'Light Blue — 淺藍'),
  ('default', 'skyBlue',        '#D4E4F7', 'color', 'Sky Blue — 天空藍'),
  ('default', 'successGreen',   '#22c55e', 'color', '成功綠'),
  ('default', 'warningAmber',   '#f59e0b', 'color', '警告琥珀'),
  ('default', 'errorRed',       '#ef4444', 'color', '錯誤紅'),
  ('default', 'fontFamily',     'Inter, Noto Sans TC, system-ui', 'typography', '主要字體族'),
  ('default', 'borderRadius-md','0.5rem',  'spacing', '標準圓角'),
  ('default', 'shadow-md',      '0 4px 12px rgba(0,50,98,0.08)', 'shadow', '標準陰影')
ON CONFLICT (company_id, token_key) DO NOTHING;

-- Seed: Default Components
INSERT INTO public.brand_components (company_id, name, category, variant, description, tags, version) VALUES
  ('default', 'BrandBadge',       'atomic',    'default',  '狀態標籤元件，支援 9 種變體 × 3 種尺寸', ARRAY['badge','status','label'], '9.0.0'),
  ('default', 'BrandButton',      'atomic',    'primary',  '按鈕元件，支援 6 種變體 × 4 種尺寸、Loading 狀態', ARRAY['button','action','cta'], '9.0.0'),
  ('default', 'BrandCard',        'molecular', 'default',  '可組合卡片元件，含 Header/Section 子組件', ARRAY['card','container','layout'], '9.0.0'),
  ('default', 'BrandInput',       'atomic',    'text',     '統一表單控件（Input/Textarea/Select）', ARRAY['form','input','select'], '9.0.0'),
  ('default', 'BrandModal',       'molecular', 'default',  '無障礙彈窗系統，含 Footer 插槽', ARRAY['modal','dialog','overlay'], '9.0.0'),
  ('default', 'BrandTable',       'organism',  'striped',  '通用型別安全資料表，含骨架屏', ARRAY['table','data','grid'], '9.0.0'),
  ('default', 'BrandTabs',        'molecular', 'line',     '頁籤元件，支援 line/pill/box 變體', ARRAY['tabs','navigation','panel'], '9.0.0'),
  ('default', 'BrandProgress',    'atomic',    'blue',     '多色進度條，支援 4 種尺寸與自動色', ARRAY['progress','metric','visual'], '9.0.0'),
  ('default', 'BrandKpiCard',     'organism',  'default',  'KPI 指標卡，含計算公式彈窗與 5T 驗證', ARRAY['kpi','metric','dashboard'], '9.0.0'),
  ('default', 'BrandPageHeader',  'organism',  'default',  '頁面標題欄，支援漸層與麵包屑', ARRAY['header','title','page'], '9.0.0'),
  ('default', 'BrandT5Strip',     'atomic',    'full',     '5T 誠信協議視覺條帶', ARRAY['5t','protocol','integrity'], '9.0.0'),
  ('default', 'BrandStatusDot',   'atomic',    'active',   '狀態圓點指示器，含脈衝動畫', ARRAY['status','dot','indicator'], '9.0.0'),
  ('default', 'BrandAlert',       'molecular', 'info',     '提示框元件，4 種變體，可解除', ARRAY['alert','notification','feedback'], '9.0.0'),
  ('default', 'BrandSkeleton',    'atomic',    'default',  '骨架屏載入元件，含卡片模式', ARRAY['skeleton','loading','placeholder'], '9.0.0'),
  ('default', 'BrandEmptyState',  'molecular', 'default',  '空狀態提示元件，含動作插槽', ARRAY['empty','state','placeholder'], '9.0.0'),
  ('default', 'BrandAvatar',      'atomic',    'default',  '頭像元件，支援圖片/首字母/狀態', ARRAY['avatar','user','profile'], '9.0.0'),
  ('default', 'BrandTooltip',     'atomic',    'top',      '工具提示，4 個方向', ARRAY['tooltip','hint','info'], '9.0.0'),
  ('default', 'BrandSearchBar',   'atomic',    'default',  '搜尋欄位，含清除按鈕', ARRAY['search','filter','input'], '9.0.0'),
  ('default', 'BrandFilterChip',  'molecular', 'default',  '篩選膠囊，多選切換', ARRAY['filter','chip','select'], '9.0.0'),
  ('default', 'BrandTimeline',    'organism',  'default',  '事件時間軸，含圖示與標籤', ARRAY['timeline','event','history'], '9.0.0'),
  ('default', 'BrandStepWizard',  'organism',  'horizontal','步驟精靈，水平/垂直兩種模式', ARRAY['step','wizard','flow'], '9.0.0'),
  ('default', 'BrandChartCard',   'organism',  'default',  '圖表容器卡，含標題/頁尾插槽', ARRAY['chart','card','visualization'], '9.0.0'),
  ('default', 'BrandDataCard',    'molecular', 'default',  '數據卡，輕量型指標顯示', ARRAY['data','card','metric'], '9.0.0'),
  ('default', 'BrandGRITag',      'atomic',    'default',  'GRI 指標代碼標籤', ARRAY['gri','tag','standard'], '9.0.0'),
  ('default', 'BrandScoreRing',   'atomic',    'default',  'SVG 分數環，支援動態描邊', ARRAY['score','ring','chart'], '9.0.0')
ON CONFLICT (company_id, name, category) DO NOTHING;

-- Verification
SELECT table_name, COUNT(*) AS rows FROM (
  SELECT 'brand_components' AS table_name FROM public.brand_components
  UNION ALL SELECT 'brand_tokens' FROM public.brand_tokens
) t GROUP BY table_name ORDER BY table_name;