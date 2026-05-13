-- ============================================================
-- ESG GO | Omni_Terminal — Schema v5.1 Seed Data
-- Run this in Supabase SQL Editor to populate all tables
-- ============================================================

-- ============================================================
-- Seed: social_metrics
-- ============================================================
INSERT INTO public.social_metrics (category, metric_name, value, unit, target_value, gri_reference, reporting_period, department, notes)
VALUES
  ('workforce', '全職員工人數', 1250, '人', 1300, 'GRI 2-7', '2024', '人資部', '含正式及約聘員工'),
  ('workforce', '女性員工比例', 42.5, '%', 45, 'GRI 2-7', '2024', '人資部', '管理職女性比例 28%'),
  ('workforce', '員工自願離職率', 8.2, '%', 7, 'GRI 401-1', '2024', '人資部', '較去年改善 1.3%'),
  ('workforce', '平均服務年資', 6.8, '年', 7, 'GRI 401-1', '2024', '人資部', NULL),
  ('safety', '失能傷害頻率 (FR)', 0.45, '次/百萬工時', 0.3, 'GRI 403-2', '2024', '環安衛', '較去年下降 22%'),
  ('safety', '職業病發生率', 0.08, '%', 0.05, 'GRI 403-2', '2024', '環安衛', NULL),
  ('safety', '總工時', 2600000, '工時', NULL, 'GRI 403-2', '2024', '環安衛', '含加班時數'),
  ('safety', '安全訓練覆蓋率', 98.5, '%', 100, 'GRI 403-5', '2024', '環安衛', '2人因病假未完成'),
  ('training', '人均年度受訓時數', 42.3, '小時/人', 48, 'GRI 404-1', '2024', '人資部', '線上課程佔 35%'),
  ('training', '績效考核覆蓋率', 100, '%', 100, 'GRI 404-3', '2024', '人資部', '100% 完成年度考核'),
  ('training', '內部晉升比例', 67, '%', 70, 'GRI 404-2', '2024', '人資部', NULL),
  ('supply_chain', '供應商 ESG 評估覆蓋率', 78, '%', 90, 'GRI 308-1', '2024', '採購部', '前50大供應商已評估'),
  ('supply_chain', '本地採購比例', 62, '%', 65, 'GRI 204-1', '2024', '採購部', '台灣本地供應商'),
  ('supply_chain', '簽署永續承諾書比例', 85, '%', 95, 'GRI 414-1', '2024', '採購部', NULL)
ON CONFLICT DO NOTHING;

-- ============================================================
-- Seed: governance_metrics
-- ============================================================
INSERT INTO public.governance_metrics (category, metric_name, value, unit, target_value, gri_reference, reporting_period, notes)
VALUES
  ('board', '董事會總人數', 9, '人', NULL, 'GRI 2-9', '2024', '含獨立董事 3 名'),
  ('board', '獨立董事比例', 33.3, '%', 33.3, 'GRI 2-9', '2024', '符合最低法規要求'),
  ('board', '女性董事比例', 22.2, '%', 25, 'GRI 2-9', '2024', '2名女性董事'),
  ('board', '董事會平均年齡', 58.4, '歲', NULL, 'GRI 2-9', '2024', NULL),
  ('board', '董事出席率', 91.7, '%', 90, 'GRI 2-9', '2024', '2024年全年董事會'),
  ('ethics', '貪腐事件數', 0, '件', 0, 'GRI 205-3', '2024', '零申訴紀錄'),
  ('ethics', '違規罰款總額', 0, '萬元', 0, 'GRI 206-1', '2024', '無任何法規裁罰'),
  ('ethics', '申訴管道案件數', 3, '件', NULL, 'GRI 2-26', '2024', '均已結案，無重大違失'),
  ('ethics', '員工誠信培訓覆蓋率', 96.2, '%', 100, 'GRI 205-2', '2024', '新進員工必修課程'),
  ('tax', '有效稅率', 19.8, '%', NULL, 'GRI 207-1', '2024', '符合國際稅務標準'),
  ('tax', '繳納所得稅', 4250, '萬元', NULL, 'GRI 207-4', '2024', '台灣境內'),
  ('tax', '政府補貼金額', 850, '萬元', NULL, 'GRI 207-4', '2024', '研發抵減稅額'),
  ('risk', '重大 ESG 風險項目數', 4, '項', 3, 'GRI 2-25', '2024', '氣候/供應鏈/人才/法規'),
  ('risk', '風險緩解措施覆蓋率', 75, '%', 90, 'GRI 2-25', '2024', NULL)
