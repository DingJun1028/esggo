CREATE EXTENSION IF NOT EXISTS pgcrypto;

ALTER TABLE public.esg_tasks
    ADD COLUMN IF NOT EXISTS owner_id UUID DEFAULT auth.uid(),
    ADD COLUMN IF NOT EXISTS company_id TEXT DEFAULT COALESCE(auth.jwt() -> 'app_metadata' ->> 'company_id', 'default');

ALTER TABLE public.esg_atoms
    ADD COLUMN IF NOT EXISTS owner_id UUID DEFAULT auth.uid(),
    ADD COLUMN IF NOT EXISTS company_id TEXT DEFAULT COALESCE(auth.jwt() -> 'app_metadata' ->> 'company_id', 'default');

ALTER TABLE public.integrity_proofs
    ADD COLUMN IF NOT EXISTS tenant_id UUID DEFAULT '00000000-0000-0000-0000-000000000000';

DROP POLICY IF EXISTS "Enable read access for all authenticated users" ON public.esg_tasks;
DROP POLICY IF EXISTS "Enable insert access for all authenticated users" ON public.esg_tasks;
DROP POLICY IF EXISTS "Enable update access for all authenticated users" ON public.esg_tasks;

CREATE POLICY "esg_tasks_owner_or_company_select" ON public.esg_tasks
    FOR SELECT
    TO authenticated
    USING (
        owner_id = auth.uid()
        OR company_id = COALESCE(auth.jwt() -> 'app_metadata' ->> 'company_id', 'default')
    );

CREATE POLICY "esg_tasks_owner_or_company_insert" ON public.esg_tasks
    FOR INSERT
    TO authenticated
    WITH CHECK (
        owner_id = auth.uid()
        OR company_id = COALESCE(auth.jwt() -> 'app_metadata' ->> 'company_id', 'default')
    );

CREATE POLICY "esg_tasks_owner_or_company_update" ON public.esg_tasks
    FOR UPDATE
    TO authenticated
    USING (
        owner_id = auth.uid()
        OR company_id = COALESCE(auth.jwt() -> 'app_metadata' ->> 'company_id', 'default')
    )
    WITH CHECK (
        owner_id = auth.uid()
        OR company_id = COALESCE(auth.jwt() -> 'app_metadata' ->> 'company_id', 'default')
    );

DROP POLICY IF EXISTS "Allow public insert for Tri-Sync integration" ON public.report_sections;
DROP POLICY IF EXISTS "Allow public update for Tri-Sync integration" ON public.report_sections;
DROP POLICY IF EXISTS "Allow public select for Tri-Sync integration" ON public.report_sections;
DROP POLICY IF EXISTS "Allow public insert for Eternal Memories" ON public.eternal_memories;
DROP POLICY IF EXISTS "Allow public select for Eternal Memories" ON public.eternal_memories;

CREATE POLICY "report_sections_company_select" ON public.report_sections
    FOR SELECT
    TO authenticated
    USING (company_id = COALESCE(auth.jwt() -> 'app_metadata' ->> 'company_id', 'default'));

CREATE POLICY "report_sections_company_insert" ON public.report_sections
    FOR INSERT
    TO authenticated
    WITH CHECK (company_id = COALESCE(auth.jwt() -> 'app_metadata' ->> 'company_id', 'default'));

CREATE POLICY "report_sections_company_update" ON public.report_sections
    FOR UPDATE
    TO authenticated
    USING (company_id = COALESCE(auth.jwt() -> 'app_metadata' ->> 'company_id', 'default'))
    WITH CHECK (company_id = COALESCE(auth.jwt() -> 'app_metadata' ->> 'company_id', 'default'));

CREATE POLICY "eternal_memories_company_select" ON public.eternal_memories
    FOR SELECT
    TO authenticated
    USING (company_id = COALESCE(auth.jwt() -> 'app_metadata' ->> 'company_id', 'default'));

