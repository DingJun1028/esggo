---
uuid: "a6fedba5-8072-4571-9e8b-2f24d84e9d61"
version: "1.1.0"
timestamp: "2026-06-06T00:00:00.000Z"
evidence: "OMNICOMPONENT_REGISTRY.md"
---
# OmniBookcase Registry (萬能書櫃元件總表)

> **全系統命名融合**：結合「萬能書櫃」(OmniBookcase) 的收納性與「萬能元件」(OmniComponent) 的靈活性，本總表落實了 MECE (Mutually Exclusive, Collectively Exhaustive) 原則，並以 5T+1 維度嚴格控管。

## MECE 元件分類 (Component Categories)
- **Atom (原子元件)**：不可再分割的基礎 UI 單元（如：按鈕、圖示、標籤）。
- **Molecule (分子元件)**：由多個原子組成的功能單元（如：搜尋框、指標卡片）。
- **Organism (組織元件)**：由分子組成的複雜區塊（如：導覽列、資料表）。
- **Template (模板元件)**：定義頁面佈局的骨架。

## 5T + 1 維度 (5T + 1 Dimensions)
1. **Tangible (可感知)**：視覺化指標具體化
2. **Traceable (可溯源)**：`source_origin` 鏈式日誌
3. **Trackable (可追蹤)**：生命週期 Hook 紀錄
4. **Transparent (可驗算)**：公開算法公式
5. **Trustworthy (不可篡改)**：Hash Lock 封印
6. **元件歸屬 (Attribution)**：萬能元件 (Omni Component)

---

## 總表 (Registry Matrix)

| 序號 (ID) | 種類 (Type) | 名稱 (Name) | 狀態 (Status) | 元件歸屬 | Tangible | Traceable | Trackable | Transparent | Trustworthy | 按鈕 (Actions) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| OMNI-001 | Molecule | BrandKpiCard | 運作中 | 萬能元件 | 🟢 | 🟢 | 🟢 | 🟢 | 🔴 | [檢視] [編輯] |
| OMNI-002 | Organism | GenesisConsole | 運作中 | 萬能元件 | 🟢 | 🟢 | 🟢 | 🟢 | 🔴 | [檢視] [編輯] |
| OMNI-003 | Atom | AtomicButton | 測試中 | 萬能元件 | 🟢 | 🟢 | 🟡 | 🟡 | 🔴 | [檢視] [編輯] |
| OMNI-004 | Template | OmniCoreShell | 運作中 | 萬能元件 | 🟢 | 🟢 | 🟢 | 🟢 | 🔴 | [檢視] [編輯] |
| OMNI-005 | Molecule | OmniBookcaseRegistry | 開發中 | 萬能元件 | 🟢 | 🟢 | 🟢 | 🟢 | 🔴 | [檢視] [編輯] |

> **自動更新機制 (Auto-Sync Mechanism)**：本 Wiki 將與系統內的 `OmniBookcaseRegistry` React 元件狀態同步更新，確保文件與實作的一致性。
