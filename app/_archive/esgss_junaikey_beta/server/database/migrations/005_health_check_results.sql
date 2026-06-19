-- ===============================================
-- ESG GO Platform: Health Check Module Schema
-- Sprint 2: L1 Assessment Database
-- ===============================================

-- Table: health_check_results
-- Purpose: 儲存 L1 快篩評估結果
-- Features: G/E/S 三維度評分、缺失識別、工時預估

CREATE TABLE IF NOT EXISTS health_check_results (
  -- Primary Key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Foreign Keys
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
  
  -- L1 評估資料
  l1_score INTEGER NOT NULL CHECK (l1_score >= 0 AND l1_score <= 100),
  governance_score INTEGER NOT NULL CHECK (governance_score >= 0 AND governance_score <= 100),
  environmental_score INTEGER NOT NULL CHECK (environmental_score >= 0 AND environmental_score <= 100),
  social_score INTEGER NOT NULL CHECK (social_score >= 0 AND social_score <= 100),
  
  -- 缺失與建議 (JSON 格式)
  gaps JSONB NOT NULL DEFAULT '[]', -- Gap[] 結構
  recommendations JSONB DEFAULT '[]', -- string[]
  estimated_workload_hours INTEGER DEFAULT 0,
  
  -- 原始提交資料 (MVD)
  raw_data JSONB NOT NULL, -- L1MinimalData 完整結構
  
  -- 5T Protocol 合規
  hash_signature VARCHAR(64) UNIQUE, -- SHA-256 of raw_data (Trustworthy)
  source_origin VARCHAR(255) DEFAULT 'web_portal', -- Traceable: 資料來源
  ip_address INET, -- Traceable: 提交 IP
  
  -- 狀態管理
  status VARCHAR(20) DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'archived')),
  
  -- 時間戳 (Trackable)
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  
  -- 索引優化
  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_company FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE SET NULL
);

-- 索引: 按用戶查詢 (最常用)
CREATE INDEX IF NOT EXISTS idx_hc_user_id ON health_check_results(user_id);

-- 索引: 按公司查詢
CREATE INDEX IF NOT EXISTS idx_hc_company_id ON health_check_results(company_id) WHERE company_id IS NOT NULL;

-- 索引: 按評分排序 (用於排行榜)
CREATE INDEX IF NOT EXISTS idx_hc_score ON health_check_results(l1_score DESC);

-- 索引: 按時間排序 (查詢最新結果)
CREATE INDEX IF NOT EXISTS idx_hc_created_at ON health_check_results(created_at DESC);

-- 索引: Hash 簽章查詢 (驗證用)
CREATE INDEX IF NOT EXISTS idx_hc_hash ON health_check_results(hash_signature) WHERE hash_signature IS NOT NULL;

-- 複合索引: 用戶 + 時間 (查詢用戶歷史)
CREATE INDEX IF NOT EXISTS idx_hc_user_time ON health_check_results(user_id, created_at DESC);

-- Trigger: 自動更新 updated_at
CREATE OR REPLACE FUNCTION update_health_check_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_health_check_update
BEFORE UPDATE ON health_check_results
FOR EACH ROW
EXECUTE FUNCTION update_health_check_timestamp();

-- ===============================================
-- Sample Data (for testing)
-- ===============================================
-- COMMENT ON TABLE health_check_results IS 'L1 Health Check assessment results with 5T Protocol compliance';
-- COMMENT ON COLUMN health_check_results.gaps IS 'Array of Gap objects: [{dimension, severity, estimatedHours, recommendation}]';
-- COMMENT ON COLUMN health_check_results.hash_signature IS 'SHA-256 hash of raw_data for data integrity verification';
