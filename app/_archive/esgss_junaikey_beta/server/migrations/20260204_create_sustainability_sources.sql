-- =====================================================
-- Phase 5: Global Sustainability Intelligence Sources
-- Migration: Create sustainability_sources table
-- =====================================================
-- 創建日期: 2026-02-04
-- 目標: 存儲 31 個全球永續資訊來源

-- 1. 創建主資料表
CREATE TABLE IF NOT EXISTS sustainability_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id INTEGER UNIQUE NOT NULL,
  name_en TEXT NOT NULL,
  name_tc TEXT NOT NULL,
  url TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('A', 'B', 'C')),
  category_name TEXT NOT NULL,
  content_type TEXT[] NOT NULL,
  update_frequency TEXT NOT NULL,
  priority INTEGER NOT NULL CHECK (priority BETWEEN 1 AND 4),
  rationale TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  last_crawled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. 創建索引
CREATE INDEX IF NOT EXISTS idx_sustainability_sources_category 
  ON sustainability_sources(category);

CREATE INDEX IF NOT EXISTS idx_sustainability_sources_priority 
  ON sustainability_sources(priority);

CREATE INDEX IF NOT EXISTS idx_sustainability_sources_update_frequency 
  ON sustainability_sources(update_frequency);

CREATE INDEX IF NOT EXISTS idx_sustainability_sources_is_active 
  ON sustainability_sources(is_active);

-- 3. 創建更新時間觸發器
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_sustainability_sources_updated_at
  BEFORE UPDATE ON sustainability_sources
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 4. 插入初始資料

-- A. 國際組織（10 個）
INSERT INTO sustainability_sources (source_id, name_en, name_tc, url, category, category_name, content_type, update_frequency, priority, rationale) VALUES
(1, 'UN SDGs Knowledge Platform', 'UN SDGs 知識平台', 'https://sdgs.un.org', 'A', '國際組織', ARRAY['全球SDG政策', '會議', '國家報告'], 'Weekly', 3, '最權威SDG資訊來源'),
(2, 'UNEP', '聯合國環境規劃署', 'https://www.unep.org', 'A', '國際組織', ARRAY['氣候', '污染', '自然', '生物多樣性專題'], 'Daily-Weekly', 2, '全球環境議題的官方標準'),
(3, 'UNFCCC', '聯合國氣候變遷框架公約', 'https://unfccc.int', 'A', '國際組織', ARRAY['氣候談判', 'COP文稿', '政策更新'], 'Daily-During COP', 2, '氣候政策第一手來源'),
(4, 'IPCC', '氣候變遷專家小組', 'https://www.ipcc.ch', 'A', '國際組織', ARRAY['氣候科學評估', 'AR系列'], 'Irregular', 4, '氣候科學的黃金標準'),
(5, 'UNDP', '聯合國開發計畫署', 'https://www.undp.org', 'A', '國際組織', ARRAY['再生發展', '治理', '減貧', '永續專案'], 'Weekly', 3, '永續政策落地最強案例庫'),
(6, 'World Bank', '世界銀行', 'https://www.worldbank.org', 'A', '國際組織', ARRAY['ESG數據', '永續投資', '開發金融'], 'Daily-Weekly', 2, '財經視角的永續政策分析'),
(7, 'OECD', '經合組織', 'https://www.oecd.org', 'A', '國際組織', ARRAY['全球治理', '教育', '永續政策統計'], 'Weekly', 3, 'OECD的資料與報告即為各國政策參考標準'),
(8, 'FAO', '聯合國糧農組織', 'https://www.fao.org', 'A', '國際組織', ARRAY['食農', '土地', '水資源', '生態系統'], 'Weekly', 3, '食農永續與自然資本的重要來源'),
(9, 'ILO', '國際勞工組織', 'https://www.ilo.org', 'A', '國際組織', ARRAY['勞權', '未來工作', '供應鏈社會責任'], 'Weekly', 3, 'S（社會議題）最關鍵來源之一'),
(10, 'IISD SDG Knowledge Hub', 'IISD SDG 知識中心', 'https://sdg.iisd.org', 'A', '國際組織', ARRAY['SDG全球新聞', '政策', '研究'], 'Daily', 1, 'SDG新聞最快速、最全面的平台之一');

