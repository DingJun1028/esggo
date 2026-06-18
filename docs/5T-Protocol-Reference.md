# 5T 誠信協議 (5T Integrity Protocol) - 正確對應

## 5T = 真善美信通

| 代碼 | 英文（正確）    | 中文（正確） | 說明                                                                  |
| ---- | --------------- | ------------ | --------------------------------------------------------------------- |
| T1   | **Tangible**    | 真           | 可感知/具體化：將抽象的永續願景轉化為具體的指標成果與實作項目。       |
| T2   | **Traceable**   | 善           | 可溯源：鏈式日誌必須包含原始資料來源 (source_origin) 備註。           |
| T3   | **Trackable**   | 美           | 可追蹤：利用生命週期 Hook 即時記錄數據在平台間的流轉路徑。            |
| T4   | **Transparent** | 信           | 可透明驗算：算法公式公開化，且必須通過「零幻覺驗證」。                |
| T5   | **Trustworthy** | 通           | 不可篡改：數據寫入後即刻執行雜湊鎖定 (Hash Lock) 與 Object.freeze()。 |

## 4 可 1 不可狀態機

- **可感知** (Tangible)：指標是否已具體化？
- **可溯源** (Traceable)：來源是否已標註？
- **可追蹤** (Trackable)：路徑是否已紀錄？
- **可透明驗算** (Transparent)：公式是否已公開且通過驗證？
- **不可篡改** (Trustworthy)：雜湊鎖定是否已完成？

## 常見錯誤對應（已棄用）

| 舊版（錯誤） | 新版（正確）    |
| ------------ | --------------- |
| Truth        | **Tangible**    |
| Goodness     | **Traceable**   |
| Beauty       | **Trackable**   |
| Trust        | **Transparent** |
| Transferful  | **Trustworthy** |

## 使用範例

```typescript
// 正確的 5T 狀態型別
interface FiveTStatus {
  tangible: boolean;      // T1: 真 - 可感知/具體化
  traceable: boolean;     // T2: 善 - 可溯源
  trackable: boolean;     // T3: 美 - 可追蹤
  transparent: boolean;   // T4: 信 - 可透明驗算
  trustworthy: boolean;   // T5: 通 - 不可篡改
}

// Protocol5TStrip 使用方式
<Protocol5TStrip
  status={[true, true, true, true, true]}
  showLabels
/>
// 顯示: Tangible · Traceable · Trackable · Transparent · Trustworthy

// 自訂標籤（可選用中文）
<Protocol5TStrip
  status={[true, true, true, false, false]}
  labels={['真', '善', '美', '信', '通']}
  showLabels
/>
```

## ADR 合規對應

- **T1 Tangible (真)**: GRI 覆蓋率矩陣、KPI 卡片數據完整度
- **T2 Traceable (善)**: 數據溯源路徑圖、evidence_id、source_origin
- **T3 Trackable (美)**: 合規事件時間軸、lifecycle hooks、event trail
- **T4 Transparent (信)**: AI 協作透明度分數、推理日誌、GRI 條款引用
- **T5 Trustworthy (通)**: SHA-256 hash lock、ZKP verification badge
