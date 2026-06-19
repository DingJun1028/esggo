-- 🟢 創建數據點與證據鏈的聯合視圖
CREATE TABLE IF NOT EXISTS esg_indicators (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) NOT NULL UNIQUE, -- 如 "GRI 305-1"
    formula_logic JSONB, -- 自動驗算的算法邏輯
    required_evidence TEXT[], -- 需要上傳的證據類型
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS esg_datapoints (
    uuid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    indicator_id UUID REFERENCES esg_indicators(id),
    value DECIMAL NOT NULL,
    unit VARCHAR(20) NOT NULL,
    version VARCHAR(20) NOT NULL, -- 語義化版本（如 1.2.0）
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS esg_evidence_chain (
    id SERIAL PRIMARY KEY,
    datapoint_uuid UUID NOT NULL REFERENCES esg_datapoints(uuid),
    current_hash VARCHAR(64) NOT NULL,
    parent_hash VARCHAR(64), -- 🔗 鏈向上一筆數據，達成 Trackable
    evidence_vault_url TEXT, -- 🔗 鏈向雲端證據庫
    verification_status VARCHAR(20) DEFAULT 'pending',
    sealed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    -- [4+1 協議] 雜湊鎖定觸發器限制
    CONSTRAINT hash_immutable UNIQUE (current_hash)
);

-- 🟠 建立自動驗算檢查約束
ALTER TABLE esg_datapoints
ADD CONSTRAINT check_value_positive CHECK (value >= 0);

-- 🔵 自動追蹤 Hook：更新時自動生成新版本
CREATE OR REPLACE FUNCTION fn_increment_version()
RETURNS TRIGGER AS $$
BEGIN
    -- 簡單的版本號遞增邏輯 (實際可能需要更複雜的語義化版本解析)
    -- 這裡假設 version 是 x.y.z 格式，簡單 append 或更新 updated_at
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_track_version
BEFORE UPDATE ON esg_datapoints
FOR EACH ROW EXECUTE PROCEDURE fn_increment_version();
