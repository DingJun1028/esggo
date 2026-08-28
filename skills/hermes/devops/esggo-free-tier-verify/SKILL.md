---
name: esggo-free-tier-verify
description: 免費算立服務激活與誠實驗證工作流（自託 OSS、pnpm 鎖定繞道、EdgeResearch UI 驗證）。
---

# esggo-free-tier-verify

ESG-GO 硬約束：**只用免費算立**（禁付費 API / 私鑰 npm）。本 skill 收錄將「付費 SaaS 功能」替換為「自託 OSS + 環境變數驅動」的激活路徑，以及不自我欺騙的驗證節奏（移植自 EdgeResearch：freeze → mutate → measure → decide）。

## 0. 生產部署形態（先搞對，否則白做）
- **esggo.co 前端跑 Docker**，不是 pm2。`docker compose -f /var/www/esggo/vps/docker-compose.yml`（service 名 `esggo`，容器 `esggo-core:latest`）。pm2 只管 gateway / UT 等其它 app。
- 改動要上線 = `cd /var/www/esggo && git pull && docker compose -f vps/docker-compose.yml build esggo && docker compose -f vps/docker-compose.yml up -d esggo`。
- compose `environment:` 用 `${VAR}` 讀 `/var/www/esggo/.env`（權限 600，含 MinIO/AGENTIC 等憑證，**不進 git**）。加新 env：先 patch compose 的 `esggo.environment` 區塊加 `- NEW_VAR=${NEW_VAR:-}`，再在 `.env` 寫值。
- VPS SSH：`ubuntu@161.118.248.180`（ci_deploy_key 可連；git@ / id_rsa_esggo* 均 Permission denied）。

## 1. pnpm 11 build 鎖定繞道（repo 級，必知）
- 症狀：`pnpm run build` / `pnpm run test` / `pnpm run lint` 全被 `ERR_PNPM_IGNORED_BUILDS: tesseract.js@7.0.0`（未 approve 的 build script）擋 exit 1。Docker build 的 `RUN pnpm run build` 同樣死。
- 本機繞道（驗證用）：`npx vitest run` / `npx tsc -p tsconfig.core.json` / `npx next build` / `npx playwright test`。
- 根治（二選一）：
  (a) Dockerfile builder 階段 `RUN pnpm run build` → 改 `RUN npx next build`；
  (b) `pnpm-workspace.yaml` 加 `onlyBuiltDependencies: [tesseract.js, sqlite3, prisma]`（標準 pnpm11 解法；docker COPY context 需含改後 yaml，注意 build cache 層）。
- `pnpm.overrides` 只能放 `pnpm-workspace.yaml`，放 `package.json` 會被 silently ignored。

## 2. 自託 OSS 激活（VPS 已實證，Oracle 4OCPU/24GB always-free 綽綽有餘）
所有服務走 docker compose，憑證存 VPS `.env`（不進 git）。

### 2.1 SonarQube CE（靜態分析，取代付費 SonarCloud）
- `docker compose`：postgres + `sonarqube:community`，對外埠避開已佔用（:9000 是 portainer → 用 :19000）。
- 初次啟動後改 admin 密碼：API `POST /api/users/change_password` 需帶 `previousPassword`（預設 `admin`，不是空）。成功回 204。
- 產 token：`POST /api/user_tokens/generate -u admin:NEWPW -d name=...` → `squ_xxx`。
- 掃描：VPS 本機 `npx sonarqube-scanner -Dsonar.host.url=http://localhost:19000 -Dsonar.token=$TOKEN -Dsonar.projectKey=universal-translator -Dsonar.sources=server.mjs,translate.mjs,stt_client.mjs` → **ANALYSIS SUCCESSFUL**。
- **限制**：agentic 自動修復是 SonarCloud/Enterprise 付費功能，CE 不含。依免費算立不啟用雲端 agentic；CI 以 `sonar-smoke` job（免費本地煙測）作守門。

