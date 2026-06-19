-- ============================================================================
-- Mitigation 009: Ambient Reliability Layer (Outbox Pattern)
-- Purpose: Decouple sensor ingestion from webhooks using an Outbox pattern
--          to ensure reliability, retries, and monitoring.
-- ============================================================================

-- 1. Create Outbox Table
CREATE TABLE IF NOT EXISTS public.outbox_events (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  topic text NOT NULL,
  payload jsonb NOT NULL,
  headers jsonb DEFAULT '{}'::jsonb,
  attempts int DEFAULT 0,
  last_error text,
  next_try_at timestamptz DEFAULT now(),
  processed boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_outbox_next_try ON public.outbox_events (processed, next_try_at);

-- 2. Create Alerts Table (for monitoring failures)
CREATE TABLE IF NOT EXISTS public.alerts (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  outbox_id uuid REFERENCES public.outbox_events(id),
  alert_type text,
  details jsonb,
  created_at timestamptz DEFAULT now(),
  acknowledged boolean DEFAULT false
);

-- 3. Create Trigger Function (Queue to Outbox instead of direct Send)
CREATE OR REPLACE FUNCTION public.tr_sensor_to_outbox()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  -- Only queue anomalies
  IF NEW.is_anomaly IS TRUE THEN
    INSERT INTO public.outbox_events (topic, payload, headers)
    VALUES (
      'sensor.anomaly',
      jsonb_build_object(
        'sensor_id', NEW.sensor_id,
        'reading_id', NEW.id,
        'value', NEW.value,
        'unit', NEW.unit,
        'timestamp', NEW.timestamp,
        'metadata', COALESCE(NEW.metadata, '{}'::jsonb)
      ),
      jsonb_build_object('x-source','db-trigger')
    );
     RAISE NOTICE 'Anomaly queued to Outbox for Sensor: %', NEW.sensor_id;
  END IF;
  RETURN NEW;
END;
$$;

-- 4. Replace the old trigger
DROP TRIGGER IF EXISTS tr_ambient_webhook ON public.sensor_readings; -- Drop the direct one
DROP TRIGGER IF EXISTS trg_sensor_outbox ON public.sensor_readings;

CREATE TRIGGER trg_sensor_outbox 
AFTER INSERT ON public.sensor_readings
FOR EACH ROW 
EXECUTE FUNCTION public.tr_sensor_to_outbox();

-- 5. Create Worker Function to Process Outbox
-- This function can be called by pg_cron or manually
CREATE OR REPLACE FUNCTION public.process_outbox_batch(batch_size int DEFAULT 50)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  rec RECORD;
  endpoint text := 'https://mruetmtibkbzfaawfjbm.supabase.co/functions/v1/ambient-webhook';
BEGIN
  FOR rec IN
    SELECT * FROM public.outbox_events
    WHERE processed = false AND next_try_at <= now()
    ORDER BY next_try_at
    LIMIT batch_size
  LOOP
    BEGIN
      -- Use pg_net to send the request
      PERFORM net.http_post(
          url := endpoint,
          body := rec.payload,
          headers := COALESCE(rec.headers, '{}'::jsonb) || '{"Content-Type": "application/json"}'::jsonb
      );
      
      -- Mark as processed (queued successfully)
      -- Note: In a full production system, we might check net.http_request_queue for actual completion,
      -- but for this design, successful queuing is considered "processed" by the outbox worker.
      UPDATE public.outbox_events
      SET processed = true, attempts = attempts + 1, updated_at = now()
      WHERE id = rec.id;
      
    EXCEPTION WHEN OTHERS THEN
      -- Handle execution errors (e.g. net.http_post fails to queue)
      UPDATE public.outbox_events
      SET attempts = attempts + 1,
          last_error = substring(SQLERRM for 2000),
          next_try_at = now() + ( (attempts + 1) ^ 2 ) * interval '1 minute',
          updated_at = now()
      WHERE id = rec.id;
      
      -- If too many attempts, create an alert
      IF (rec.attempts + 1) >= 5 THEN
        INSERT INTO public.alerts (outbox_id, alert_type, details)
        VALUES (rec.id, 'MaxAttemptsReached', jsonb_build_object('error', SQLERRM));
      END IF;
    END;
  END LOOP;
END;
$$;

DO $$
BEGIN
    RAISE NOTICE '✅ Reliability Layer (Outbox, Alerts, Worker) created successfully.';
END $$;
