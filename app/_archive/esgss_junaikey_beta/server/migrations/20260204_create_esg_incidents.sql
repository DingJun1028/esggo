-- =====================================================
-- Phase 5.9: ESG Risk Incidents Tracking
-- 遷移腳本：創建 ESG 風險事件資料表
-- =====================================================
-- 創建日期：2026-02-04
-- 目標：紀錄被標註為高風險的商情項目，支援主動化合規預警

CREATE TABLE IF NOT EXISTS esg_incidents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id UUID NOT NULL REFERENCES market_intelligence_items(id) ON DELETE CASCADE,
  
  -- 風險評級與狀態
  risk_level TEXT NOT NULL CHECK (risk_level IN ('High', 'Medium', 'Low')),
  status TEXT NOT NULL DEFAULT 'Unresolved' CHECK (status IN ('Unresolved', 'Monitoring', 'Resolved', 'Dismissed')),
  
  -- AI 判定理由
  ai_rationale TEXT,      -- AI 標記此事件為風險的具體邏輯
  severity_score NUMERIC(3,2) DEFAULT 0.0, -- 事件嚴重性評分
  
  -- 元數據
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 索引：優化風險監控查詢
CREATE INDEX IF NOT EXISTS idx_esg_incidents_item_id ON esg_incidents(item_id);
CREATE INDEX IF NOT EXISTS idx_esg_incidents_risk_level ON esg_incidents(risk_level);
CREATE INDEX IF NOT EXISTS idx_esg_incidents_status ON esg_incidents(status);
CREATE INDEX IF NOT EXISTS idx_esg_incidents_created ON esg_incidents(created_at DESC);

COMMENT ON TABLE esg_incidents IS 'ESG 風險事件：紀錄並追蹤市場中高風險的合規異常或重大事件';
COMMENT ON COLUMN esg_incidents.ai_rationale IS 'AI 判定理由：說明為何此項商情被歸類為特定風險等級';

-- 觸發器：自動更新時間戳
CREATE TRIGGER update_esg_incidents_updated_at
  BEFORE UPDATE ON esg_incidents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
