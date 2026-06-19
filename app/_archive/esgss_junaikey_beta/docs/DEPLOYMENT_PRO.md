# InfoOne v8.1.0 - Professional Deployment Guide (Vercel + Supabase)

## 🚀 Overview
- **Database**: Supabase (PostgreSQL with RLS)
- **Platform**: Vercel (CI/CD)
- **AI Engine**: Google Gemini 2.0
- **Security**: 5T Protocol & Hash Lock Integrity

## 1. Supabase Initialization
### 1.1 SQL Schema Setup
Execute the following in Supabase SQL Editor:
```sql
CREATE TABLE IF NOT EXISTS evidence_vault (
  uuid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  timestamp BIGINT NOT NULL,
  formula TEXT NOT NULL,
  impact_metric JSONB NOT NULL,
  hash_lock TEXT NOT NULL,
  source_origin TEXT NOT NULL,
  lifecycle_stage TEXT NOT NULL CHECK (lifecycle_stage IN ('draft', 'verified', 'published', 'archived')),
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Immutable Trigger
CREATE OR REPLACE FUNCTION prevent_evidence_update() RETURNS TRIGGER AS $$
BEGIN
  RAISE EXCEPTION 'Evidence is immutable under 5T Protocol';
END; $$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_immutability BEFORE UPDATE ON evidence_vault FOR EACH ROW EXECUTE FUNCTION prevent_evidence_update();
```

## 2. Environment Variables
Configure these in Vercel:
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase Project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Public Anon Key
- `SUPABASE_SERVICE_ROLE_KEY`: Service Role Secret (Backend Only)
- `GEMINI_API_KEY`: API Key from Google AI Studio

## 3. Deployment Steps
1. Push code to a **Private** GitHub repository.
2. Connect Vercel to the repository.
3. Set Framework Preset: **Vite** (for current SPA) or **Next.js** (if using App Router).
4. Deploy!

## 4. Verification
Run the verification script to ensure all systems are "Crystallized":
`npx tsx scripts/test-api.ts`

---
**Status**: DEPLOYMENT READY 🚀
