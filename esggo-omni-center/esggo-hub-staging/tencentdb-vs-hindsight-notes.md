# TencentDB Agent Memory vs Hindsight — 對照筆記（2026-08-01）

來源：TencentCloud/TencentDB-Agent-Memory README（MIT）
情境：本機 Windows Hermes（C:\Users\dingj\AppData\Local\hermes）+ 現役 Hindsight（bank: esggo, budget: high）

## 架構對照

| 面向 | TencentDB Agent Memory | Hindsight (現役) |
|---|---|---|
| 定位 | 團隊級記憶中樞（Hub + 資產共享） | 長期記憶（fact 萃取/檢索/反思） |
| 短期記憶 | symbolic：tool log 卸載成 Mermaid canvas（node_id 追蹤） | 無（靠 context/壓縮） |
| 長期記憶 | 分層 L0 對話→L1 Atom→L2 Scenario→L3 Persona | 語意檢索 + 實體圖 + rerank |
| 儲存 | SQLite + sqlite-vec（全本地、零外部 API） | Hindsight Cloud（雲端） |
| 檢索 | BM25 + vector + RRF 混合 | 語意 + 關鍵字 + 實體圖 |
| Agent 工具 | tdai_memory_search / tdai_conversation_search | hindsight_recall / reflect / retain |
| 白盒可除錯 | L2/L3 是 Markdown、canvas 是 Mermaid，可人讀 | 較黑箱 |
| 授權 | MIT（可自架） | 雲端服務 |
| 成本 | 僅 LLM key（本地算力） | 雲端額度 |

## 對 ESG-GO 的意義

1. 全本地零外部依賴 → 記憶資料不出機器，符合 VPS/自架哲學；Hindsight 走雲端。
2. 短期記憶卸載可降 token 用量（官方宣稱最高 -61%），對長 session（如 swarm 協作、
   esggo-learning-center 這類長任務）有感。
3. 團隊級共享（team/agent 可見性）與 ESG-GO 30 代理蜂群的「萬能蜂群」架構吻合：
   Persona/Scenario 可跨 agent 裝備。
4. Roadmap 未完成：跨框架/跨裝置遷移、自動 Skill 生成、視覺化儀表板 → 還有成長空間。

## 共存問題（關鍵決策）

Hermes 的 memory provider 為單一 active（config.yaml memory.provider）。
- 切到 memory_tencentdb 後，Hindsight 工具（hindsight_*) 可能不再注入。
- 反之若保留 Hindsight，TencentDB 的記憶不會被 Hermes 主迴圈呼叫。
- 折衷：TencentDB 跑 gateway（:8420）獨立服務 + tdai 工具仍可用，
  但「自動 recall 注入」只會作用於被選為 provider 的那個。
→ 建議：先備份 config.yaml（腳本已做），裝完實測一輪再決定去留；可隨時回滾。

## 安裝路徑（本機）

- 腳本：setup-memory-tencentdb.ps1 + run-setup-memory.bat（staging 目錄）
- 前置：Node >= 22.16（本機 v22.23.1 ✓）；TDAI_LLM_API_KEY（OpenAI 相容端點）
- 流程：npm 裝套件 → provider 進 plugins\memory\memory_tencentdb（底線必守）→
  config.yaml 備份+改 provider → .env 加 6 變數 → gateway 啟動 → /health 驗證
- 驗證：memory-setup.log + curl http://127.0.0.1:8420/health

## 替代路徑

- VPS Docker（README 2.A）：docker/opensource Dockerfile.hermes，容器 hermes-memory
  開 :8420，-v hermes_data:/opt/data 持久化。適用於想把記憶層搬到 VPS 的場景
  （但那是第二個 Hermes gateway，不是本機這個）。
- OpenClaw（README 1）：openclaw plugins install @tencentdb-agent-memory/memory-tencentdb

## 下一步建議

1. set TDAI_LLM_API_KEY=sk-...（可選 TDAI_LLM_BASE_URL/TDAI_LLM_MODEL）
2. 雙擊 run-setup-memory.bat → 讀 memory-setup.log 驗證
3. 重啟 Hermes（hermes update --no-backup --yes 或重開 app）
4. 觀察：tdai_memory_search 是否出現、Persona 是否於 ~\.memory-tencentdb\memory-tdai\ 生成
5. 對照 Hindsight：跑 2-3 個 session 後決定 provider 去留（回滾 = 還原 config.yaml.bak-*）
