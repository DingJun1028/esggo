# 🏛️ ESG GO 商業偵情中心實作計劃

## 策略背景

- **發起人**：策略長 洪鼎竣 (Jun Hong)
- **收件人**：CEO 楊博 (Yang Bo)
- **日期**：2026-01-13
- **目標**：建構 12.65M 價值護城河

---

## 核心架構：5T 協議門

| 5T 協議     | 狀態        | 哲學          | 實作定義                    |
| ----------- | ----------- | ------------- | --------------------------- |
| Tangible    | 🟢 可感知   | 美 (Beauty)   | 液態玻璃質感 UI             |
| Traceable   | 🟢 可溯源   | 真 (Truth)    | source_origin 鏈式日誌      |
| Trackable   | 🔵 可追蹤   | 真 (Truth)    | 生命週期 Hook               |
| Transparent | 🟠 可透明   | 善 (Goodness) | 零幻覺驗算 + ISO 標籤       |
| Trustworthy | 🔴 不可篡改 | 信 (Trust)    | Hash Lock + Object.freeze() |

---

## S1-S5 情資分類學

- **S1 全球治理**：UN, UNFCCC（法規與政策前兆）
- **S2 揭露框架**：ISSB, TCFD（企業必備語言）
- **S3 全球智庫**：WEF, MIT（系統性風險）
- **S4 資本金融**：NGFS, PRI（資本定價風險）
- **S5 產業技術**：SEMI, TSMC ESG（落地現實）

---

## 實作任務清單

### Phase 1: 5T 核心引擎 (Core Engine)

- [ ] 建立 `src/core/5t-protocol/` 目錄結構
- [ ] 實作 `IIntelNode5T` 介面 (TypeScript)
- [ ] 實作 `processReconnaissanceIntel()` 函數
- [ ] 整合 Hash Lock 機制 (SHA-256)
- [ ] 實作 Object.freeze() 寫入保護

### Phase 2: S1-S5 情資聚合器

- [ ] 建立 `src/services/reconnaissance/` 服務層
- [ ] 實作 S1-S5 分類 Mapper
- [ ] 建立 30+ 源頭機構的資料結構
- [ ] 實作 API 路由 `/api/reconnaissance/`

### Phase 3: 液態玻璃 UI 組件

- [ ] 建立 `src/components/reconnaissance/` 目錄
- [ ] 實作 `IntelCard5T` 組件 (Bento Box 佈局)
- [ ] 實作 5T 狀態指示燈號
- [ ] 整合 Liquid Glass 視覺效果
- [ ] 建立 `/app/omni/reconnaissance/page.tsx` 頁面

### Phase 4: 資料庫 Schema

- [ ] 設計 `intel_reconnaissance_hub` table
- [ ] 建立 GIN 索引優化查詢
- [ ] 實作 hash_lock 唯一性約束

### Phase 5: 價值核算

- [ ] 實作避險價值計算模組 (S4+S5)
- [ ] 實作合規自動化溢價模組 (S2)
- [ ] 實作策略先行優勢模組 (S1+S3)

---

## 輸出產出

1. **TypeScript Core**: `src/core/5t-protocol/intel-node.ts`
2. **React UI**: `src/components/reconnaissance/IntelCard5T.tsx`
3. **API Route**: `src/app/api/reconnaissance/route.ts`
4. **Database**: PostgreSQL Schema
5. **Page**: `/omni/reconnaissance`

---

_Plan Created: 2026-03-08_ _Status: Ready for Implementation_
