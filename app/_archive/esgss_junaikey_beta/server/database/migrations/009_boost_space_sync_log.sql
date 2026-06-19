-- Migration 009: Boost.Space Sync Log Table
-- Description: Creates audit trail table for CRM synchronization operations
-- Author: ESGss JunAiKey Beta Team
-- Date: 2026-02-08

-- ============================================================================
-- Table: boost_space_sync_log
-- Purpose: Track all synchronization operations between InfoOne and Boost.Space CRM
-- ============================================================================

CREATE TABLE IF NOT EXISTS boost_space_sync_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Entity identification
  entity_type VARCHAR(50) NOT NULL CHECK (entity_type IN ('player', 'achievement', 'battle', 'card', 'evidence')),
  entity_id UUID NOT NULL,
  boost_space_id VARCHAR(255),  -- CRM entity ID
  
  -- Sync metadata
  sync_direction VARCHAR(20) NOT NULL CHECK (sync_direction IN ('to_crm', 'from_crm')),
  sync_status VARCHAR(20) NOT NULL CHECK (sync_status IN ('success', 'failed', 'conflict', 'pending')),
  
  -- Conflict tracking
  conflict_data JSONB,  -- Stores ConflictData when conflicts detected
  error_message TEXT,
  
  -- Retry tracking
  retry_count INTEGER DEFAULT 0,
  last_retry_at TIMESTAMP,
  
  -- Timestamps
  synced_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- Indexes for Performance
-- ============================================================================

-- Fast lookup by entity
CREATE INDEX idx_sync_log_entity 
  ON boost_space_sync_log(entity_type, entity_id);

-- Fast lookup by Boost.Space ID (for reverse lookups)
CREATE INDEX idx_sync_log_boost_space_id 
  ON boost_space_sync_log(boost_space_id);

-- Fast lookup for failed/conflict syncs (admin dashboard)
CREATE INDEX idx_sync_log_status 
  ON boost_space_sync_log(sync_status) 
  WHERE sync_status IN ('failed', 'conflict');

-- Fast lookup by sync timestamp (for retry jobs)
CREATE INDEX idx_sync_log_synced_at 
  ON boost_space_sync_log(synced_at DESC);

-- Composite index for entity sync history
CREATE INDEX idx_sync_log_entity_history 
  ON boost_space_sync_log(entity_type, entity_id, synced_at DESC);

-- ============================================================================
-- Helper Functions
-- ============================================================================

/**
 * Get latest sync status for an entity
 */
CREATE OR REPLACE FUNCTION get_latest_sync_status(
  p_entity_type VARCHAR,
  p_entity_id UUID
) RETURNS JSONB
LANGUAGE plpgsql
AS $$
DECLARE
  result JSONB;
BEGIN
  SELECT jsonb_build_object(
    'sync_status', sync_status,
    'boost_space_id', boost_space_id,
    'last_synced_at', synced_at,
    'has_conflicts', (sync_status = 'conflict')
  )
  INTO result
  FROM boost_space_sync_log
  WHERE entity_type = p_entity_type 
    AND entity_id = p_entity_id
  ORDER BY synced_at DESC
  LIMIT 1;
  
  RETURN COALESCE(result, '{}'::jsonb);
END;
$$;

/**
 * Get all unresolved conflicts
 */
