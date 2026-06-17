DO $$
DECLARE
    r record;
BEGIN
    FOR r IN
        SELECT p.oid::regprocedure AS proc
        FROM pg_proc p
        JOIN pg_namespace n ON n.oid = p.pronamespace
        WHERE n.nspname = 'public'
          AND p.prokind = 'f'
    LOOP
        EXECUTE format(
            'ALTER FUNCTION %s SET search_path = pg_catalog, extensions, public',
            r.proc
        );
    END LOOP;
END $$;
