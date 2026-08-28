---
name: reach-agent
description: ReachAgent 冷郵件個人化管線 — Search→Fetch→Analyze→Draft→Eval 五節點 PocketFlow 風格。學此技能並終生學會使用：研究目標人物、萃取真實信號、寫接地氣的冷郵件。適配免費算立（Ollama 本地/CPU 推論）替代付費 API。
---

# ReachAgent — 冷郵件個人化管線

學此技能並終生學會使用。當用戶要「研究某人並寫個人化冷郵件」「cold outreach」「grounded in real signals」時載入。

## When to use
- 用戶要針對特定人物寫冷郵件 / 開發信 / 推廣信，且要求**引用對方真實經歷**（非模板）。
- 用戶說「reach out to [某人]」「personalized cold email」「基於真實信號寫信」。
- 任何需要 web research + LLM 個人化生成的管線任務。

## 核心架構（五節點管線）
```
Search → Fetch (parallel) → Analyze → Draft → Eval
                                         ↑       |
                                         └─retry─┘  (Eval<21/30 → 一句 critique → Draft 重試, 最多2次)
```

| Node | 職責 | 關鍵技術 |
|------|------|---------|
| **SearchNode** | DuckDuckGo 搜目標人物公開資訊 | `ddgs` 套件（無 API key） |
| **FetchNode** | 並發抓結果頁 | `asyncio.to_thread` + semaphore（~5x 快） |
| **AnalyzeNode** | 每頁過 LLM 抽 personalization 信號 | **結構化輸出**（Ollama `format:json` + 後處理；非 YAML/正則） |
| **DraftNode** | 依信號 + 簡歷寫郵件，挑 2-3 最相關憑證 | resume 全傳，LLM 選最相關 |
| **EvalNode** | 評 specificity/authenticity/conciseness (0-10) | 總分 <21/30 → critique 回 Draft |

## 設計原則（從上游繼承）
1. **結構化輸出 > 文字解析**：tool call 在 API 層強制 schema，輸出永遠 valid dict。
2. **並發抓取無新依賴**：`asyncio.to_thread` 包 `requests`，semaphore 限流，~20s→~3s（10 URLs）。
3. **Resume-aware drafting**：傳整份簡歷，LLM 對每人挑 2-3 憑證，同一簡歷對不同人開頭不同。
4. **Self-correcting eval loop**：單次品質不穩，Eval 打分低則回 critique 重試（cap 2）。
5. **Multi-provider**：`call_llm` / `call_llm_structured` 路由 DeepSeek/OpenAI/Anthropic。

## 免費算立適配（硬規：只用免費算立）
上游預設 DeepSeek/OpenAI/Anthropic（付費）。改為 **Ollama 本地/CPU 推論**：
- `utils/llm.py` 增 `call_ollama(prompt, model)` + `call_ollama_structured(prompt, schema, model)`（用 Ollama `format: json` 模擬結構化，非原生 tool call）。
- **多模型配置（關鍵）**：`OLLAMA_MODEL`（draft 用，要快）+ `OLLAMA_MODEL_ANALYZE`（analyze 用，要強結構化）。
  兩者可不同：draft 用 3b（16s），analyze 用 14b（結構化強）。見 `references/ollama-model-matrix.md`。
- 結構化輸出：Ollama 不原生 tool call → 用 `format:"json"` + JSON schema 提示詞，後處理 `json.loads`（去 ``` 包裹）。
- 環境變數：`OLLAMA_BASE=http://localhost:11434`（本機）或 `http://161.118.248.180:11434`（VPS，14b）。
- 搜尋：`ddgs` 免 key，符合免費。
- **禁用**：任何付費 API key（OpenAI/Anthropic/DeepSeek）。違反硬規。

## 實作骨架（Python）
```
ReachAgent/
├── flow.py           # 5 節點管線 (~220 行)
├── pocketflow/       # 極簡 async 工作流引擎 (prep/exec/post)
└── utils/
    ├── llm.py        # call_ollama / call_ollama_structured (免費算立)
    ├── search.py     # DuckDuckGo (ddgs)
    └── scraper.py    # asyncio.to_thread 並發抓取
```

