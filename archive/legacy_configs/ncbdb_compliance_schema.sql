-- Compliance Records Table for NCBDB (54686_esggo)
CREATE TABLE compliance_records (
    id SERIAL PRIMARY KEY,
    uuid UUID DEFAULT gen_random_uuid() UNIQUE,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    user_email TEXT NOT NULL,
    report_id TEXT NOT NULL,           -- 關聯報告 ID
    standard_version TEXT NOT NULL,    -- 使用的準則版本 (e.g., GRI-2021)
    status TEXT NOT NULL,              -- 掃描狀態: PENDING, PASSED, FAILED, WARNING
    findings JSONB,                    -- AI 發現清單 (包含法規鏈接與 CoT)
    integrity_hash TEXT NOT NULL,      -- 誠信鎖定 Hash (與 Supabase 同步)
    version INTEGER DEFAULT 1,
    metadata JSONB                     -- 其他擴展數據 (RAG 引用、Token 消耗等)
);

-- Index for fast lookup
CREATE INDEX idx_compliance_uuid ON compliance_records(uuid);
CREATE INDEX idx_compliance_user ON compliance_records(user_email);
