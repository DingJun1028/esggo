# 🏛️ 善向永續：ESG All In One 系統架構規格書

## 版本資訊

- **版本**: 1.0.0
- **更新日期**: 2026-02-17
- **狀態**: 已實作

---

## 第一層：5T 邏輯門 (The 5T Logic Gate)

所有進入系統的數據流，必須依序通過以下五道檢驗門徑，確保願景能轉化為真實的影響力：

| 門徑 | 名稱                       | 定義                                               | 作用                       |
| ---- | -------------------------- | -------------------------------------------------- | -------------------------- |
| 1    | **Tangible 可感知**        | 將抽象的永續願景轉化為具體的指標成果與實作項目     | 確保「善向」不再是空談     |
| 2    | **Traceable 可溯源**       | 鏈式日誌必須包含原始資料來源 (source_origin)       | 確保每一筆數據都能回溯起點 |
| 3    | **Trackable 可追蹤**       | 生命週期 Hook 即時記錄數據流轉路徑                 | 實現數據全生命週期監控     |
| 4    | **Transparent 可透明驗算** | 算法公式公開化（如 [ISO-14064-1]），通過零幻覺驗證 | 消除黑箱，確保透明度       |
| 5    | **Trustworthy 不可篡改**   | 雜湊鎖定 (Hash Lock) 與 Object.freeze()            | 確保數據終極真實性         |

---

## 第二層：4+1 狀態機 (The 4+1 State Machine)

```typescript
interface IEvidenceMap {
  // 🟢 可感知 (Tangible)
  readonly tangible?: {
    metric?: string;
    visual_grade?: 'GOLD' | 'PLATINUM' | 'SOVEREIGN';
    glow_intensity?: number;
    is_crystallized?: boolean;
  };

  // 🟢 可溯源 (Traceable)
  readonly traceable?: {
    source_origin: string;
    verification_links?: string[];
    owner?: string;
  };

  // 🟢 可追蹤 (Trackable)
  readonly trackable?: {
    lifecycle_hooks: { event: string; timestamp: number; actor: string }[];
    pathway?: string[];
  };

  // 🟢 可透明驗算 (Transparent)
  readonly transparent?: {
    formula: string;
    validation_standard?: string;
    logic_source?: string;
  };

  // 🔴 不可篡改 (Trustworthy)
  readonly trustworthy?: {
    hash_lock?: string;
    is_frozen: boolean;
    locked_at?: number;
    zkpProof?: string;
    quantumSeal?: string;
  };
}
```

---

## UI/UX 設計系統：Liquid Glass (Cyan Sovereignty)

### 色彩規範

| Token 名稱       | 色碼                      | 用途           |
| ---------------- | ------------------------- | -------------- |
| `cyan-core`      | #06b6d4                   | 主要品牌強調色 |
| `emerald-soul`   | #10b981                   | 成功狀態、增長 |
| `void-stark`     | #020617                   | 深層背景色     |
| `glass-surface`  | rgba(15, 23, 42, 0.6)     | 模組基礎背景   |
| `glass-frosted`  | rgba(255, 255, 255, 0.05) | 邊框高亮       |
| `gold-sovereign` | #ffd700                   | 精英狀態       |

### 液態玻璃效果

```css
.liquid-glass {
  background: rgba(99, 166, 176, 0.08);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 20px;
}

.liquid-glass-strong {
  background: rgba(99, 166, 176, 0.15);
  backdrop-filter: blur(24px) saturate(200%);
  border-radius: 24px;
  box-shadow:
    0 8px 32px 0 rgba(31, 38, 135, 0.15),
    0 0 40px rgba(99, 166, 176, 0.2);
}
```

### Bento Box 佈局

```css
.bento-container {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-template-rows: repeat(6, 1fr);
  gap: 1.5rem;
  height: 100vh;
}

.bento-card {
  border-radius: 2rem;
  padding: 1.5rem;
}
```

---

## 平台功能對應表

| 階段    | 5T 門徑     | 平台功能           | 主要對象   | Dr. Thoth 任務       |
| ------- | ----------- | ------------------ | ---------- | -------------------- |
| 01 覺醒 | Tangible    | 目標設定與指標定義 | CEO/CSO    | 願景轉化為可衡量實體 |
| 02 連結 | Traceable   | 數據匯入與來源標註 | IT/人員    | 確保數據有「根」     |
| 03 流轉 | Trackable   | 生命週期路徑紀錄   | 管理員     | 監視數據模組間移動   |
| 04 煉金 | Transparent | 透明算法與公式驗算 | 審計師     | 消除黑箱，零幻覺     |
| 05 永恆 | Trustworthy | 雜湊鎖定與報告生成 | 利害關係人 | 數據真實性確認       |

---

## 實作狀態

| 元件             | 檔案位置                                   | 狀態      |
| ---------------- | ------------------------------------------ | --------- |
| IComponentCore   | `src/0-domain/contracts/IComponentCore.ts` | ✅ 已實作 |
| Liquid Glass CSS | `src/styles/liquid-glass.css`              | ✅ 已實作 |
| Bento 佈局       | `src/index.css`                            | ✅ 已實作 |
| OmniDataAdapter  | `src/services/data/OmniDataAdapter.ts`     | ✅ 已實作 |
| EsgDataMapper    | `src/services/data/EsgDataMapper.ts`       | ✅ 已實作 |
| OmniTruthEngine  | `src/1-service/OmniTruthEngine.ts`         | ✅ 已實作 |
| 數據整合測試     | `scripts/test-data-integration.ts`         | ✅ 已實作 |

---

_Generated on 2026-02-17 - ESGss JunAiKey InfoOne System_
