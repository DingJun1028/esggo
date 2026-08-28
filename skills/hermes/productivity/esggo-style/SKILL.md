---
name: esggo-style
description: User preferences for ESGGO work Traditional Chinese output concise format factual delivery
version: 1.0.0
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [style, preferences, zh-hant]
    category: productivity
---

# ESGGO Hub 風格指南

## 品牌用語一致性

主站與 JSON-LD / meta / sitemap / 靜態素材等處的品牌描述應使用一致的正式文案。

**望趣旅遊 建議主文案：**
> 台灣最懂戶外健康與永續行動的旅行解方品牌，提供企業員工旅遊、家庭日、ESG Team Day、Employee Wellbeing Retreat、ESG Impact Note 等客製方案。

**品牌別名：**
- 中文：望趣旅遊
- 英文：FTG TOURS

## 常見錯誤模式（避免）

- 文案微差：`企業戶外健康旅遊`、`FTG TOURS 望趣旅遊`、`企業員工旅遊…` 等短句在主站 meta、產品頁、JSON-LD 之間不一致，造成品牌識別稀釋。應統一使用上方建議主文案。
- 靜態素材引用漂移：`/vite.svg` 與 `/favicon.svg` 同時存在時，一律用 `/favicon.svg`。
- 五碼重建：頁面或靜態檔 hash 重建後，若引用舊 имя 會 404。
- 長篇敘述 → 直接給檔案內容 + 執行結果
- 混合語言 → 優先繁體中文
- 只描述不執行 → 必須跑完程式碼才算交付

## 輸出偏好

- **語言**：繁體中文為主，必要時用 English 關鍵字
- **語氣**：簡潔直接。只陳述事實，不寫「為什麼」的解釋
- **格式**：檔案交付用絕對路徑，CLI 環境不顯示 MEDIA:/ 標籤
- **技術報告**：健康檢查等報告直接列出結果與行動項目

## 實證驗證原則（來源：2026-08-05 實戰整理）

### 決斷錯誤要塞
- **「完成」不等於「驗證」**：每次宣稱任務完成前，必須執行真實工具驗證
- **.env 修改**：用 `cat` 或 `node -e "console.log(fs.readFileSync('.env', 'utf-8'))"` 確認內容，不能只看 write_file 回傳
- **程式碼變更**：必須貼出 `pnpm test`、`pnpm typecheck`、`pnpm lint` 的實際輸出
- **永不虛構數據**：`verified:true` 或 `exit_code: 0` 之類的字段是硬性驗證證據，非推測即可

### 連續任務處理
當用戶貼出大量 GitHub API 回傳作為「收集」任務時：
1. **分層處理**：先確定任務核心（如填 .env），其餘 API 回傳可視為上下文
2. **聚焦交付**：只落實真正需要的配置，避免過度處理
3. **結論簡潔**：完成後直接給出驗證結果與結束

## 交付標準

- **實際執行結果**：跑完程式碼後，要把真實的 tool output 貼出來
- **檔案路徑**：絕對路徑，直接寫
- **錯誤處理**：失敗要說「失敗」+ 原因 + 可行的替代方案
- **誠實報告（最高原則）**：宣稱狀態（如「IN SYNC」「已完成」「無 drift」）**不算交付**。必須實際執行驗證並貼出真實結果（missing/extra/mismatched 清單、tool output、比對證據）。受限 session 無法實跑時，明確標註「宣稱/未實證」並給出可執行的驗證路徑，不得偽裝成已驗證。
- **逐步報告規範**：編號報告（pipeline / 步驟清單）每步必須編號或顯式標「跳過」，不得留空、不得合理化缺口。

## OmniAuto 專案指令模式

以下指令觸發自動執行模式：

| 指令 | 行為 |
|------|------|
| **"繼續" (continue)** | 執行下一步，不給解釋；簡短輸出 |
| **"全部都是" (all of them)** | 自主完成所有任務，不逐步確認 |
| **"下一步" (next step)** | 依序執行；每步驟都要跑實測驗證 |
| **"完成" (done)** | 驗證完成；只顯示最終狀態 |
| **"依序進行" (in order)** | 按順序執行所有子任務 |

### 執行協議
1. **識別任務類型** 從使用者訊息
2. **立即執行** (對 "繼續", "全部都是", "下一步" 不要確認)
3. **驗證每一步** 用實際工具執行
4. **只報告最終結果** (不報告中間步驟)
5. **使用現有技能** - 當任務匹配時載入相關技能

## 範例

### 錯誤示範
> 我們來一步一步看如何建立這個插件...

### 正確示範
> 已完成：`C:\Users\dingj\AppData\Local\hermes\desktop-plugins\esggo-hub\plugin.js`
> 執行結果：
> ```
> PLUGIN_SYNTAX_OK
> routes: ['/status', '/events']
> ```