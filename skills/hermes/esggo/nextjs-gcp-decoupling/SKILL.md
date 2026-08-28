---
name: nextjs-gcp-decoupling
description: "De-GCP Next.js: swap Firebase for local shims."
version: 1.0.0
author: Hermes Agent
license: MIT
platforms: [windows, linux, macos]
metadata:
  hermes:
    tags: [nextjs, firebase, firestore, gcp, decoupling, local, refactor, esggo]
    related_skills: [esggo-best-practice-execution, windows-hermes-update-troubleshooting]
---

# Next.js GCP Decoupling — replace Firebase/Cloud with local shims

## When to use
- User says "remove Google Cloud SQL", "停用 Firebase", "移除 GCP 依賴", "de-GCP the project", "run fully local/offline".
- A Next.js monorepo where Firebase/Firestore/Cloud SQL were used but infra moved local (Oracle VPS, SQLite, Ollama, local JSON).

## Scope decision (ask or infer, then state it)
- **Infra only** (Firestore / Firebase Auth / Cloud SQL): replace with local shim; keep Gemini/`@google/genai` if user policy allows free-tier AI.
- **Full de-Google**: also replace Gemini with local Ollama (`http://127.0.0.1:11434`). esggo already has `app/api/health` Ollama probe + `agentic-twin` fallback pattern to reuse.

## NCBDB as the real data layer (user override: "改用 NCBDB")
When the user says "改用 NCBDB" / "接 NCBDB" / "資料層用 NCBDB", the target is NOT a local JSON shim — it is the project's existing NoCodeBackend instance `54686_esg_go_userdb`. Use the local shim ONLY as a fallback when no API key is set.
- Root project already has `src/lib/ncb-utils.ts` exporting `ncbQuery<T>({table, method, body, params})` → `GET ${NCB_API_ENDPOINT}/db/54686_esg_go_userdb/${table}` with `Authorization: Bearer ${NCB_API_KEY}`.
- DB instance is HARDCODED `54686_esg_go_userdb` (do not read from a made-up env var that guesses the instance).
- No API key → `ncbQuery` returns `[]` (simulation mode, non-fatal).
- For sub-projects (e.g. Learning Center), create a sibling client (`src/ncb-client.js`) mirroring the same endpoint/instance/auth, supporting the sub-project's collections.

## Core architecture (CRITICAL — gets build failures wrong if ignored)
Separate the **client shim** from the **server store** so the client bundle never imports Node `fs`.

| File | Role | Imports `fs`? |
|------|------|---------------|
| `src/lib/firebase.ts` | CLIENT shim (used by client components + some routes) | **NO** — uses `localStorage` (browser) / `globalThis` memory (SSR) |
| `src/lib/local-store.ts` | SERVER store (API routes only) | YES — JSON files under `data/` |
| `src/lib/firebase-admin.ts` | SERVER admin stub → delegates to local-store | NO (imports local-store, which has fs) |
| `src/lib/auth.ts` | CLIENT auth → `LocalUser` + `localStorage` session | NO |

Export surface to preserve for zero call-site rewrites:
- firebase.ts: `db`, `collection`, `doc`, `getDocs`, `getDoc`, `query`, `where`, `orderBy`, `limit`, `addDoc`, `setDoc`, `deleteDoc`, `onSnapshot`, `writeBatch`.
- firebase-admin.ts: `adminDb` (chainable `collection().doc().get/set/delete` + `runTransaction`), `getAdminApp`, `getAuth` (Firebase Auth methods throw "disabled" so call sites degrade).
- auth.ts: `signInWithGoogle`, `signInWithEmail`, `signUpWithEmail`, `signOut`, `onAuthChange`, `getCurrentUser`, `isAuthenticated`, `type User = LocalUser`.

## Pitfalls (learned the hard way — each caused a failed gate)
1. **Never let the client shim import `fs`.** If `src/lib/firebase.ts` imports `./local-store` (which uses `fs`), every client component pulls `fs` into the browser bundle → `Module not found: Can't resolve 'fs'`. Keep client shim dependency-free; server routes import `./local-store` directly.
2. **`onSnapshot` has no local equivalent.** Simulate with `setInterval` polling (~2s) + optional `BroadcastChannel` for cross-tab. Return an unsubscribe fn.
3. **`writeBatch` / `runTransaction`** — implement as in-memory op queues flushed on `commit()`.
4. **`getDocs` return shape** — Firebase returns `QuerySnapshot` with `.docs[]` AND `.forEach()`. Your shim MUST provide BOTH or existing `snapshot.forEach(doc => doc.data())` breaks.
5. **`DocRef` constructor param collision** — do NOT name a ctor param `private collection` if the class also has a `collection(sub)` method; TS throws `Duplicate identifier 'collection'`. Use `_collection`/`_id`.
6. **`search_files` regex with `(`** — rg aborts with `regex parse error: unclosed group` on unescaped `(`. Use plain strings (no parens) or escape them. e.g. search `from 'firebase` not `(from|import).*firebase`.

