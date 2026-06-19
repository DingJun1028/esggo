# ESGss x JunAiKey 系統 - 文件最佳實作指南

**文件版本**: v7.0.0-sentient
**更新日期**: 2026-02-18
**適用範圍**: 全域 `.md`, `.mdx` 文件與程式碼註解

---

## 一、文件協議準則

### 1. MECE 完整性原則
- **實作**: Mutually Exclusive, Collectively Exhaustive。
- **要求**: 文件架構需涵蓋所有核心情境，且不應產生邏輯衝突或重疊區塊。

### 2. DRY (Don't Repeat Yourself)
- **原則**: 避免在多個文件中重複維護相同的實作規範。
- **做法**: 使用指向性連結或單一刻印來源 (SSOT) 指向核心規格。

### 3. 讀取與視覺感知優化
- **要求**: 段落不超過 80 個字，每個段落間隔。
- **做法**: 使用項目符號 (Bullet Points) 代替冗長的大段落。

---

## 二、導航架構與快照對應表

為了維護對應穩定性，請遵循以下目錄路徑：

| 範疇 | 頂層路徑 | 對應文件 | 功能說明 |
| :--- | :--- | :--- | :--- |
| **系統全景** | `README.md` | `ARCHITECTURE.md` | 用於高階對齊並定義核心架構細節 |
| **快速啟動** | `QUICKSTART.md` | `STARTUP_GUIDE.md` | 引導開發者快速完成環境配置 |

---

## 三、技術文檔規範 (TypeScript)

### 1. 介面與方法的規範
所有主要 Service 方法需包含 TSDoc 註解，並符合 4T 驗證：
- `@param`: 描述參數類型與用途。
- `@returns`: 描述返回對象結構。
- `@example`: 提供簡單的 5T 驗證實作範例。

### 2. 數據流向繪製 (Mermaid)
透過 Mermaid 程式碼區塊繪製系統流向，確保文件內容具備可視化能力。

---

## 四、修訂與版控流程規範

### 1. Semantic Versioning (SemVer)
- **Major**: 系統架構變動。
- **Minor**: 新功能或重要文案更新。
- **Patch**: 拼字修正或格式微調。

### 2. Commit 規範
- `docs(scope): message` (例如: `docs(api): update documentation schema`)

---

## 五、檢核清單 (Review Checklist)

- [x] **編碼確認**: 確保文件使用 UTF-8 無 BOM。
- [x] **連結完整**: 所有內部與外部連結路徑皆有效。
- [x] **標籤對齊**: 版本號與系統當前版本一致。
- [x] **MECE 檢覈**: 邏輯上無重複且無遺漏。

---

*數據受信，永恆傳承。*
ESGss 文件審閱委員會
2026-02-18
