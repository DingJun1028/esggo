-- ============================================================
-- ESG GO | Audit Guardian Trigger Setup
-- ============================================================

-- Create the trigger function
CREATE OR REPLACE FUNCTION public.notify_audit_guardian()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  PERFORM
    net.http_post(
      url := 'https://yhwfmavnhaivvgzeuklx.supabase.co/functions/v1/audit-guardian',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlod2ZtYXZuaGFpdnZnemV1a2x4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODY1ODMwMywiZXhwIjoyMDk0MjM0MzAzfQ.cxcOdo70lCOVSwtgF_SHqKSgkYZ_Md6r1C63Kuuob3U'
      ),
      body := jsonb_build_object('record', row_to_json(NEW))
    );
  RETURN NEW;
END;
$$;

-- Create the trigger
DROP TRIGGER IF EXISTS trg_notify_audit_guardian ON public.audit_logs;
CREATE TRIGGER trg_notify_audit_guardian
AFTER INSERT ON public.audit_logs
FOR EACH ROW
EXECUTE FUNCTION public.notify_audit_guardian();
