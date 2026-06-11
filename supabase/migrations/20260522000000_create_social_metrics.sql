-- Migration to create social_metrics table

CREATE TABLE IF NOT EXISTS public.social_metrics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT NOT NULL,
  metric TEXT NOT NULL,
  value NUMERIC NOT NULL,
  unit TEXT NOT NULL,
  gri TEXT NOT NULL,
  verified BOOLEAN DEFAULT false,
  year INTEGER DEFAULT extract(year from current_date),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.social_metrics ENABLE ROW LEVEL SECURITY;

-- Allow anonymous read access (for simple ESG platform frontend, or replace with authenticated reads)
CREATE POLICY "Allow public read access" ON public.social_metrics
  FOR SELECT USING (true);

-- Mock Data Insertion
INSERT INTO public.social_metrics (category, metric, value, unit, gri, verified, year) VALUES
  ('workforce', '全職員工人數', 1250, '人', 'GRI 2-7', true, 2024),
  ('workforce', '女性員工比例', 38.5, '%', 'GRI 2-7', true, 2024),
  ('workforce', '高階主管女性比例', 25.0, '%', 'GRI 405-1', false, 2024),
  ('safety', '失能傷害頻率 (FR)', 0.45, '次/百萬工時', 'GRI 403-2', true, 2024),
  ('safety', '職業安全訓練覆蓋率', 96, '%', 'GRI 403-5', false, 2024),
  ('training', '平均訓練時數', 28.5, '小時/人', 'GRI 404-1', true, 2024),
  ('training', '績效考核覆蓋率', 100, '%', 'GRI 404-3', true, 2024),
  ('supply', '在地採購比例', 65, '%', 'GRI 204-1', false, 2024),
  ('supply', '供應商 ESG 評核完成率', 78, '%', 'GRI 308-1', false, 2024),
  ('community', '社區志工服務時數', 1200, '小時', 'GRI 413-1', true, 2024),
  ('community', '公益捐款總額', 500, '萬元', 'GRI 201-1', true, 2024),
  ('human_rights', '人權盡職調查完成率', 85, '%', 'GRI 412-1', false, 2024);
