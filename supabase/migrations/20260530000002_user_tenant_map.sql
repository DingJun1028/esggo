-- user_tenant_map: The missing link for multi-tenant RLS
CREATE TABLE IF NOT EXISTS user_tenant_map (
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    tenant_id TEXT NOT NULL, -- Corresponds to company_id
    role TEXT DEFAULT 'member',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, tenant_id)
);

-- Enable RLS on user_tenant_map
ALTER TABLE user_tenant_map ENABLE ROW LEVEL SECURITY;

-- Users can view their own tenant mappings
CREATE POLICY "user_tenant_map read own"
ON user_tenant_map
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Admin/Service can manage all (Internal use)
CREATE POLICY "user_tenant_map manage all"
ON user_tenant_map
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Update existing RLS policies to use user_tenant_map for more robust checks if needed
-- (The auth.jwt() approach in the previous migration is faster, but this table allows for manual overrides and better management)
