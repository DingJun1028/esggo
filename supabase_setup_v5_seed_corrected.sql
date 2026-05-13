-- ============================================================
-- ESG GO | Omni_Terminal — Schema v5.1 Corrected Seed Data
-- Matches ACTUAL column names from your Supabase database
-- Run this in Supabase SQL Editor
-- ============================================================

-- ─── social_metrics ────────────────────────────────────────────
INSERT INTO public.social_metrics
  (company_id, category, metric_name, metric_value, unit, year, gri_standard, source_origin, verified)
VALUES
  ('default', 'workforce', '全職員工人數',         1250,  '人',       2024, 'GRI 2-7',   '人資系統',  TRUE),
  ('default', 'workforce', '女性員工比例',           42.5, '%',        2024, 'GRI 2-7',   '人資系統',  TRUE),
  ('default', 'workforce', '員工自願離職率',          8.2, '%',        2024, 'GRI 401-1', '人資系統',  TRUE),
  ('default', 'workforce', '平均服務年資',            6.8, '年',       2024, 'GRI 401-1', '人資系統',  TRUE),
  ('default', 'safety',    '失能傷害頻率 (FR)',       0.45,'次/百萬工時',2024,'GRI 403-2', '環安衛紀錄',TRUE),
  ('default', 'safety',    '職業病發生率',            0.08,'%',        2024, 'GRI 403-2', '環安衛紀錄',FALSE),
  ('default', 'safety',    '總工時',              2600000, '工時',     2024, 'GRI 403-2', '環安衛紀錄',TRUE),
  ('default', 'safety',    '安全訓練覆蓋率',          98.5,'%',        2024, 'GRI 403-5', '訓練紀錄',  TRUE),
  ('default', 'training',  '人均年度受訓時數',        42.3,'小時/人',  2024, 'GRI 404-1', '訓練系統',  TRUE),
  ('default', 'training',  '績效考核覆蓋率',          100, '%',        2024, 'GRI 404-3', 'HR系統',    TRUE),
  ('default', 'training',  '內部晉升比例',            67,  '%',        2024, 'GRI 404-2', 'HR系統',    TRUE),
  ('default', 'supply_chain','供應商ESG評估覆蓋率',   78,  '%',        2024, 'GRI 308-1', '採購系統',  FALSE),
  ('default', 'supply_chain','本地採購比例',          62,  '%',        2024, 'GRI 204-1', '採購系統',  TRUE),
  ('default', 'supply_chain','簽署永續承諾書比例',    85,  '%',        2024, 'GRI 414-1', '採購系統',  FALSE)
ON CONFLICT DO NOTHING;

-- ─── governance_metrics ────────────────────────────────────────
INSERT INTO public.governance_metrics
  (company_id, category, metric_name, metric_value, unit, year, gri_standard, source_origin, verified)
VALUES
  ('default', 'board',  '董事會總人數',           9,    '人',   2024, 'GRI 2-9',   '董事會名冊',  TRUE),
  ('default', 'board',  '獨立董事比例',           33.3, '%',    2024, 'GRI 2-9',   '董事會名冊',  TRUE),
  ('default', 'board',  '女性董事比例',           22.2, '%',    2024, 'GRI 2-9',   '董事會名冊',  TRUE),
  ('default', 'board',  '董事會平均年齡',         58.4, '歲',   2024, 'GRI 2-9',   '董事會名冊',  TRUE),
  ('default', 'board',  '董事出席率',             91.7, '%',    2024, 'GRI 2-9',   '會議紀錄',    TRUE),
  ('default', 'ethics', '貪腐事件數',              0,   '件',   2024, 'GRI 205-3', '稽核報告',    TRUE),
  ('default', 'ethics', '違規罰款總額',            0,   '萬元', 2024, 'GRI 206-1', '法務紀錄',    TRUE),
  ('default', 'ethics', '申訴管道案件數',          3,   '件',   2024, 'GRI 2-26',  '申訴系統',    TRUE),
  ('default', 'ethics', '員工誠信培訓覆蓋率',     96.2, '%',    2024, 'GRI 205-2', '訓練紀錄',    TRUE),
  ('default', 'tax',    '有效稅率',               19.8, '%',    2024, 'GRI 207-1', '財務報告',    TRUE),
  ('default', 'tax',    '繳納所得稅',             4250, '萬元', 2024, 'GRI 207-4', '財務報告',    TRUE),
  ('default', 'tax',    '政府補貼金額',            850, '萬元', 2024, 'GRI 207-4', '財務報告',    TRUE),
  ('default', 'risk',   '重大ESG風險項目數',        4,  '項',   2024, 'GRI 2-25',  '風險報告',    FALSE),
  ('default', 'risk',   '風險緩解措施覆蓋率',       75, '%',    2024, 'GRI 2-25',  '風險報告',    FALSE)
