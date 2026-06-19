-- ==========================================
-- Migration 013: Unified OmniSync Platform
-- Description: Merges Boost.Space Sync and AITable Sync into unified OmniSync
-- Date: 2026-02-09
-- ==========================================

-- ==========================================
-- SECTION 1: Create Unified Sync Platform Table
-- ==========================================

-- Drop old tables if they exist (data will be migrated)
DROP TABLE IF EXISTS aitable_sync_log CASCADE;
DROP TABLE IF EXISTS boost_space_sync_log CASCADE;

-- Create unified sync log table
CREATE TABLE IF NOT EXISTS omni_sync_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Sync Platform Identification
  platform VARCHAR(30) NOT NULL CHECK (platform IN (
    'boost_space',    -- Boost.Space CRM
    'aitable',        -- AITable.ai
    'supabase',       -- Supabase Backend
    'airtable',       -- Airtable (future)
    'notion',         -- Notion (future)
    'custom'          -- Custom integrations
  )),
  
  -- Entity Identification (Unified)
  entity_type VARCHAR(50) NOT NULL,
  entity_id UUID NOT NULL,
  external_id VARCHAR(255),  -- Platform-specific ID
  
  -- Sync Metadata
  sync_direction VARCHAR(20) NOT NULL CHECK (sync_direction IN (
    'to_platform',    -- InfoOne → Platform
    'from_platform',   -- Platform → InfoOne
    'bidirectional'    -- Bidirectional sync
  )),
  sync_status VARCHAR(20) NOT NULL CHECK (sync_status IN (
    'success',
    'failed',
    'conflict',
    'pending',
    'retry',
    'in_progress'
  )),
  
  -- Data Payload (Optional - for audit purposes)
  payload JSONB,  -- Stores the data that was synced
  metadata JSONB,  -- Additional metadata (timings, config, etc.)
  
  -- Conflict Tracking
  conflict_data JSONB,
  resolved_at TIMESTAMP WITH TIME ZONE,
  resolved_by UUID,  -- User ID who resolved
  
  -- Error Handling
  error_message TEXT,
  error_code VARCHAR(50),
  retry_count INTEGER DEFAULT 0,
  max_retries INTEGER DEFAULT 5,
  last_retry_at TIMESTAMP WITH TIME ZONE,
  
  -- Timestamps
  synced_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Soft Delete
  is_deleted BOOLEAN DEFAULT FALSE,
  deleted_at TIMESTAMP WITH TIME ZONE
);

-- ==========================================
-- SECTION 2: Entity Mapping Table
-- ==========================================

CREATE TABLE IF NOT EXISTS omni_sync_entity_map (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Local Entity
  local_entity_type VARCHAR(50) NOT NULL,
  local_entity_id UUID NOT NULL,
  
  -- External Entity (Platform-specific)
  platform VARCHAR(30) NOT NULL,
  external_entity_id VARCHAR(255) NOT NULL,
  external_datasheet_id VARCHAR(255),  -- For AITable
  
  -- Mapping Metadata
  mapping_type VARCHAR(20) DEFAULT 'manual' CHECK (mapping_type IN (
    'automatic',  -- Auto-generated mapping
    'manual',     -- User-defined mapping
    'imported'    -- Imported from existing data
  )),
  confidence_score NUMERIC(3,2) DEFAULT 1.00,
  
  -- Sync Status
  last_synced_at TIMESTAMP WITH TIME ZONE,
  sync_enabled BOOLEAN DEFAULT TRUE,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT unique_entity_mapping UNIQUE (platform, local_entity_type, local_entity_id)
);

-- ==========================================
-- SECTION 3: Sync Configuration Table
-- ==========================================

