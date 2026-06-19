-- ============================================================================
-- Mitigation 010: Automate Outbox Worker (pg_cron)
-- Purpose: Schedule the 'process_outbox_batch' function to run every minute
--          to automatically process queued webhook events.
-- ============================================================================

-- 1. Enable pg_cron
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- 2. Schedule the job (Run every minute)
-- We use standard cron syntax: '* * * * *' = every minute
SELECT cron.schedule(
    'process_outbox_every_minute', -- Unique job name
    '* * * * *',                   -- Schedule
    'SELECT public.process_outbox_batch()'
);

-- Note: To view scheduled jobs: SELECT * FROM cron.job;
-- To unschedule: SELECT cron.unschedule('process_outbox_every_minute');

DO $$
BEGIN
    RAISE NOTICE '✅ Outbox Worker scheduled successfully via pg_cron.';
END $$;
