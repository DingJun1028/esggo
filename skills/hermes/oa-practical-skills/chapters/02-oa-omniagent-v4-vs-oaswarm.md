# Ch.02 OA-OmniAgent v4 vs oa-swarm — 架構對照與收斂

## 來源歸屬
- OA-OmniAgent v4 (production, latest) soul.md — 用戶提供 (2026-08-26)
- 系統版本: ESG GO v0.6 FUSION | 熵減目標 <0.1 | AGPL-3.0
- 我們的實作: `esggo-learning-center/oa-swarm` (獨立 TS, 非 DeerFlow 融合)

## v4 核心架構 (三明治)
```
魂 (Hermes + OA-Team 30)  → 5T 治理 / 結界六柱 / Key-Ω / 熵減煉金
骨 (DeerFlow 2.0 LangGraph) → sub-agent 編排 / sandbox / skills 漸進載入 / thread 持久化
觸角 (Agent Reach + IM)   → 13+ 平台感知 + 7 IM 渠道 + A2A 互通
```

| 層 | v4 實作 | 我們 oa-swarm |
|----|---------|---------------|
| 指揮 | Hermes + LangGraph Runtime | 獨立 TS + Ollama (無 LangGraph) |
| 編排 | DeerFlow lead_agent 拉 sub-agents | SwarmCore.dispatch (5 陣列) |
| 持久化 | LangGraph thread + DeerFlow checkpoint | OAB → TDAI (8420) + 本地 JSONL |
| 觸達 | Agent Reach (13+平台) + 7 IM | 無 (僅 HTTP API 8800/8788) |
| 自我學習 | Session Goals + Hindsight 分層 | EvolutionEngine (L0-L3 類似) |

## 收斂點 (兩者共通)
1. **5T 協定**: Traceable/Trackable/Tangible/Transparent/Trustworthy 完全一致
2. **30 蜂群矩陣**: 5 陣列 × 6 = 30, 萬能蜂后 #1
3. **熵減循環**: v4 熵減煉金 ↔ oa-swarm entropy*0.97
4. **不可篡改**: Hash Lock + Object.freeze()
## 參考工具對照 (用戶同輪提供)

### DonSeTch (免費研究工具, Rust 二進制)
- 零 API key, $0, 繞過機器人檢測 (HTTP/2 + Chrome BoringSSL TLS)
- 三工具: fetch / search / crawl; 可作 MCP 或 CLI
- **實測安裝 (2026-08-26)**: ❌ 本機無 Rust 工具鏈
  - `npm install -g donsetch` → 嘗試 `git clone` + `cargo build --release` → 失敗 (環境無 cargo/rustc)
  - `where cargo` / `where rustc` → 均不存在
  - 結論: 記錄待未來 (需先裝 Rust 或下載預編譯 release 二進制)
- 替代: ReachAgent 現用 `ddgs` (純 Python, 已裝可用, 偶有 429 限速)

### TencentDB-Agent-Memory v2.0.0 (團隊記憶中心)
- 四資產: Chat Memory (L0-L3) / Skill / Wiki / CodeGraph
- Memory Hub 操作台 + Memory Proxy (Anthropic/OpenAI 雙協定)
- **我們 VPS 現狀**: `/opt/esggo/apps/tencentdb-memory` 是自建 0.1.0 (vectorStore+embedding+timerScanner), 非原生 v2.0.0
- v2.0.0 是 Docker 三件套 (core+hub+proxy), VPS RAM 24G 已 99% 滿載 → 不建議直接升級
- 方法論可借鑑: L0-L3 分層 / Skill 強制歸檔 / Agent Loadout (對齊我們 EvolutionEngine)

## 驗證清單
- [ ] oa-swarm 獨立 TS 運作 (前輪 18/18 測試通過, health 200)
- [ ] v4 soul.md 為 DeerFlow 融合版, 我們未採用 (技術棧分歧, 非缺失)
- [ ] DonSeTch 本機編譯失敗 (無 Rust) — 記錄待未來
- [ ] TencentDB VPS 為 0.1.0 自建, 非 v2.0.0

## 相關技能
- `reach-agent` (Ch.01), `oa-team-soul-canon`, `oa-twins-evolution`
- 上游: TencentDB-Agent-Memory, DonSeTch, DeerFlow 2.0

