-- Supabase SQL Schema for JES Energy Monitoring System
-- Create energy_metrics table (Aligned with 5T Protocol Best Practices)

CREATE TABLE IF NOT EXISTS energy_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  service VARCHAR(100) NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  energy_consumption NUMERIC(10,2) NOT NULL,
  carbon_emission NUMERIC(10,2) NOT NULL,
  metadata JSONB,
  -- 5T Protocol Fields (Trustworthy & Traceable)
  hash_lock TEXT NOT NULL DEFAULT 'PENDING',
  status TEXT DEFAULT 'Trustworthy' NOT NULL
);

ALTER TABLE energy_metrics ADD COLUMN IF NOT EXISTS hash_lock TEXT NOT NULL DEFAULT 'PENDING';

-- 5T Immutability: Prevent UPDATE/DELETE to ensure audit integrity
CREATE OR REPLACE FUNCTION prevent_energy_metrics_update()
RETURNS TRIGGER AS $$
BEGIN
  RAISE EXCEPTION 'Updates are not allowed on 5T compliant records. Insert new records instead.';
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_prevent_energy_metrics_update ON energy_metrics;
CREATE TRIGGER trg_prevent_energy_metrics_update
  BEFORE UPDATE OR DELETE ON energy_metrics
  FOR EACH ROW EXECUTE FUNCTION prevent_energy_metrics_update();

-- Indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_energy_metrics_service ON energy_metrics(service);
CREATE INDEX IF NOT EXISTS idx_energy_metrics_timestamp ON energy_metrics(timestamp);
CREATE INDEX IF NOT EXISTS idx_energy_metrics_hash ON energy_metrics(hash_lock);

-- Create materialized view for daily summaries
CREATE MATERIALIZED VIEW IF NOT EXISTS daily_energy_summary AS
SELECT 
  service,
  date_trunc('day', timestamp) as day,
  SUM(carbon_emission) as total_emission,
  AVG(energy_consumption) as avg_consumption,
  COUNT(*) as readings_count
FROM energy_metrics
GROUP BY service, date_trunc('day', timestamp);

-- Refresh policy (optional)
-- REFRESH MATERIALIZED VIEW daily_energy_summary;

-- Enable Row Level Security (Supabase Best Practice)
ALTER TABLE energy_metrics ENABLE ROW LEVEL SECURITY;

-- Create Policies
CREATE POLICY "Enable read access for authenticated users"
  ON energy_metrics FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Enable insert for service_role only"
  ON energy_metrics FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Grant privileges
GRANT SELECT ON energy_metrics TO authenticated;
GRANT INSERT, SELECT ON energy_metrics TO service_role;