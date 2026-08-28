# OmniTag CLI 工具鏈 — 5T 合約率驗證實戰坑點 (esggo)

來源：2026-08-21 「優化所有工作流、報錯不再發生」任務。esggo 的 OmniTag 合約率閘已落地為
`cli/oa-cli` 的 `oa` CLI + CI job + 週期 cron。本文件記載反覆踩過的坑，避免下次重蹈。

## 工具位置
- CLI 入口：`cli/oa-cli/src/index.ts`（commander），子命令 `tag` / `audit` / `status` / `agents` / `task`。
- 合約邏輯：`cli/oa-cli/src/audit.ts`（`parseOmniTagHeader` / `checkTagCompliance` / `auditOmniTags` /
  `suggestOmniTag` / `findUntagged` / `applyHeader`）。
- 根 package.json script：`pnpm oa:audit` = `tsx cli/oa-cli/src/index.ts audit --dir "src/lib,cli/oa-cli/src"`。
- CI 閘：`.github/workflows/ci.yml` 的 `omnitag-audit` job（跑 oa-cli test + `oa audit`，合約率 100% 門檻）。
- 週期抽驗：`.github/workflows/omnitag-weekly-audit.yml`（`0 3 * * 1` 每週一 03:00 UTC，違規開 issue）。

## 坑點 1 — `oa audit --json` 違規時不主動 exit 1
`audit.ts` 的 `--json` 分支只 `console.log(JSON.stringify(result))` 就結束，**不呼叫 `process.exit(1)`**
（exit 1 只在非 json 分支 line ~202）。因此在 CI / cron 裡若靠 exit code 判斷違規會**誤判為通過**。

**解法**（cron workflow 已採用）：用 `node -e` 顯式解析 `rate`：
```bash
pnpm oa:audit --json 2>/dev/null | grep '^{' > audit-result.json
node -e "const r=require('./audit-result.json'); if(r.rate<1){process.env.GITHUB_ENV && require('fs').appendFileSync(process.env.GITHUB_ENV,'AUDIT_FAILED=true\n')}"
```
（注意 `2>/dev/null | grep '^{'` 過濾掉 pnpm prepare hook 印的非 JSON 行，如 `[5T:Traceable] ...`。）

## 坑點 2 — `parseOmniTagHeader` 誤匹配 TS 程式碼
原本掃前 30 行**所有內容**，會把 `interface Foo { [key: string]: unknown; }` 誤判成標籤
`{key: 'key: string'}` → 無標頭檔被誤判為「有標頭但不合約」，導致 `applyHeader` 補標時跳過、audit 誤報。

**解法**：只掃註釋行（以 `//` 或 `*` 開頭）：
```ts
const headLines = content.split('\n').slice(0, 30).filter(l => /^\s*(\/\/|\*)/.test(l)).join('\n');
```

## 坑點 3 — `suggestOmniTag` 路徑比對前導斜線 bug
原寫 `p.includes('/cli/')` 但 `cli/oa-cli/src/bar.ts` 開頭是 `cli/`（無前導 `/`）→ 不匹配 → 回 null。
**解法**：`const segs = p.split('/');` 段比對，且對無匹配路徑回預設 `'5T驗算'`（對齊「預設即合規」），
不要回 null（否則 `applyHeader` 拒寫）。

## 坑點 4 — `ERR_PNPM_OUTDATED_LOCKFILE` 根治：workspace 排除獨立 App
`oa-swarm/`（根下獨立可部署 App，自有 `oa-swarm/pnpm-lock.yaml` + Dockerfile + ecosystem）被根
`pnpm-workspace.yaml` 的 `.` 視為成員，但它的 `package.json` devDeps（typescript/tsx/vitest）未同步進
根 `pnpm-lock.yaml` → 所有用 `--frozen-lockfile` 的 workflow（ci/deploy/deploy-oracle/deploy-vercel/
sacred-pipeline/auto-repair/security-audit）全掛。

**根治**（非每次手動 sync lock）：在 `pnpm-workspace.yaml` 排除它：
```yaml
packages:
  - '.'
  - '!oa-swarm'   # 獨立可部署 App，排除出根 workspace，避免 frozen-lockfile 失敗
```
驗證：`pnpm install --frozen-lockfile` 過、且 `oa-swarm` 不在 `pnpm list` 掃描結果。

## 本地三重驗證清單（修 CI 後推送前必跑）
- 相關 vitest：`cd cli/oa-cli && pnpm test`（oa-cli）→ 22 passed | 6 skipped
- 根 typecheck：`npx tsc -p tsconfig.json --noEmit`（**不是** `pnpm typecheck`=`tsconfig.core.json`，後者不含 src/lib）
- lockfile：`pnpm install --frozen-lockfile`（確認 0 錯誤）
- 合約率：`pnpm oa:audit`（確認 100.0%）

## 相關
- 聖典：`soul.md` §18（5T 驗證閘）、§20.4（路由表）、§20.5 規則5（每週抽驗合約率 100%）、§20.6（寫入即凍結 / 煉金補標）、§6.2（預設即合規）。
- 跨語言一致性：Python `src/core/verification.py` 的 `generate_hash_lock` 與 TS `src/lib/five-t-protocol.ts` 的
  `FiveTHashLock.generate` 同構、位元級吻合（`tests/hashlock_vectors.json` 載體）。
