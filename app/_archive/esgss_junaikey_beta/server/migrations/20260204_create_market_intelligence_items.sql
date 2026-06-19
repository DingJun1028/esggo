-- =====================================================
-- Phase 5.5: Market Intelligence & 5T Integrity
-- 遷移腳本：創建市場情資與誠信存證資料表
-- =====================================================
-- 創建日期：2026-02-04
-- 目標：實作具備 5T 協議的市場情資存儲，回應外部公信力需求
-- 語言策略：英文檔名/路徑，繁體中文註釋

CREATE TABLE IF NOT EXISTS market_intelligence_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id INTEGER REFERENCES sustainability_sources(source_id),
  
  -- 基本情資內容
  title TEXT NOT NULL,
  summary TEXT,           -- AI 生成的高質量繁中摘要
  full_content TEXT,      -- 爬取的原文內容 (前 8000 字)
  url TEXT UNIQUE NOT NULL,
  
  -- AI 分析維度
  sentiment TEXT CHECK (sentiment IN ('Positive', 'Neutral', 'Negative')),
  impact_score NUMERIC(3,2) DEFAULT 0.5,
  confidence NUMERIC(3,2) DEFAULT 0.0, -- AI 分析置信度
  
  -- 5T 誠信協議封印 (Trust Layer)
  crystal_hash TEXT,      -- SHA-256 不可篡改雜湊鎖定
  evidence JSONB NOT NULL DEFAULT '{
    "tangible": {"source_link": ""},
    "traceable": {"crawler_session": ""},
    "trackable": {"status": "analyzed"},
    "transparent": {"ai_model": "gemini-2.0-flash", "prompt_version": "1.0"},
    "trustworthy": {"hash_locked": false}
  }'::jsonb,
  
  -- 元數據
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 索引：優化搜尋與分析
CREATE INDEX IF NOT EXISTS idx_market_intel_source_id ON market_intelligence_items(source_id);
CREATE INDEX IF NOT EXISTS idx_market_intel_sentiment ON market_intelligence_items(sentiment);
CREATE INDEX IF NOT EXISTS idx_market_intel_impact ON market_intelligence_items(impact_score);
CREATE INDEX IF NOT EXISTS idx_market_intel_published ON market_intelligence_items(published_at DESC);

-- 全文檢索索引
CREATE INDEX IF NOT EXISTS idx_market_intel_fts ON market_intelligence_items 
  USING gin(to_tsvector('simple', title || ' ' || COALESCE(summary, '')));

COMMENT ON TABLE market_intelligence_items IS '市場情資實體：整合 5T 協議，提供具備公信力的 ESG 動態數據';
COMMENT ON COLUMN market_intelligence_items.crystal_hash IS '數位存證雜湊：確保情資分析結果不可篡改';
COMMENT ON COLUMN market_intelligence_items.evidence IS '5T 證據地圖：包含原文連結、爬蟲 Session、AI 模型版本等溯源資訊';

-- 觸發器：自動更新時間戳
CREATE TRIGGER update_market_intelligence_items_updated_at
  BEFORE UPDATE ON market_intelligence_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
