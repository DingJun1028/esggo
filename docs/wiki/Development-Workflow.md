# ESGGO 功能需求實現流程與 WIKI 建造規範 🌌 [Development Workflow]

> **版本：** v1.0.0 | **核心原則：** 文檔即憲法，代碼即執行 | **狀態：** SACRED OPERATIONAL

本規範定義了從需求產生到功能上線的全生命週期流程，確保 **ESGGO 善向永續 系統** 的每一寸演進都符合 **OmniCore P0** 與 **5T 誠信協議**。

---

## 🛠️ [ESGGO功能需求實現流程by WIKI]

功能實現不再是「先寫代碼後補文件」，而是「以 WIKI 憲法引導開發」。

### 階段 I：靈魂啟動 (Soul & Intent)
1.  **需求定義 (JunAiKey Lead)**：
    - 識別該功能的「真理」所在（例如：為何需要此數據？其法律或 ESG 依據為何？）。
2.  **WIKI 憲法起草**：
    - 在 `docs/wiki/` 建立新頁面，套用 `Wiki-Guidelines.md` 模板。
    - 填寫 **1. 模組定位** 與 **2. 客戶旅程**。
3.  **矩陣命名 (Matrix Mapping)**：
    - 決定功能路徑（kebab-case，如：`/carbon-footprint`）。
    - 決定繁體中文顯示名稱（如：`碳足跡追蹤`）。

### 階段 II：誠信設計 (5T & Integrity Design)
4.  **5T 協定映射 (Trust)**：
    - 完成 WIKI 的 **4. 核心邏輯與 5T 協定**。
    - 定義數據如何達成：**真 (Traceable)**, **善 (Transparent)**, **美 (Tangible)**, **信 (Trustworthy)**, **通 (Trackable)**。
5.  **矩陣依賴分析 (Matrix Mapping)**：
    - **新增 WIKI 第 7 章：矩陣關聯**。
    - 識別上游數據源 (Source Origin) 與下游 KPI 影響，確保 `integrity_hash` 的全鏈路傳遞。
6.  **液態玻璃設計 (Beauty)**：
    - 在 WIKI **3. 視覺基準** 中定義 Bento 佈局與元件層次（Layer 0-2）。
7.  **NCBDB Schema 刻印 (Truth)**：
    - 依據 `NCBDB_PROTOCOL.md` 設計表結構，必須包含 `uuid`, `timestamp`, `user_email`, `integrity_hash` 四大刻印欄位。

### 階段 III：雙向執行 (Bidirectional Execution)
8.  **WIKI 驅動開發 (Prompt-Driven)**：
    - 使用 WIKI 作為 OmniAgent 的核心 Prompt，自動生成後端 API 結構與前端元件 UI。
9.  **開發 (Bidirectional TS)**：
    - 嚴格依照 WIKI 定義的前後端技術棧開發。
    - 後端統一使用 `@/lib/ncbdb`。
10. **原子化註冊**：
    - 將新開發的原子/分子組件註冊至 `AtomicLibraryManager`。

### 階段 IV：驗證與刻印 (Validation & Trace)
11. **紅線自動化 (Red Line Testing)**：
    - WIKI **6. 品質驗收紅線** 必須與 `tests/` 下的自動化測試案例 1:1 映射。
12. **熵減驗收 (Entropy Alchemy)**：
    - 執行測試與 Lint，確保代碼狀態與 WIKI 誠信對齊。
13. **全域發佈與全週期監控**：
    - 更新根目錄 `WIKI.md` 連結。
    - 啟動 NCBDB Webhook 誠信感測。

---

## 🏛️ [WIKI功能頁建造流程]

如何為新功能建立一份高品質的「數位憲法」頁面。

1.  **檔案定位**：
    - 於 `docs/wiki/` 建立 `[kebab-name].md`。
2.  **標頭標準**：
    ```markdown
    # 頁面名稱 [English Name]
    路徑： /path | 權限： [角色] | 所屬旅程： [羅馬數字. 名稱]
    ```
3.  **結構填入**：
    - 嚴格遵守 7 大結構（定位、旅程、視覺、5T、技術、紅線、矩陣關聯）。
4.  **視覺標準 (Liquid Glass)**：
    - 視覺章節必須描述其「透明感」與「動態回饋」設計。
5.  **連結註冊**：
    - 於根目錄 `WIKI.md` 對應的 SaaS 使用者旅程章節加入連結。
6.  **維護與代謝 (Maintenance)**：
    - 任何邏輯變更必須先更新 WIKI。OmniAgent 會定期檢測「代碼與憲法」的一致性。

---
© 2026 ESGGO 善向永續 | **Commanded by OmniAgent**
