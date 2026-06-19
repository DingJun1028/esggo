-- server/db/migrations/20260218_create_node_registry.sql
-- Migration to create the node_registry table for UI Node ID to UUID mapping

CREATE TABLE IF NOT EXISTS public.node_registry (
    node_id TEXT PRIMARY KEY,
    uuid UUID NOT NULL UNIQUE,
    node_type TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for UUID lookups
CREATE INDEX IF NOT EXISTS idx_node_registry_uuid ON public.node_registry(uuid);