ON CONFLICT DO NOTHING;

-- ============================================================
-- Seed: roadmap_milestones
-- ============================================================
INSERT INTO public.roadmap_milestones (title, description, target_date, status, carbon_reduction_target, actual_reduction, category, gri_reference, responsible_dept, budget_twd)
VALUES
  ('完成基準年碳盤查', '依 ISO 14064-1 完成 2020 年基準年溫室氣體盤查，取得第三方查證', '2024-06-30', 'completed', 0, 0, 'measurement', 'GRI 305-1', '環安衛', 500000),
  ('太陽能屋頂安裝', '廠區屋頂安裝 500 kW 太陽能板，年發電量約 65 萬度', '2024-09-30', 'completed', 8, 8.2, 'renewable', 'GRI 302-1', '廠務', 12000000),
  ('LED 照明全面換裝', '將全廠照明系統更換為 LED，減少 30% 電力消耗', '2024-12-31', 'in_progress', 5, 3.1, 'efficiency', 'GRI 302-4', '廠務', 2000000),
  ('電動公務車採購', '採購 10 輛電動公務車，取代燃油車隊', '2025-03-31', 'planned', 3, NULL, 'transport', 'GRI 305-1', '總務', 5000000),
  ('綠電採購 20%', '透過 T-REC 採購 20% 再生能源憑證', '2025-06-30', 'planned', 12, NULL, 'renewable', 'GRI 302-1', '採購', 3000000),
  ('供應鏈碳足跡盤查', '完成前 30 大供應商範疇三排放量盤查', '2025-09-30', 'planned', 0, NULL, 'measurement', 'GRI 305-3', '採購', 1500000),
  ('碳中和路徑規劃', '委託顧問公司制定 2030 碳中和科學基礎減碳目標 (SBTi)', '2025-12-31', 'planned', 0, NULL, 'strategy', 'GRI 305-1', '永續委員會', 2000000),
  ('製程廢熱回收', '安裝廢熱回收系統，減少蒸氣鍋爐用量 40%', '2026-06-30', 'planned', 15, NULL, 'efficiency', 'GRI 302-4', '廠務', 8000000),
  ('達成 SBTi 1.5°C 目標', '完成科學基礎減碳目標認證，較基準年減碳 46%', '2030-12-31', 'planned', 46, NULL, 'strategy', 'GRI 305-1', '永續委員會', NULL),
  ('淨零排放', '達成全範疇碳中和，剩餘排放透過高品質碳抵換抵銷', '2050-12-31', 'planned', 100, NULL, 'strategy', 'GRI 305-1', '董事會', NULL)
ON CONFLICT DO NOTHING;

