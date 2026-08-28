# NCBDB (NoCodeBackend) — esggo integration reference

## Instance (hardcoded, do not guess)
- DB instance: `54686_esg_go_userdb`
- Endpoint env: `NEXT_PUBLIC_NCB_API_ENDPOINT` / `VITE_NCB_API_ENDPOINT` (default `https://api.nocodebackend.com`)
- Auth: `Authorization: Bearer ${NCB_API_KEY}` (no key → simulation returns `[]`)

## Query shape (aligned root `src/lib/ncb-utils.ts`)
```
GET  ${ENDPOINT}/db/54686_esg_go_userdb/${table}?param=...
POST ${ENDPOINT}/db/54686_esg_go_userdb/${table}   body: {...}
PUT  ${ENDPOINT}/db/54686_esg_go_userdb/${table}?param=...  body: {...}
DELETE ${ENDPOINT}/db/54686_esg_go_userdb/${table}?param=...
```
Response may be wrapped `{data: [...]}` or a bare array — unwrap defensively:
`Array.isArray(data) ? data : (data?.data ?? data)`.

## Table-name rules (the #1 mistake this session)
- NCBDB uses FLAT table names. Do NOT mirror Firebase collection paths (`platforms/{APP_ID}/{col}`).
- Root-project tables already exist: `user_profiles`, `digital_twins`, `knowledge_chunks`, `rag_sessions`, `sustainability_reports`, `evidence_vault`, `compliance_checks`, `benchmark_data`, `report_sections`, `report_citations`, `gri_knowledge_base`, `validation_logs`, `village_members`, `impact_projects`, `community_posts`, `votes`, `service_modules`, `esg_metrics`, `materiality_matrix`, `stakeholders`, `supply_chain_data`, `ncba_user`, `ncba_session`, `ncba_account`.
- For sub-project-specific data, prefix with the project short code to avoid collision: e.g. Learning Center uses `lc_submissions`, `lc_profiles`, `lc_tas`, `lc_pairings` (NOT `platforms_lc_submissions`).

## Cross-cutting pitfalls
- When migrating a sub-project that already has `useFirebase && db → localStorage`, insert `useNcb` as the MIDDLE branch so the live Firebase path stays intact (no downtime) and NCBDB only activates with a key.
- `migrateLocalToNcb()` should be idempotent and guarded by `useNcb` (skip silently when no key); call from app bootstrap.
- Never commit the real `NCB_API_KEY`. Put `VITE_NCB_API_KEY=` (empty) in `.env` / `.env.example`; user fills the secret out-of-band.
- Schema mismatch symptom: data "disappears" because `ncbQuery` writes to a table name that does not exist in the instance. Verify the table name against this list before declaring done.