ON CONFLICT DO NOTHING;

-- ─── roadmap_milestones ─────────────────────────────────────────
INSERT INTO public.roadmap_milestones
  (company_id, title, description, target_year, category, target_value, current_value, unit, status, sbti_aligned, gri_reference)
VALUES
  ('default', '完成基準年碳盤查',    '依 ISO 14064-1 完成 2020 年基準年溫室氣體盤查，取得第三方查證',  2024, 'Carbon',    0,    0,    'tCO2e',  'achieved',   FALSE, 'GRI 305-1'),
  ('default', '太陽能屋頂安裝',      '廠區屋頂安裝 500 kW 太陽能板，年發電量約 65 萬度',              2024, 'Renewable', 8,    8.2,  '%',      'achieved',   FALSE, 'GRI 302-1'),
  ('default', 'LED 照明全面換裝',    '將全廠照明系統更換為 LED，減少 30% 電力消耗',                   2024, 'Efficiency',5,    3.1,  '%',      'in_progress',FALSE, 'GRI 302-4'),
  ('default', '電動公務車採購',      '採購 10 輛電動公務車，取代燃油車隊',                             2025, 'Transport', 3,    NULL, '%',      'planned',    FALSE, 'GRI 305-1'),
  ('default', '綠電採購 20%',        '透過 T-REC 採購 20% 再生能源憑證',                               2025, 'Renewable', 12,   NULL, '%',      'planned',    FALSE, 'GRI 302-1'),
  ('default', '供應鏈碳足跡盤查',    '完成前 30 大供應商範疇三排放量盤查',                             2025, 'Carbon',    0,    NULL, 'tCO2e',  'planned',    FALSE, 'GRI 305-3'),
  ('default', '碳中和路徑規劃',      '制定 2030 碳中和科學基礎減碳目標 (SBTi)',                        2025, 'Strategy',  0,    NULL, 'tCO2e',  'planned',    TRUE,  'GRI 305-1'),
  ('default', '製程廢熱回收',        '安裝廢熱回收系統，減少蒸氣鍋爐用量 40%',                        2026, 'Efficiency',15,   NULL, '%',      'planned',    FALSE, 'GRI 302-4'),
  ('default', '達成 SBTi 1.5°C 目標','完成科學基礎減碳目標認證，較基準年減碳 46%',                     2030, 'Strategy',  46,   NULL, '%',      'planned',    TRUE,  'GRI 305-1'),
  ('default', '淨零排放',            '達成全範疇碳中和，剩餘排放透過高品質碳抵換抵銷',                 2050, 'Strategy',  100,  NULL, '%',      'planned',    TRUE,  'GRI 305-1')
ON CONFLICT DO NOTHING;

-- ─── advisory_sessions ─────────────────────────────────────────
INSERT INTO public.advisory_sessions
  (user_id, persona, title, messages)
