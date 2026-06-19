# 🧪 InfoOne 萬能最佳實踐工作流 (Best Practice Flow)

> **版本**: v1.0.0  
> **版本**: v1.0.0
> **核心準則**: 「一眼觀果，本因修復」
> **適用範圍**: 視覺修復、功能增益、架構重構

---

## 🌀 第一階段：覺察與導向 (Awareness)

1. **觀果 (Observe)**: 使用 `browser_subagent` 或 `grep_search` 鎖定異常現象。
2. **尋因 (Trace)**: 定位至具體代碼、CSS 變數或 API 節點。
3. **立願 (Goal)**: 定義 DoD (Definition of Done)，例如「Light/Dark 模式皆符合 AAA 對比標準」。


## 🌀 第二階段：轉化與顯化 (Transformation)

1. **修因 (Heal)**:
    - 嚴禁 hardcode 顏色，必須使用 `var(--theme-*)`。
    - 確保 `LiquidGlassContainer` 的 `intensity` 符合場景需求。
    - 凡涉及數據處置，必先導入 `IComponentCore` 介面。

2. **造緣 (Manifest)**:
    - 執行代碼修改。
    - 若有 UI 變更，同步更新 `UNVIERSAL_PROJECT_REQUIREMENTS.md`。
    

## 🌀 第三階段：驗證與傳法 (Verification & Mastery)

1. **驗因 (Verify)**:
    - 執行 `npm run build`。
    - 使用 `browser_subagent` 進行視覺驗證並截圖。

2. **傳法 (Share)**:
    - 更新 `walkthrough.md`。
    - 若發現通用規律，寫入系統 `KIs` (Knowledge Items)。

---
### 「服務即教學，知識即資產。」 —— InfoOne 智能團隊

