-- server/db/migrations/013_create_behavioral_tracking.sql
-- 5T Protocol Behavioral Tracking Layer

CREATE TABLE IF NOT EXISTS behavioral_events (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid,
  event_type varchar(50) NOT NULL,
  session_id varchar(100),
  page_url text,
  metadata jsonb DEFAULT '{}',
  data_hash varchar(64) NOT NULL, -- SHA-256 for 5T Trustworthy
  created_at timestamp NOT NULL DEFAULT current_timestamp
);

CREATE INDEX IF NOT EXISTS idx_be_user_id ON behavioral_events (user_id);
CREATE INDEX IF NOT EXISTS idx_be_event_type ON behavioral_events (event_type);

-- Trigger to ensure updated_at if needed, but this is append-only
