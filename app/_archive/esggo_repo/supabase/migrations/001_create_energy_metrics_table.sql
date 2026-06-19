-- Supabase SQL Schema for JES Energy Monitoring System
-- Create energy_metrics table

CREATE TABLE IF NOT EXISTS energy_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service VARCHAR(100) NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  energy_consumption NUMERIC(10,2) NOT NULL,
  carbon_emission NUMERIC(10,2) NOT NULL,
  metadata JSONB
);

-- Indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_energy_metrics_service ON energy_metrics(service);
CREATE INDEX IF NOT EXISTS idx_energy_metrics_timestamp ON energy_metrics(timestamp);

-- Create materialized view for daily summaries
CREATE MATERIALIZED VIEW daily_energy_summary AS
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

-- Insert policy for service roles
GRANT INSERT, UPDATE, DELETE ON energy_metrics TO service_role;