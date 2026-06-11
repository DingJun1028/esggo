-- ============================================================================
-- ESG GO | AI Pre-warning System
-- Focus: Anomaly Detection & Proactive Risk Alerting
-- ============================================================================

-- 1. Create AI Alerts Table
CREATE TABLE IF NOT EXISTS public.ai_alerts (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id    TEXT NOT NULL DEFAULT 'default',
  severity      TEXT CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  title         TEXT NOT NULL,
  description   TEXT,
  gri_tag       TEXT,
  suggested_fix TEXT,
  is_resolved   BOOLEAN DEFAULT false,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Enable Realtime for AI Alerts
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'ai_alerts'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE ai_alerts;
  END IF;
END $$;

-- 3. Automatic Anomaly Trigger Function
-- This function identifies "Critical Gaps" or "Data Spikes" and notifies AI Alerter
CREATE OR REPLACE FUNCTION public.check_esg_anomalies()
RETURNS trigger AS $$
BEGIN
  -- Simple threshold logic: If emissions spike > 5000 in one entry, trigger AI analysis
  IF (NEW.metric_value > 5000 AND NEW.category = 'GHG') THEN
    PERFORM net.http_post(
      url := 'https://yhwfmavnhaivvgzeuklx.supabase.co/functions/v1/ai-alerter',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlod2ZtYXZuaGFpdnZnemV1a2x4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODY1ODMwMywiZXhwIjoyMDk0MjM0MzAzfQ.cxcOdo70lCOVSwtgF_SHqKSgkYZ_Md6r1C63Kuuob3U'
      ),
      body := jsonb_build_object('event', 'ANOMALY_DETECTED', 'record', row_to_json(NEW))
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 4. Create the Anomaly Trigger
DROP TRIGGER IF EXISTS trg_check_esg_anomalies ON public.environmental_data;
CREATE TRIGGER trg_check_esg_anomalies
  AFTER INSERT OR UPDATE ON public.environmental_data
  FOR EACH ROW EXECUTE FUNCTION public.check_esg_anomalies();
