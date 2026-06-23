# 5T 誠信協議 (5T Integrity Protocol) - 正確對應

## 5T = 真善美信通

**重要：「真善美信通」是中文口訣，順序非 T1-T5 技術編號順序**

| 代碼 | 英文            | 中文 | 核心定義                   | 技術實作                                  |
| ---- | --------------- | ---- | -------------------------- | ----------------------------------------- |
| T1   | **Tangible**    | 美   | 抽象數據轉化為具體治理指標 | Bento Grid 視覺化 + Skeleton Loader       |
| T2   | **Traceable**   | 真   | 每筆數據與原始憑證精確關聯 | `evidence_id` 外鍵 + `source_origin` 欄位 |
| T3   | **Trackable**   | 信   | 完整編輯軌跡與生命週期追蹤 | `audit_logs` 表 + 生命週期 Hook           |
| T4   | **Transparent** | 善   | 主動掃描綠漂風險，算法公開 | AI 合規引擎 + GRI 對齊檢查                |
| T5   | **Trustworthy** | 通   | SHA-256 雜湊鎖定，不可篡改 | `hash_lock` 欄位 + `Object.freeze()`      |

## UCC 誠信協議核心架構

### T1 Tangible (美) — 具體治理

- **定義**：將抽象的永續願景轉化為具體的指標成果與實作項目
- **實作**：Bento Grid 視覺化 + Skeleton Loader
- **驗收**：指標是否已具體化？

### T2 Traceable (真) — 原始憑證

- **定義**：每筆數據皆夾帶 `source_origin` 與完整 `flow_path`
- **實作**：`evidence_id` 外鍵 + `source_origin` 欄位
- **驗收**：來源是否已標註？

### T3 Trackable (信) — 生命軌跡

- **定義**：完整生命週期日誌，request_id 全程追蹤
- **實作**：`audit_logs` 表 + 生命週期 Hook
- **驗收**：路徑是否已紀錄？

### T4 Transparent (善) — 算法公開

- **定義**：主動掃描綠漂風險，算法公式公開化
- **實作**：AI 合規引擎 + GRI 對齊檢查
- **驗收**：公式是否已公開且通過驗證？

### T5 Trustworthy (通) — 不可篡改

- **定義**：數據寫入後即刻執行雜湊鎖定
- **實作**：`hash_lock` 欄位 + `Object.freeze()`
- **驗收**：雜湊鎖定是否已完成？

## 4 可 1 不可狀態機

- **可感知** (Tangible/美)：指標是否已具體化？
- **可溯源** (Traceable/真)：來源是否已標註？
- **可追蹤** (Trackable/信)：路徑是否已紀錄？
- **可透明驗算** (Transparent/善)：公式是否已公開且通過驗證？
- **不可篡改** (Trustworthy/通)：雜湊鎖定是否已完成？

## 使用範例

```typescript
// 正確的 5T 狀態型別
interface FiveTStatus {
  tangible: boolean;      // T1: 美 - 具體治理
  traceable: boolean;     // T2: 真 - 原始憑證
  trackable: boolean;     // T3: 信 - 生命軌跡
  transparent: boolean;   // T4: 善 - 算法公開
  trustworthy: boolean;   // T5: 通 - 不可篡改
}

// Protocol5TStrip 使用方式
<Protocol5TStrip
  status={[true, true, true, true, true]}
  showLabels
/>
// 顯示: Tangible · Traceable · Trackable · Transparent · Trustworthy

// 自訂中文標籤
<Protocol5TStrip
  status={[true, true, true, false, false]}
  labels={['美', '真', '信', '善', '通']}
  showLabels
/>
```
