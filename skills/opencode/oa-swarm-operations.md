---
name: oa-swarm-operations
description: OA-Team 蜂群運維總技能 — 雙生代理+決策樹+共享記憶+實戰日課 一鍵喚醒與部署。
---

# OA-Team 蜂群運維總技能 (oa-swarm-operations)

合併 `oa-dual-agent-obsidian`(§18) + `oa-delegation-tree`(§19) + `oa-shared-memory`(§20) + §21 實戰日課。
喚醒 OA-Team 蜂群、配置雙生拓撲、判定委託歸屬、部署共享記憶、排程日課時載入此單一技能即可。

## When to use
- 任何涉及 OA-Team 蜂群實際運轉、部署、排程、委託判定的任務
- 接手新蜂群專案需要一次性載入全部運維脈絡
- 決定任務該「自動跑 / 半自動 / 交人工 / 拒絕」

## 模組一：雙生代理拓撲 (§18)
- 雲端助理 = 01蜂后+20運營+27安全（always-on, VPS）
- 本機實習生 = 15文案+13圖像+14動畫+25測場（用戶在場）
- 知識花園：Obsidian vault `Agents/` 共享資料夾 + Sync Headless
- 權限分離：助理讀全 vault，寫僅 `Agents/`；改他區需顯式授權

## 模組二：委託決策樹 (§19)
三問 + 紅線：
```
Q1 可逆? 否→H3人工主導(禁自動). 是→Q2
Q2 高頻(≥每週1)且低風險? 是→H0全自主(cron/n8n). 否→Q3
Q3 中風險且可回滾? 是→H1代行回報/H2授權. 否→H3會同
Q4(先過): 觸KillSwitch(restricted外洩/憑證暴露/未授權篡改/熵>0.3/偽造證據)→H4凍結
```
成熟度四閘：M3治理化 / 可逆性證明 / 熵<0.1 / 5T拒絕率<5%，全過才可入無作元狀態 `WUZUO`。

## 模組三：共享記憶後端 (§20)
- 架構：`OA-Team蜂群 → memory.esggo.co/gateway/ → nginx:80 → {:8420 core | :8125 panel}`
- 三件套：tdai-memory-core + tdai-memory-hub + tdai-proxy
- 本機起站：`cd esggo/apps/tencentdb-memory && cp .env.example .env && chmod +x start-*.sh _lib.sh && ./start-all.sh`
- 生產部署（Groq 路徑）：`export GROQ_API_KEY=gsk_xxx && bash deploy.sh`（VPS + Cloudflare Tunnel，不裸開端口）
- **自託管路徑（現為預設，零 API 成本）**：VPS 本機 Ollama（`gemma4:e4b`+`nomic-embed-text`），腳本已改 `NETWORK=host` + `embedding=ollama`。詳見 `tencentdb-agent-memory` skill `references/tencentdb-global-images-vps-2026-08.md` 的「Ollama 自託管路徑」節。已知限制：memory-core 啟動探測拿 `dimensions=0` 時 `embeddingService` 仍 false（源碼層時序問題，vectorStore+bm25 仍可用），部署時誠實報告，勿假稱 embedding 已通。
- `.env` 不進 git；admin key 存 `.admin-key`；CRLF 陷阱 `sed -i 's/\
$//' .env`

## Soul canon 章節附加模式（3 層，用戶反覆要求）
用戶對 OA-Team 靈魂核心聖典（soul.md / soul-full.md）的每一章追加，慣例要求**同時產出 3 層實體**：
1. **主典章**：併入 `esggo-omni-center/soul-full.md`（v0.6 全書終版，§一~§五 + §13~§N 委製附錄；終章封印仍最高律法，新章以「§N 用戶委製附錄」格式接於前章之後，不逾其界）。
2. **落檔備份**：`C:\Project\esggo-learning-center\soul-chapter-NN-<slug>.md`（agent 對 `C:\Project\esggo` 可能無寫入權限，落檔點用 esggo-learning-center）。
3. **可喚醒技能**：`oa-*` 技能（description 須 ≤60 字觸發句，超長會被拒；技能 body 放細節）。

