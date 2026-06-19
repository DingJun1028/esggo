-- ============================================================================
-- Mitigation 006: Create Enums for Stronger Type Safety
-- Aligned with src/types/esgss_schema.ts and existing constraints
-- ============================================================================

-- 1. InfoOne Lifecycle Status
-- TS Definition: 'DORMANT' | 'INITIALIZING' | 'ACTIVE' | 'OPTIMIZING' | 'TERMINATING' | 'SEALED' | 'Trustworthy'
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'info_one_lifecycle_status') THEN
    CREATE TYPE public.info_one_lifecycle_status AS ENUM (
      'DORMANT', 
      'INITIALIZING', 
      'ACTIVE', 
      'OPTIMIZING', 
      'TERMINATING', 
      'SEALED', 
      'Trustworthy'
    );
  END IF;
END$$;

-- 2. Source Taxonomy (S-Series)
-- TS Definition: 'S1', 'S2', 'S3', 'S4', 'S5'
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'source_taxonomy') THEN
    CREATE TYPE public.source_taxonomy AS ENUM (
      'S1', -- Primary Sensor
      'S2', -- System Log
      'S3', -- Verified Audit
      'S4', -- Self Reported
      'S5'  -- Inferred AI
    );
  END IF;
END$$;

-- 3. Verification Status
-- TS Definition: 'PENDING' | 'VERIFIED' | 'REJECTED'
-- Note: 'unverified' was not in the TS definition, staying compliant with current code.
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'verification_status') THEN
    CREATE TYPE public.verification_status AS ENUM (
      'PENDING', 
      'VERIFIED', 
      'REJECTED'
    );
  END IF;
END$$;

-- 4. Agent Context Strategy
-- DB Constraint: IN ('FIFO', 'Summarization', 'Hybrid')
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'agent_context_strategy') THEN
    CREATE TYPE public.agent_context_strategy AS ENUM (
      'FIFO', 
      'Summarization', 
      'Hybrid'
    );
  END IF;
END$$;
