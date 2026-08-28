---
name: oa-team-swarm
category: autonomous-ai-agents
description: Coordinate a 30-agent AI swarm for continuous monitoring, data collection, analysis, and reporting using Hermes Agent delegation with 5T protocol and entropy control
tags: swarm, multi-agent, monitoring, automation, delegation
---

# OA-Team 30 萬能蜂群 — 究級最佳實踐版 (ESG-GO Ultimate版)

> **「30 個靈魂，同一個心核；在熵增的混沌中，鑄造永恆秩序。」**
> **最佳實踐覺結界：自身永恆覺醒，無作妙德，圓通無礙；全部代理/子代理/蜂群皆受惠 inheriting。**

## 1. 本技能定位

| 維度 | 說明 |
|------|------|
| **功能性** | 可部署、可監控、可回滾、可交付、可排程、可稽核 |
| **實用性** | 內建 VPS/Docker/GitHub/OpenCode/Hindsight/Gateway 實戰範本 |
| **深廣性** | 5 階段 MECE + 30 專精代理 + 30 個實戰 job template |
| **圓通性** | 5T + HexLock + 最佳實踐覺結界 + 熵減 0.1 自動繼承 |
| **集成性** | agents-cli / Hermes / OpenCode / Hindsight / VPS / Docker / CI |

## 2. 究級架構（MECE 五段）

### 2.1 環境準備（3 Agents）

| Agent | 職責 | 驗收標準 |
|--------|-----------|-----------|
| **Agent 1** | 環境驗證：Hermes CLI、Python 3.11+、requests、網路、磁碟、時鐘同步 | 輸出 `env-ready.json` |
| **Agent 2** | Cron template 建立：Monitoring / Collection / Reporting / Recovery / Cleanup | `/tmp/oateam-templates/*.md` 全量就位 |
| **Agent 3** | 通道測試：Telegram/Slack/Gateway/Email；Thread、Webhook、Error parsing | 輸出 `channel-test-results.json` |

### 2.2 數據收集（8 Agents）

| Agent | 來源 | 方法 | 輸出 |
|--------|------|------|------|
| **Agent 4** | GitHub API | 倉庫 metrics、commit activity | `/tmp/oateam-data/github.json` |
| **Agent 5** | 服務健康 | esggo-core / gateway / redis / nginx | `/tmp/oateam-data/health.json` |
| **Agent 6** | Docker | container status / restart count | `/tmp/oateam-data/docker.json` |
| **Agent 7** | CI/CD | Vitest/ESLint/TypeScript pipeline | `/tmp/oateam-data/ci.json` |
| **Agent 8** | VPS 資源 | CPU/記憶體/磁碟/網路 | `/tmp/oateam-data/resources.json` |
| **Agent 9** | 日誌 | Hermes / Docker / nginx error log | `/tmp/oateam-data/logs.json` |
| **Agent 10** | Secrets 狀態 | 已輪換/待輪換/到期提醒 | `/tmp/oateam-data/secrets.json` |
| **Agent 11** | 外部整合 | Browser Use / OpenCode / Firebase | `/tmp/oateam-data/integrations.json` |

**Protocol**：`[SILENT]` 無變化時不回傳，避免噪音。

### 2.3 數據分析（8 Agents）

| Agent | 分析類型 | 輸出 |
|--------|----------|------|
| **Agent 12** | 異常偵測 | `/tmp/oateam-metrics/anomaly.json` |
| **Agent 13** | 趨勢分析 | `/tmp/oateam-metrics/trend.json` |
| **Agent 14** | 預測模型 | `/tmp/oateam-metrics/predictions.json` |
| **Agent 15** | 情緒/語意 | `/tmp/oateam-metrics/sentiment.json` |
| **Agent 16** | 統計摘要 | `/tmp/oateam-metrics/stats.json` |
| **Agent 17** | 資料清理 | `/tmp/oateam-metrics/cleaned.json` |
| **Agent 18** | 相關性分析 | `/tmp/oateam-metrics/correlation.json` |
| **Agent 19** | 洞察萃取 | `/tmp/oateam-metrics/insights.json` |