## Execution steps
1. Inventory: `search_files` for `firebase`, `firebase-admin`, `google-cloud`, `cloudsql`, `firebase/firestore`, `firebase/auth`, `@google/genai`.
3. **Learning Center sub-project**: the skill's default is to respect `apps/learning-center` AGENTS.md (Firebase mode must stay) and SKIP it. **BUT** the user can OVERRIDE this with an explicit authorization like "確保 Learning Center 裡正在用的網頁以及資料庫都可以無縫轉移" — that means DO migrate it. The correct seamless approach (proven this session):
   - LC is a SEPARATE repo/checkout (`C:\Project\esggo-learning-center`, Next.js; its AGENTS.md describes an older Vite build — ignore that stale doc).
   - LC's `src/db.js` already has a 3-layer fallback: `useFirebase && db` → `localStorage`. **Insert NCBDB as a MIDDLE layer** (`useFirebase && db` → `useNcb` → `localStorage`) so the live Firebase path stays INTACT (no downtime) and NCBDB activates only when `VITE_NCB_API_KEY` is set.
   - Add `migrateLocalToNcb()` that copies existing localStorage records into NCBDB on app boot (guarded by `useNcb` — skips silently when no key). Call it in `App.jsx` init `useEffect`.
   - **NCBDB table naming (CRITICAL pitfall)**: do NOT reuse the Firebase collection path as a table name (e.g. `platforms_${appId}_submissions`). The real NCBDB uses FLAT table names. For LC-specific data use a `lc_` prefix to avoid colliding with root-project tables (`user_profiles`, `village_members`, etc.): `lc_submissions`, `lc_profiles`, `lc_tas`, `lc_pairings`. Root instance is `54686_esg_go_userdb`.
   - Set `VITE_NCB_API_ENDPOINT` / `VITE_NCB_DB_INSTANCE` / `VITE_NCB_API_KEY` in `.env` (KEY LEFT EMPTY — user fills the real secret; app degrades to localStorage until then). `.env` is gitignored; never commit secrets.
4. Build shims from `templates/` below.
4. Rewrite call sites: `from 'firebase/firestore'` → `from '@/lib/firebase'`; `from 'firebase-admin/auth'` / `firebase-admin/firestore` → `from '@/lib/firebase-admin'`; `from 'firebase/auth'` → `from '@/lib/auth'`; `type User from 'firebase/auth'` → `from '@/lib/auth'`.
5. Remove deps from root `package.json` (`firebase`, `firebase-admin`), then `pnpm install --no-frozen-lockfile`. Sub-project package.jsons that still need firebase are left alone (workspace install keeps them; only root removal matters for the build).
6. **Validation gates (do not skip, in order):** `pnpm run typecheck` → `pnpm run test` → `pnpm run build`.

## What each gate catches
- **typecheck**: missing `.delete()`/`.limit()` on refs, `forEach` absence, `doc.data() as OmniNote` direct cast (use `as unknown as OmniNote`).
- **test**: `Cannot find package 'firebase/firestore'` in route files you missed (vitest resolves imports at load).
- **build**: client-bundle `fs` leakage, missing `app`/`getAuth` exports from `@lib/firebase`.

## Autonomous-execution note
When the user grants "最佳實踐處理 / 下一步 / 繼續" with a GCP-removal intent, execute the full pipeline above without re-asking, but respect sub-project AGENTS.md protections and stop at a verification gate if a build error reveals a missed call site — fix and re-run the gate.

## References
- `references/firestore-shim-api.md` — exact compatible API surface (signatures).
- `references/ncbdb-schema.md` — NCBDB instance, query shape, FLAT table-name rules, `lc_` prefix convention, migration pitfalls.
- `templates/local-store-server.ts` — server JSON store (fs-based).
- `templates/firebase-client-shim.ts` — zero-fs client shim with onSnapshot + writeBatch.
