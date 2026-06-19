-- server/db/behavioral_analytics.sql
-- 5T Protocol Behavioral Analytics & Big Data Summary

-- 1. Behavioral Events (Raw Logs)
CREATE TABLE IF NOT EXISTS behavioral_events (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid,
    event_type varchar(100) NOT NULL,
    session_id varchar(255),
    page_url text,
    metadata jsonb DEFAULT '{}',
    data_hash varchar(64) NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);

-- Index for analytics performance
CREATE INDEX IF NOT EXISTS idx_be_user_event ON behavioral_events (user_id, event_type);
CREATE INDEX IF NOT EXISTS idx_be_created_at ON behavioral_events (created_at);

-- 2. User Habit Stats (Aggregated Personal Data)
CREATE TABLE IF NOT EXISTS user_habit_stats (
    user_id uuid PRIMARY KEY,
    habit_tags text[], -- e.g., ['EarlyBird', 'ESG_Enthusiast']
    most_visited_pages jsonb DEFAULT '{}',
    avg_session_duration numeric DEFAULT 0,
    peak_activity_hour integer,
    last_analyzed_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- 3. Big Data Summary (Global Trends)
CREATE TABLE IF NOT EXISTS big_data_summary (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    category varchar(50) NOT NULL, -- e.g., 'global_event_distribution', 'hourly_traffic'
    summary_data jsonb NOT NULL,
    period_start timestamp with time zone NOT NULL,
    period_end timestamp with time zone NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);

-- Trigger for user_habit_stats updated_at
CREATE OR REPLACE TRIGGER update_user_habit_stats_updated_at
BEFORE UPDATE ON user_habit_stats
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
