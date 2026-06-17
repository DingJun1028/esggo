DROP INDEX IF EXISTS public.idx_energy_metrics_hash;
DROP INDEX IF EXISTS public.idx_evidence_vault_hash;
DROP INDEX IF EXISTS public.idx_hc_results_company;
DROP INDEX IF EXISTS public.idx_health_check_company;
ALTER TABLE public.roadmap_milestones DROP CONSTRAINT IF EXISTS roadmap_milestones_bk;
DROP INDEX IF EXISTS public.idx_sw_company;
DROP INDEX IF EXISTS public.idx_public_tasks_assignee;
DROP INDEX IF EXISTS public.idx_vault_omni_payload_gri;
