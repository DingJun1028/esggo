-- Add hash_lock field to energy_metrics table for 5T Protocol compliance
-- This ensures each metric record can be cryptographically sealed and verified

ALTER TABLE energy_metrics 
ADD COLUMN IF NOT EXISTS hash_lock TEXT,
ADD COLUMN IF NOT EXISTS sealed_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS sealed_by TEXT;

-- Create index for faster hash lookups
CREATE INDEX IF NOT EXISTS idx_energy_metrics_hash_lock ON energy_metrics(hash_lock);

-- Update existing records with empty hash_lock (for backward compatibility)
UPDATE energy_metrics 
SET hash_lock = NULL, sealed_at = NULL, sealed_by = NULL
WHERE hash_lock IS NULL;

-- Add constraint to ensure hash_lock is provided when sealing
ALTER TABLE energy_metrics 
ADD CONSTRAINT chk_hash_lock_format 
CHECK (hash_lock ~ '^0x[0-9a-fA-F]{64}$' OR hash_lock IS NULL);