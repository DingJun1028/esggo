-- 🏛️ Omni ESG Reports: NCBDB Schema Definition (Phase 1: Truth & Trust)
-- 遵守「完美開發範式 - 1. 定義 (Definition)」

-- ============================================================================
-- 1. 模組註冊表 (Omni Modules Registry)
-- 儲存 config/omni-modules.ts 中定義的 UUID 與描述
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.omni_modules (
    uuid VARCHAR PRIMARY KEY,            -- e.g., 'mod-omni-core-0002'
    domain VARCHAR NOT NULL,             -- e.g., 'Core', 'Adv'
    name VARCHAR NOT NULL,               -- e.g., 'Carbon Footprint'
    route VARCHAR NOT NULL,              -- e.g., '/omni/carbon'
    description TEXT,
    status VARCHAR DEFAULT 'PLANNED'     -- 'ACTIVE', 'DEVELOPMENT', 'PLANNED'
);

-- 插入基礎資料
INSERT INTO public.omni_modules (uuid, domain, name, route, description, status)
VALUES 
    ('mod-omni-hub-0000', 'Hub', 'ESG Omni Hub', '/omni', '萬能永續報告中心入口', 'ACTIVE'),
    ('mod-omni-hub-0001', 'Hub', 'ESG Reports Center', '/omni/reports', '負責收納與派發 200 種報告的總樞紐', 'DEVELOPMENT'),
    ('mod-omni-core-0002', 'Core', 'Carbon Footprint', '/omni/carbon', 'ISO-14064 碳足跡盤查與熱點分析', 'DEVELOPMENT')
ON CONFLICT (uuid) DO NOTHING;

-- ============================================================================
-- 2. 全能永續數據節點 (Omni Data Nodes / IComponentCore)
-- 每一個 200 項功能的填報資料都會轉化為這個節點 (遵循真、信哲學)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.omni_data_nodes (
    uuid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    module_id VARCHAR REFERENCES public.omni_modules(uuid) NOT NULL,
    
    -- IComponentCore Contract
    version VARCHAR NOT NULL,
    timestamp BIGINT NOT NULL,
    
    -- 數據溯源與哈希鎖定 (Hash Lock)
    evidence_origin_id VARCHAR,
    evidence_origin_hash VARCHAR,
    evidence_method VARCHAR,
    
    -- 生命週期與無架構負載
    lifecycle_events JSONB DEFAULT '[]'::jsonb,
    data JSONB NOT NULL,
    
    -- 封印狀態
    is_frozen BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ============================================================================
-- 3. 安全性規則 (Google Jules 防禦網 / Trust)
-- ============================================================================
-- 允許啟用 RLS
ALTER TABLE public.omni_data_nodes ENABLE ROW LEVEL SECURITY;

-- 【造緣/修因】寫入防護：不允許 Update 已被封印的節點
CREATE OR REPLACE FUNCTION check_frozen_node()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.is_frozen = true THEN
        RAISE EXCEPTION 'Omni Component Error: This Data Node is subjected to Hash Lock (Frozen) and cannot be modified.';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER protect_frozen_nodes
BEFORE UPDATE ON public.omni_data_nodes
FOR EACH ROW EXECUTE FUNCTION check_frozen_node();