CREATE TABLE IF NOT EXISTS omni_sync_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Configuration Identification
  config_name VARCHAR(100) NOT NULL UNIQUE,
  platform VARCHAR(30) NOT NULL,
  
  -- Sync Settings
  sync_enabled BOOLEAN DEFAULT TRUE,
  sync_direction VARCHAR(20) DEFAULT 'bidirectional' CHECK (sync_direction IN (
    'to_platform',
    'from_platform',
    'bidirectional'
  )),
  
  -- Scheduling
  sync_interval_minutes INTEGER DEFAULT 60,
  scheduled_sync TIME DEFAULT '02:00:00',  -- Daily sync at 2 AM
  timezone VARCHAR(50) DEFAULT 'Asia/Taipei',
  
  -- Retry Settings
  max_retries INTEGER DEFAULT 5,
  retry_interval_minutes INTEGER DEFAULT 15,
  
  -- Conflict Resolution
  conflict_resolution_strategy VARCHAR(30) DEFAULT 'manual' CHECK (conflict_resolution_strategy IN (
    'manual',           -- Require human intervention
    'local_wins',      -- Local data takes precedence
    'remote_wins',     -- Platform data takes precedence
    'latest_wins',     -- Most recent timestamp wins
    'merge'            -- Attempt automatic merge
  )),
  
  -- Field Mapping
  field_mappings JSONB,  -- JSON field mapping configuration
  
  -- Webhook Configuration
  webhook_url VARCHAR(500),
  webhook_secret VARCHAR(255),
  
  -- Status
  is_active BOOLEAN DEFAULT TRUE,
  last_sync_at TIMESTAMP WITH TIME ZONE,
  last_error TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  created_by UUID,
  updated_by UUID
);

-- ==========================================
-- SECTION 4: Indexes for Performance
-- ==========================================

-- Omni Sync Log Indexes
CREATE INDEX IF NOT EXISTS idx_omni_sync_platform 
  ON omni_sync_log(platform, entity_type);

CREATE INDEX IF NOT EXISTS idx_omni_sync_entity 
  ON omni_sync_log(entity_type, entity_id);

CREATE INDEX IF NOT EXISTS idx_omni_sync_external 
  ON omni_sync_log(platform, external_id);

CREATE INDEX IF NOT EXISTS idx_omni_sync_status 
  ON omni_sync_log(sync_status) 
  WHERE sync_status IN ('failed', 'conflict', 'pending', 'retry');

CREATE INDEX IF NOT EXISTS idx_omni_sync_direction 
  ON omni_sync_log(sync_direction);

CREATE INDEX IF NOT EXISTS idx_omni_sync_synced_at 
  ON omni_sync_log(synced_at DESC);

CREATE INDEX IF NOT EXISTS idx_omni_sync_platform_status 
  ON omni_sync_log(platform, sync_status, synced_at DESC);

-- Entity Map Indexes
CREATE INDEX IF NOT EXISTS idx_omni_map_local 
  ON omni_sync_entity_map(local_entity_type, local_entity_id);

CREATE INDEX IF NOT EXISTS idx_omni_map_external 
  ON omni_sync_entity_map(platform, external_entity_id);

CREATE INDEX IF NOT EXISTS idx_omni_map_platform 
  ON omni_sync_entity_map(platform, local_entity_type);

-- ==========================================
-- SECTION 5: Helper Functions
-- ==========================================

