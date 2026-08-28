# ESG-GO CI 修復指引 v1.0

## 目標
一次性修復 OmniCore CI 的 Vitest / ESLint / TypeScript 失敗，並清理 dump-env 殘留。

## 前置條件
- 已安裝 GitHub CLI 並登入：`gh auth status`
- 本機有 `C:\Project\esggo` repo
- 有 `DingJun1028/esggo` 的 write 權限

## 步驟 1：建立修復分支
```powershell
cd C:\Project\esggo
git checkout main
git pull origin main
git checkout -b fix/ci-vitest-eslint-node24
```

## 步驟 2：升級 GitHub Actions Node.js
檔案：`.github/workflows/ci.yml`

將所有 `actions/checkout@v4` 改為 `actions/checkout@v4`（若無 v5 暫時維持 v4，但加上 `FORCE_JAVASCRIPT_ACTIONS_TO_NODE24=true`）
在 env 區塊加入：
```yaml
FORCE_JAVASCRIPT_ACTIONS_TO_NODE24: "true"
```

## 步驟 3：修復 src/impl/core.ts
- 移除未使用的 import：`ITaskSpec`、`ITaskResult`、`OmniTag`
- 修復未使用的 `idx` 參數：改為 `_idx` 或移除
- 修復 `as any` 類型：
  - L202：補齊 `IBusEvent` 泛型
  - L234：補齊 `IMartialLawEvent` 型別
  - L296/L304：補齊 `IBusEvent` 型別

## 步驟 4：修復 src/agents/twelve-omni/omni-bus.ts
- L27：補齊 `handlers` Map 型別
  ```typescript
  private handlers: Map<string, SubscriptionId[]> = new Map();
  ```

## 步驟 5：修復 src/agents/twelve-omni/omni-api.ts
- L29：補齊 Map 型別
  ```typescript
  private endpoints: Map<string, APIEndpoint> = new Map();
  private circuitStates: Map<string, CircuitState> = new Map();
  private rateLimitCounters: Map<string, RateLimitCounter> = new Map();
  ```

## 步驟 6：驗證
```powershell
pnpm lint
pnpm typecheck
pnpm vitest run --reporter=verbose
```

## 步驟 7：Commit 與 Push
```powershell
git add .
git commit -m "fix: resolve ESLint any/unused vars, TypeScript errors, and Node 24 warnings"
git push origin fix/ci-vitest-eslint-node24
```

## 步驟 8：建立 PR
```powershell
gh pr create --repo DingJun1028/esggo --title "fix: CI Vitest/ESLint/TS and Node 24 migration" --body "## Summary`n- Fix unused imports in src/impl/core.ts`n- Fix any types in omni-bus.ts and omni-api.ts`n- Add FORCE_JAVASCRIPT_ACTIONS_TO_NODE24`n`n## Test Plan`n- [x] pnpm lint`n- [x] pnpm typecheck`n- [x] pnpm vitest run"
```

## 步驟 9：清理 dump-env 殘留（可選）
```powershell
gh workflow run delete-branch.yml --repo DingJun1028/esggo -f branch=temp-dump-env || echo "skip"
# 手動刪除 workflow 檔案
Remove-Item .github/workflows/dump-env.yml, .github/workflows/reset-db-pw.yml -ErrorActionSilentlyContinue
git add .github/workflows/
git commit -m "chore: remove dump-env and reset-db-pw workflow remnants"
git push origin fix/ci-vitest-eslint-node24
```

## 驗收標準
- CI 全部綠色
- Vitest 通過
- ESLint 0 warning
- TypeScript 0 error