VALUES
  (
    'default', 'compliance', '範疇三排放量計算諮詢',
    '[{"role":"user","content":"我們公司的範疇三排放量如何計算？"},{"role":"assistant","content":"範疇三排放量依 GHG Protocol 分為 15 個類別。對製造業而言，最重要的通常是：上游 - 採購商品與服務 (Cat.1)、資本財 (Cat.2)；下游 - 已售商品使用 (Cat.11)。建議先進行重要性評估，聚焦前 3 大類別，通常佔範疇三排放量的 80% 以上。"}]'::jsonb
  ),
  (
    'default', 'compliance', 'TCFD 氣候財務揭露準備',
    '[{"role":"user","content":"如何準備 TCFD 氣候相關財務揭露？"},{"role":"assistant","content":"TCFD 框架包含四大核心要素：1) 治理 - 董事會對氣候風險的監督；2) 策略 - 氣候風險與機會對業務的影響；3) 風險管理 - 識別、評估與管理流程；4) 指標與目標。建議先完成氣候情境分析（1.5°C 與 4°C 情境），再對應各部門的財務衝擊評估。"}]'::jsonb
  ),
  (
    'default', 'harmony', 'ESG 員工參與文化建立',
    '[{"role":"user","content":"如何提升員工對 ESG 的參與感？"},{"role":"assistant","content":"ESG 文化建立需要由上而下的承諾與由下而上的參與。建議：1) 設立跨部門 ESG 大使計畫；2) 將個人 ESG 貢獻納入績效考核；3) 舉辦內部永續黑客松；4) 定期分享進展。讓永續不只是企業責任，更是個人價值實踐。"}]'::jsonb
  ),
  (
    'default', 'innovation', '循環經濟商業價值諮詢',
    '[{"role":"user","content":"循環經濟如何為製造業創造商業價值？"},{"role":"assistant","content":"循環經濟在製造業有三大商業模式：1) 產品即服務 (PaaS)；2) 工業共生 - 與周邊企業交換廢棄物與副產品；3) 再製造 - 回收舊品翻新。預計 2030 年前循環經濟市場規模將達 4.5 兆美元。"}]'::jsonb
  )
ON CONFLICT DO NOTHING;

-- ─── published_reports ─────────────────────────────────────────
INSERT INTO public.published_reports
  (company_id, title, year, framework, status, page_count, gri_coverage, zkp_verified, zkp_hash)
VALUES
  ('default', '2023 永續報告書', 2023, ARRAY['GRI 2021', 'TCFD', 'SASB'], 'published', 156, 78, TRUE, 'sha256:a1b2c3d4e5f6789012345678901234567890abcdef'),
  ('default', '2022 永續報告書', 2022, ARRAY['GRI 2021', 'TCFD'], 'published', 128, 71, TRUE, 'sha256:b2c3d4e5f6789012345678901234567890abcdef'),
  ('default', '2024 永續報告書 (草稿)', 2024, ARRAY['GRI 2021', 'TCFD', 'SASB', 'ISSB S2'], 'draft', 0, 45, FALSE, NULL),
  ('default', '2024 中期進度報告', 2024, ARRAY['GRI 2021'], 'published', 48, 35, TRUE, 'sha256:c3d4e5f6789012345678901234567890abcdef'),
  ('default', '碳中和路徑白皮書', 2024, ARRAY['TCFD', 'SBTi'], 'published', 64, 20, TRUE, 'sha256:d4e5f6789012345678901234567890abcdef')
ON CONFLICT DO NOTHING;

-- ─── Verification ───────────────────────────────────────────────
SELECT 'social_metrics'     AS table_name, COUNT(*) AS rows FROM public.social_metrics
UNION ALL
SELECT 'governance_metrics', COUNT(*) FROM public.governance_metrics
UNION ALL
SELECT 'roadmap_milestones', COUNT(*) FROM public.roadmap_milestones
UNION ALL
SELECT 'advisory_sessions',  COUNT(*) FROM public.advisory_sessions
UNION ALL
SELECT 'published_reports',  COUNT(*) FROM public.published_reports;