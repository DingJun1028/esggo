-- 🏛️ ESGss 商業偵情中心 (Business Reconnaissance Hub)
-- 底層資料庫擴充指南 v1.0
-- 遵循 5T 協議：真、善、美、信、通

-- 1. 建立商業偵情主表
-- 此表用於儲存來自 30+ 國際機構的 Decision-Ready 情資
CREATE TABLE IF NOT EXISTS intel_reconnaissance_hub (
    uuid UUID PRIMARY KEY DEFAULT gen_random_uuid(), -- 唯一識別碼
    category VARCHAR(2) NOT NULL CHECK (category IN ('S1', 'S2', 'S3', 'S4', 'S5')), -- S1-S5 分類
    impact_level INT NOT NULL DEFAULT 3,             -- 影響等級 (1-5)
    source_origin TEXT NOT NULL,                     -- 🟢 可溯源 (Source URL)
    hash_lock CHAR(64) UNIQUE NOT NULL,              -- 🔴 不可篡改 (SHA-256)
    
    -- 核心數據封裝 (JSONB)
    -- 包含 title, insight, affected_supply_chain 等
    frozen_payload JSONB NOT NULL,                   -- 🔴 [核心禁區] 存入後嚴禁 UPDATE
    
    -- 5T 協議詳細元數據
    protocol_5t_metadata JSONB NOT NULL DEFAULT '{
        "tangible": true,
        "trackable": [],
        "transparent": ""
    }'::jsonb,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), -- 🔵 可追蹤起點
    status TEXT DEFAULT 'Trustworthy' NOT NULL         -- 受信狀態
);

-- 2. 建立高性能索引
-- 針對 S1-S5 分類進行索引
CREATE INDEX IF NOT EXISTS idx_recon_category ON intel_reconnaissance_hub(category);

-- 針對 Hash Lock 進行索引
CREATE INDEX IF NOT EXISTS idx_recon_hash_lock ON intel_reconnaissance_hub(hash_lock);

-- 針對 JSONB Payload 進行 GIN 索引，支援複雜的「零延遲」全文檢索
CREATE INDEX IF NOT EXISTS idx_recon_payload ON intel_reconnaissance_hub USING GIN (frozen_payload);

-- 3. 安全策略 (RLS)
-- 確保只有授權的 5T 代理或管理員可以讀取/寫入
ALTER TABLE intel_reconnaissance_hub ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated read access" 
ON intel_reconnaissance_hub FOR SELECT 
TO authenticated 
USING (true);

-- 4. 觸發器：防止更新 (WORM 特性)
-- 確保 Trustworthy 支柱：一旦寫入，嚴禁物理修改
CREATE OR REPLACE FUNCTION prevent_intel_update()
RETURNS TRIGGER AS $$
BEGIN
    RAISE EXCEPTION 'Trustworthy Pillar Violation: Intelligence nodes are immutable and cannot be updated.';
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_prevent_intel_update
BEFORE UPDATE ON intel_reconnaissance_hub
FOR EACH ROW EXECUTE FUNCTION prevent_intel_update();
