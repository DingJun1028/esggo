-- ============================================================================
-- Mitigation 008: Ambient Webhook Trigger (Native SQL)
-- Purpose: Trigger the 'ambient-webhook' Edge Function on anomaly insertion
--          using the pg_net extension since Dashboard configuration is manual.
-- ============================================================================

-- 1. Ensure pg_net extension is enabled
CREATE EXTENSION IF NOT EXISTS pg_net;

-- 2. Create the Trigger Function
CREATE OR REPLACE FUNCTION public.fn_ambient_webhook()
RETURNS TRIGGER AS $$
DECLARE
    payload JSONB;
    request_id BIGINT;
BEGIN
    -- Only trigger if is_anomaly is true
    IF NEW.is_anomaly = true THEN
        -- Construct the payload to match Supabase Webhook format
        payload := json_build_object(
            'type', 'INSERT',
            'table', 'sensor_readings',
            'record', row_to_json(NEW),
            'schema', 'public',
            'old_record', null
        );

        -- Send POST request to Edge Function
        -- Note: Update the URL if your project ID changes.
        -- We are not sending Auth headers as verify_jwt is false for this specific internal function,
        -- but adding Content-Type is good practice.
        PERFORM net.http_post(
            url := 'https://mruetmtibkbzfaawfjbm.supabase.co/functions/v1/ambient-webhook',
            body := payload,
            headers := '{"Content-Type": "application/json"}'::jsonb
        );
        
        RAISE NOTICE 'Webhook triggered for Sensor ID: %', NEW.sensor_id;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. Create the Trigger
DROP TRIGGER IF EXISTS tr_ambient_webhook ON public.sensor_readings;

CREATE TRIGGER tr_ambient_webhook
AFTER INSERT ON public.sensor_readings
FOR EACH ROW
EXECUTE FUNCTION public.fn_ambient_webhook();

RAISE NOTICE '✅ Trigger tr_ambient_webhook created successfully.';