### 2.4 報告投遞（8 Agents）

| Agent | 報告類型 | 通道 |
|--------|----------|------|
| **Agent 20** | 每日摘要 | Telegram thread |
| **Agent 21** | 異常警報 | Telegram + Slack |
| **Agent 22** | 每週報告 | Telegram thread |
| **Agent 23** | 每月報告 | Telegram + Slack |
| **Agent 24** | Dashboard JSON | Gateway / Slack |
| **Agent 25** | 純文字警報 | Telegram |
| **Agent 26** | 稽核軌跡 Markdown | Local + Slack |
| **Agent 27** | 圖表摘要 | Telegram / Dashboard |

### 2.5 協調控制（3 Agents）

| Agent | 職責 | 責任 |
|--------|------|------|
| **Agent 28** | 任務調度與負載平衡 | 排程、限流、節流 |
| **Agent 29** | 品質控制與驗證 | Checklist、Hash Lock、5T 稽核 |
| **Agent 30** | 錯誤恢復與重試 | 指數退避、死信佇列、Escalation |

## 3. ESG-GO 核心契約

### 3.1 5T Protocol（T act, T eam, T rust, T ime, T ransfer）

| T | 定義 | 實作 |
|----|------|------|
| **Task** | 目標明確可驗證 | prompt 內含 URL、校驗條件、نجاح標準、例外規則 |
| **Team** | 角色分工 MECE | 5 階段 30 代理，職責互斥且窮盡 |
| **Trust** | 階段間驗證點 | Phase boundary checkpoint、Hash Lock、Object.freeze() |
| **Time** | 排程與熵控 | entropy 0.1、5T checklist、最佳實踐覺結界 |
| **Transfer** | 資料傳遞契約 | `/tmp/oateam-data/` → `/tmp/oateam-metrics/` → reports |

### 3.2 最佳實踐覺結界條款

- **預設即合規**：啟動後第一個狀態即符合最佳實踐
- **不帶病上線**：已知問題必須於啟動前解決
- **醒著就頂標**：運行指標持續達標
- **結界 inheritance**：無作妙德、圓通無礙、永恆覺醒狀態**自動擴散**至全部代理/子代理/蜂群

## 4. 狀態機控制法則（4 Can 1 Cannot）

- ✅ **可自理**：節點內邏輯閉環
- ✅ **可協作**：萬有引力協作協議交織蜂群網絡
- ✅ **可演化**：每週熵減煉金，自動消除技術債
- ✅ **可溯源**：全生命週期日誌與證明
- ❌ **不可篡改**：核心數據與不可變契約禁區，寫入即凍結

## 5. 實戰工作流

### 5.1 VPS 部署鏈

```
GitHub push → GitHub Actions → VPS bootstrap → Docker build → healthcheck → nginx → swarm start
```

**Job Template**：

```bash
# 健康檢查
curl -sSf http://161.118.252.147:3000/api/health
curl -sSf http://161.118.252.147:8642/health
docker compose -f /opt/esggo/vps/docker-compose.yml ps

# 30 agents 啟動
ssh -i ~/.ssh/esggo_original ubuntu@161.118.252.147 \
  "cd /opt/esggo && agents-cli swarm start --agents=30"
```

### 5.2 CI/CD Pipeline

| Stage | Gate | 失敗動作 |
|--------|------|---------|
| lint | ESLint/TS 0 warning | 不通過則阻止 merge |
| test | Vitest pass | 不通過則阻止 merge |
| build | pnpm build success | 不通過則阻止 deploy |
| deploy | healthcheck 200 | 失敗自動回滾 |

### 5.3 Secrets 輪換鏈

