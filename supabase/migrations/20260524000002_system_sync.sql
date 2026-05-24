-- ============================================================================
-- ESG GO | System Synchronization & Gap Analysis (Resilient Version)
-- ============================================================================

-- 1. Create a View for Gap Analysis
CREATE OR REPLACE VIEW public.system_gaps_summary AS
WITH required_gri AS (
  SELECT unnest(ARRAY['GRI 302-1', 'GRI 305-1', 'GRI 305-2', 'GRI 303-3', 'GRI 403-9']) as gri_tag
)
SELECT 
  r.gri_tag,
  CASE WHEN d.id IS NULL THEN 'MISSING' ELSE 'FILLED' END as status,
  d.company_id,
  d.updated_at
FROM required_gri r
LEFT JOIN environmental_data d ON d.gri_standard = r.gri_tag;

-- 2. Enable Realtime with existence checks
DO $$
BEGIN
  -- Add environmental_data if not exists
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'environmental_data'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE environmental_data;
  END IF;

  -- Add evidence_vault if not exists
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'evidence_vault'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE evidence_vault;
  END IF;

  -- Add user_memory if not exists
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'user_memory'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE user_memory;
  END IF;
END $$;

-- 3. GRI Nexus Function
CREATE OR REPLACE FUNCTION public.get_gri_nexus(p_gri_tag TEXT)
RETURNS TABLE (
  artifact_type TEXT,
  artifact_id UUID,
  identity_hash TEXT
) 
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 'ENVIRONMENTAL'::TEXT, id, hash_lock FROM environmental_data WHERE gri_standard = p_gri_tag
  UNION ALL
  SELECT 'VAULT'::TEXT, id, hash_lock FROM evidence_vault WHERE gri_reference = p_gri_tag
  UNION ALL
  SELECT 'AUDIT'::TEXT, id, hash_lock FROM audit_logs WHERE t5_tag = p_gri_tag;
END;
$$;
