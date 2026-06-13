-- ESGGO 5T Protocol Core Tables
-- Creates the esg_health_checks table to store Enterprise Health Check results with Hash Locks

CREATE TABLE IF NOT EXISTS public.esg_health_checks (
  uuid UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  score_e NUMERIC DEFAULT 0 NOT NULL,
  score_s NUMERIC DEFAULT 0 NOT NULL,
  score_g NUMERIC DEFAULT 0 NOT NULL,
  gaps JSONB NOT NULL DEFAULT '[]'::jsonb,
  advice TEXT NOT NULL,
  hash_lock TEXT NOT NULL,
  status TEXT DEFAULT 'Trustworthy' NOT NULL,
  evidence JSONB NOT NULL DEFAULT '{}'::jsonb
);

-- Trigger to prevent updates to esg_health_checks, ensuring immutability (Trustworthy)
CREATE OR REPLACE FUNCTION prevent_esg_health_checks_update()
RETURNS TRIGGER AS $$
BEGIN
  RAISE EXCEPTION 'Updates to esg_health_checks are forbidden by the 5T Protocol (Trustworthy)';
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_prevent_esg_health_checks_update ON public.esg_health_checks;

CREATE TRIGGER trg_prevent_esg_health_checks_update
BEFORE UPDATE ON public.esg_health_checks
FOR EACH ROW
EXECUTE FUNCTION prevent_esg_health_checks_update();

-- Row Level Security (RLS)
ALTER TABLE public.esg_health_checks ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own health checks
CREATE POLICY "Users can read own health checks"
ON public.esg_health_checks
FOR SELECT
USING (auth.uid() = user_id);

-- Insert policy (authenticated users)
CREATE POLICY "Authenticated Insert Health Checks"
ON public.esg_health_checks
FOR INSERT
WITH CHECK (auth.role() = 'authenticated');
