-- server/db/init.sql
-- Unified Schema for ESGss x JunAiKey v6.0

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Blockchain Anchors
CREATE TABLE IF NOT EXISTS blockchain_anchors (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  data_hash varchar(64) NOT NULL,
  transaction_id varchar(255),
  block_number integer,
  network varchar(50) DEFAULT 'ethereum',
  status varchar(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'failed')),
  confirmations integer DEFAULT 0,
  created_at timestamp NOT NULL DEFAULT current_timestamp,
  updated_at timestamp NOT NULL DEFAULT current_timestamp
);
CREATE INDEX IF NOT EXISTS idx_ba_data_hash ON blockchain_anchors (data_hash);

-- 2. ZKP Proofs
CREATE TABLE IF NOT EXISTS zkp_proofs (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  proof_type varchar(20) NOT NULL DEFAULT 'groth16',
  proof_data text NOT NULL,
  public_inputs jsonb NOT NULL,
  qr_code text,
  valid_until timestamp NOT NULL,
  verification_key text,
  created_at timestamp NOT NULL DEFAULT current_timestamp
);

-- 3. Emission Factors
CREATE TABLE IF NOT EXISTS emission_factors (
  id SERIAL PRIMARY KEY,
  source_name text NOT NULL,
  category text NOT NULL,
  region text NOT NULL,
  year integer NOT NULL,
  activity_type text NOT NULL,
  unit text NOT NULL,
  co2e_per_unit numeric NOT NULL,
  created_at timestamp NOT NULL DEFAULT current_timestamp,
  CONSTRAINT unique_factor_constraint UNIQUE (source_name, region, year, activity_type, unit)
);

-- 4. Evidence Vault
CREATE TABLE IF NOT EXISTS evidence_vault (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid,
  storage_path text NOT NULL,
  data_type varchar(50) NOT NULL,
  status varchar(30) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'pending_validation')),
  assignee_id uuid,
  
  -- 4T Protocol
  trace_id uuid NOT NULL DEFAULT uuid_generate_v4(),
  data_hash varchar(64) NOT NULL,
  
  -- Metrics (Flattened for convenience)
  metric_key text,
  metric_value_numeric numeric,
  calculated_co2e numeric,
  emission_factor_id integer REFERENCES emission_factors(id) ON DELETE SET NULL,
  
  -- Trust Layer
  blockchain_anchor_id uuid REFERENCES blockchain_anchors(id),
  zkp_proof_id uuid REFERENCES zkp_proofs(id),
  onchain_anchor_hash text,
  blockchain_tx_id text,

  -- Awakening & Audit
  awakening_impact jsonb,
  approved_by uuid,
  approved_at timestamp,
  rejection_reason text,
  
  created_at timestamp NOT NULL DEFAULT current_timestamp,
  updated_at timestamp NOT NULL DEFAULT current_timestamp
);

CREATE INDEX IF NOT EXISTS idx_ev_status ON evidence_vault (status);
CREATE INDEX IF NOT EXISTS idx_ev_data_hash ON evidence_vault (data_hash);

-- 5. Extracted Metrics
CREATE TABLE IF NOT EXISTS extracted_metrics (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  evidence_id uuid NOT NULL REFERENCES evidence_vault(id) ON DELETE CASCADE,
  metric_key varchar(100) NOT NULL,
  category char(1) NOT NULL CHECK (category IN ('E', 'S', 'G')),
  numeric_value numeric,
  text_value text,
  date_value date,
  unit varchar(20),
  confidence_score numeric(3,2),
  extraction_method varchar(50) DEFAULT 'ai',
  created_at timestamp NOT NULL DEFAULT current_timestamp
);

-- 6. Evidence Comments
CREATE TABLE IF NOT EXISTS evidence_comments (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  evidence_id uuid NOT NULL REFERENCES evidence_vault(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  comment_text text NOT NULL,
  created_at timestamp NOT NULL DEFAULT current_timestamp
);

-- 7. Trigger Logic
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_evidence_vault_updated_at ON evidence_vault;
CREATE TRIGGER update_evidence_vault_updated_at
BEFORE UPDATE ON evidence_vault
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_blockchain_anchors_updated_at ON blockchain_anchors;
CREATE TRIGGER update_blockchain_anchors_updated_at
BEFORE UPDATE ON blockchain_anchors
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- 8. L1 Assessments (SME Fast Track)
CREATE TABLE IF NOT EXISTS l1_assessments (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid,
  company_name text,
  industry text,
  employee_count integer,
  
  -- Compliance Flags
  has_gh_inventory boolean DEFAULT false,
  has_code_of_conduct boolean DEFAULT false,
  has_sustainability_report boolean DEFAULT false,
  supply_chain_policy boolean DEFAULT false,
  
  -- Score & Status
  score integer,
  overall_status varchar(20),
  
  -- Contact
  contact_person text,
  contact_email text,
  
  created_at timestamp NOT NULL DEFAULT current_timestamp
);
