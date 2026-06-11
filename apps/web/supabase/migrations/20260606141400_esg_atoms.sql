-- ESGGO 5T Protocol Core Tables
-- Creates the esg_atoms table to store Trustworthy data with Hash Locks

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS public.esg_atoms (
  uuid UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  hash_lock TEXT NOT NULL,
  status TEXT DEFAULT 'Trustworthy' NOT NULL,
  evidence JSONB NOT NULL
);

-- Trigger to prevent updates to esg_atoms, ensuring immutability (Trustworthy)
CREATE OR REPLACE FUNCTION prevent_esg_atoms_update()
RETURNS TRIGGER AS $$
BEGIN
  RAISE EXCEPTION 'Updates to esg_atoms are forbidden by the 5T Protocol (Trustworthy)';
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_prevent_esg_atoms_update ON public.esg_atoms;

CREATE TRIGGER trg_prevent_esg_atoms_update
BEFORE UPDATE ON public.esg_atoms
FOR EACH ROW
EXECUTE FUNCTION prevent_esg_atoms_update();

-- Row Level Security (RLS)
ALTER TABLE public.esg_atoms ENABLE ROW LEVEL SECURITY;

-- Allow public read for transparency, but restrict writes to authenticated services/users
CREATE POLICY "Public Read for Transparency"
ON public.esg_atoms
FOR SELECT
USING (true);

-- Insert policy (e.g. only authenticated users/agents)
CREATE POLICY "Authenticated Insert"
ON public.esg_atoms
FOR INSERT
WITH CHECK (auth.role() = 'authenticated');