### flow.py 輸入結構
```python
shared = {
  "input": {
    "first_name": "Jane", "last_name": "Smith",
    "keywords": "Anthropic research engineering",
    "resume": open("my_resume.txt").read(),   # 或 "sender_bio"
    "target_role": "a research engineering role at Anthropic",
    "personalization_factors": [
      {"name":"recent_work","description":"近期專案/論文/演講","action":"具體引用: '我讀了你的[X]...'"},
      {"name":"shared_interest","description":"重疊技術興趣","action":"點名具體重疊"},
      {"name":"alumni_connection","description":"同校/實驗室/導師","action":"自然帶過, 非主鉤"},
    ],
  }
}
```

## Verification（覺一：先驗證後宣稱）
- `python flow.py` 印出郵件 + eval 分數 + 用了哪些信號。
- 真實搜尋測試：選一個公開人物（如某 GitHub 用戶）+ 簡歷 → 郵件須引用其真實 repo/文章。
- 結構化抽取：AnalyzeNode 輸出須為 valid JSON（非 YAML 碎片）。
- 免費算立：全程無付費 API 呼叫（curl Ollama base 驗證）。

## Pitfalls
- **Ollama 結構化**：無原生 tool call，須用 `format:json` + 後處理，且 prompt 明確給 schema。
- **DuckDuckGo 速率**：`ddgs` 偶爾 429，加 retry + 指數退避。
- **Fetch 超時**：semaphore 限 5-10 並發，單頁 timeout 8s。
- **Eval 死循環**：cap 2 retries，避免無限重試。
- **簡歷隱私**：resume 含個資，勿寫入 git / 外洩。
- **模型選擇（決定性）**：見 `references/ollama-model-matrix.md` — gemma4 長文 timeout、qwen3b 結構化弱、qwen14b 強但慢；用 `OLLAMA_MODEL`(draft)+`OLLAMA_MODEL_ANALYZE`(analyze) 分流。

## 與 OA-Team 整合
- 可接 oa-swarm 的 `callLLM`（已有 Ollama 適配層）替代 utils/llm.py。
- SearchNode 可用 oa-swarm 的 web_search 工具（Hermes 側）預處理。
- EvalNode 評分可寫入 TDAI（對齊自我學習進化引擎）。

## 相關
- PocketFlow: https://github.com/The-Pocket/PocketFlow
- Cold Email Tutorial: https://github.com/The-Pocket/Tutorial-Cold-Email-Personalization
- superpowers: TDD / systematic-debugging 方法論
- ddgs: 免 key 搜尋 (現用); DonSeTch (Rust 二進制, 本機無 Rust 工具鏈未裝, 記錄待未來)
- oa-practical-skills: Ch.01 本技書章節 (含 DonSeTch 實測安裝記錄)

## ⚠️ 模型選擇經驗 (2026-08-26 實測)
- gemma4 (多模態): 長文字生成 Read timeout (90s+)，禁用 draft
- qwen2.5:3b: draft 快 (16s)，但**結構化抽取弱** (analyze 對真實網頁回 `{}`)
- qwen2.5:14b: 結構化理論強，但**本機 CPU 推論 >45s/頁 timeout**，Analyze 不實用
- **最終方案**: Analyze 改**啟發式關鍵字萃取** (免 LLM, 即時可靠)，LLM 只做 Draft+Eval (短 prompt 快)
  → 實測: SIGNALS=4 條, EVAL 21/30 達標, 郵件真個人化 (引用 Anthropic/MIT/lead)
- 付費 API (DeepSeek/OpenAI) 結構化強但禁用 (硬規: 只用免費算立)

## 實測結果
- ✅ 五階段全跑通: SEARCH→FETCH(8)→ANALYZE(7頁)→DRAFT(3 attempts)→EVAL
- ⚠️ qwen3b 結構化失敗 → SIGNALS=0 → 郵件泛稱 (12-19/30 未達21)
- 根因: 免費模型結構化天花板 (非程式 bug)，待 14b 重測