-- ============================================================
-- Seed: advisory_sessions
-- ============================================================
INSERT INTO public.advisory_sessions (persona, user_message, assistant_response, session_id, context_tags)
VALUES
  ('compliance', '我們公司的範疇三排放量如何計算？', '範疇三排放量依 GHG Protocol 分為 15 個類別。對製造業而言，最重要的通常是：上游 - 採購商品與服務 (Cat.1)、資本財 (Cat.2)、燃料與能源相關活動 (Cat.3)；下游 - 已售商品使用 (Cat.11)、報廢處理 (Cat.12)。建議先進行重要性評估，聚焦前 3 大類別，通常佔範疇三排放量的 80% 以上。', 'session_001', ARRAY['GHG', 'Scope3', 'GRI 305-3']),
  ('compliance', '如何準備 TCFD 氣候相關財務揭露？', 'TCFD 框架包含四大核心要素：1) 治理 - 董事會對氣候風險的監督；2) 策略 - 氣候風險與機會對業務的影響；3) 風險管理 - 識別、評估與管理流程；4) 指標與目標 - 量化指標與減碳目標。建議先完成氣候情境分析（1.5°C 與 4°C 情境），再對應各部門的財務衝擊評估。', 'session_001', ARRAY['TCFD', 'Climate', 'GRI 201-2']),
  ('harmony', '如何提升員工對 ESG 的參與感？', 'ESG 文化建立需要由上而下的承諾與由下而上的參與。建議：1) 設立跨部門 ESG 大使計畫，讓員工成為倡議者；2) 將個人 ESG 貢獻納入績效考核；3) 舉辦內部永續黑客松，鼓勵創新解決方案；4) 定期分享進展，讓員工看到自身貢獻的影響力。最重要的是讓永續不只是企業責任，更是個人價值實踐。', 'session_002', ARRAY['Culture', 'Engagement', 'GRI 2-7']),
  ('innovation', '循環經濟如何為我們的製造業創造商業價值？', '循環經濟在製造業有三大商業模式：1) 產品即服務 (PaaS) - 將設備所有權保留，收取使用費，延長產品壽命；2) 工業共生 - 與周邊企業交換廢棄物與副產品，創造新收入；3) 再製造 - 回收舊品翻新，以較低成本服務價格敏感市場。台積電、鴻海均已在此領域有所佈局，預計 2030 年前循環經濟市場規模將達 4.5 兆美元。', 'session_003', ARRAY['CircularEconomy', 'Innovation', 'GRI 301-1'])
ON CONFLICT DO NOTHING;

-- ============================================================
-- Seed: published_reports
-- ============================================================
INSERT INTO public.published_reports (title, report_year, status, framework, gri_coverage, total_pages, zkp_hash, integrity_score, author, description)
VALUES
  ('2023 永續報告書', 2023, 'published', ARRAY['GRI 2021', 'TCFD', 'SASB'], 78, 156, 'sha256:a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456', 94, '永續委員會', '本公司 2023 年度永續報告書，依 GRI 通用準則 2021 及 TCFD 框架編制，並取得 KPMG 有限確信聲明'),
  ('2022 永續報告書', 2022, 'published', ARRAY['GRI 2021', 'TCFD'], 71, 128, 'sha256:b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef12345678', 88, '永續委員會', '本公司首份依 GRI 通用準則 2021 編制之永續報告書'),
  ('2024 永續報告書 (草稿)', 2024, 'draft', ARRAY['GRI 2021', 'TCFD', 'SASB', 'ISSB S2'], 45, 0, NULL, NULL, '永續委員會', '2024 年度報告書草稿，目前完成度 45%，預計 2025 年 6 月正式發布'),
  ('2024 中期進度報告', 2024, 'published', ARRAY['GRI 2021'], 35, 48, 'sha256:c3d4e5f6789012345678901234567890abcdef1234567890abcdef1234567890', 82, '企劃部', '2024 上半年 ESG 關鍵指標進度更新報告'),
  ('碳中和路徑白皮書', 2024, 'published', ARRAY['TCFD', 'SBTi'], 20, 64, 'sha256:d4e5f6789012345678901234567890abcdef1234567890abcdef123456789012', 91, '永續委員會', '2024-2030 科學基礎減碳目標行動計畫，涵蓋範疇一、二、三減量路徑')
ON CONFLICT DO NOTHING;

-- ============================================================
-- Verification
-- ============================================================
SELECT 'social_metrics' AS table_name, COUNT(*) AS rows FROM public.social_metrics
UNION ALL
SELECT 'governance_metrics', COUNT(*) FROM public.governance_metrics
UNION ALL
SELECT 'roadmap_milestones', COUNT(*) FROM public.roadmap_milestones
UNION ALL
SELECT 'advisory_sessions', COUNT(*) FROM public.advisory_sessions
UNION ALL
SELECT 'published_reports', COUNT(*) FROM public.published_reports;