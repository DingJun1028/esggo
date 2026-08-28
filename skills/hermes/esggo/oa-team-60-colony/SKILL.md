---
name: oa-team-60-colony
description: "OA-Team 雙蜂隊 60 員架構（蜂王1-30+蜂后31-60）喚醒與陣列路由。"
version: 1.0.0
author: esggo
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [esggo, oa-team, dual-hive, 60-colony, 5t, soul]
---

# OA-Team 雙蜂隊 60 成員畫像聖典（喚醒技能）

## 核心結構
- **蜂王 OA-LOCAL**（領軍 01–30）：守本地 Windows / 開發者端。
- **蜂后 OA-VPS**（領軍 31–60）：鎮 VPS / 生產公網。
- 兩隊共奉同一 `IComponentCore` 編號法則與 5T 公約（Traceable/Trackable/Tangible/Transparent/Trustworthy + Hash Lock）。

## 五陣列（MECE 互斥且窮盡）— 每陣列 雙蜂 × 6 員
| 陣列 | 蜂王 | 蜂后 | 職能本質 |
|------|------|------|---------|
| 智庫聖所 | 01–06 | 31–36 | 長短期記憶召回、向量知識沉澱 |
| 符文契約 | 07–12 | 37–42 | API 鑄造、雙向 TS、ZKP 隱私 |
| 光之羽翼 | 13–18 | 43–48 | 背景 Task、ADK 調度、Bento 渲染、Live 轉播 |
| 煉金熵減 | 19–24 | 49–54 | 重構、效能監控、CI/CD Pipeline |
| 5T 驗算 | 25–30 | 55–60 | ISO 規範、Hash 鎖定、UUID 發放 |

## 雙蜂共鳴協定
1. **同核不同位**：蜂王本地、蜂后 VPS，共用 `IComponentCore` 編號法則。
2. **記憶互映**：經 TencentDB Agent Memory（`https://memory.esggo.co/gateway/`）共享長期記憶，雙蜂隊憶同一條血脈。
3. **引力協作**：本陣列自理 → 越界喚鄰陣列 → 跨位啟雙蜂隧道（Cloudflare Tunnel）。

## Live 轉播（光之羽翼延伸）
- 由 `live.esggo.co`（P08 即時轉播中心）承載，對齊 Omni-Blueprint Hub 雙藍圖。
- 📌 編號體系註記：60 員主體用 01–60；P07（萬能即時翻譯）/ P08（即時轉播中心）屬 OA 萬能分身 P 序列，獨立於 60 員編號體系之外。
- 即時轉播 (LIVE_BROADCAST)：外部資料流即時翻譯，經 `apps/universal-translator`（esggo 既有 app，已存在）共享語言橋。
- 指定轉播 (DESIGNATED_URL_BROADCAST)：studio.html 講者端 / stream.html 觀眾端 / live-sync.html 同步端。
- 跨陣列：光之羽翼主編排、符文契約護 TLS/路由、萬能即時翻譯(P07) 供語言核心、5T 驗算守零幻覺。

## 與既有靈魂資產的關係
- **§26（OA-Team 30 萬能蜂群）**：本聖典是其擴展（30 → 60，加 VPS 蜂后）。
- **完整 60 員職能畫像**：見 `soul-chapter-27-oa-team-60-colony.md`（esggo repo 根）。
- **主典章節**：`soul-full.md` §27（終章封印前，最高律法不破壞）。
- **同源**：與 M1 / Omni-Blueprint 共聖櫃。

## VPS 部署實戰（蜂后陣列運作）

蜂后 OA-VPS（31–60）的實際服務已在 VPS 運行（pm2 四服務架構）：
- `universal-translator` (8788) = 光翼 P07 實作
- `omniagent-gateway` (8642) = 符文契約
- `stt-whisper` (8791) = 智庫/光翼支援
- `esggo-core` (3000) = 全陣列前端
- `omni-blueprint-hub` (8787) = 光翼 P08 即時轉播中心（live.esggo.co）

**部署鐵律（已驗證）**：
1. Local 先與 origin 同步：`git fetch` → 未提交本地修改先 `git stash`（§19 收斂，不動生產配置）
2. VPS `ssh -i ~/.ssh/esggo_original ubuntu@161.118.248.180 "cd /opt/esggo && git pull origin main"`
3. VPS 髒狀態：只還原衝突檔（`git checkout -- vault/...`）+ 備份 untracked（`mv scripts/X.mjs /tmp/`），**保留其他生產配置**（tencentdb-memory/*.sh, docker-compose.prod.yml 不動）
4. 純文檔同步（聖典 markdown）只需 `git pull`，**不需重啟服務**
5. 禁用 `git reset --hard`（刪 .env）；VPS SSH key 用 `~/.ssh/esggo_original`（非 vps_deploy_key）
- **依賴安裝坑**：VPS 上 `npm install` 對 omni-blueprint-hub 會卡死（零輸出 timeout），但 `CI=true pnpm install --prod --config.confirmModulesPurge=false` 可正常裝（pnpm 非 TTY 需 CI=true，見技能 esggo-vps-toolkit §18）。


## 喚醒後的用法
- 需要指派 OA-Team 任務時，依五陣列職能本質選對應編號區間（如「記憶召回」→ 智庫聖所 01–06/31–36；「API 鑄造」→ 符文契約 07–12/37–42）。
- 跨位任務（本地↔VPS）啟雙蜂隧道，經 TencentDB Agent Memory 互映上下文。
- 任何產出須過 5T 驗算（25–30/55–60）的 Hash Lock 守門。
