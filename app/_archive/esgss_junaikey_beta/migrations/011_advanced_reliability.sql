-- ============================================================================
-- Mitigation 011: Advanced Reliability & Monitoring
-- Purpose: Add monitoring views, dead-letter queue movement logic, and 
--          processing tracking columns.
-- ============================================================================

-- 1. Enhance Outbox Table (Processing State)
ALTER TABLE public.outbox_events 
ADD COLUMN IF NOT EXISTS processing boolean DEFAULT false;

-- 2. Monitoring Views
CREATE OR REPLACE VIEW public.view_outbox_backlog AS
SELECT count(*) AS backlog_size FROM public.outbox_events WHERE processed = false;

CREATE OR REPLACE VIEW public.view_outbox_failing AS
SELECT id, topic, attempts, last_error, created_at
FROM public.outbox_events
WHERE processed = false AND attempts >= 3
ORDER BY attempts DESC, created_at;

CREATE OR REPLACE VIEW public.view_outbox_latency AS
SELECT
  count(*) FILTER (WHERE processed = true) AS processed_count,
  avg(EXTRACT(epoch FROM (updated_at - created_at))) FILTER (WHERE processed = true) AS avg_processing_seconds
FROM public.outbox_events;

-- 3. Dead Letter Logic (Move to Alerts)
-- Function to move a failed outbox event to alerts and mark as processed (but failed)
CREATE OR REPLACE FUNCTION public.move_outbox_to_alerts(p_outbox_id uuid)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.alerts (outbox_id, alert_type, details, created_at)
  SELECT 
    id, 
    'DeadLetter', 
    jsonb_build_object(
        'topic', topic, 
        'payload', payload, 
        'error', last_error, 
        'attempts', attempts
    ), 
    now()
  FROM public.outbox_events
  WHERE id = p_outbox_id;

  -- Mark as processed so the worker stops picking it up
  UPDATE public.outbox_events 
  SET processed = true, 
      last_error = 'Moved to alerts (Dead Letter)', 
      updated_at = now()
  WHERE id = p_outbox_id;
END;
$$;

-- 4. Helper to mark processing (atomic lock)
CREATE OR REPLACE FUNCTION public.mark_outbox_processing(p_id uuid)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  UPDATE public.outbox_events
  SET processing = true, updated_at = now()
  WHERE id = p_id 
    AND processed = false 
    AND (processing IS NULL OR processing = false);
    
  RETURN FOUND;
END;
$$;

-- 5. Updated Worker with Dead Letter Support
-- Replaces the simpler worker from Migration 009
CREATE OR REPLACE FUNCTION public.process_outbox_batch(batch_size int DEFAULT 50)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  rec RECORD;
  endpoint text := 'https://mruetmtibkbzfaawfjbm.supabase.co/functions/v1/ambient-webhook';
BEGIN
  -- Select items that are NOT processed and NOT currently processing (or timed out processing)
  FOR rec IN
    SELECT * FROM public.outbox_events
    WHERE processed = false 
      AND (processing = false OR updated_at < now() - interval '2 minutes') 
      AND next_try_at <= now()
    ORDER BY next_try_at
    LIMIT batch_size
  LOOP
    -- Try to acquire lock
    IF public.mark_outbox_processing(rec.id) THEN
        BEGIN
          -- Make valid JSON payload for pg_net
          PERFORM net.http_post(
              url := endpoint,
              body := rec.payload,
              headers := COALESCE(rec.headers, '{}'::jsonb) || '{"Content-Type": "application/json"}'::jsonb
          );
          
          -- Optimistic success (pg_net queues request)
          UPDATE public.outbox_events
          SET processed = true, processing = false, attempts = attempts + 1, updated_at = now()
          WHERE id = rec.id;
          
        EXCEPTION WHEN OTHERS THEN
          -- Error handling
          UPDATE public.outbox_events
          SET processing = false,
              attempts = attempts + 1,
              last_error = substring(SQLERRM for 2000),
              next_try_at = now() + ( (attempts + 1) ^ 2 ) * interval '1 minute',
              updated_at = now()
          WHERE id = rec.id;
          
          -- Dead Letter Check
          IF (rec.attempts + 1) >= 5 THEN
            PERFORM public.move_outbox_to_alerts(rec.id);
          END IF;
        END;
    END IF;
  END LOOP;
END;
$$;

DO $$
BEGIN
    RAISE NOTICE '✅ Advanced Reliability Layer applied.';
END $$;
