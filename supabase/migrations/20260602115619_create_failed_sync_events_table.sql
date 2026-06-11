CREATE TABLE IF NOT EXISTS public.failed_sync_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id TEXT NOT NULL UNIQUE,          -- 來源 OmniEvent ID
    event_type TEXT NOT NULL,               -- OmniEvent.event_type
    payload JSONB NOT NULL,                 -- 完整 OmniEvent.payload（可追溯）
    error_log TEXT NOT NULL,                -- JSON.stringify 的錯誤資訊
    create_time TIMESTAMPTZ DEFAULT now(),
    retry_count INTEGER DEFAULT 0,
    latest_error TIMESTAMPTZ DEFAULT now(),
    status VARCHAR(20) DEFAULT 'pending',   -- pending | fixed | error | ignored
    is_deleted BOOLEAN DEFAULT FALSE
);