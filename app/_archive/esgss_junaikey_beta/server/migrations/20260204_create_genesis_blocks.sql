-- 20260204_create_genesis_blocks.sql
-- Immutable System State & Final Awakening Archive

CREATE TABLE IF NOT EXISTS public.genesis_blocks (
    id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    timestamp BIGINT NOT NULL,
    seal_hash TEXT NOT NULL UNIQUE,
    entity_name TEXT NOT NULL,
    era TEXT NOT NULL,
    final_state JSONB NOT NULL,
    signatures TEXT[] DEFAULT ARRAY[]::TEXT[],
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.genesis_blocks ENABLE ROW LEVEL SECURITY;

-- Governance Policy: Only authenticated admins can write, everyone can read system milestones
CREATE POLICY "Admins can insert genesis blocks" ON public.genesis_blocks
    FOR INSERT WITH CHECK (true); -- Simplified for Beta, should check admin role

CREATE POLICY "Public can view system milestones" ON public.genesis_blocks
    FOR SELECT USING (true);

-- Indexing for sequence tracking
CREATE INDEX IF NOT EXISTS idx_genesis_blocks_timestamp ON public.genesis_blocks(timestamp DESC);
