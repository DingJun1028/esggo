-- ==========================================
-- OmniTable.ai Sync Log Migration
-- ==========================================
-- [用途] 記錄 InfoOne ↔ OmniTable 雙向同步的日誌與狀態
-- [功能] 追蹤同步成功/失敗/衝突、支援重試機制、提供審計追蹤
-- [架構] 類似 Boost.Space Sync Log，確保架構一致性

-- ==================== Main Table ====================

CREATE TABLE IF NOT EXISTS omnitable_sync_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- 實體識別
  entity_type VARCHAR(50) NOT NULL CHECK (entity_type IN (
    'customer',     -- 客戶主檔
    'project',      -- 專案管理
    'metric',       -- ESG 指標
    'document',     -- 知識庫文檔
    'opportunity'   -- 商機管理
  )),
  entity_id UUID NOT NULL,  -- InfoOne 實體 ID
  
  -- OmniTable 識別
  omnitable_record_id VARCHAR(255),   -- OmniTable Record ID
  datasheet_id VARCHAR(255) NOT NULL, -- OmniTable Datasheet ID
  
  -- 同步方向與狀態
  sync_direction VARCHAR(20) NOT NULL CHECK (sync_direction IN ('to_omnitable', 'from_omnitable')),
  sync_status VARCHAR(20) NOT NULL CHECK (sync_status IN ('success', 'failed', 'conflict', 'pending', 'retry')),
  
  -- 衝突資料 (JSON 格式儲存)
  conflict_data JSONB,
  /* 範例結構:
  {
    "field": "customer_name",
    "localValue": "ABC Corp",
    "remoteValue": "ABC Corporation",
    "localTimestamp": "2026-02-08T10:00:00Z",
    "remoteTimestamp": "2026-02-08T10:05:00Z"
  }
  */
  
  -- 錯誤訊息
  error_message TEXT,
  
  -- 重試機制
  retry_count INTEGER DEFAULT 0,
  last_retry_at TIMESTAMP WITH TIME ZONE,
  
  -- 時間戳
  synced_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==================== Indexes ====================

-- 基礎查詢索引
CREATE INDEX IF NOT EXISTS idx_omnitable_sync_entity 
  ON omnitable_sync_log(entity_type, entity_id);

CREATE INDEX IF NOT EXISTS idx_omnitable_sync_record 
  ON omnitable_sync_log(omnitable_record_id);

CREATE INDEX IF NOT EXISTS idx_omnitable_sync_datasheet 
  ON omnitable_sync_log(datasheet_id);

-- 狀態管理索引
CREATE INDEX IF NOT EXISTS idx_omnitable_sync_status 
  ON omnitable_sync_log(sync_status) 
  WHERE sync_status IN ('failed', 'conflict', 'pending', 'retry');

-- 方向索引
CREATE INDEX IF NOT EXISTS idx_omnitable_sync_direction 
  ON omnitable_sync_log(sync_direction);

-- 時間範圍索引（效能查詢）
CREATE INDEX IF NOT EXISTS idx_omnitable_sync_created_at 
  ON omnitable_sync_log(created_at DESC);

-- 複合索引：實體 + 方向（常見查詢模式）
CREATE INDEX IF NOT EXISTS idx_omnitable_sync_entity_direction 
  ON omnitable_sync_log(entity_type, entity_id, sync_direction);

-- ==================== Helper Functions ====================