CREATE OR REPLACE FUNCTION get_unresolved_conflicts()
RETURNS TABLE (
  entity_type VARCHAR,
  entity_id UUID,
  boost_space_id VARCHAR,
  conflict_data JSONB,
  synced_at TIMESTAMP
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    bsl.entity_type,
    bsl.entity_id,
    bsl.boost_space_id,
    bsl.conflict_data,
    bsl.synced_at
  FROM boost_space_sync_log bsl
  WHERE bsl.sync_status = 'conflict'
    AND bsl.id IN (
      -- Get only the latest conflict for each entity
      SELECT DISTINCT ON (entity_type, entity_id) id
      FROM boost_space_sync_log
      WHERE sync_status = 'conflict'
      ORDER BY entity_type, entity_id, synced_at DESC
    )
  ORDER BY bsl.synced_at DESC;
END;
$$;

/**
 * Get failed syncs that need retry
 */
CREATE OR REPLACE FUNCTION get_failed_syncs_for_retry(
  retry_after_minutes INTEGER DEFAULT 15
)
RETURNS TABLE (
  id UUID,
  entity_type VARCHAR,
  entity_id UUID,
  boost_space_id VARCHAR,
  retry_count INTEGER,
  error_message TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    bsl.id,
    bsl.entity_type,
    bsl.entity_id,
    bsl.boost_space_id,
    bsl.retry_count,
    bsl.error_message
  FROM boost_space_sync_log bsl
  WHERE bsl.sync_status = 'failed'
    AND bsl.retry_count < 5  -- Max 5 retries
    AND (
      bsl.last_retry_at IS NULL 
      OR bsl.last_retry_at < NOW() - (retry_after_minutes || ' minutes')::INTERVAL
    )
  ORDER BY bsl.synced_at ASC
  LIMIT 100;  -- Process in batches
END;
$$;

-- ============================================================================
-- Permissions (RLS not needed for audit logs, but applied for consistency)
-- ============================================================================

-- Enable RLS
ALTER TABLE boost_space_sync_log ENABLE ROW LEVEL SECURITY;

-- Admins can view all sync logs
CREATE POLICY sync_log_admin_policy ON boost_space_sync_log
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.uid() = id
        AND raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Users can view their own entity sync logs
CREATE POLICY sync_log_user_policy ON boost_space_sync_log
  FOR SELECT
  USING (
    -- Match player entities to user
    (entity_type = 'player' AND entity_id IN (
      SELECT id FROM game_players WHERE user_id = auth.uid()
    ))
    OR
    -- Match achievement/battle/card entities to user's player
    (entity_type IN ('achievement', 'battle', 'card') AND entity_id IN (
      SELECT a.id FROM game_achievements a
      JOIN game_players p ON p.id = a.player_id
      WHERE p.user_id = auth.uid()
      UNION
      SELECT b.id FROM game_battle_history b
      JOIN game_players p ON p.id = b.player_id
      WHERE p.user_id = auth.uid()
      UNION
      SELECT c.id FROM game_card_collections c
      JOIN game_players p ON p.id = c.player_id
      WHERE p.user_id = auth.uid()
    ))
    OR
    -- Match evidence to user
    (entity_type = 'evidence' AND entity_id IN (
      SELECT id FROM evidence_vault WHERE user_id = auth.uid()
    ))
  );

-- ============================================================================
-- Comments
-- ============================================================================

COMMENT ON TABLE boost_space_sync_log IS 
  'Audit trail for all synchronization operations between InfoOne and Boost.Space CRM';

COMMENT ON COLUMN boost_space_sync_log.entity_type IS 
  'Type of entity being synced: player, achievement, battle, card, evidence';

COMMENT ON COLUMN boost_space_sync_log.sync_direction IS 
  'Direction of sync: to_crm (InfoOne → Boost.Space) or from_crm (Boost.Space → InfoOne)';

COMMENT ON COLUMN boost_space_sync_log.conflict_data IS 
  'JSON object containing conflict details when sync_status is conflict';

COMMENT ON COLUMN boost_space_sync_log.retry_count IS 
  'Number of retry attempts for failed syncs (max 5)';

COMMENT ON FUNCTION get_latest_sync_status IS 
  'Returns the latest sync status for a given entity';

COMMENT ON FUNCTION get_unresolved_conflicts IS 
  'Returns all entities with unresolved sync conflicts';

COMMENT ON FUNCTION get_failed_syncs_for_retry IS 
  'Returns failed syncs eligible for retry (max 5 attempts, 15min cooldown)';
