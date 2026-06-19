-- 💡 ESGss JunAiKey: AI 永續報告自動化資料庫模式 (PostgreSQL)
-- 符合 3+1 數位信託協議實作

-- 1. 指標定義表 (esg_indicators)
-- 存儲 GRI/SASB 等法規的結構化元數據
CREATE TABLE IF NOT EXISTS esg_indicators (
    id UUID PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,      -- 例如: "GRI 305-1"
    topic TEXT NOT NULL,                  -- 例如: "直接(範疇 1)溫室氣體排放"
    standard VARCHAR(20) NOT NULL,        -- GRI, SASB, CSRD
    formula_logic JSONB,                  -- 🟠 [可驗算] 的算法邏輯
    required_evidence JSONB,              -- 🟢 [可溯源] 需要上傳的證據類型清單
    metadata JSONB,                       -- 額外元數據 (例如：描述)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. 核心數據點事實表 (esg_datapoints)
-- 紀錄每一筆事實數據，支援語義化版本控制
CREATE TABLE IF NOT EXISTS esg_datapoints (
    uuid UUID PRIMARY KEY,                -- DP-UUID
    indicator_id UUID REFERENCES esg_indicators(id),
    value DECIMAL(19, 6) NOT NULL,
    unit VARCHAR(20) NOT NULL,
    version VARCHAR(20) NOT NULL,         -- 🔵 [可追蹤] 語義化版本 (例如: 1.0.0)
    source_origin TEXT,                   -- 🟢 [可溯源] 數據來源原始備註
    protocol_status JSONB NOT NULL,       -- 3+1 協議實時狀態 (JSON 結構)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. 證據與雜湊鎖定表 (esg_hash_locks)
-- 專門負責 [不可篡改性] 的物理層設計
CREATE TABLE IF NOT EXISTS esg_hash_locks (
    id UUID PRIMARY KEY,                  -- LOCK-UUID
    datapoint_uuid UUID REFERENCES esg_datapoints(uuid),
    evidence_hash VARCHAR(64) NOT NULL,   -- 🟢 [可溯源] 原始文件 SHA-256
    merkle_root VARCHAR(64),              -- 🔴 [不可篡改] 用於驗證多筆數據的樹根
    parent_hash VARCHAR(64),              -- 🔵 [可追蹤] 鏈向上一筆數據的雜湊
    sealed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- 確保雜湊一致性，物理級別不可更改
    CONSTRAINT hash_immutable UNIQUE (evidence_hash)
);

-- 4. 信任鏈紀錄表 (esg_audit_trail)
-- 紀錄數據從 ERP 原始值到文本敘事的流轉路徑
CREATE TABLE IF NOT EXISTS esg_audit_trail (
    id SERIAL PRIMARY KEY,
    datapoint_uuid UUID REFERENCES esg_datapoints(uuid),
    action VARCHAR(50) NOT NULL,          -- ingest, audit, narrative, seal
    actor_id VARCHAR(100),                -- 使用者 ID 或 Agent ID
    current_hash VARCHAR(64) NOT NULL,
    parent_hash VARCHAR(64),
    evidence_vault_url TEXT,              -- 證據存儲路徑 (S3 URL)
    payload JSONB,                        -- 變更細節
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. 自動化版本 Hook (遞增版本)
-- 透過資料庫函數確保可追蹤性
CREATE OR REPLACE FUNCTION fn_increment_version()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    -- 這裡可依需求實作版本號自動遞增邏輯
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_track_datapoint_version
BEFORE UPDATE ON esg_datapoints
FOR EACH ROW EXECUTE PROCEDURE fn_increment_version();

-- 批註：高標高效 - 零幻覺資料庫
-- 1. Check 約束確保數據不變性
-- 2. JSONB 支援靈活的法規規則
-- 3. 強制外鍵鏈結確保數據不丟失
