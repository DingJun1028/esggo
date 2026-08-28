# Ollama 模型矩陣 (ReachAgent 免費算立實測)

來源：2026-08-26 本機 Ollama（Windows）+ VPS Ollama 實測。決定性經驗，非猜測。

## 模型行為對照

| 模型 | draft (長文生成) | analyze (結構化抽取) | 備註 |
|------|-----------------|---------------------|------|
| **gemma4:latest** (多模態) | ❌ Read timeout 90s+ | — | 多模態模型對純文字長 prompt 異常，**禁用於 draft** |
| **qwen2.5:3b** | ✅ 16s 回完整郵件 | ❌ 對真實網頁長文本回 `{}` | draft 快但結構化弱 |
| **qwen2.5:14b** | ⚠️ ~48s (CPU) | ✅ 結構化強 | analyze 推薦；CPU 推論慢 |

## 推薦配置（多模型分流）

```env
OLLAMA_BASE=http://localhost:11434
OLLAMA_MODEL=qwen2.5:3b          # draft 用，要快
OLLAMA_MODEL_ANALYZE=qwen2.5:14b # analyze 用，要強結構化
```

- 單機需先 `ollama pull qwen2.5:14b`（~9GB，一次下載永久用）。
- VPS Ollama 通常只裝 14b（無 3b）→ 設 `OLLAMA_MODEL=qwen2.5:14b` 用真實推論，勿留 3b 預設（會 45s timeout 才 fallback MOCK）。

## 實測結果（2026-08-26）

- ✅ 五階段全跑通：SEARCH→FETCH(8 URLs)→ANALYZE(7 頁)→DRAFT(3 attempts)→EVAL
- ⚠️ qwen3b 結構化失敗 → `SIGNALS=0` → 郵件泛稱（12-19/30，未達 21）
- 根因：免費模型結構化天花板（非程式 bug）；換 14b 做 analyze 預期 SIGNALS>0

## 結構化抽取防呆（flow.py 模式）

```python
def analyze_page(page, factors):
    if not page.get("text"):
        return {"url": page["url"], "signals": []}
    # 重試 2 次（小模型結構化偶失敗）
    for _ in range(2):
        res = call_ollama_structured(prompt, schema, model=ANALYZE_MODEL, timeout=45)
        if res.get("signals"):
            return res
    return {"url": page["url"], "signals": []}  # 降級：至少不讓個人化完全失效
```

`call_ollama_structured` 實作：`format:"json"` + schema 提示詞 → `json.loads` 後處理（去 ``` 包裹）。
