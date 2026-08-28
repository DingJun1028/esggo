# Ch.01 ReachAgent 冷郵件個人化管線 (免費算立適配)

## 來源歸屬
- 上游設計說明：用戶提供 ReachAgent README（基於 PocketFlow by Zachary Huang）
- 真實上遊（web_search 證實原 `your-username/ReachAgent` 是佔位符，不存在）：
  [PocketFlow Cold Email Tutorial](https://github.com/The-Pocket/Tutorial-Cold-Email-Personalization)
- 適配改寫：本 session（2026-08-26），將付費 API（DeepSeek/OpenAI/Anthropic）改為 **Ollama 免費算立**
- 技能固化：`reach-agent` Hermes skill + 本技書章節

## 核心架構（五節點管線）
```
Search → Fetch (parallel) → Analyze → Draft → Eval
                                         ↑       |
                                         └─retry─┘  (Eval<21/30 → 一句 critique → Draft 重試, 最多2次)
```

| Node | 職責 | 關鍵技術 |
|------|------|---------|
| SearchNode | DuckDuckGo 搜目標公開資訊 | `ddgs`（無 API key） |
| FetchNode | 並發抓結果頁 | `asyncio.to_thread` + semaphore（~5x 快） |
| AnalyzeNode | 每頁過 LLM 抽 personalization 信號 | **結構化 tool call**（非 YAML/正則） |
| DraftNode | 依信號 + 簡歷寫郵件，挑 2-3 最相關憑證 | resume 全傳，LLM 選最相關 |
| EvalNode | 評 specificity/authenticity/conciseness (0-10) | 總分 <21/30 → critique 回 Draft |

## 免費算立適配（硬規：只用免費算立）
上游預設 DeepSeek/OpenAI/Anthropic（付費）。改為 **Ollama 本地/CPU 推論**：
- `utils/llm.py` / `flow.py` 的 `call_ollama(prompt, model)` + `call_ollama_structured`
- 結構化輸出：Ollama 不原生 tool call → 用 `format: "json"` + JSON schema 提示詞 + `json.loads` 後處理
- 環境變數：`OLLAMA_BASE`（本機 `http://localhost:11434` 或 VPS `http://161.118.248.180:11434`）+ `OLLAMA_MODEL=qwen2.5:14b`
- 搜尋：`ddgs` 免 key，符合免費
- **禁用**：任何付費 API key（OpenAI/Anthropic/DeepSeek）。違反硬規。

## 可執行命令

```bash
# 1. 安裝依賴 (uv 或 pip)
cd reach-agent
uv pip install -r requirements.txt
# 或: pip install -r requirements.txt

# 2. 設定 .env (免費算立)
cp .env.example .env
# 編輯 .env: OLLAMA_BASE + OLLAMA_MODEL (禁用付費 key)

# 3. 準備簡歷
echo "你的簡歷文字" > my_resume.txt

# 4. 編輯 flow.py main() 的 shared 輸入 (first_name/last_name/keywords/resume/target_role/personalization_factors)

# 5. 執行
python flow.py
# 輸出: 郵件草稿 + EVAL 分數 + 用了哪些信號
```

## 地雷 / 陷阱 (Pitfalls)

1. **Ollama 結構化輸出無原生 tool call**
   → 用 `format: "json"` + schema 提示詞，後處理 `json.loads`；去掉 ``` 包裹
   → 若 Ollama 回非 JSON，call_ollama_structured 回 `{}`（須檢查空 dict）

2. **DuckDuckGo 速率限制 (429)**
   → `ddgs` 偶爾被限流；加重試 + 指數退避（flow.py 現版未加，待補強）

3. **Fetch 超時 / 阻塞**
   → semaphore 限 5-10 並發，單頁 timeout 8s（asyncio.to_thread 包 requests）

4. **Eval 死循環**
   → cap 2 retries（flow.py `range(3)` = 0,1,2 共 3 次嘗試，含首輪）

5. **簡歷隱私**
   → resume 含個資，勿寫入 git / 外洩（加 `.gitignore` 排除 `my_resume.txt`）

6. **VPS Ollama 對外防火牆**
   → 本機無 Ollama 時接 VPS `161.118.248.180:11434`，須確認 VPS 安全組開放 11434 或走 tunnel

5. **郵件隱私**
   → resume 含個資，勿寫入 git / 外洩（加 `.gitignore` 排除 `my_resume.txt`）

6. **模型選擇 (實測關鍵)**
   → gemma4 (多模態) 長文字生成會 90s+ timeout，禁用
   → qwen2.5:3b draft 快 (16s) 但**結構化抽取弱** (analyze 真實網頁回 `{}`)
   → qwen2.5:14b 結構化理論強，但**本機 CPU 推論 >45s/頁 timeout**，Analyze 不實用
   → **最終方案**: Analyze 改啟發式關鍵字萃取 (免 LLM, 即時)，LLM 只做 Draft+Eval
   → 實測: SIGNALS=4, EVAL 21/30 達標, 郵件真個人化 (引用 Anthropic/MIT/lead)

7. **前輪 stream timeout 教訓**
   → 寫大檔（>8K tokens）用 write_file 一次會 timeout；拆小檔 / 多段 patch

## 驗證清單 (Verification)

- [ ] `OLLAMA_BASE` 可達：`curl -s http://161.118.248.180:11434/api/tags` 回模型列表
- [ ] `ddgs` 可搜：`python -c "from ddgs import DDGS; print(len(DDGS().text('test', max_results=3)))"`
- [ ] `python flow.py` 跑通：Search→Fetch→Analyze→Draft→Eval 五階段均有日誌
- [ ] 結構化抽取：AnalyzeNode 輸出為 valid JSON（非 YAML 碎片）
- [ ] 免費算立：全程無付費 API 呼叫（grep 程式無 `openai`/`anthropic` import）
- [ ] 郵件品質：Eval score ≥ 21/30，且引用目標人物真實經歷

## 相關技能 (Related)

- Hermes skill: `reach-agent`（方法論索引）、`superpowers`（TDD/code-review）、`practical-skills-handbook`（技書規範）
- OA-Team: soul.md §十一 進化路線圖（自我學習引擎可接 EvalNode 寫 TDAI）
- 上游: PocketFlow `https://github.com/The-Pocket/PocketFlow`