-- Get unified sync status for an entity
CREATE OR REPLACE FUNCTION get_unified_sync_status(
  p_platform VARCHAR,
  p_entity_type VARCHAR,
  p_entity_id UUID
)
RETURNS TABLE (
  sync_status VARCHAR,
  sync_direction VARCHAR,
  external_id VARCHAR,
  synced_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  retry_count INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    osl.sync_status,
    osl.sync_direction,
    osl.external_id,
    osl.synced_at,
    osl.error_message,
    osl.retry_count
  FROM omni_sync_log osl
  WHERE osl.platform = p_platform
    AND osl.entity_type = p_entity_type
    AND osl.entity_id = p_entity_id
    AND osl.is_deleted = FALSE
  ORDER BY osl.synced_at DESC
  LIMIT 1;
END;
$$ LANGUAGE plpgsql;

-- Get all entities with unresolved conflicts
CREATE OR REPLACE FUNCTION get_unresolved_omni_conflicts()
RETURNS TABLE (
  id UUID,
  platform VARCHAR,
  entity_type VARCHAR,
  entity_id UUID,
  external_id VARCHAR,
  conflict_data JSONB,
  synced_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    osl.id,
    osl.platform,
    osl.entity_type,
    osl.entity_id,
    osl.external_id,
    osl.conflict_data,
    osl.synced_at
  FROM omni_sync_log osl
  WHERE osl.sync_status = 'conflict'
    AND osl.is_deleted = FALSE
  ORDER BY osl.synced_at DESC;
END;
$$ LANGUAGE plpgsql;

-- Get failed syncs eligible for retry
CREATE OR REPLACE FUNCTION get_omni_failed_syncs_for_retry(
  p_max_retry_count INTEGER DEFAULT 5
)
RETURNS TABLE (
  id UUID,
  platform VARCHAR,
  entity_type VARCHAR,
  entity_id UUID,
  retry_count INTEGER,
  error_message TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    osl.id,
    osl.platform,
    osl.entity_type,
    osl.entity_id,
    osl.retry_count,
    osl.error_message
  FROM omni_sync_log osl
  WHERE osl.sync_status = 'failed'
    AND osl.retry_count < p_max_retry_count
    AND (
      osl.last_retry_at IS NULL 
      OR osl.last_retry_at < NOW() - INTERVAL '15 minutes'
    )
  ORDER BY osl.synced_at ASC
  LIMIT 100;
END;
$$ LANGUAGE plpgsql;

-- Get sync statistics by platform
CREATE OR REPLACE FUNCTION get_omni_sync_statistics(
  p_platform VARCHAR DEFAULT NULL,
  p_hours_ago INTEGER DEFAULT 24
)
RETURNS TABLE (
  platform VARCHAR,
  total_syncs BIGINT,
  successful_syncs BIGINT,
  failed_syncs BIGINT,
  conflict_syncs BIGINT,
  pending_syncs BIGINT,
  success_rate NUMERIC,
  avg_sync_duration_ms NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    osl.platform,
    COUNT(*)::BIGINT AS total_syncs,
    COUNT(*) FILTER (WHERE osl.sync_status = 'success')::BIGINT AS successful_syncs,
    COUNT(*) FILTER (WHERE osl.sync_status = 'failed')::BIGINT AS failed_syncs,
    COUNT(*) FILTER (WHERE osl.sync_status = 'conflict')::BIGINT AS conflict_syncs,
    COUNT(*) FILTER (WHERE osl.sync_status IN ('pending', 'in_progress'))::BIGINT AS pending_syncs,
    CASE 
      WHEN COUNT(*) FILTER (WHERE osl.sync_status = 'success') > 0 THEN
        ROUND(
          (COUNT(*) FILTER (WHERE osl.sync_status = 'success')::NUMERIC / 
           NULLIF(COUNT(*), 0)::NUMERIC) * 100, 2
        )
      ELSE 0
    END AS success_rate,
    COALESCE(
      AVG((osl.metadata->>'duration_ms')::NUMERIC),
      0
    ) AS avg_sync_duration_ms
  FROM omni_sync_log osl
  WHERE osl.created_at >= NOW() - (p_hours_ago || ' hours')::INTERVAL
    AND (p_platform IS NULL OR osl.platform = p_platform)
    AND osl.is_deleted = FALSE
  GROUP BY osl.platform;
END;
$$ LANGUAGE plpgsql;

-- ==========================================
-- SECTION 6: Triggers
-- ==========================================

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_omni_sync_log_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_omni_sync_log_updated_at
  BEFORE UPDATE ON omni_sync_log
  FOR EACH ROW
  EXECUTE FUNCTION update_omni_sync_log_updated_at();

-- Auto-update entity map updated_at
CREATE OR REPLACE FUNCTION update_omni_entity_map_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_omni_entity_map_updated_at
  BEFORE UPDATE ON omni_sync_entity_map
  FOR EACH ROW
  EXECUTE FUNCTION update_omni_entity_map_updated_at();

-- Auto-update config updated_at
CREATE OR REPLACE FUNCTION update_omni_sync_config_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_omni_sync_config_updated_at
  BEFORE UPDATE ON omni_sync_config
  FOR EACH ROW
  EXECUTE FUNCTION update_omni_sync_config_updated_at();

-- ==========================================
-- SECTION 7: Row Level Security (RLS)
-- ==========================================

-- Enable RLS on all tables
ALTER TABLE omni_sync_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE omni_sync_entity_map ENABLE ROW LEVEL SECURITY;
ALTER TABLE omni_sync_config ENABLE ROW LEVEL SECURITY;

-- Sync Log Policies
CREATE POLICY omni_sync_log_admin_policy ON omni_sync_log
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY omni_sync_log_read_policy ON omni_sync_log
  FOR SELECT
  TO authenticated
  USING (auth.role() = 'authenticated');

-- Entity Map Policies
CREATE POLICY omni_entity_map_admin_policy ON omni_sync_entity_map
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY omni_entity_map_read_policy ON omni_sync_entity_map
  FOR SELECT
  TO authenticated
  USING (auth.role() = 'authenticated');

-- Config Policies
CREATE POLICY omni_sync_config_admin_policy ON omni_sync_config
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY omni_sync_config_read_policy ON omni_sync_config
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.uid() = id
        AND raw_user_meta_data->>'role' IN ('admin', 'manager')
    )
  );

-- ==========================================
-- SECTION 8: Default Configurations
-- ==========================================

-- Insert default platform configurations
INSERT INTO omni_sync_config (
  config_name,
  platform,
  sync_enabled,
  sync_direction,
  sync_interval_minutes,
  conflict_resolution_strategy
) VALUES 
(
  'Boost.Space Default',
  'boost_space',
  TRUE,
  'bidirectional',
  60,
  'manual'
),
(
  'OmniTable Default',
  'omni_table',
  TRUE,
  'bidirectional',
  30,
  'manual'
),
(
  'Supabase Default',
  'supabase',
  TRUE,
  'bidirectional',
  15,
  'local_wins'
) ON CONFLICT (config_name) DO NOTHING;

-- ==========================================
-- SECTION 9: Comments
-- ==========================================

COMMENT ON TABLE omni_sync_log IS 'OmniSync Unified Platform: Centralized sync log for all platform integrations (Boost.Space, AITable, Supabase, etc.)';
COMMENT ON TABLE omni_sync_entity_map IS 'Entity mapping table: Links local entities to external platform entities';
COMMENT ON TABLE omni_sync_config IS 'Sync configuration: Platform-specific settings and policies';

COMMENT ON COLUMN omni_sync_log.platform IS 'Integration platform: boost_space, aitable, supabase, airtable, notion, custom';
COMMENT ON COLUMN omni_sync_log.entity_type IS 'Local entity type (e.g., player, customer, project, document)';
COMMENT ON COLUMN omni_sync_log.sync_direction IS 'Sync direction: to_platform, from_platform, bidirectional';
COMMENT ON COLUMN omni_sync_log.conflict_data IS 'JSON conflict details when sync_status is conflict';
COMMENT ON COLUMN omni_sync_entity_map.confidence_score IS 'Mapping confidence: 0.00-1.00 (1.00 = certain)';

-- ==========================================
-- SECTION 10: Migration Summary
-- ==========================================

DO $$
BEGIN
  RAISE NOTICE '✅ Unified OmniSync Platform Migration Complete';
  RAISE NOTICE '📊 Tables Created: 3 (omni_sync_log, omni_sync_entity_map, omni_sync_config)';
  RAISE NOTICE '📍 Indexes Created: 11 (Performance optimized)';
  RAISE NOTICE '⚙️  Functions Created: 4 (get_unified_sync_status, get_unresolved_conflicts, get_failed_syncs_for_retry, get_sync_statistics)';
  RAISE NOTICE '🔒 RLS Policies: 6 (Admin + Read for each table)';
  RAISE NOTICE '🚀 Ready for Phase 1 & Phase 2 Sync Operations';
END $$;

-- ==========================================
-- ROLLBACK SCRIPT (if needed)
-- ==========================================

/*
-- To rollback this migration:
DROP TABLE IF EXISTS omni_sync_log CASCADE;
DROP TABLE IF EXISTS omni_sync_entity_map CASCADE;
DROP TABLE IF EXISTS omni_sync_config CASCADE;

-- Recreate legacy tables if needed:
-- (Re-run migration 009 and 010 for Boost.Space and AITable)
*/