CREATE POLICY "eternal_memories_company_insert" ON public.eternal_memories
    FOR INSERT
    TO authenticated
    WITH CHECK (company_id = COALESCE(auth.jwt() -> 'app_metadata' ->> 'company_id', 'default'));

DROP POLICY IF EXISTS "Public can read verified proofs" ON public.integrity_proofs;
DROP POLICY IF EXISTS "Authenticated users can insert proofs" ON public.integrity_proofs;

CREATE POLICY "integrity_proofs_tenant_select" ON public.integrity_proofs
    FOR SELECT
    TO authenticated
    USING (
        tenant_id::text = COALESCE(
            auth.jwt() -> 'app_metadata' ->> 'tenant_id',
            auth.jwt() -> 'app_metadata' ->> 'company_id'
        )
        AND tenant_id::text <> '00000000-0000-0000-0000-000000000000'
    );

CREATE POLICY "integrity_proofs_tenant_insert" ON public.integrity_proofs
    FOR INSERT
    TO authenticated
    WITH CHECK (
        tenant_id::text = COALESCE(
            auth.jwt() -> 'app_metadata' ->> 'tenant_id',
            auth.jwt() -> 'app_metadata' ->> 'company_id'
        )
        AND tenant_id::text <> '00000000-0000-0000-0000-000000000000'
    );

DROP POLICY IF EXISTS "Public Read for Transparency" ON public.esg_atoms;
DROP POLICY IF EXISTS "Authenticated Insert" ON public.esg_atoms;

CREATE POLICY "esg_atoms_owner_or_company_select" ON public.esg_atoms
    FOR SELECT
    TO authenticated
    USING (
        owner_id = auth.uid()
        OR company_id = COALESCE(auth.jwt() -> 'app_metadata' ->> 'company_id', 'default')
    );

CREATE POLICY "esg_atoms_owner_or_company_insert" ON public.esg_atoms
    FOR INSERT
    TO authenticated
    WITH CHECK (
        owner_id = auth.uid()
        OR company_id = COALESCE(auth.jwt() -> 'app_metadata' ->> 'company_id', 'default')
    );