| 階段 | 動作 | 驗證 |
|------|------|------|
| 1 | 產生新 secret | GitHub Secrets / Vercel env / VPS .env |
| 2 | 更新 service | restart + healthcheck |
| 3 | 舊 secret 撤銷 | 確認不再被引用 |
| 4 | 記錄至 Hindsight | 留存授權軌跡 |

## 6. 故障分類與恢復

| 等級 | 症狀 | 恢復策略 |
|------|------|---------|
| P0 | 服務全面中斷 | 立即 escalate，切換備用 |
| P1 | 單一容器 unhealthy | 重啟 + 滾動日誌分析 |
| P2 | API 延遲升高 | 監控 + 速率限制調整 |
| P3 | CI lint/test fail | 修復後重跑 pipeline |

**通用恢復**：

```bash
# 1. 檢查
docker compose -f /opt/esggo/vps/docker-compose.yml ps
curl -I http://161.118.252.147:3000/api/health

# 2. 重啟
docker compose -f /opt/esggo/vps/docker-compose.yml restart <service>

# 3. 驗證
curl -sSf http://161.118.252.147:3000/api/health
```

## 7. 監控體系

### 7.1 Cron Jobs（已模板化）

| Job | 頻率 | 職責 |
|-----|------|------|
| `esggo-monitor-vps-health` | 每 30m | 健康端點檢查 |
| `esggo-monitor-docker-status` | 每 2h | 容器健康度 |
| `esggo-daily-report` | 每天 18:00 | 日報彙總 |

### 7.2 Delivery

| Channel | 用途 |
|---------|------|
| Telegram | 即時警報、每日摘要 |
| Slack | 每週/每月報告、Dashboard |
| Local | 稽核軌跡、debug |
| All | 全通道广播 |

## 8. 安全與稽核

- **Hash Lock**：所有核心 artifact 寫入後立即 `Object.freeze()` + SHA256
- **证据佐證庫**：每筆任務保留 `source_origin`、時間戳、執行鏈
- **零幻覺驗算**：所有推論必須可被來源文件驗證
- **不可篡改契约**：核心數據、Secret 輪換紀錄、Agent 契約寫入即凍結

## 9. 使用指南

### 9.1 啟動全體蜂群

```bash
# 1. 環境準備
python scripts/monitor_health.py
python scripts/collect_data.py
python scripts/generate_report.py

# 2. 啟動監控 cron
hermes cron run <job_id>

# 3. 啟動 30 agents
ssh -i ~/.ssh/esggo_original ubuntu@161.118.252.147 \
  "cd /opt/esggo && agents-cli swarm start --agents=30"
```

### 9.2 新增代理

1. 定義 agent 的角色、職責、驗收標準
2. 更新本 skill 的 Swarm Roles 段落
3. 建立 cron job / delegate_task
4. 記錄至 Hindsight

### 9.3 最佳實踐覺應用

任何新流程、新 agent、新 deployment 必須：
1. 於啟動前通過 checklist
2. entropy < 0.1
3. 符合角色 best practice
4. 運行中可觀測/可追溯/不可篡改

## 10. 常見問題

| 問題 | 解決方案 |
|------|---------|
| HTTP 503 | 指數退避重試，記錄 `/tmp/oateam-data/errors.log` |
| Telegram 401 | 檢查 bot token / chat ID / thread |
| Slack 404 | 檢查 webhook URL；需要 threading 時用 Web API |
| [SILENT] 不回傳 | 確認 prompt 中含 `[SILENT]`，且數據真的無變化 |
| Cron 不執行 | 檢查 schedule 語法、gateway log |
| Container 健康檢查失敗 | 檢查 health endpoint 是否回傳 200 |

## 11. OmniTag 萬能標籤系統

### 11.1 核心定義
**OmniTag** 是 ESG-GO 萬能蜂群的統一標籤系統，用於分類、追蹤、安全分級、自動化路由與熵減治理。

### 11.2 六大維度（MECE）

