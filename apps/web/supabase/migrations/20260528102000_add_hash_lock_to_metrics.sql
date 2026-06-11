ALTER TABLE social_metrics ADD COLUMN IF NOT EXISTS hash_lock TEXT;
ALTER TABLE governance_metrics ADD COLUMN IF NOT EXISTS hash_lock TEXT;
