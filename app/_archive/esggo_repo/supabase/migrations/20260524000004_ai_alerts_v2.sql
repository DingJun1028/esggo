-- ============================================================================
-- ESG GO | Proactive AI Alert Expansion (v1.1)
-- Focus: Multi-dimensional risk triggers & Resolution logic
-- ============================================================================

-- 1. Add resolution metadata to ai_alerts
ALTER TABLE public.ai_alerts ADD COLUMN IF NOT EXISTS resolved_at TIMESTAMPTZ;
ALTER TABLE public.ai_alerts ADD COLUMN IF NOT EXISTS resolved_by TEXT;

-- 2. Enhanced Proactive Trigger: Missing Data Warning
-- This trigger fires when an evidence record is created but lacks a GRI reference
CREATE OR REPLACE FUNCTION public.check_vault_integrity_gap()
RETURNS trigger AS $$
BEGIN
  IF (NEW.gri_reference IS NULL OR NEW.gri_reference = '') THEN
    PERFORM net.http_post(
      url := 'https://yhwfmavnhaivvgzeuklx.supabase.co/functions/v1/ai-alerter',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlod2ZtYXZuaGFpdnZnemV1a2x4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODY1ODMwMywiZXhwIjoyMDk0MjM0MzAzfQ.cxcOdo70lCOVSwtgF_SHqKSgkYZ_Md6r1C63Kuuob3U'
      ),
      body := jsonb_build_object(
        'event', 'INTEGRITY_GAP',
        'record', jsonb_build_object(
          'id', NEW.id,
          'company_id', NEW.company_id,
          'gri_standard', 'MISSING_REF',
          'metric_value', 0,
          'unit', 'N/A',
          'description', '上傳的證據檔案缺少 GRI 指標關聯，將無法建立 5T 誠信鏈。'
        )
      )
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_check_vault_integrity_gap ON public.evidence_vault;
CREATE TRIGGER trg_check_vault_integrity_gap
  AFTER INSERT ON public.evidence_vault
  FOR EACH ROW EXECUTE FUNCTION public.check_vault_integrity_gap();

-- 3. RLS for AI Alerts (Security Best Practice)
ALTER TABLE public.ai_alerts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS ai_alerts_company_policy ON public.ai_alerts;
CREATE POLICY ai_alerts_company_policy ON public.ai_alerts
  FOR ALL TO authenticated
  USING ( company_id = (SELECT auth.jwt()->>'company_id') )
  WITH CHECK ( company_id = (SELECT auth.jwt()->>'company_id') );
