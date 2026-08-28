---
name: esggo-ncdb-integration
category: esggo
version: "1.0.0"
description: Integrate NCBDB; Firebase→NCBDB seamless transition.
tags: [esggo, ncbdb, nocodebackend, firebase-removal, data-layer, 5t, seamless-transition]
---

# ESGGO NCBDB Integration

## When to use
- Removing GCP Firebase/Firestore from an esggo project and replacing the data layer with NCBDB (NoCodeBackend).
- Adding NCBDB as a backend behind an existing Firebase/localStorage fallback (seamless transition).
- Any task touching `src/lib/ncb-utils.ts`, `src/lib/ncb-service.ts`, `src/ncb-client.js`, or NCBDB table names.
- User says "NCBDB", "NoCodeBackend", "54686_esg_go_userdb", or "改用 NCBDB".

## Connection constants (durable — from ncb-utils.ts + build report 2026-02-27)
- API endpoint: `https://api.nocodebackend.com` (env: `NEXT_PUBLIC_NCB_API_ENDPOINT` / `VITE_NCB_API_ENDPOINT` / `NCB_API_ENDPOINT`)
- DB instance (HARDCODE, do not guess from env): `54686_esg_go_userdb`
- Auth: `Authorization: Bearer ${NCB_API_KEY}` (env: `NCB_API_KEY` / `VITE_NCB_API_KEY`)
- Query URL shape: `${ENDPOINT}/db/${INSTANCE}/${table}`

## ncbQuery interface shape (root project src/lib/ncb-utils.ts)
```ts
ncbQuery<T>({ table, method?, body?, params? }): Promise<T>
// method: GET | POST | PUT | DELETE
// No API key → returns [] (simulation mode, no crash)
```
Client-side factory: `src/lib/ncb-service.ts` (typed fetch wrapper; `serviceModulesApi.list()`, `esgMetricsApi.listByCategory()`).

## Seamless transition pattern (KEEP OLD + INSERT NEW + FEATURE FLAG)
When replacing Firebase, do NOT delete the Firebase path. Insert NCBDB as a middle layer so live deployments never break:
```
priority: useFirebase && db  →  Firebase Firestore (intact, highest)
          else if useNcb    →  NCBDB (new backend, enabled by API key)
          else              →  localStorage (existing fallback)
```
- `useNcb = Boolean(NCB_API_KEY)` — feature flag, zero downtime. Firebase path stays intact so existing prod keeps working.
- For client localStorage→NCBDB migration, add `migrateLocalToNcb()` that runs once on page load (user-invisible, no data loss). It iterates localStorage keys by prefix and writes each to NCBDB.

## CRITICAL SCHEMA RULE — flat table names, NO platforms_ prefix
NCBDB uses FLAT table names. The Firestore collection path `platforms/{APP_ID}/{collection}` does NOT map to `platforms_${appId}_${collection}` tables — those tables do NOT exist in NCBDB; writes are silently lost (return [] in sim mode, 404 in real mode). This was a real bug caught by cross-checking the build report against `ncb-utils.ts`.

Correct mapping:
- DB instance is a single flat namespace: `54686_esg_go_userdb` (no per-app sub-namespacing).
- Root project tables (already built): `user_profiles`, `digital_twins`, `knowledge_chunks`, `rag_sessions`, `report_sections`, `report_citations`, `gri_knowledge_base`, `validation_logs`, `village_members`, `impact_projects`, `community_posts`, `votes`, `sustainability_reports`, `evidence_vault`, `audit_trail`, `compliance_checks`, `benchmark_data`, `esg_metrics`, `materiality_matrix`, `stakeholders`, `supply_chain_data`, `service_modules`, `ncba_user`, `ncba_session`, `ncba_account`
- Learning Center isolated tables (LC-specific, prefix `lc_` to avoid collision with root `user_profiles` etc.): `lc_submissions`, `lc_profiles`, `lc_tas`, `lc_pairings`
- NCBDB allows unlimited tables & columns per DB (max 10 DBs total).

Response normalization (NCBDB may return `{ data: [...] }` OR a bare array):
```js
const data = await res.json();
return Array.isArray(data) ? data : (data?.data ?? data);
```

## Verification (5T honest gate)
- `pnpm run test` — must pass. NOTE: `oa-swarm/test/swarm.test.*` has a KNOWN FLAKY 15s timeout ("靈魂執行鏈 executeSwarmTask 產出 5T 凍結產物") UNRELATED to db/ncb changes (oa-swarm does not import db.js/ncb-client.js). Confirm non-regression by checking the import graph, not by assuming your change broke it.
- `pnpm run build` — must succeed. For LC, build runs `scripts/validate-env.ts` which requires `DATABASE_URL`; pass a placeholder + `VITE_NCB_API_KEY` to exercise the NCBDB code path through the gate.
- Commit + push. If remote rejects ("fetch first"), `git pull --rebase origin main` then push (no conflicts expected if you only touched NCBDB files).

## Full schema reference
See `references/ncdb-schema.md` for the complete table inventory, service-module UUID map, and RLS policies from the 2026-02-27 build report.
