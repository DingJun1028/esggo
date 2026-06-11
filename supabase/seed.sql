-- Seed Data for ESG GO Platform
-- Populating mock data to verify RLS policies and Liquid Glass UI (T1 Tangible)

-- =========================
-- 1) evidence_vault (必填 storage_path)
-- =========================
INSERT INTO public.evidence_vault
  (id, company_id, file_name, file_type, file_size, storage_path, gri_mapping, is_sealed, category, status, source_url, hash_lock, t5_bundle, zkp_proof)
VALUES
  (gen_random_uuid(), 'default', '2025_Carbon_Emissions_Report.pdf', 'PDF', 123456,
   'evidence/2025_Carbon_Emissions_Report.pdf', ARRAY['GRI 305'], false,
   'Environmental', 'Active', NULL, decode('4f7a2b9d', 'hex'), '{}'::jsonb, true),

  (gen_random_uuid(), 'default', 'Q1_Employee_Diversity_Stats.csv', 'CSV', 23456,
   'evidence/Q1_Employee_Diversity_Stats.csv', ARRAY['GRI 405'], false,
   'Social', 'Active', NULL, NULL, '{}'::jsonb, false),

  (gen_random_uuid(), 'other_company', 'Supplier_Code_of_Conduct.pdf', 'PDF', 98765,
   'evidence/Supplier_Code_of_Conduct.pdf', ARRAY['GRI 414'], true,
   'Governance', 'Active', NULL, decode('8b1c4e9f', 'hex'), '{}'::jsonb, true)
ON CONFLICT DO NOTHING;


-- =========================
-- 2) audit_logs（補齊所有 NOT NULL 欄位）
-- =========================
INSERT INTO public.audit_logs
  (txn_id, module, action, actor, data_hash, status, company_id, resource, t5_tag, details, hash_lock)
VALUES
  ('txn-001', 'evidence_vault', 'INSERT', 'system',
   encode(digest('audit-001', 'sha256'), 'hex'), 'ok', 'default',
   'evidence_vault:2025_Carbon_Emissions_Report.pdf', 'T5',
   jsonb_build_object('note','seed evidence_vault pdf row'),
   NULL),

  ('txn-002', 'evidence_vault', 'INSERT', 'system',
   encode(digest('audit-002', 'sha256'), 'hex'), 'ok', 'default',
   'evidence_vault:Q1_Employee_Diversity_Stats.csv', 'T5',
   jsonb_build_object('note','seed evidence_vault csv row'),
   NULL),

  ('txn-003', 'evidence_vault', 'INSERT', 'system',
   encode(digest('audit-003', 'sha256'), 'hex'), 'ok', 'other_company',
   'evidence_vault:Supplier_Code_of_Conduct.pdf', 'T5',
   jsonb_build_object('note','seed evidence_vault other_company row'),
   NULL)
ON CONFLICT DO NOTHING;


-- =========================
-- 3) sustainwrite_sections（只填 NOT NULL 欄位 + 合理值）
-- =========================
INSERT INTO public.sustainwrite_sections
  (project_id, company_id, section_key, content_md, input_snapshot, hash_value,
   evidence, status, version, hash_lock, chapter_id, section_id, data, user_id, ai_persona)
VALUES
  ('default', 'default', 'ch-env-01',
   '### Carbon Emissions\n\n- Emissions decreased by 15%.',
   '{}'::jsonb, 'hash-value-env-01',
   '{}'::jsonb, 'completed', 'v1.0.0', 'hash-lock-env-01',
   'ch-env-01', 'sec-env-01',
   '{}'::jsonb, 'default', 'compliance'),

  ('default', 'default', 'ch-soc-01',
   '### Employee Diversity\n\n- Increased female representation in management to 40%.',
   '{}'::jsonb, 'hash-value-soc-01',
   '{}'::jsonb, 'draft', 'v1.0.0', 'hash-lock-soc-01',
   'ch-soc-01', 'sec-soc-01',
   '{}'::jsonb, 'default', 'compliance')
ON CONFLICT DO NOTHING;
