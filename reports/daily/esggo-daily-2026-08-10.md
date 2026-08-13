# ESG-GO 每日報告 — 2026-08-10 18:00 (UTC+8)

> agent:20 報吿投遞 · p3 · platform:omni · best-practice:結界
> 探測方式：純 Web (curl/HTTPS)，未使用 SSH。Firecrawl 額度不足 → 改用 curl 直測。

## 1. VPS / 服務健康（Web 探測）

| 端點 | HTTP | 狀態 | 佐證 |
|---|---|---|---|
| https://esggo.co | 200 | 🟢 正常 | `<title>ESGGO — 永續發展無限進化</title>`, server: cloudflare, cf-cache: DYNAMIC |
| https://omniagent.esggo.co/health | 200 | 🟢 正常 | `{"status":"healthy"}` |
| https://omniagent.esggo.co/status | 200 | 🟢 正常 | v0.14.1, Ubuntu 24.04, uptime 9933s (~2.76h), active_workers 8, mem 10.76MB |
| https://omniagent.esggo.co/ (root) | 404 | 🟡 預期 | 無 root route，僅 /health /status |
| https://translate.esggo.co | 200 | 🟢 正常 | 萬能即時雙語字幕頁面正常渲染 |
| https://translate.esggo.co/health | 200 | 🟢 正常 | `{"status":"ok","version":"1.5.0"}` |
| https://translate.esggo.co/metrics | 200 | 🟢 正常 | uptime 1305s, rss 74MB, sse_clients 0, stt_port 8791 |
| **https://live.esggo.co** | **502** | **🔴 異常** | `nginx/1.24.0 (Ubuntu)` 回 502 → 上游 :8787 (omni-blueprint-hub) 未運行 |
| https://live.esggo.co/healthz、/stream、/studio.html | 502 | 🔴 同上 | 全站上游死 |
| ut / api / hub / learn .esggo.co | 000 | ⚪ 未解析 | 無此 DNS（非故障） |

**結論**：對外 3/4 服務健康；`live.esggo.co`（omni-blueprint-hub）全站 502。

## 2. OA-Team 30 蜂群協作層

| 節點 | 狀態 | 今日佐證 |
|---|---|---|
| OA-Local | ✅ | 本機 repo main 乾淨（僅 15 個未追蹤 patterns/*.ts） |
| OA-Team (CrewAI) | 🟢 | `oa-team-crewai/` 存在，`agents/*.jsonc` **實測 30 個**，`crew.jsonc` 在位 |
| OA-VPS | 🟢 部分 | omniagent gateway online (8 workers)、UT v1.5.0 online；blueprint-hub 掛 |
| OA-TWINS | 🟡 定義入冊 | 記憶雙路徑✅，事件互聯經 OAB；本輪無新事件證據 |
| OAB broker | 🟡 | 本機 `oa-twins/oab/broker.py` 在位；VPS 運行狀態**無法驗證**（需 SSH，本輪禁用） |
| Auto-Repair | 🟢 | OA-TWINS Auto-Repair 今日 4 次執行全 success (09:41–09:48Z) |

⚠️ 誠實聲明：OAB broker 於 VPS 的活性、journal 寫入狀況本輪**未取得證據**（禁 SSH 且無對外 HTTP 端點）。建議為 OAB 開 `/oab/health` 讓 Web 探測可覆蓋。

## 3. 異常與待辦

### 🔴 P0-1 live.esggo.co 502（omni-blueprint-hub 死）
- nginx 存活、上游 :8787 無回應。
- 今日 09:42Z 部署日誌的 pm2 restart 清單只有 `esggo-core(0) / stt-whisper(5) / deerflow(11) / universal-translator(12)` — **omni-blueprint-hub 不在 pm2 清單中**（已 stop/delete）。
- 處置：`pm2 start /opt/esggo/apps/omni-blueprint-hub`（需人工/授權 SSH）。

### 🔴 P0-2 Deploy to Oracle VPS 失敗（run 31375751987）
- job `Deploy to VPS` → step `Deploy direct` exit 1。
- 根因：`[PM2][ERROR] Process 1 not found`（`omniagent-gateway`），隨後 pm2 CLI 崩潰
  `TypeError: Cannot read properties of undefined (reading 'pm2_env')` @ `pm2/lib/API.js:1718`。
- 註：服務本身仍活（/health 200）— 是 **pm2 進程表與 ecosystem 名稱漂移**，非服務故障。
- 處置：deploy 腳本改 `pm2 startOrReload ecosystem.config.cjs --update-env`，避免按 id restart；或先 `pm2 delete omniagent-gateway || true`。

### 🟠 P1-1 CI 紅：OmniCore CI + 🌌 Sacred Pipeline（同因）
- 根因（實測日誌）：`Error: No test suite found in file /home/runner/work/esggo/esggo/apps/universal-translator/test/ut.test.mjs`
- `ut.test.mjs` 是 **node:test** 檔（`import { test } from 'node:test'`，跑 `node --test`），卻被根 vitest 抓取。
- 統計：`Test Files 1 failed | 44 passed | 3 skipped (48)`。
- 修法（一行）：`vitest.config.ts` 的 `exclude` 加 `'apps/universal-translator/test/**'`（與既有 `esggo-omni-center/**`、`**/__test__/**` 同慣例）。
- 本輪**未修改/未推送**：本任務授權為「僅 Web 探測」，不做程式碼變更。

### 🟡 P2 其他
- 開啟中 PR 8 支，含 #584 `Sentinel: [CRITICAL] Remove hardcoded API key from gateway config` — 安全類，建議優先處理。
- 本機 15 個 `packages/omni-agent-bus/src/patterns/*.ts` 未追蹤（§12 進階整合模式落地檔），待決定提交或清理。
- Firecrawl 額度耗盡 → web_extract 全數 Payment Required；Web 探測已改 curl，建議長期改用 curl 探測腳本以免額度綁死。

---
Traceable: source_origin=cron[agent:20] · Trackable: run ids 31375752048/31375751993/31375751987 · Transparent: 全數據為當輪 curl + gh 實測輸出 · Trustworthy: 本檔為當日快照
