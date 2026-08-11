# apps/oneringai — OneRingAI 實裝專案

> 把 `@everworker/oneringai` 套件做成一個**可獨立執行的 agent 助手**，直接消費其 Connector-First API，走本地 Ollama 免費算立路徑。

## 與 oa-framework adapter 的關係
- `packages/oa-framework/src/adapters/oneringai.ts`：OneRingAI 作為 OA 第 11 子框架 adapter（經 5T 雙層閘門包裝）。
- `apps/oneringai`：OneRingAI **本身的實裝專案**——直接 import `@everworker/oneringai`，不經 oa-framework，證明套件可獨立落地。

兩者互補：adapter 保 OA 5T 核心資產；app 展示 OneRingAI 原生能力。

## 前置
```bash
ollama serve                                    # 啟本地 Ollama
ollama pull qwen2.5:3b-instruct-q4_K_M         # 本機實存 tag (寫 qwen2.5:3b 會 404)
```

## 執行
```bash
cd apps/oneringai
node index.mjs "你的問題"
# 或環境變數
OA_PROMPT="什麼是循環經濟？" node index.mjs
```

可選環境變數：
- `OA_MODEL` — 預設 `qwen2.5:3b-instruct-q4_K_M`
- `OA_BASE_URL` — 預設 `http://localhost:11434/v1`（Ollama）；指 OpenAI/Anthropic 即走雲端
- `OA_API_KEY` — Ollama 填 `ollama`，雲端填對應 key
- `OA_SYSTEM` — 角色前綴（併入 prompt，因 Agent.create 不收 systemPrompt 欄位）

## 驗證狀態
- 真實實跑：本地 Ollama `qwen2.5:3b-instruct-q4_K_M` 推論，`agent.run()` 回 `output_text`/`output`，5T 由 oa-framework 另層鑄造。
- 套件實際版本：`@everworker/oneringai@1.0.1`（非 README 寫的 1.0.0）。
