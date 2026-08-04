# OmniCore CI Fix — Round 2 接手說明（READ ME FIRST）

> 產生時間：2026-08-02（cron job，Hermes）
> 狀態：**fix2 已備妥、尚未執行**（cua-driver session 結束，無法自動 GUI 執行）

## 背景
- 第一輪已完成並推送：分支 `fix/omnicore-ci`、PR **#416**（commit `0d19084`，76 檔）
- 比對 repo 檔案樹後發現第一輪「全 app/api route.ts 的 `@/lib/` → `@lib/`」**過度替換**：
  - tsconfig：`@/*` → `./src/*`、`@lib/*` → `./lib/*`（兩層都存在，原 import 多數合法）
  - 真正 broken 僅 **9 個目標**（src/lib 不存在）：`adk/arvo-wings-agents`、`adk/ten-wings-agents`、`core/5t-protocol`、`services/adk/apostle-dispatcher-server`、`services/adk/apostle-squad-manager`、`services/esg/DataOrchestratorServer`、`services/esg/ReportGeneratorServer`、`services/google-drive`、`services/ncbdb`
  - 誤改 **21 個目標**（src/lib 原本就有；其中 15 個 lib/ 下根本不存在 = 新 broken）：
    `api-utils`(65 檔)、`agnes-api`、`ncb-client`、`esg-sonnar`、`five-t-protocol`、`celestial/implementation`、`cloudflare`、`omni-core`、`omni-core/omni-kernel`、`omni-core/entropy-forge`、`storage-service`、`omni-base/plugin-registry`、`prisma`、`village-seeder`、`rate-limit`、`zkp-service`、`firebase`、`omni-agent`、`omni-theme`、`sustain-write`、`sustain-write/omni-tag`

## 如何完成修正（二選一）

### 方式 A：雙擊執行（推薦，30 秒）
1. 開啟檔案總管：`C:\Project\esggo-learning-center\cron-fix-logs\`
2. **雙擊 `omnicore-fix2.bat`**（會自動跑 `omnicore-fix2.ps1`）
3. 完成後查看 `cron-fix-logs\omnicore-fix2.log`：
   - 預期 `@lib/ targets NOT existing in lib/` = **0**
   - 預期 `@/lib/ targets NOT existing in src/lib` = **0**
   - 會自動 commit + push + `gh pr edit 416 --body-file`（修正 body 編碼亂碼）
4. PR #416 會自動更新，CI 重跑

### 方式 B：下次 Hermes 互動時請 agent 執行
> 說：「執行 C:\Project\esggo-learning-center\cron-fix-logs\omnicore-fix2.bat 並讀取 omnicore-fix2.log 回報」

## 已知 CI 狀態（PR #416, commit 0d19084）
- ✅ TypeScript Check / ESLint / Secret Scan / GitGuardian / agents.yaml Verification
- ❌ Vitest Tests（Build Check 因 `needs` 依賴被 skip；Vitest 失敗原因待 fix2 本機診斷）
- ❌ build / build-and-test / check-types-sync / Code Quality / Security Scan / Workers Builds / 原罪煉金（部分為其他 workflow 既有問題）
- ⚠️ Validate VPS Scripts 失敗（非 Docker syntax check 區塊，待查）
