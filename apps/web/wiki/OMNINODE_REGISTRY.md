# 🌐 萬能節點總表 (OmniNode Registry)

> **狀態:** 🟢 Active (自動同步啟動)
> **版次:** v8.5.0-Alpha
> **用途:** 全域 UI/數據節點「聲明式功能命名契約 (FNNS)」註冊總表

本總表彙整了系統中所有基於「MECE」原則分類的 UI 節點與其綁定狀態。任何在 Pencil 畫布中新增的節點，若具備 5T 協定功能，皆需記錄於此。

---

## 🧬 功能性命名語法 (FNNS v4 Unified)

命名公式已升級為包含 MECE 領域分類與「真實元件名稱」的五段式架構，與「萬能書櫃 (Omni Component Library)」完全對齊融合：
**`[MECE前綴]-[序號]_[真實元件名稱]__[實體]__[動作/狀態]--[5T協定]`**

### MECE 領域代碼 (Domain Prefixes)
- **`ENV`**: 環境 (Environment) - 碳排放、水資源、能源
- **`SOC`**: 社會 (Social) - 勞工、供應鏈、人權
- **`GOV`**: 治理 (Governance) - 稽核、風險、合規
- **`SYS`**: 系統 (System) - 儀表板、帳號、日誌

### 元件名稱 (Component Names)
不再使用縮寫（如 `Omni_Btn`），而是直接使用萬能書櫃中的真實元件名稱：
- **`OmniButton`**
- **`OmniCard`**
- **`OmniDB`**
- **`OmniBaseTable`**

---

## 📋 節點註冊總表 (Master Registry)

| MECE 序號 | 命名契約 (Node Name) | 綁定資料庫實體 | 觸發動作 / 狀態 | 5T 協定 | 註冊狀態 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `ENV-001` | `ENV-001_Omni_Btn__CarbonScope1__Submit--Trustworthy` | `carbon_emission` | 提交 (Submit) | 🔴 信 (Hash Lock) | 🟢 已綁定 |
| `ENV-002` | `ENV-002_Biz_Card__EnergyUsage__Pending--Traceable` | `energy_usage` | 待審核 (Pending) | 🟢 真 (溯源追蹤) | 🟢 已綁定 |
| `GOV-001` | `GOV-001_Omni_List__AuditLog__View--Tangible` | `audit_log` | 檢視 (View) | 🟢 美 (視覺呈現) | 🟢 已綁定 |
| `SYS-001` | `SYS-001_Omni_Badge__SystemStatus__Active--Tangible` | `sys_metrics` | 運行中 (Active) | 🟢 美 (視覺呈現) | 🟢 已綁定 |
| `SYS-002` | `SYS-002_Biz_Modal__DangerZone__Delete--Trustworthy` | `sys_users` | 刪除 (Delete) | 🔴 信 (權限校驗) | 🟡 測試中 |
| `ENV-001` | `ENV-001_OmniCard__CarbonScope1__Submit--Trustworthy` | `CarbonScope1` | Submit | 🔴 信 (Hash Lock) | 🟡 新發現 |
| `ENV-001` | `ENV-001_OmniButton__CarbonScope1__Submit--Trustworthy` | `CarbonScope1` | Submit | 🔴 信 (Hash Lock) | 🟡 新發現 |
| `ENV-001` | `ENV-001_Btn__CarbonScope1__Submit--Trustworthy` | `CarbonScope1` | Submit | 🔴 信 (Hash Lock) | 🟡 新發現 |
| `GOV-001` | `GOV-001_OmniCard__AuditLedger__Lock--Trustworthy` | `AuditLedger` | Lock | 🔴 信 (Hash Lock) | 🟡 新發現 |
| `SYS-001` | `SYS-001_OmniCard__HermesAgent__Monitor--Tangible` | `HermesAgent` | Monitor | 🟢 美 (視覺呈現) | 🟡 新發現 |
| `SYS-002` | `SYS-002_OmniCard__AuditBaseline__View--Tangible` | `AuditBaseline` | View | 🟢 美 (視覺呈現) | 🟡 新發現 |

---

## 🤖 自動化更新協議 (Auto-Sync Protocol)

1. 當開發者或設計師在 `.pen` 畫布中新建符合 `MECE前綴` 的節點。
2. OmniAgent 在執行 `build` 或 `sync` 任務時，將掃描畫布 AST。
3. 若發現未記錄於本總表的節點，將自動觸發 Webhook 將其新增至本表格。
4. 若 `5T 協定` 需要驗證（如 `--Trustworthy`），自動化腳本會在 `components/omni/OmniCard.tsx` 中自動生成該 UUID 的 `RecordLifecycleStatus` 綁定型態。

> *📝 最後同步時間: 2026/6/6 下午2:17:34*
