-- ===============================================
-- ESG GO Platform: Evidence Vault Schema
-- Sprint 2: Evidence Management with Hash Lock
-- ===============================================

-- Table: evidence_vault
-- Purpose: 儲存用戶上傳的證據文件（支援跨部門協作）
CREATE TABLE IF NOT EXISTS evidence_vault (
  -- Primary Key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Foreign Keys
  user_id UUID NOT NULL,
  company_id UUID,
  l1_assessment_id UUID REFERENCES health_check_results(id),
  
  -- File Metadata
  file_name VARCHAR(255) NOT NULL,
  file_type VARCHAR(50) NOT NULL, -- 'pdf', 'jpg', 'xlsx', 'docx'
  file_size_bytes BIGINT NOT NULL CHECK (file_size_bytes > 0),
  file_url TEXT NOT NULL, -- Supabase Storage URL
  
  -- Evidence Classification
  evidence_category VARCHAR(50) NOT NULL CHECK (
    evidence_category IN (
      'governance',
      'environmental',
      'social',
      'financial',
      'operational',
      'certification',
      'other'
    )
  ),
  evidence_sub_type VARCHAR(100), -- e.g., 'board_minutes', 'carbon_report'
  
  -- Evidence Tags (for search & filtering)
  tags TEXT[] DEFAULT '{}',
  description TEXT,
  
  -- 5T Protocol: Hash Lock (不可篡改)
  file_hash_sha256 VARCHAR(64) NOT NULL UNIQUE,
  metadata_hash VARCHAR(64), -- Hash of all metadata
  locked_at TIMESTAMP, -- Hash Lock 時間
  is_locked BOOLEAN DEFAULT false,
  
  -- 5T Protocol: Traceable & Trackable
  source_origin VARCHAR(255) DEFAULT 'web_upload',
  uploaded_by_name VARCHAR(255),
  department VARCHAR(100),
  
  -- Access Control
  visibility VARCHAR(20) DEFAULT 'private' CHECK (
    visibility IN ('private', 'department', 'company', 'public')
  ),
  shared_with_users UUID[] DEFAULT '{}',
  
  -- QA Score Integration
  contributes_to_qa_score BOOLEAN DEFAULT true,
  qa_score_weight DECIMAL(3, 2) DEFAULT 1.0,
  
  -- Verification Status
  verification_status VARCHAR(20) DEFAULT 'pending' CHECK (
    verification_status IN ('pending', 'verified', 'rejected', 'expired')
  ),
  verified_by UUID,
  verified_at TIMESTAMP,
  
  -- Lifecycle
  status VARCHAR(20) DEFAULT 'active' CHECK (
    status IN ('active', 'archived', 'deleted')
  ),
  expires_at TIMESTAMP, -- 證據有效期限
  
  -- Timestamps
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_ev_user_id ON evidence_vault(user_id);
CREATE INDEX IF NOT EXISTS idx_ev_company_id ON evidence_vault(company_id) WHERE company_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_ev_assessment_id ON evidence_vault(l1_assessment_id) WHERE l1_assessment_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_ev_category ON evidence_vault(evidence_category);
CREATE INDEX IF NOT EXISTS idx_ev_hash ON evidence_vault(file_hash_sha256);
CREATE INDEX IF NOT EXISTS idx_ev_locked ON evidence_vault(is_locked) WHERE is_locked = true;
CREATE INDEX IF NOT EXISTS idx_ev_created_at ON evidence_vault(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ev_tags ON evidence_vault USING GIN(tags);

-- Composite Index: User + Category + Status
CREATE INDEX IF NOT EXISTS idx_ev_user_category_status 
  ON evidence_vault(user_id, evidence_category, status);

-- Trigger: Auto-update timestamp
CREATE OR REPLACE FUNCTION update_evidence_vault_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_evidence_vault_update
BEFORE UPDATE ON evidence_vault
FOR EACH ROW
EXECUTE FUNCTION update_evidence_vault_timestamp();

-- Trigger: Prevent modification after Hash Lock
CREATE OR REPLACE FUNCTION prevent_locked_evidence_modification()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.is_locked = true THEN
    RAISE EXCEPTION 'Cannot modify locked evidence (5T: Trustworthy)';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_prevent_locked_modification
BEFORE UPDATE ON evidence_vault
FOR EACH ROW
EXECUTE FUNCTION prevent_locked_evidence_modification();

-- Row Level Security
ALTER TABLE evidence_vault ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own evidence
CREATE POLICY evidence_select_policy ON evidence_vault
  FOR SELECT
  USING (
    auth.uid() = user_id OR
    auth.uid() = ANY(shared_with_users) OR
    visibility = 'public'
  );

-- Policy: Users can insert their own evidence
CREATE POLICY evidence_insert_policy ON evidence_vault
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own unlocked evidence
CREATE POLICY evidence_update_policy ON evidence_vault
  FOR UPDATE
  USING (auth.uid() = user_id AND is_locked = false);

-- Policy: Users can delete their own unlocked evidence
CREATE POLICY evidence_delete_policy ON evidence_vault
  FOR DELETE
  USING (auth.uid() = user_id AND is_locked = false);
