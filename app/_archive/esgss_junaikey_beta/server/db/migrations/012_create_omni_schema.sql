-- 1. Omni Audit Log (for VaultService)
CREATE TABLE IF NOT EXISTS omni_audit_log (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  entity_type text NOT NULL, -- 'AGENT', 'USER', 'SYSTEM', 'NOTE'
  entity_id text NOT NULL,
  event_type text NOT NULL, -- 'ZKP_COMMITMENT', 'BLOCKCHAIN_ANCHOR', 'CREATION', 'MUTATION'
  payload jsonb,
  proof text, -- Hash or Signature
  timestamp timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_audit_entity ON omni_audit_log (entity_id, entity_type);

-- 2. Omni Notes (for OmniNoteService / ICrystalDNA)
-- Represents the "Note" nature in Omni-Yuantong
CREATE TABLE IF NOT EXISTS omni_notes (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid, -- Owner
  title text,
  content text, -- Rich text or Markdown
  
  -- ICrystalDNA Core
  nature text DEFAULT 'Note', -- Note, Task, Evidence
  resonance float DEFAULT 0.0,
  
  -- 5T Protocol Metadata (Stored as columns for query performance, or JSONB for flexibility)
  -- We'll use specific columns for key protocol fields
  traceable_id text, -- Derived from creation context
  trustworthy_hash text, -- Content hash
  
  -- Spontaneous Flow
  vector_id uuid, -- Link to memory_chunks if stored there, or we rely on RAG ingest
  
  tags text[],
  is_archived boolean DEFAULT false,
  
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Trigger for updated_at
DROP TRIGGER IF EXISTS update_omni_notes_timestamp ON omni_notes;
CREATE TRIGGER update_omni_notes_timestamp
BEFORE UPDATE ON omni_notes
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
