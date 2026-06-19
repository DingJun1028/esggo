
-- Migration: Rename boost_space_sync_log to omni_sync_log
-- Description: Renaming the sync log table to reflect the shift from Boost.space to Omni System.

-- Rename the table
ALTER TABLE IF EXISTS boost_space_sync_log RENAME TO omni_sync_log;

-- Rename indexes if they exist (Postgres automatically renames indexes when table is renamed, but good to be explicit if we keyed them manually)
-- However, standard practice is to let Postgres handle index ownership or rename them if we successfully renamed the table.
-- Let's rename the policies to match the new name for clarity.

DROP POLICY IF EXISTS sync_log_admin_policy ON omni_sync_log;
DROP POLICY IF EXISTS sync_log_user_policy ON omni_sync_log;

-- Re-create policies with new name context
CREATE POLICY omni_sync_log_admin_policy ON omni_sync_log
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY omni_sync_log_user_policy ON omni_sync_log
  FOR SELECT
  TO authenticated
  USING (true);

-- Update comments
COMMENT ON TABLE omni_sync_log IS 'Omni System Sync Logs (formerly BoostSpace Sync Logs)';
