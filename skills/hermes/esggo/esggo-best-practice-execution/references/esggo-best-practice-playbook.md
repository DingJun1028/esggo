# esggo 最佳實踐實戰手冊（references）

配套 `esggo-best-practice-execution` SKILL.md。收錄本倉庫最佳實踐自主執行時可複用的命令與陷阱解法（來自 2026-08-13 系列 session）。

## A. 重播鑑別（Replay Guard）

當對話貼入舊 session 推理日誌，先核驗產物真實存在：

```bash
# 舊日誌常宣稱建立了這些，實際查無則為重播
search_files pattern=".devin" target="files"
search_files pattern="unified-auth" target="files"
search_files pattern="repair-engine-enhanced" target="files"

# 真實基線測量（取代舊日誌的誇大數字）
git ls-files '*.ts' '*.tsx' | wc -l
git ls-files | grep -E 'app/.*/route\.(ts|tsx)$' | wc -l
git grep -cE ':\s*any\b|as\s+any\b|any\[\]' -- 'app/api/**/*.ts' 'src/**/*.ts'
git grep -nE '\(error as Error\)\.message|error\.message' -- 'app/**/route.ts' | grep -vE 'console\.'
```

## B. 全域錯誤洩漏修補模式

根因：所有路由最終經 `jsonError()`（來自 `@lib/api-utils`）。在共用層加統一截斷 helper，再批次替換 call site：

```ts
// src/lib/api-utils.ts — 雙副本 (root + esggo-omni-center) 都要加
export function jsonErrorInternal(
  error: unknown,
  errorKey: ErrorCodeKey = 'INTERNAL_ERROR',
  status?: number,
): NextResponse {
  console.error(`[api] ${errorKey}:`, error);   // 伺服器端留存
  return jsonError(errorKey, undefined, status); // 回應不含原始 message
}
```

替換模式（用腳本 `node scripts/fix-error-leak.mjs` 批次，做完即刪除腳本）：
- `jsonError('INTERNAL_ERROR', (error as Error).message)` → `jsonErrorInternal(error)`
- `NextResponse.json({ error: error.message }, { status: 500 })` → `NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })`
- `const message = error instanceof Error ? error.message : 'Unknown error'; return jsonError('INTERNAL_ERROR', message)` → `return jsonErrorInternal(error)`

清理：修補腳本跑完立即 `rm -f scripts/fix-error-leak*.mjs`（熵減，不留技術債）。

## C. Vitest 測試 Next.js Route Handler 的三種可靠姿勢

```ts
// 姿勢 1：只斷言 status（最穩，適用認證守門拒絕情境）
const res = await POST(makePost(body));
expect(res.status).toBe(401);

// 姿勢 2：需讀 body 時用 text + JSON.parse（res.json() 在 vitest 回 undefined）
function parse(res: Response): Promise<any> {
  return res.text().then((t) => (t ? JSON.parse(t) : undefined));
}
const body = await parse(res);
expect(body.hashLock).toBeDefined();

// 姿勢 3：繞過 HTTP 層，直接測 service class（推薦給純邏輯，如 ZKPService）
import { ZKPService } from '../src/lib/zkp-service';
const res = ZKPService.verify('doc', hashLock);
expect(res.valid).toBe(true);  // 注意 verify 回 { valid: boolean } 非 boolean
```

ESM 頂層 env 綁定問題（守門讀 `const TOKEN = process.env.X`）：

```ts
import { describe, it, expect, afterEach, vi } from 'vitest';
describe('POST /api/omni/sync', () => {
  afterEach(() => { vi.unstubAllEnvs(); vi.resetModules(); });
  it('正確 token → 非 401', async () => {
    vi.stubEnv('OMNI_KEY', 'sync-token-abc');
    vi.stubEnv('GATEWAY_API_KEY', '');
    const { POST } = await import('../app/api/omni/sync/route'); // 動態重載
    const res = await POST(makePost(VALID_STATE, { 'x-omni-token': 'sync-token-abc' }));
    expect(res.status).not.toBe(401);
  });
});
```

## D. 代主固化工作流（commit + push + 追蹤）

```bash
# 1. 顯式檔案清單，禁止 git add -A
git add app/api/cron/route.ts esggo-omni-center/app/api/cron/route.ts \
        src/lib/api-utils.ts esggo-omni-center/src/lib/api-utils.ts \
        .env.production.example tests/json-error-internal.test.ts

# 2. 中文 commit message 用 heredoc 避免引號 EOF 錯
git commit -F - <<'EOF'
security(api): 全域錯誤洩漏清零 + cron/memory 路由認證守門

- 新增 jsonErrorInternal helper (5T Transparent)
- 修補 82 處 API 路由錯誤洩漏
EOF

# 3. push 鎖住（防 session 間修補消失）
git push origin main

# 4. 萬能分身追蹤（append 一筆）
cat >> .hermes/auto-repair/tracker-log.jsonl <<'EOF'
{"task_id":"SEC-API-LEAK-20260813","agent":"萬能分身(代主)","commit":"ab34a0cd2","scope":"app/api/**/route.ts","actions":["add jsonErrorInternal","patch 82 leaks"],"status":"done"}
EOF
```

## E. patch 工具逾時但實際生效的確認

`patch` 回 `timed out after 420s` 時，diff 多已寫入。驗證真實狀態再決定是否重試：

```bash
sed -n '189p' src/impl/core.ts          # 看目標行是否已是新內容
grep -c 'jsonErrorInternal' app/api/agnes/route.ts
```

若已生效，勿重試（重試會因 old_string 不匹配而失敗）。

## F. 刻意逃逸清單（不硬改，避免連鎖型別錯誤）

以下 `any` 保留為設計選擇：
- index signature `[key: string]: any`（擴充逃生口，改 `unknown` 會破壞所有呼叫方）
- 外部 JSON 邊界（`oracle-sync-service` 的 `any[]` / `(r: any)` 來自 Python 腳本回傳）
- 內部型別轉型（`bus.ts` 的 `cb as (event: any)`，因 omni-agent-bus 簡易型別 vs contracts 泛型）
- 已有 `eslint-disable-next-line @typescript-eslint/no-explicit-any` 標記處（如 `FnImpl`）