-- B. 研究機構（10 個）
INSERT INTO sustainability_sources (source_id, name_en, name_tc, url, category, category_name, content_type, update_frequency, priority, rationale) VALUES
(11, 'WRI', '世界資源研究所', 'https://www.wri.org', 'B', '研究機構', ARRAY['氣候', '土地利用', '能源政策'], 'Daily-Weekly', 2, '以圖表、數據、政策工具著名'),
(12, 'WWF', '世界自然基金會', 'https://www.worldwildlife.org', 'B', '研究機構', ARRAY['生物多樣性', '自然資本', '倡議'], 'Weekly', 3, '自然與保育資訊的全球領導者'),
(13, 'IUCN', '國際自然保護聯盟', 'https://www.iucn.org', 'B', '研究機構', ARRAY['物種名錄', '自然政策', '研究'], 'Weekly', 3, '自然資本×政策×科學的交匯'),
(14, 'Stockholm Resilience Centre', '斯德哥爾摩韌性中心', 'https://www.stockholmresilience.org', 'B', '研究機構', ARRAY['行星界限', '系統思維', '自然治理'], 'Weekly', 3, '行星界限理論的原創單位'),
(15, 'Potsdam Climate Institute', '波茨坦氣候研究所', 'https://www.pik-potsdam.de', 'B', '研究機構', ARRAY['氣候風險', '模型', '能源系統'], 'Weekly', 3, '歐洲氣候科學最強中心之一'),
(16, 'Yale Environment 360', '耶魯環境360', 'https://e360.yale.edu', 'B', '研究機構', ARRAY['氣候', '自然', '生態治理評論'], 'Weekly', 3, '深度評論最優質來源之一'),
(17, 'MIT Climate Portal', 'MIT氣候入口', 'https://climate.mit.edu', 'B', '研究機構', ARRAY['氣候科技', '減碳技術', '科普文章'], 'Weekly', 3, '氣候科技轉型的最佳來源'),
(18, 'Cambridge Sustainability Commission', '劍橋永續委員會', 'https://www.cam.ac.uk', 'B', '研究機構', ARRAY['科學研究', '永續政策', '學術報告'], 'Monthly', 4, '深度研究與學者觀點具高度可信度'),
(19, 'NBER Environmental & Energy Economics', 'NBER環境與能源經濟', 'https://www.nber.org', 'B', '研究機構', ARRAY['永續與能源經濟研究'], 'Monthly', 4, 'ESG×經濟模型的最好參考資料之一'),
(20, 'Chatham House', '皇家國際研究所', 'https://www.chathamhouse.org', 'B', '研究機構', ARRAY['國際政治×ESG', '地緣環境'], 'Weekly', 3, 'ESG×Geopolitics的最佳來源');

