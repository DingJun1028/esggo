-- ============================================================================
-- ESG GO | Database Optimization v1
-- Focus: 5T Integrity Performance, Memory Consolidation, and RLS Tuning
-- ============================================================================

BEGIN;

-- ============================================================================
-- 1. Index Refinement (JSONB & Query Performance)
-- ============================================================================

-- Optimize user_memory JSONB lookups
-- Using jsonb_path_ops for faster containment (@>) queries and smaller index size
DROP INDEX IF EXISTS public.idx_user_memory_value_gin;
CREATE INDEX idx_user_memory_value_gin ON public.user_memory USING gin (memory_value jsonb_path_ops);

-- Add expression index for memory_key if not already efficient
CREATE INDEX IF NOT EXISTS idx_user_memory_key_pattern ON public.user_memory (memory_key text_pattern_ops);

-- Optimize evidence_vault for fast lookups on company and status
CREATE INDEX IF NOT EXISTS idx_ev_company_status ON public.evidence_vault(company_id, status);
CREATE INDEX IF NOT EXISTS idx_ev_hash_lock ON public.evidence_vault(hash_lock);

-- Optimize vault_omni_core for GRI and high-volume TRACE lookups
DROP INDEX IF EXISTS public.idx_vault_omni_payload_gin;
CREATE INDEX idx_vault_omni_payload_gin ON public.vault_omni_core USING gin (payload jsonb_path_ops);

-- Optimize audit_logs for traceability
CREATE INDEX IF NOT EXISTS idx_audit_logs_company_resource ON public.audit_logs(company_id, resource);
CREATE INDEX IF NOT EXISTS idx_audit_logs_t5 ON public.audit_logs(t5_tag);

-- ============================================================================
-- 2. RLS Performance Tuning
-- ============================================================================

-- Optimize user_memory policies
DROP POLICY IF EXISTS "user_memory_owner_policy" ON public.user_memory;
DROP POLICY IF EXISTS "allow_all_user_memory" ON public.user_memory;
CREATE POLICY "user_memory_owner_policy" ON public.user_memory
  FOR ALL TO authenticated
  USING ( (SELECT auth.uid())::text = user_id )
  WITH CHECK ( (SELECT auth.uid())::text = user_id );

-- Optimize evidence_vault policies (Company-scoped access)
DROP POLICY IF EXISTS "evidence_vault_owner_policy" ON public.evidence_vault;
DROP POLICY IF EXISTS "evidence_vault_deny_all" ON public.evidence_vault;
CREATE POLICY "evidence_vault_company_policy" ON public.evidence_vault
  FOR ALL TO authenticated
  USING ( company_id = (SELECT auth.jwt()->>'company_id') )
  WITH CHECK ( company_id = (SELECT auth.jwt()->>'company_id') );

-- Optimize ai_memory policies
DROP POLICY IF EXISTS "ai_memory_owner_policy" ON public.ai_memory;
DROP POLICY IF EXISTS "allow_all_ai_memory" ON public.ai_memory;
CREATE POLICY "ai_memory_owner_policy" ON public.ai_memory
  FOR ALL TO authenticated
  USING ( (SELECT auth.uid())::text = user_id )
  WITH CHECK ( (SELECT auth.uid())::text = user_id );

-- ============================================================================
-- 3. Automated Auditing & Consolidation
-- ============================================================================

-- Function to consolidate memory records
CREATE OR REPLACE FUNCTION public.consolidate_eternal_memories(
  p_user_id TEXT,
  p_company_id TEXT,
  p_memory_type TEXT
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_new_id UUID;
  v_combined_content JSONB;
  v_count INTEGER;
BEGIN
  SELECT jsonb_agg(memory_value), count(*) INTO v_combined_content, v_count
  FROM user_memory
  WHERE user_id = p_user_id AND company_id = p_company_id AND memory_type = p_memory_type
    AND (context->>'consolidated')::boolean IS NOT TRUE;

  IF v_count < 2 THEN RETURN NULL; END IF;

  INSERT INTO user_memory (user_id, company_id, memory_type, memory_key, memory_value, context, hash_lock)
  VALUES (
    p_user_id, p_company_id, p_memory_type,
    'consolidated_' || p_memory_type || '_' || extract(epoch from now())::text,
    v_combined_content,
    jsonb_build_object('consolidated', true, 'child_count', v_count, 'consolidated_at', now()),
    encode(digest(v_combined_content::text, 'sha256'), 'hex')
  ) RETURNING id INTO v_new_id;

  UPDATE user_memory SET context = context || jsonb_build_object('consolidated', true, 'parent_id', v_new_id)
  WHERE user_id = p_user_id AND company_id = p_company_id AND memory_type = p_memory_type
    AND id != v_new_id AND (context->>'consolidated')::boolean IS NOT TRUE;

  RETURN v_new_id;
END;
$$;

-- Automatic Auditing Trigger for Evidence Vault (T5 Trackable)
CREATE OR REPLACE FUNCTION public.audit_vault_change()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.audit_logs (company_id, action, resource, t5_tag, details, hash_lock)
  VALUES (
    NEW.company_id,
    TG_OP,
    'evidence_vault:' || NEW.id,
    'T5',
    jsonb_build_object('old_status', OLD.status, 'new_status', NEW.status, 'is_sealed', NEW.is_sealed)::text,
    encode(digest(NEW::text, 'sha256'), 'hex')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_audit_vault_change ON public.evidence_vault;
CREATE TRIGGER trg_audit_vault_change
  AFTER UPDATE OR INSERT ON public.evidence_vault
  FOR EACH ROW EXECUTE FUNCTION public.audit_vault_change();

-- ============================================================================
-- 4. Storage & Vault Performance
-- ============================================================================

ALTER TABLE public.vault_omni_core SET (autovacuum_vacuum_scale_factor = 0.01);
ALTER TABLE public.evidence_vault SET (autovacuum_vacuum_scale_factor = 0.05);

COMMIT;

