CREATE TABLE IF NOT EXISTS omni_conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('user', 'model')),
    content JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    metadata JSONB
);

CREATE INDEX IF NOT EXISTS idx_omni_conversations_session_id ON omni_conversations(session_id);
