# Gemini API 整合參考 — 免費層功能開啟指南

> 本文件收錄 Gemini API 官方文件重點（Interactions API / GenAI SDK / Managed Agents），
> 並說明 esggo 如何「開啟免費層功能」整合 Gemini。
> 最後更新：2026-07-17

---

## 一、官方文件重點（背景參考）

### 1. GenAI SDK（@google/genai）
- 官方推薦程式庫：`@google/genai`（JS/TS）、`google-genai`（Python）。
- 舊版 `@google/generativeai` 已於 2025-11-30 終止支援，**esggo 已遷移到新版 `@google/genai`**（現裝 2.10.0）。
- 安裝：`npm install @google/genai`。

### 2. Interactions API（2026-06 GA，建議新專案使用）
取代舊 `models.generateContent` 的統一介面。核心資源是 **Interaction**（一輪對話/工作的完整記錄）。

特點：
- **伺服器端對話狀態**：`previous_interaction_id` 可繼續對話，伺服器跨輪次快取內容降低權杖成本。
- **背景執行**：`background=true` 跑長時間工作。
- **可觀測**：回應含 `steps`（model 想法、tool call/result、最終 `model_output`）。
- **新功能平台**：日後新模型/多模態/工具/代理都在 Interactions API 推出。

資料保留：
- 付費方案：互動記錄保留 55 天。
- 免費方案：保留 **1 天**。
- `store=false` 可選無狀態模式（不儲存、與 background 不相容、禁用 previous_interaction_id）。

SDK 呼叫（2.10.0）：
```ts
const { GoogleGenAI } = await import('@google/genai');
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const interaction = await ai.interactions.create({
  model: 'gemini-2.5-flash',
  input: prompt,            // 單輪輸入欄位（非 user_input / contents）
  store: false,              // 免費層級無狀態
  generation_config: { temperature: 0.7, max_output_tokens: 256 },
});
// model 輸出在 steps 中 type==="model_output" 的 content.parts[].text
const text = (interaction.steps ?? [])
  .filter((s) => s.type === 'model_output')
  .flatMap((s) => s.content ?? [])
  .flatMap((c) => c.parts ?? [])
  .map((p) => p.text ?? '')
  .join('')
  .trim();
```

### 3. Managed Agents（Antigravity / Deep Research）
- 單一 API 佈建 Linux 沙箱，代理自主推論、執行程式碼、管檔案、搜網。
- 沙箱 OS 層級隔離，預設輸出網路不受限（可用 allowlist 限制）。
- 憑證經輸出 Proxy 標頭轉換注入，**絕不在沙箱公開**；建議短期權杖 + 最小權限 + 定期輪替。
- 免費方案提供受管理代理，但有速率限制與用量配額。
- 部署前須專人驗證輸出（生成的程式碼/資料轉換/設定變更）。
- 其他建構代理架構：LangChain/LangGraph、LlamaIndex、CrewAI、Vercel AI SDK、Google ADK、Antigravity SDK。

---

## 二、esggo 開啟免費層功能（實作對應）

esggo 的 Gemini 整合走**免費層級**：用 `gemini-2.5-flash`（免費配額模型）+ Interactions API 無狀態模式。

### 啟用方式（環境變數）
在 `.env`（VPS，gitignored）設定：

```bash
# 開啟 Interactions API 路徑（預設 false = 走舊 generateContent，行為不變）
USE_INTERACTIONS_API=true

# 允許真實 AI 呼叫（預設 FREE_TIER_ONLY=true 會回 mock，不打卡）
FREE_TIER_ONLY=false

# Gemini 金鑰（免費方案即可）
GEMINI_API_KEY=你的_免費層_key
```

### 免費層設計原則
- **模型**：`gemini-2.5-flash`（Interactions API 支援清單內，免費層可用）。
- **無狀態**：`store: false` — 不依賴 `previous_interaction_id` / `background`，避免免費方案 1 天保留限制。
- **安全降級**：`USE_INTERACTIONS_API=false`（預設）時完全不改變原有 `generateContent` 行為；設 true 才切到 Interactions API。
- **路由保護**：`/api/village/trends` 等路由原有 `FREE_TIER_ONLY` / mock 降級邏輯保持不動，PoC 只在「真實 AI 分支」內替換呼叫方式。

### 已落地（PR #330）
- `app/api/village/trends/route.ts`：真實 AI 分支加入 `ai.interactions.create` 路徑。
  - `input: prompt`、`store: false`、`generation_config`。
  - model 輸出從 `interaction.steps` 提取（`type==="model_output"` → `content.parts[].text`）。
  - `USE_INTERACTIONS_API` 開關 default false，預設不變。

### 待擴（未做）
- 其他 route（`/api/nexus`、`/api/omni-one`、`/api/rag/query|ingest`、`/api/sustain-write/v5/grammar`）仍用 `generateContent`，可同模式遷移。
- 多輪對話場景（需要 previous_interaction_id）不適用免費層無狀態模式，需評估是否升付費方案。

---

## 三、注意事項
- Interactions API 是 2026-06 GA 的新介面；esggo 裝的 `@google/genai` 2.10.0 已含 `interactions` 型別。
- `interactions.create` 單輪輸入欄位是 `input`（非 `user_input`/`contents`），回應結構與 `generateContent` 不同（需從 `steps` 取 `model_output`）。
- 免費方案 Interactions API 呼叫仍受速率限制；生產環境建議加 cache / 降級（route 已有 mock 降級）。