-- C. ESG標準機構（11 個）
INSERT INTO sustainability_sources (source_id, name_en, name_tc, url, category, category_name, content_type, update_frequency, priority, rationale) VALUES
(21, 'IFRS Foundation / ISSB', 'IFRS基金會/ISSB', 'https://www.ifrs.org', 'C', 'ESG標準機構', ARRAY['永續揭露標準', 'S1/S2', '全球準則'], 'Weekly', 3, '永續揭露的全球標準制定者'),
(22, 'CDP', '碳揭露專案', 'https://www.cdp.net', 'C', 'ESG標準機構', ARRAY['氣候', '水', '森林揭露資料與報告'], 'Daily-Weekly', 2, '企業環境揭露的領導平台'),
(23, 'TCFD', '氣候相關財務揭露', 'https://www.fsb-tcfd.org', 'C', 'ESG標準機構', ARRAY['氣候財務資訊框架資料'], 'Irregular', 4, '已併入ISSB，仍為重要參考'),
(24, 'TNFD', '自然相關財務揭露', 'https://tnfd.global', 'C', 'ESG標準機構', ARRAY['自然相關財務揭露'], 'Weekly', 3, '自然資本揭露的新興標準'),
(25, 'SBTi', '科學基礎減量目標倡議', 'https://sciencebasedtargets.org', 'C', 'ESG標準機構', ARRAY['科學碳目標', '企業減量審核'], 'Daily-Weekly', 2, '企業減碳目標的權威驗證機構'),
(26, 'PRI', '責任投資原則', 'https://www.unpri.org', 'C', 'ESG標準機構', ARRAY['ESG投資趨勢', '資管指南'], 'Weekly', 3, '全球最大ESG投資者網絡'),
(27, 'GFANZ', '淨零金融聯盟', 'https://www.gfanzero.com', 'C', 'ESG標準機構', ARRAY['金融機構淨零承諾與行動'], 'Monthly', 4, '金融業淨零轉型的核心平台'),
(28, 'Climate Policy Initiative', '氣候政策倡議', 'https://www.climatepolicyinitiative.org', 'C', 'ESG標準機構', ARRAY['氣候投資', '政策追踪', '金融分析'], 'Weekly', 3, '氣候金融政策的深度分析'),
(29, 'GRI', '全球永續報告準則', 'https://www.globalreporting.org', 'C', 'ESG標準機構', ARRAY['GRI標準與示例'], 'Irregular', 4, '永續報告的全球通用標準'),
(30, 'SASB Standards', 'SASB標準', 'https://sasb.org', 'C', 'ESG標準機構', ARRAY['產業永續標準與揭露內容'], 'Irregular', 4, '產業特定的永續揭露標準'),
(31, 'WEF', '世界經濟論壇', 'https://www.weforum.org', 'C', 'ESG標準機構', ARRAY['永續科技', 'ESG趨勢', '國際政策'], 'Daily', 1, '全球ESG議程的引領者');

-- 5. 驗證資料完整性
DO $$
DECLARE
  total_count INTEGER;
  category_a_count INTEGER;
  category_b_count INTEGER;
  category_c_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO total_count FROM sustainability_sources;
  SELECT COUNT(*) INTO category_a_count FROM sustainability_sources WHERE category = 'A';
  SELECT COUNT(*) INTO category_b_count FROM sustainability_sources WHERE category = 'B';
  SELECT COUNT(*) INTO category_c_count FROM sustainability_sources WHERE category = 'C';
  
  RAISE NOTICE '總資料筆數: %', total_count;
  RAISE NOTICE '國際組織 (A): %', category_a_count;
  RAISE NOTICE '研究機構 (B): %', category_b_count;
  RAISE NOTICE 'ESG標準機構 (C): %', category_c_count;
  
  IF total_count != 31 THEN
    RAISE EXCEPTION '資料筆數不正確！預期 31 筆，實際 % 筆', total_count;
  END IF;
  
  IF category_a_count != 10 THEN
    RAISE EXCEPTION '國際組織筆數不正確！預期 10 筆，實際 % 筆', category_a_count;
  END IF;
  
  IF category_b_count != 10 THEN
    RAISE EXCEPTION '研究機構筆數不正確！預期 10 筆，實際 % 筆', category_b_count;
  END IF;
  
  IF category_c_count != 11 THEN
    RAISE EXCEPTION 'ESG標準機構筆數不正確！預期 11 筆，實際 % 筆', category_c_count;
  END IF;
  
  RAISE NOTICE '✅ 資料驗證通過！';
END $$;

-- 6. 查詢統計
SELECT 
  category,
  category_name,
  COUNT(*) as count,
  ARRAY_AGG(name_tc ORDER BY source_id) as sources
FROM sustainability_sources
GROUP BY category, category_name
ORDER BY category;

-- 7. 查詢優先級分佈
SELECT 
  priority,
  CASE 
    WHEN priority = 1 THEN 'Daily'
    WHEN priority = 2 THEN 'Daily-Weekly'
    WHEN priority = 3 THEN 'Weekly'
    WHEN priority = 4 THEN 'Monthly/Irregular'
  END as frequency_desc,
  COUNT(*) as count,
  ARRAY_AGG(name_tc ORDER BY source_id) as sources
FROM sustainability_sources
GROUP BY priority
ORDER BY priority;
