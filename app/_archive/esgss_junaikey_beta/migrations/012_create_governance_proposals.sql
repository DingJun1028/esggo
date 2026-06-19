-- ============================================================================
-- 13. Governance Proposals Table (DAO)
-- ============================================================================
CREATE TABLE IF NOT EXISTS governance_proposals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    creator_id TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL CHECK (category IN ('ENVIRONMENTAL', 'SOCIAL', 'GOVERNANCE', 'TECHNICAL')),
    votes_for NUMERIC DEFAULT 0,
    votes_against NUMERIC DEFAULT 0,
    quorum NUMERIC DEFAULT 100,
    status TEXT NOT NULL CHECK (status IN ('DRAFT', 'ACTIVE', 'PASSED', 'REJECTED', 'EXECUTED')),
    impact_score NUMERIC DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for active proposals lookup
CREATE INDEX IF NOT EXISTS idx_proposals_status ON governance_proposals(status);
CREATE INDEX IF NOT EXISTS idx_proposals_category ON governance_proposals(category);

-- RLS Policies
ALTER TABLE governance_proposals ENABLE ROW LEVEL SECURITY;

-- Allow read access to everyone (public/transparent DAO)
CREATE POLICY "Governance proposals are public" 
ON governance_proposals FOR SELECT 
USING (true);

-- Allow authenticated users (or service role) to insert
CREATE POLICY "Agents/Users can create proposals" 
ON governance_proposals FOR INSERT 
WITH CHECK (true); -- Ideally restrict to specific roles, but 'true' for now

-- Allow updates (voting updates typically done via backend/RPC, but allowing direct update for prototype)
CREATE POLICY "Agents/Users can update proposals" 
ON governance_proposals FOR UPDATE 
USING (true);