-- 函數：取得最新同步狀態
CREATE OR REPLACE FUNCTION get_latest_omnitable_sync_status(
  p_entity_type VARCHAR(50),
  p_entity_id UUID
)
RETURNS TABLE (
  sync_status VARCHAR(20),
  sync_direction VARCHAR(20),
  omnitable_record_id VARCHAR(255),
  synced_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    osl.sync_status,
    osl.sync_direction,
    osl.omnitable_record_id,
    osl.synced_at,
    osl.error_message
  FROM omnitable_sync_log osl
  WHERE osl.entity_type = p_entity_type
    AND osl.entity_id = p_entity_id
  ORDER BY osl.created_at DESC
  LIMIT 1;
END;
$$ LANGUAGE plpgsql;

-- 函數：取得所有未解決的衝突
CREATE OR REPLACE FUNCTION get_unresolved_omnitable_conflicts()
RETURNS TABLE (
  id UUID,
  entity_type VARCHAR(50),
  entity_id UUID,
  omnitable_record_id VARCHAR(255),
  conflict_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    osl.id,
    osl.entity_type,
    osl.entity_id,
    osl.omnitable_record_id,
    osl.conflict_data,
    osl.created_at
  FROM omnitable_sync_log osl
  WHERE osl.sync_status = 'conflict'
  ORDER BY osl.created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- 函數：取得需要重試的失敗同步
CREATE OR REPLACE FUNCTION get_failed_omnitable_syncs_for_retry(
  p_max_retry_count INTEGER DEFAULT 3
)
RETURNS TABLE (
  id UUID,
  entity_type VARCHAR(50),
  entity_id UUID,
  sync_direction VARCHAR(20),
  retry_count INTEGER,
  error_message TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    osl.id,
    osl.entity_type,
    osl.entity_id,
    osl.sync_direction,
    osl.retry_count,
    osl.error_message
  FROM omnitable_sync_log osl
  WHERE osl.sync_status IN ('failed', 'retry')
    AND osl.retry_count < p_max_retry_count
  ORDER BY osl.last_retry_at ASC NULLS FIRST
  LIMIT 100;
END;
$$ LANGUAGE plpgsql;

-- 函數：同步統計（用於 Dashboard）
CREATE OR REPLACE FUNCTION get_omnitable_sync_statistics(
  p_hours_ago INTEGER DEFAULT 24
)
RETURNS TABLE (
  total_syncs BIGINT,
  successful_syncs BIGINT,
  failed_syncs BIGINT,
  conflict_syncs BIGINT,
  pending_syncs BIGINT,
  success_rate NUMERIC,
  to_omnitable_count BIGINT,
  from_omnitable_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*)::BIGINT AS total_syncs,
    COUNT(*) FILTER (WHERE sync_status = 'success')::BIGINT AS successful_syncs,
    COUNT(*) FILTER (WHERE sync_status = 'failed')::BIGINT AS failed_syncs,
    COUNT(*) FILTER (WHERE sync_status = 'conflict')::BIGINT AS conflict_syncs,
    COUNT(*) FILTER (WHERE sync_status = 'pending')::BIGINT AS pending_syncs,
    CASE 
      WHEN COUNT(*) > 0 THEN 
        ROUND((COUNT(*) FILTER (WHERE sync_status = 'success')::NUMERIC / COUNT(*)::NUMERIC) * 100, 2)
      ELSE 0
    END AS success_rate,
    COUNT(*) FILTER (WHERE sync_direction = 'to_omnitable')::BIGINT AS to_omnitable_count,
    COUNT(*) FILTER (WHERE sync_direction = 'from_omnitable')::BIGINT AS from_omnitable_count
  FROM omnitable_sync_log
  WHERE created_at >= NOW() - (p_hours_ago || ' hours')::INTERVAL;
END;
$$ LANGUAGE plpgsql;

-- ==================== Triggers ====================

-- 自動更新 updated_at
CREATE OR REPLACE FUNCTION update_omnitable_sync_log_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_omnitable_sync_log_updated_at
  BEFORE UPDATE ON omnitable_sync_log
  FOR EACH ROW
  EXECUTE FUNCTION update_omnitable_sync_log_updated_at();

-- ==================== Row Level Security (RLS) ====================

-- 啟用 RLS
ALTER TABLE omnitable_sync_log ENABLE ROW LEVEL SECURITY;

-- Policy: 允許 authenticated 用戶讀取所有記錄
CREATE POLICY omnitable_sync_log_select_policy ON omnitable_sync_log
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Policy: 允許 service_role 完全控制
CREATE POLICY omnitable_sync_log_all_policy ON omnitable_sync_log
  FOR ALL
  USING (auth.role() = 'service_role');

-- ==================== Comments ====================

COMMENT ON TABLE omnitable_sync_log IS 'OmniTable.ai 同步日誌：記錄 InfoOne 與 OmniTable 之間的雙向同步狀態、衝突、錯誤';
COMMENT ON COLUMN omnitable_sync_log.entity_type IS '實體類型：customer, project, metric, document, opportunity';
COMMENT ON COLUMN omnitable_sync_log.sync_direction IS '同步方向：to_omnitable (推送), from_omnitable (接收)';
COMMENT ON COLUMN omnitable_sync_log.sync_status IS '同步狀態：success, failed, conflict, pending, retry';
COMMENT ON COLUMN omnitable_sync_log.conflict_data IS '衝突資料 (JSON)：儲存欄位名稱、本地值、遠端值、時間戳';
COMMENT ON COLUMN omnitable_sync_log.retry_count IS '重試次數：追蹤失敗同步的重試次數';

-- ==================== Initial Data (Optional) ====================

-- 可選：插入測試資料
-- INSERT INTO aitable_sync_log (entity_type, entity_id, datasheet_id, sync_direction, sync_status)
-- VALUES ('customer', gen_random_uuid(), 'dst123456', 'to_aitable', 'success');

-- ==================== Migration Complete ====================

-- 驗證 Migration
DO $$
BEGIN
  RAISE NOTICE '✅ OmniTable Sync Log Migration 完成';
  RAISE NOTICE '📊 表格: omnitable_sync_log';
  RAISE NOTICE '📍 索引: 7 個';
  RAISE NOTICE '⚙️  函數: 4 個 (get_latest_status, get_conflicts, get_failed_syncs, get_statistics)';
  RAISE NOTICE '🔒 RLS: 已啟用';
END $$;
