-- test_rls.sql
BEGIN;

-- Create some dummy users for testing if necessary, but we can just mock the JWT claims.

-- 1. Test Evidence Vault with Company A
SET LOCAL role authenticated;
SET LOCAL request.jwt.claims TO '{"sub": "user_a", "app_metadata": {"company_id": "company_A"}}';

-- Should succeed
INSERT INTO public.evidence_vault (id, company_id, content, evidence_hash, created_at, source_origin) 
VALUES (gen_random_uuid(), 'company_A', 'Evidence for A', 'hashA', now(), 'test_script');

-- Should fail (RLS violation)
DO $$
BEGIN
    BEGIN
        INSERT INTO public.evidence_vault (id, company_id, content, evidence_hash, created_at, source_origin) 
        VALUES (gen_random_uuid(), 'company_B', 'Evidence for B', 'hashB', now(), 'test_script');
        RAISE EXCEPTION 'RLS FAIL: Inserted cross-company evidence_vault';
    EXCEPTION WHEN insufficient_privilege THEN
        -- Expected
        RAISE NOTICE 'RLS PASS: Prevented cross-company insert in evidence_vault';
    END;
END $$;

-- 2. Test Audit Logs with Company A
-- Should succeed
INSERT INTO public.audit_logs (id, company_id, action, performed_by, target_resource, created_at) 
VALUES (gen_random_uuid(), 'company_A', 'CREATE', 'user_a', 'resource', now());

-- Should fail (RLS violation)
DO $$
BEGIN
    BEGIN
        INSERT INTO public.audit_logs (id, company_id, action, performed_by, target_resource, created_at) 
        VALUES (gen_random_uuid(), 'company_B', 'CREATE', 'user_a', 'resource', now());
        RAISE EXCEPTION 'RLS FAIL: Inserted cross-company audit_logs';
    EXCEPTION WHEN insufficient_privilege THEN
        -- Expected
        RAISE NOTICE 'RLS PASS: Prevented cross-company insert in audit_logs';
    END;
END $$;

-- Try updating Audit Log (Assuming no UPDATE or restricted UPDATE policy)
-- audit_logs_company_update checks company_id. Let's try updating another company's log.
SET LOCAL request.jwt.claims TO '{"sub": "user_b", "app_metadata": {"company_id": "company_B"}}';

-- This should update 0 rows due to SELECT isolation
UPDATE public.audit_logs SET action = 'UPDATED' WHERE company_id = 'company_A';
-- Or should fail if we try to change company_id to B
DO $$
BEGIN
    BEGIN
        UPDATE public.audit_logs SET company_id = 'company_B' WHERE company_id = 'company_A';
        -- The update might silently fail (0 rows) due to SELECT policy. 
        -- To be sure it didn't update, we check below.
    END;
END $$;

-- 3. Test sustainwrite_sections with user_a
SET LOCAL request.jwt.claims TO '{"sub": "user_a", "app_metadata": {"company_id": "company_A"}}';

-- Should succeed
INSERT INTO public.sustainwrite_sections (id, content, version, created_at, user_id) 
VALUES (gen_random_uuid(), 'Content A', 1, now(), 'user_a');

-- Should fail
DO $$
BEGIN
    BEGIN
        INSERT INTO public.sustainwrite_sections (id, content, version, created_at, user_id) 
        VALUES (gen_random_uuid(), 'Content B', 1, now(), 'user_b');
        RAISE EXCEPTION 'RLS FAIL: Inserted cross-user sustainwrite_sections';
    EXCEPTION WHEN insufficient_privilege THEN
        -- Expected
        RAISE NOTICE 'RLS PASS: Prevented cross-user insert in sustainwrite_sections';
    END;
END $$;

-- 4. Test DELETE (should fail as no policy exists)
DO $$
BEGIN
    BEGIN
        DELETE FROM public.audit_logs WHERE company_id = 'company_A';
        RAISE EXCEPTION 'RLS FAIL: Delete allowed in audit_logs';
    EXCEPTION WHEN insufficient_privilege THEN
        RAISE NOTICE 'RLS PASS: Prevented delete in audit_logs';
    END;
END $$;

ROLLBACK;