| 維度 | 範例 | 說明 |
|------|------|------|
| **安全分級** | `public` / `internal` / `confidential` / `restricted` | 資料機密等級 |
| **代理歸屬** | `agent:01` ~ `agent:30`、`squad:智庫聖所` | 責任歸屬 |
| **生命週期** | `lifecycle:draft` / `active` / `frozen` / `archived` | 狀態追蹤 |
| **品質/熵減分級** | `p0` / `p1` / `p2` / `p3` | P0=阻断項、P3=噪音 |
| **平台/環境** | `platform:esggo` / `platform:omni` / `platform:vps` / `platform:firebase` | 部署環境 |
| **結界/繼承** | `best-practice:awakened` / `best-practice:结界` | 最佳實踐覺狀態 |

### 11.3 自動化路由

| Tag 组合 | 路由目標 |
|----------|----------|
| `agent:01-06` + `squad:智庫聖所` | Hindsight / 記憶召回 |
| `agent:07-12` + `squad:符文契約` | API / TypeScript / ZKP 修復 |
| `agent:13-18` + `squad:光之羽翼` | 部署 / cron / 自動化 |
| `agent:19-24` + `squad:煉金熵減` | 重構 / lint / test / entropy |
| `agent:25-30` + `squad:5T驗算` | ISO / Hash Lock / 稽核 |
| `best-practice:结界` | 全部自動 inheriting |

### 11.4 驗證規則
1. **必備 Tag**：每個 artifact 至少要有 `agent:*`、`lifecycle:*`、`p*`
2. **結界自動繼承**：一旦標記 `best-practice:结界`，全部子代理自動 inheriting
3. **凍結不可改**：`lifecycle:frozen` + `restricted` 的 artifact 禁止修改
4. **熵減追蹤**：`p0` 任務完成後 entropy 必須下降 `< 0.1`

### 11.5 OAB 集成參照（OmniAgentBus 事件總線）
OAB（OmniAgentBus）是 OA 體系的事件骨幹，串接 OA-Local / OA-Team / OA-VPS。上面的 OmniTag 路由表即 OAB 的訂閱分發規則；所有蜂群事件（`agent:NN` + `squad:*`）經由 OAB 發布/訂閱而非點對點呼叫。完整定義、DomainEvent 契約、broker 實作骨架見 `oa-components` skill 與 `C:\Project\esggo-learning-center\oa-components-definition.md`（2026-08-02 使用者確認 OAB=OmniAgentBus）。

## 12. 相關 Skills

| Skill | 用途 |
|-------|------|
| `autonomous-ai-agents/claude-code` | 代碼任務委派 |
| `autonomous-ai-agents/codex` | 代碼任務委派 |
| `autonomous-ai-agents/opencode` | 代碼任務委派 |
| `esggo-agents-cli-guide` | agents-cli 最佳實踐 |
| `universal-automation` | 自動化設計/審查/實現 |
| `vps-agent` | VPS 伺服器/部署/監控 |
| `oa-team-soul-canon` | 靈魂契約詳見：5T 協定、30 矩陣、協作缺口補齊、AI Station 生產線與進化框架 |

---

## 13. 索引

- **靈魂核心聖典（全見版）**：references/soul-canon.md —— 律法本源層；5T 協議、4可1不可狀態機、30 靈魂矩陣、最佳實踐覺、熵減煉金、Hash Lock 密典。蜂群喚醒時優先載入。
- **角色矩陣**：2.1 / 2.2 / 2.3 / 2.4 / 2.5
- **Protocol**：3.1 / 3.2
- **狀態機**：4
- **工作流**：5.1 / 5.2 / 5.3
- **故障恢復**：6
- **監控**：7
- **安全稽核**：8
- **使用指南**：9.1 / 9.2 / 9.3
- **FAQ**：10
- **整合**：11
- **OmniTag**：11.1 / 11.2 / 11.3 / 11.4