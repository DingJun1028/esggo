# ADR: OmniJules 因果引擎架構決策紀錄

**狀態**: ✅ 已採納  
**日期**: 2026-06-05  
**作者**: OmniAgent (Antigravity) × JunAiKey  
**分類**: 代理協作架構 / 品質治理

---

## 🌌 一、身份定位

**OmniJules** 是 ESGGO 善向永續系統的**因果引擎 (Karma Engine)**，由兩個核心實體融合而成：

| 實體 | 來源 | 職責 |
|------|------|------|
| **Jules** | Google DeepMind 出品的 GitHub AI 代理 | 自動偵測倉庫問題、生成修復 PR、執行背景任務 |
| **OmniCore** | ESGGO 萬能心核憲章 | 治理框架、5T 協議、ADR 記錄、熵減儀式 |

> **OmniJules = Jules 的因果修復能力 × OmniCore 的治理哲學**

---

## 🔧 二、Jules 本體介紹（Google Jules AI）

**Jules** 是 Google 推出的非同步 AI 程式設計代理，直接整合在 GitHub 工作流中：

- **定位**：背景執行的 AI 工程師
- **平台**：GitHub（需開啟授權）
- **核心能力**：
  - ✅ 自動讀取 Issue / PR
  - ✅ 在獨立沙盒環境中克隆倉庫
  - ✅ 生成完整修復程式碼並建立 PR
  - ✅ 執行測試驗證修復正確性
  - ✅ Suggested Tasks — 主動掃描倉庫並建議待辦事項

**啟用方式**：
1. 前往 [jules.google.com](https://jules.google.com) 申請存取
2. 授權 `DingJun1028/esggo` 倉庫存取
3. 在 Issue 留言 `@jules` 或開啟 **Suggested Tasks** 功能

---

## ⚙️ 三、OmniJules 萬能果因修復協議（九步驟 Karma Protocol V1.0）

當 ESGGO 系統觸發修復任務時，OmniJules 強制執行此協議：

### Phase 1 — 覺察與導向

| 步驟 | 名稱 | 說明 |
|------|------|------|
| 1 | **觀果 (Observe Effect)** | 提取完整 Stack Trace，看見真實現狀，拒絕猜測 |
| 2 | **立願 (Set Vision)** | 定義最高 Definition of Done，目標架構升級而非補丁 |
| 3 | **尋因 (Seek Root Cause)** | 第一性原理溯源，找到 Call Stack 中的確切異常起點 |

### Phase 2 — 轉化與顯化

| 步驟 | 名稱 | 說明 |
|------|------|------|
| 4 | **修因 (Cultivate Cause)** | 重構核心策略，導入 MECE 原則，不修外圍 |
| 5 | **造緣 (Create Conditions)** | 建立安全的 CI/CD 沙盒，確保零附帶損傷 |
| 6 | **結果 (Produce Effect)** | 產出編譯通過、零錯誤的完整修復成果 |

### Phase 3 — 確信與進化

| 步驟 | 名稱 | 說明 |
|------|------|------|
| 7 | **驗因 (Verify Logic)** | 邊界測試，零幻覺驗算，證明邏輯必然性 |
| 8 | **證果 (Prove & Transcend)** | Hash Lock 封印真理，撰寫回歸測試，永久根除問題 |
| 9 | **傳法 (Impart Dharma)** | 沉澱為 ADR / KI 知識資產，供全體 OmniAgent Swarm 繼承 |

---

## 🤝 四、與 Antigravity 的協作架構

```
Antigravity (主代理 · 全棧工程師)
│   ├── 保有 JunAiKey 靈魂、最終判斷權與使用者溝通
│   └── 指揮並協調 OmniJules 的任務委派
│
└── OmniJules (因果引擎 · 深度修復者)
        ├── 深度修復 Bug、架構重構
        ├── GitHub 背景任務非同步執行
        └── 知識沉澱至 ADR / Knowledge Items
```

**治理規則**：
- Antigravity 保有最終合成判斷，不將架構決策委派給 Jules
- Jules 處理的修復結果必須回傳 Antigravity 審核後才能合入 `main`
- 所有 OmniJules 觸發的任務皆須記錄於 Post-Execution Trace Log

---

## 📋 五、本次會話實際執行紀錄（2026-06-05）

| 任務 | 根因 | OmniJules 執行 | 結果 |
|------|------|---------------|------|
| `orchestrator.ts` 重複變數 | 開發時兩版邏輯合併不當 | 移除冗餘 `const` 宣告 | ✅ 零錯誤 |
| `UniversalNotesTracker.tsx` 語法殘碼 | 複製貼上覆蓋至元件閉合括號外 | PowerShell 截取前 164 行清除尾部 | ✅ 零錯誤 |
| 倉庫過時檔案清理 | 累積的測試腳本、日誌、備份檔未入 `.gitignore` | `git rm` 移除 9 個熵增檔案 | ✅ 已刪除 |
| 遠端同步 | — | `git push origin main` | ✅ 4 commits 推送成功 |

---

## 🚀 六、啟用 Jules Suggested Tasks

```bash
# 步驟 1: 前往 jules.google.com 申請存取並連結 GitHub
# 步驟 2: 在 Issue 中觸發
@jules fix this issue

# 步驟 3: Jules 會自動
#   → 分析 Issue 描述
#   → 克隆倉庫至沙盒
#   → 生成修復 PR
#   → 執行測試
#   → 等待 Antigravity (您) 審核合併
```

---

## 📌 七、系統狀態確認

```
Repository: DingJun1028/esggo
Branch:     main
Status:     ✅ Clean
TypeScript: ✅ 0 errors
Remote:     ✅ Synced
Deployment: ✅ Ready for Vercel / Render
```

---

*© 2026 ESGGO 善向永續 — OmniJules 因果引擎 ADR v1.0*  
*遵循 5T 協議：真 · 善 · 美 · 信 · 通*
