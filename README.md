# ESG-GO 專案

## 📁 專案概述
ESG-GO 自動化工作區域，承載 OA-Team 雙蜂隊（蜂王 OA-LOCAL + 蜂后 OA-VPS，共 60 員）的萬能代理編制。

## 🐝 快速開始

- **TencentDB Agent Memory（共享記憶後端）** → [apps/tencentdb-memory/QUICKSTART.md](apps/tencentdb-memory/QUICKSTART.md)
- **萬能藍圖中心** → [apps/omni-blueprint-hub/](apps/omni-blueprint-hub/)
- **聖櫃（架構/神器/角色畫像）** → [Omni-Sanctuary/](Omni-Sanctuary/)

## 🖥️ VPS 服務架構（Oracle Always-Free A1.Flex · 4 OCPU / 24GB）

部署於 `ubuntu@161.118.248.180`，由 `ecosystem.config.cjs` + pm2 管理，依賴分層、故障隔離：

| 層級 | 服務 | Port | 說明 | 依賴 |
|---|---|---|---|---|
| L2 推理 | `stt-whisper` | 8791 | 本地 faster-whisper（零 key，免費算立） | 無 |
| L3 應用 | `universal-translator` | 8788 | 萬能即時雙語字幕（[README](apps/stt/README.md)） | 8791 |
| L3 應用 | `omniagent-gateway` | 8642 | Omni 閘道（需 `apps/gateway/.env` 的 `GATEWAY_API_KEY`） | 獨立 |
| L3 應用 | `deerflow` | 2026 | DeerFlow 多智能體（Docker Compose，domain `deerflow.esggo.co`） | 獨立（Docker） |
| L4 主站 | `esggo-core` | 3000 | Next.js 主站（需 `pnpm build`） | 獨立 |

**運維約定**
- 各服務 `max_restarts: 20`、`restart_delay: 5–8s`，避免連鎖崩潰（詳見 [AGENTS.md](AGENTS.md) 自動修復機制）
- 部署不用全量 `pm2 start ecosystem`，改 `--only <svc>` 增量重啟
- 密鑰外置於 `apps/*/.env`（不進 git），`GATEWAY_API_KEY` 等經 GitHub Secrets 注入

## 📊 OMNI ESG Reports Center（萬能永續報告書）

對齊《OMNI ESG 萬能永續報告書 - 開發與架構對照書》v1.1.0-Universe 補強建議，落實於 Next.js App Router：

- **路由**：`/omni/reports`（報告總樞紐，Grid/Board/List 三布局）、`/omni/reports/[reportId]/edit`（動態表單生成器 + 9式果因引擎零幻覺驗算）
- **核心庫** `src/lib/omni-reports/`：`IComponentCore` 心核、`jules-validator`（Zod 零幻覺）、`registry`（Schema 註冊）、`ncb-client`（NCB 雲端同源 + Hash Lock）、`agentic-twin`（Dr. Thoth 雙棲決策）、`tier-config`（SaaS 三階權限）
- **UI** `src/components/omni/reports/`：Liquid Glass 4D 玻璃質感 + 428 懸浮鍵（召喚 Dr. Thoth 側欄）、`OmniGlassChart` 霓虹 3D 圖表
- **驗證**：`vitest` 17/17（零幻覺驗算 + 欄位警告）、`node --test` 6/6、Next build 通過
- **SonarQube agentic**：`apps/universal-translator` 已接 `sonar analyze agentic`（`ci.yml` 加 `sonar-agentic` job，`SONAR_TOKEN` 選用閘門，對齊「只用免費算立」）

## 🔐 機密管理
- GitHub Secrets (推薦)
- GCP Secret Manager (備援)

## ⚠️ 安全注意事項
請立即輪換所有已暴露的機密！
