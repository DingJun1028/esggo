# Firebase → local shim compatibility matrix (esggo GCP decoupling)

Context: 2026-08-25 session. Removed `firebase` + `firebase-admin` from root
`package.json`, rewrote server routes to NCBDB (`ncbQuery`), and built a
client-safe zero-`fs` shim at `src/lib/firebase.ts` so existing client `.tsx`
components keep working without GCP.

## Why a shim (not just NCBDB) for client code
NCBDB is request/response REST. Client components used Firestore realtime APIs
(`onSnapshot`, `query().onSnapshot`) that have no NCBDB equivalent. A local
shim (`localStorage` client / `globalThis` server) preserves the function
signatures so call sites only change the import path, not the logic.

## Required exports from the shim (`src/lib/firebase.ts`)
These names MUST exist or `pnpm build` fails with `Type error`:

| Name | Signature | Notes |
|------|-----------|-------|
| `db` | `{ __local: true }` | placeholder, replaces firebase app |
| `collection(_db, name)` | `→ CollectionRef` | |
| `doc(_db, name, id)` | `→ DocRef` | |
| `query(ref, ...constraints)` | accepts `CollectionRef \| QueryBuilder` | |
| `where(field, op, value)` | constraint fn | op: `== != > >= < <=` |
| `orderBy(field, dir?)` | constraint fn | |
| `limit(n)` | constraint fn | |
| `getDocs(q)` | accepts `CollectionRef \| QueryBuilder` → `QuerySnapshot` | |
| `getDoc(ref)` | `→ {exists,id,data}` | |
| `addDoc(ref, data)` | `→ {id}` | |
| `setDoc(ref, data)` | `void` | |
| `updateDoc(ref, data)` | `void` (merge) | calls `ref.set(data,{merge:true})` |
| `deleteDoc(ref)` | `void` | |
| `onSnapshot(ref, cb, onError?)` | `→ unsub()` | polls every 2s + BroadcastChannel |
| `writeBatch(_db)` | `{set, delete, commit}` | sequential ops |

## QuerySnapshot shape
```ts
class QuerySnapshot {
  docs: Array<{ id: string; data: () => DocData }>;
  get size(): number;          // firebase has .size
  get empty(): boolean;        // firebase has .empty
  forEach(cb: (doc) => void): void;
}
```
Both `size` and `empty` are REQUIRED — build errors `Property 'size'/'empty'
does not exist` if omitted.

## DocRef / CollectionRef gotchas
- `CollectionRef.doc(id?)` — id OPTIONAL (auto-gen via `Date.now()+random`);
  `village/vote/route.ts` calls `.doc()` with no id.
- `DocRef.set(data, opts?)` — 2nd arg optional; `updateDoc` passes `{merge:true}`,
  ignore it locally.
- `getDocs` / `query` / `onSnapshot` must accept `CollectionRef` OR `QueryBuilder`
  (call sites pass `collection(db,'x')` directly, not wrapped in `query()`).

## firebase-admin.ts local stub
```ts
export const adminDb = {
  collection(name): CollectionRef,
  doc(path): DocRef,            // 'col/id' or 'col/id/sub/subid'
  runTransaction: async (fn) => fn(new Transaction()),
};
export const adminAuth = {
  async verifyIdToken(_t?, _f?): Promise<never> { throw '[LocalMode] ...'; },
  async getUser(_uid?): Promise<never> { throw '[LocalMode] ...'; },
  async setCustomUserClaims(_u?, _c?): Promise<never> { throw '[LocalMode] ...'; },
};
```
`auth-claims.ts` / `unified-auth.ts` call these — make the methods accept
optional args so call sites typecheck, then short-circuit to `return null`
(graceful degradation) instead of calling them.

## Files that must switch import source
- `'firebase/firestore'` → `'@lib/firebase'`:
  `app/omni-center/{page,omni-calendar-view,rag-knowledge-manager,wuzuo-note-view,zkp-vault}.tsx`,
  `app/village/page.tsx`, `app/sustain-write/v5/page.tsx`,
  `app/api/{nexus,rag/query,rag/ingest}/route.ts`.
- `'firebase-admin/auth'` / `'firebase-admin/firestore'` → `'@/lib/firebase-admin'`:
  `auth-claims.ts`, `unified-auth.ts`, `claims/route.ts`, `surveys/route.ts`, `resources/route.ts`.
- `'firebase/auth'` (client) → `'@/lib/auth'` (local Auth with `User` type):
  `AuthProvider.tsx`, `LoginButton.tsx`, `user-profile.ts`.

---

# Learning Center 子專案 (獨立 repo) 實戰細節 — 2026-08-25

LC 是 **獨立 checkout** `C:\Project\esggo-learning-center`（Next.js + Firebase + Prisma），非 monorepo 子目錄。

## 架構事實
- `src/db.js` 已有完整雙層 fallback：`if (useFirebase && db) { ...firestore... } else { localStorage }`。
- 各 repository 層（`pairing.repository.js` 等）同款雙層結構。
- `.env` 的 `VITE_FB_*` 憑證**全空** → `useFirebase=false` → 線上實際跑 localStorage。

## 無縫插入 NCBDB 層的做法
1. 新增 `src/ncb-client.js`：`ncbSubmissions/ncbProfiles/ncbTAs/ncbPairings` 四個集合物件，各含 `get/set/list/delete`，對齊根專案 `ncbQuery` 介面，支援 `VITE_*` 與 `process.env.*` 雙源。
2. `src/db.js` 頂部：`import { isNcbEnabled, ncbSubmissions, ... } from './ncb-client';` + `export let useNcb = isNcbEnabled();`
3. 每個 CRUD 函式：`if (useFirebase && db) {...} else if (useNcb) { ncb 呼叫 } else { localStorage }`。
4. `subscribePairings` 加 `else if (useNcb)` 分支：輪詢 `ncbPairings.list(APP_ID)` 每 3s。
5. 新增 `migrateLocalToNcb()`：遍歷 localStorage 的 submissions/profiles/tas/pairings 寫入 NCBDB，使用者開網頁呼叫一次即完成遷移。
6. `.env.example` 加 `VITE_NCB_API_ENDPOINT` / `VITE_NCB_DB_INSTANCE` / `VITE_NCB_API_KEY`。

## Firebase 集合路徑（LC）
`platforms/{APP_ID}/submissions`、`platforms/{APP_ID}/profiles`、`platforms/{APP_ID}/tas`、`platforms/{APP_ID}/pairings`

## 驗證門檻（LC 獨立 repo）
- `pnpm run test` → 683 passed / 20 skipped（oa-swarm 靈魂執行鏈偶發 flaky timeout，與 db.js 無關，重跑即綠）
- `pnpm run build` 需 `DATABASE_URL` 佔位（Prisma validate-env 要求）+ `VITE_NCB_API_KEY` 設定值
- push 被拒時：`git pull --rebase origin main` 再 push

## Verification gate that actually passed
- `pnpm run typecheck` → exit 0
- `pnpm run test` → 66 files / 675 passed / 20 skipped
- `pnpm run build` → `✓ Compiled successfully` + `✓ Generating static pages (54/54)`
- Unrelated `libs/incremental/*` and `oa-swarm/*` edits were LEFT UNSTAGED
  (different task) — only the 30 GCP-removal files were committed.