REVOKE EXECUTE ON FUNCTION public.consolidate_eternal_memories(text, text, text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.consolidate_eternal_memories(text, text, text) TO service_role;

CREATE OR REPLACE FUNCTION public.consolidate_eternal_memories(
    p_user_id TEXT,
    p_company_id TEXT,
    p_memory_type TEXT
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, extensions, public
AS $$
DECLARE
    v_new_id UUID;
    v_combined_content JSONB;
    v_count INTEGER;
    v_role TEXT;
    v_company_from_jwt TEXT;
BEGIN
    v_role := auth.jwt() ->> 'role';
    v_company_from_jwt := auth.jwt() -> 'app_metadata' ->> 'company_id';

    IF v_role <> 'service_role' AND auth.uid()::text IS DISTINCT FROM p_user_id THEN
        RAISE EXCEPTION '5T Protocol Violation: only the owner or service_role can consolidate memories';
    END IF;

    IF v_role <> 'service_role' AND v_company_from_jwt IS DISTINCT FROM p_company_id THEN
        RAISE EXCEPTION '5T Protocol Violation: company_id mismatch';
    END IF;

    SELECT jsonb_agg(memory_value), count(*)
    INTO v_combined_content, v_count
    FROM public.user_memory
    WHERE user_id = p_user_id
      AND company_id = p_company_id
      AND memory_type = p_memory_type
      AND (context ->> 'consolidated')::boolean IS NOT TRUE;

    IF v_count < 2 THEN
        RETURN NULL;
    END IF;

    INSERT INTO public.user_memory (
        user_id,
        company_id,
        memory_type,
        memory_key,
        memory_value,
        context,
        hash_lock
    )
    VALUES (
        p_user_id,
        p_company_id,
        p_memory_type,
        'consolidated_' || p_memory_type || '_' || extract(epoch FROM now())::text,
        v_combined_content,
        jsonb_build_object(
            'consolidated', true,
            'child_count', v_count,
            'consolidated_at', now()
        ),
        encode(digest(v_combined_content::text, 'sha256'), 'hex')
    )
    RETURNING id INTO v_new_id;

    UPDATE public.user_memory
    SET context = context || jsonb_build_object(
            'consolidated', true,
            'parent_id', v_new_id
        )
    WHERE user_id = p_user_id
      AND company_id = p_company_id
      AND memory_type = p_memory_type
      AND id != v_new_id
      AND (context ->> 'consolidated')::boolean IS NOT TRUE;

    RETURN v_new_id;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.execute_autonomous_healing(text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.execute_autonomous_healing(text) TO service_role;

CREATE OR REPLACE FUNCTION public.execute_autonomous_healing(p_company_id TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, extensions, public
AS $$
DECLARE
    v_gap_record RECORD;
    v_evidence_id UUID;
    v_healed_count INTEGER := 0;
    v_result JSONB;
    v_role TEXT;
    v_company_from_jwt TEXT;
BEGIN
    v_role := auth.jwt() ->> 'role';
    v_company_from_jwt := auth.jwt() -> 'app_metadata' ->> 'company_id';

    IF v_role <> 'service_role' AND v_company_from_jwt IS DISTINCT FROM p_company_id THEN
        RAISE EXCEPTION '5T Protocol Violation: company_id mismatch';
    END IF;

    FOR v_gap_record IN
        SELECT s.gri_tag
        FROM public.system_gaps_summary s
        WHERE s.status = 'MISSING'
          AND s.company_id = p_company_id
        LIMIT 5
    LOOP
        SELECT ev.id INTO v_evidence_id
        FROM public.evidence_vault ev
        WHERE ev.status = 'verified'
          AND ev.company_id = p_company_id
          AND v_gap_record.gri_tag = ANY(ev.gri_mapping)
        LIMIT 1;

        IF v_evidence_id IS NOT NULL THEN
            INSERT INTO public.environmental_data (
                company_id,
                category,
                metric_name,
                metric_value,
                unit,
                year,
                gri_standard,
                hash_lock
            )
            VALUES (
                p_company_id,
                'AUTO_HEALED',
                'System Autonomous Population',
                0,
                'N/A',
                2024,
                v_gap_record.gri_tag,
                'healed_lock_' || encode(digest(v_evidence_id::text, 'sha256'), 'hex')
            );

            INSERT INTO public.healing_log (
                target_gri,
                action_taken,
                status,
                details
            )
            VALUES (
                v_gap_record.gri_tag,
                'AUTO_LINK_EVIDENCE',
                'success',
                jsonb_build_object(
                    'evidence_id', v_evidence_id,
                    'method', 'Vault_Nexus_Healing'
                )
            );

            v_healed_count := v_healed_count + 1;
        END IF;
    END LOOP;

    v_result := jsonb_build_object(
        'healed_count', v_healed_count,
        'timestamp', now(),
        'agent', 'OmniHermes_Healing_Unit'
    );

    RETURN v_result;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.notify_audit_guardian() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.notify_audit_guardian() TO service_role;

CREATE OR REPLACE FUNCTION public.notify_audit_guardian()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, extensions, public
AS $$
DECLARE
    v_service_key TEXT;
BEGIN
    v_service_key := current_setting('app.audit_guardian_service_key', true);

    IF v_service_key IS NULL THEN
        RETURN NEW;
    END IF;

    PERFORM net.http_post(
        url := 'https://yhwfmavnhaivvgzeuklx.supabase.co/functions/v1/audit-guardian',
        headers := jsonb_build_object(
            'Content-Type', 'application/json',
            'Authorization', 'Bearer ' || v_service_key
        ),
        body := jsonb_build_object('record', row_to_json(NEW))
    );

    RETURN NEW;
END;
$$;
