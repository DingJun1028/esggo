# OA-Team 30 萬能蜂群 — CrewAI 原型

對應 `soul.md`（ESG-GO 萬能蜂群靈魂核心聖典）的「30 Souls Matrix」。

## 架構對應

| soul.md 陣列 | Agent 編號 | crew.jsonc agents | 智能標籤 |
|-------------|-----------|-------------------|---------|
| 智庫聖所小隊 | 01–06 | `sage_01`..`sage_06` | `#記憶聖所` `#全知之眼` |
| 符文契約小隊 | 07–12 | `rune_07`..`rune_12` | `#神聖契約` `#雙向TS` |
| 光之羽翼小隊 | 13–18 | `wing_13`..`wing_18` | `#光之羽翼` `#自主代行` |
| 煉金熵減小隊 | 19–24 | `forge_19`..`forge_24` | `#原罪煉金` `#熵減寶石` |
| 5T 驗算小隊 | 25–30 | `verify_25`..`verify_30` | `#零幻覺` `#HashLock` |

## 協作協定（萬有引力協作協議三步）

1. **本質提純** → `sage_01`（智庫聖所召回記憶）
2. **蜂群協同** → `rune_07`（契約） → `wing_13`（代行） → `forge_19`（熵減）
3. **5T 驗算** → `verify_25`（零幻覺 + Hash Lock）

## 檔案結構

```
oa-team-crewai/
├── crew.jsonc          # CrewAI JSON-first 編排 (5 tasks, 30 agents)
├── agents/             # 30 個 agent 定義 (sage_01..verify_30)
├── main.py             # Flow 入口 (load_crew + OATeamFlow)
├── gen_agents.py       # 批量生成 30 agent (對應 soul.md 5 陣列)
├── pyproject.toml
└── .env.example
```

## 運行

```bash
# 1. 建立 .env (從環境繼承 key 或用 Nous/OpenRouter)
cp .env.example .env

# 2. 執行 30 蜂群
python main.py "為 ESG-GO 產出一個 5T 合規的元件骨架"
```

## 環境需求

- Python 3.10–3.13（CrewAI 要求）
- `crewai[litellm]`（LiteLLM 路由 `openai/tencent/hy3:free` → Nous base_url）
- 可達的 LLM 端點（當前阻塞：Nous DNS 解析失敗，需本機 Ollama 或有效 key）

## 狀態

- ✅ 結構完成：30 agents / 5 tasks / load_crew() 組裝成功
- ⚠️ LLM 推理待端點恢復（Nous `api.nousresearch.com` 當前 DNS 失敗）
