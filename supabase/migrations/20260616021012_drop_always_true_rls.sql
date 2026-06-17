ALTER TABLE public."AuditRecord"
    ADD COLUMN IF NOT EXISTS tenant_id TEXT;

ALTER TABLE public."EternalMemory"
    ADD COLUMN IF NOT EXISTS tenant_id TEXT;

DROP POLICY IF EXISTS "audit_record_select" ON public."AuditRecord";
DROP POLICY IF EXISTS "audit_record_insert" ON public."AuditRecord";
DROP POLICY IF EXISTS "eternal_memory_select" ON public."EternalMemory";
DROP POLICY IF EXISTS "eternal_memory_insert" ON public."EternalMemory";

CREATE POLICY "audit_record_tenant_select" ON public."AuditRecord"
    FOR SELECT
    TO authenticated
    USING (
        tenant_id = COALESCE(
            auth.jwt() -> 'app_metadata' ->> 'tenant_id',
            auth.jwt() -> 'app_metadata' ->> 'company_id'
        )
        AND tenant_id IS NOT NULL
    );

CREATE POLICY "audit_record_tenant_insert" ON public."AuditRecord"
    FOR INSERT
    TO authenticated
    WITH CHECK (
        tenant_id = COALESCE(
            auth.jwt() -> 'app_metadata' ->> 'tenant_id',
            auth.jwt() -> 'app_metadata' ->> 'company_id'
        )
        AND tenant_id IS NOT NULL
    );

CREATE POLICY "eternal_memory_tenant_select" ON public."EternalMemory"
    FOR SELECT
    TO authenticated
    USING (
        tenant_id = COALESCE(
            auth.jwt() -> 'app_metadata' ->> 'tenant_id',
            auth.jwt() -> 'app_metadata' ->> 'company_id'
        )
        AND tenant_id IS NOT NULL
    );

CREATE POLICY "eternal_memory_tenant_insert" ON public."EternalMemory"
    FOR INSERT
    TO authenticated
    WITH CHECK (
        tenant_id = COALESCE(
            auth.jwt() -> 'app_metadata' ->> 'tenant_id',
            auth.jwt() -> 'app_metadata' ->> 'company_id'
        )
        AND tenant_id IS NOT NULL
    );

DROP POLICY IF EXISTS "allow_all_brand_components" ON public.brand_components;
DROP POLICY IF EXISTS "allow_all_brand_tokens" ON public.brand_tokens;
DROP POLICY IF EXISTS "allow_all_component_usage_logs" ON public.component_usage_logs;