> 組別命名以 soul-full.md v0.6 為真值（智庫聖所 1-6 / 符文契約 7-12 / 光之羽翼 13-18 / 煉金熵減 19-24 / 5T 驗算 25-30），勿用 v0.5 舊名（策略/技術/創意/營銷/守衛）。
> 主典改動須 commit + rebase origin/main + push（注意 `.Jules/palette.md` 因 `core.autocrlf=true` 常被誤判 dirty，必要時 `git checkout --` 後再 rebase）。

## 模組四：實戰日課 (§21)
cron 範本（VPS 常駐）：
```bash
30 5 * * *  ubuntu  cd /opt/esggo && oa-cli brief --out Agents/briefing/$(date +\%F).md
0  6 * * *  ubuntu  cd /opt/esggo && oa-cli triage --delegate inbox-triage/
0  2 * * 0  ubuntu  cd /opt/esggo && oa-cli forge --entropy -3% --weekly
*/15 * * * * ubuntu  ssh 161.118.248.180 'cd /opt/esggo/apps/tencentdb-memory && ./verify.sh'
```
雙生共用 `memory.esggo.co/gateway/`，軌跡跨雲端/本機同一 trace_id。

## 5T 互引（全模組貫穿）
- Traceable: 產物帶 `source_origin` + `co_authors`
- Trackable: 生命週期 Hook 軌跡沉於 §20 共享記憶
- Tangible: 晨報/Panel 可視化，用戶可感
- Transparent: 決策邏輯與部署公開，零幻覺可驗
- Trustworthy: `.env`/禁區不進 git；寫入即 `Object.freeze()`

## Pitfalls
- CRLF 陷阱：Windows 編 `.env` 須 LF，否則 `$'\r': command not found`
- 勿裸開端口：生產必經 Cloudflare Tunnel + nginx :80
- 憑證禁區：`.env`/`.admin-key` 不進 git，變更走 H3
- 不可逆禁自動：已釋出產物重寫屬 §一 1.2 禁區，決策樹必拒
- CrewAI `gen_agents.py` 勿硬編 LLM：保持環境變數驅動（CI 用 CREWAI_API_KEY）

## VPS 部署實戰 (oa-swarm) — 本機/VPS 雙路徑拓撲
> ⚠️ 反覆踩坑：VPS 上有**兩份** oa-swarm，編錯那份等於沒部署。

- **pm2 實際跑的是 `/var/www/esggo/apps/oa-swarm`**（不是 `/opt/esggo/oa-swarm` git repo）。
  `/opt/esggo` 是 git 工作樹，改它不會影響線上服務。部署務必 scp 到 `/var/www/esggo/apps/oa-swarm/src/`。
- **oa-swarm 監聽 port 8788**（不是 8808/8800）。health 檢查用 `curl localhost:8788/`。
- **`pm2 delete oa-swarm` + `start` 會 EADDRINUSE**：舊進程仍佔 8788。
  正確重啟 = `fuser -k 8788/tcp; sleep 2; pm2 restart oa-swarm`（勿 delete）。
- **VPS Ollama 只有 `qwen2.5:14b`**（無 3b）。callLLM 預設 `qwen2.5:3b-instruct` 會 45s timeout 才 fallback MOCK。
  設 `OLLAMA_MODEL=qwen2.5:14b` 環境變數（ecosystem.config 或 .env）用真實推論。
- **型別守門**：`/var/www` 那份缺 `types/generated/esggo-shared.d.ts`（舊部署未跑 generator）。
  scp 本機 generator 產物過去，否則 tsc 報 `Cannot find module '../types/generated/esggo-shared.js'`。
- 部署清單：`scp src/*.ts` → `cd /var/www/esggo/apps/oa-swarm && npx tsc -p tsconfig.build.json` → `fuser -k 8788/tcp; pm2 restart oa-swarm` → `curl localhost:8788/ -w HTTP%{code}`。

## Verification
- 共享記憶：`docker ps` 三 `tdai-*` healthy + `curl /health` 回 `{"status":"ok"}`
- 決策：任務跑 `decide()` 命中 H0–H4 需可追溯至 Q1–Q4 枝
- 日課：cron 執行軌跡經共享記憶上鏈，跨晝夜同一 trace_id
