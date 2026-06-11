-- Add ZKP Proof and Hash Lock columns to evidence_vault for OmniAgent ZKP Sealing

ALTER TABLE public.evidence_vault
ADD COLUMN IF NOT EXISTS zkp_proof BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS hash_lock TEXT,
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending';