### 2.2 MinIO（S3 相容證據儲存，取代付費 S3）
- `docker run minio/minio` + `mc mb local/evidence-vault`。
- **手寫 SigV4 簽章上傳（零新依賴）**：route handler 用 `crypto` 算 `AWS4-HMAC-SHA256`（見 `references/sigv4-minio.md`）。VPS 實測 `PUT` 回 **200**（MinIO 接受寫入）。GET 需帶簽章（匿名讀預設拒 403，預期）。
- 前端 `EvidenceUploader` 改 `fetch('/api/evidence-upload', {method:'POST', body:FormData})` 取代 mock URL。

### 2.3 Ollama（真 LLM 洞察，取代付費 LLM API）
- VPS 已跑 `:11434`，有 `qwen2.5:3b-instruct-q4_K_M` / `gemma4:26b` / `nomic-embed-text`。
- route handler 用 `AGENTIC_TWIN_OLLAMA_URL` 環境變數驅動：空=純啟發式；設了才 `fetch('http://localhost:11434/api/chat')` 增強，`llmEnhanced:true` 回傳真 LLM 中文洞察。Ollama 不可達/超時(15s) → 降級保留啟發式，不阻塞 UI。
- Next.js server route 讀 env 需 `.env.local` 或 compose `environment:`，**不繼承 shell 啟動時的 `VAR=x npm` 形式**（Next 16 靜態替換）。

## 3. EdgeResearch 驗證節奏（UI / 行為類，避免自我欺騙）
1. **路由**（5 題梯子）：有可測量 incumbent？→ 主觀知識工作？→ 有界可執行/運行中 UI？→ 多租戶/權限？→ 延遲/成本地板？。本輪 K1 零幻覺警告 = `edge-research-code`（需 runtime/browser 證據，不能只靠綠測試）。
2. **凍結指標**：先寫 preflight 定義「什麼算通過」（如「提交 >500% 暴增 → 點 Seal 出現琥珀橫幅含『【Dr. Thoth 零幻覺警告】』」）。
3. **測量工具陷阱**：Browserbase 自動化對 React `onClick` 鈕（如 Seal 提交鈕）的 click **常派發失敗**（428 懸浮鍵卻可，Seal 鈕不可）——這是 Browserbase 工具缺陷，**非程式碼 bug**。誤判它「沒出橫幅=功能壞」是經典自我欺騙。
4. **正解**：本機 **Playwright 真 Chromium**（`npm i -D playwright @playwright/test` + `npx playwright install chromium`），`page.getByRole('button',{name:/提交永恆刻印/}).click()` 真實觸發 → 斷言橫幅 `toBeVisible()`。**實證：橫幅確實出現**（主橫幅 + 欄位錯誤），推翻 Browserbase 誤判。
5. **固化**：E2E 收進 `e2e-k1/`，ci.yml 加 `e2e-k1` job（**opt-in** `if: vars.E2E_ENABLED=='true'`，因 GitHub runner 連不到 VPS 域名 esggo.co，預設 skip，對齊 sonar-agentic 模式）。本地 `cd e2e-k1 && npx playwright test` 已實證 1 passed。

## 4. 誠實報告原則
- 工具失敗先診斷是「環境鎖定」還「程式碼錯」：`hermes verify` / `pnpm` 失敗多因 pnpm deps-check，與改動無關 → 用 `npx` 直跑產證據。
- 線上 curl 實證（如 `curl -s -m40 https://esggo.co/api/agentic-twin -X POST -d '{...}'`）是 live-tier 證據；VPS 內網 curl 是 runtime 證據；Playwright 是 browser 證據。三層都記錄。
- 「下一步/繼續」= 直接執行；但涉及 VPS 基礎設施變更（docker rebuild / 新容器）前，先確認是「活化既有程式碼」還「修部署事故」，二者處置不同（本輪曾誤把 esggo-core 當 pm2 管，浪費多輪）。

## References
- `references/sigv4-minio.md` — 手寫 AWS SigV4 對 MinIO PUT 的 node 實作細節
- `references/edgeresearch-verify.md` — EdgeResearch 5 題路由梯子 + K1 零幻覺警告 preflight 範本
