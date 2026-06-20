-- 1. Add tenant_id to core tables
ALTER TABLE "public"."omni_notes" ADD COLUMN IF NOT EXISTS tenant_id TEXT;
ALTER TABLE "public"."esg_atoms" ADD COLUMN IF NOT EXISTS tenant_id TEXT;

-- 2. Backfill existing data with a default tenant (for legacy data)
UPDATE "public"."omni_notes" SET tenant_id = 'default' WHERE tenant_id IS NULL;
UPDATE "public"."esg_atoms" SET tenant_id = 'default' WHERE tenant_id IS NULL;

-- 3. Make tenant_id NOT NULL for strict isolation
ALTER TABLE "public"."omni_notes" ALTER COLUMN tenant_id SET NOT NULL;
ALTER TABLE "public"."esg_atoms" ALTER COLUMN tenant_id SET NOT NULL;

-- 4. Enable RLS on core tables
ALTER TABLE "public"."omni_notes" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."esg_atoms" ENABLE ROW LEVEL SECURITY;

-- 5. Drop previous overly permissive policies (if any)
DROP POLICY IF EXISTS "Public Read for Transparency" ON public.esg_atoms;
DROP POLICY IF EXISTS "Authenticated Insert" ON public.esg_atoms;
DROP POLICY IF EXISTS "omni_notes_all" ON public.omni_notes;

-- 6. Create Multi-Tenant Isolation Policies for omni_notes
-- Select: User can see if they share the same tenant_id in user_tenant_map
CREATE POLICY "Tenant Isolation Select omni_notes" ON "public"."omni_notes"
  FOR SELECT TO authenticated
  USING (
    tenant_id IN (
      SELECT utm.tenant_id 
      FROM public.user_tenant_map utm 
      WHERE utm.user_id = auth.uid()
    )
  );

-- Insert: User can insert if they have the tenant_id in their user_tenant_map
CREATE POLICY "Tenant Isolation Insert omni_notes" ON "public"."omni_notes"
  FOR INSERT TO authenticated
  WITH CHECK (
    tenant_id IN (
      SELECT utm.tenant_id 
      FROM public.user_tenant_map utm 
      WHERE utm.user_id = auth.uid()
    )
  );

-- Update: User can update if they share the same tenant_id
CREATE POLICY "Tenant Isolation Update omni_notes" ON "public"."omni_notes"
  FOR UPDATE TO authenticated
  USING (
    tenant_id IN (
      SELECT utm.tenant_id 
      FROM public.user_tenant_map utm 
      WHERE utm.user_id = auth.uid()
    )
  );

-- Delete: User can delete if they share the same tenant_id
CREATE POLICY "Tenant Isolation Delete omni_notes" ON "public"."omni_notes"
  FOR DELETE TO authenticated
  USING (
    tenant_id IN (
      SELECT utm.tenant_id 
      FROM public.user_tenant_map utm 
      WHERE utm.user_id = auth.uid()
    )
  );

-- 7. Create Multi-Tenant Isolation Policies for esg_atoms
-- Transparency: For atoms, we might still want Public Read if it's a verifiable blockchain-like ledger.
-- But the prompt asks for tenant isolation. Let's isolate it so only tenant can see their own atoms.
CREATE POLICY "Tenant Isolation Select esg_atoms" ON "public"."esg_atoms"
  FOR SELECT TO authenticated
  USING (
    tenant_id IN (
      SELECT utm.tenant_id 
      FROM public.user_tenant_map utm 
      WHERE utm.user_id = auth.uid()
    )
  );

CREATE POLICY "Tenant Isolation Insert esg_atoms" ON "public"."esg_atoms"
  FOR INSERT TO authenticated
  WITH CHECK (
    tenant_id IN (
      SELECT utm.tenant_id 
      FROM public.user_tenant_map utm 
      WHERE utm.user_id = auth.uid()
    )
  );
