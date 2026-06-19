# Sustainable Village Roadmap - 永續村莊發展與缺口補完計畫

> **更新日期**: 2026-02-18
> **系統版本**: v8.2.1-Sentient Learning
> **當前狀態**: 執行中 / 補缺

---

## 一、已完成事項 - 持久化與核心協議實作

### 1.1 核心服務與協議
| 類別 | 路徑 | 狀態 | 描述 |
|------|------|------|------|
| **GlobalPulseService** | [`src/services/GlobalPulseService.ts`](../src/services/GlobalPulseService.ts) | 已完成 | 全球脈動核心，處理 ESG 事件共鳴與 5T 數據注入。 |
| **GamificationService** | [`src/services/GamificationService.ts`](../src/services/GamificationService.ts) | 已完成 | 遊戲化引擎，結合 5T 協議進行 `crystallizeProgress()` 進度結晶。 |
| **EcosystemPulse** | [`src/components/village/EcosystemPulse.tsx`](../src/components/village/EcosystemPulse.tsx) | 已完成 | 3D 多維核心視覺化，呈現環境與社會共鳴狀態。 |

### 1.2 UI/UX 頁面實作
| 頁面 | 路徑 | 狀態 | 描述 |
|------|------|------|------|
| **VillagePrototype** | [`src/pages/VillagePrototype.tsx`](../src/pages/VillagePrototype.tsx) | 已完成 | ESG Go 3D 概念頁面，實作 Liquid Glass 反饋機制。 |
| **SustainableVillagePage** | [`src/pages/SustainableVillagePage.tsx`](../src/pages/SustainableVillagePage.tsx) | 已完成 | 永續村莊主導航頁面，整合 5T 指標與各類功能建築。 |

### 1.3 導航與路由配置
| 項目 | 路徑 | 狀態 | 描述 |
|------|------|------|------|
| **App.tsx 路由** | [`src/App.tsx`](../src/App.tsx) | 已完成 | 新增 `/sustainable-village` 路由對應至主頁面。 |
| **導航配置** | [`src/navigation.config.ts`](../src/navigation.config.ts) | 已完成 | 在主選單中註冊「永續村莊」入口。 |

### 1.4 驗證腳本
| 腳本 | 路徑 | 狀態 | 描述 |
|------|------|------|------|
| **test_village_sync.ts** | [`scripts/test_village_sync.ts`](../scripts/test_village_sync.ts) | 已完成 | 驗證村莊數據同步與 Phase 88 邏輯。 |
| **test_village_logic.ts** | [`scripts/test_village_logic.ts`](../scripts/test_village_logic.ts) | 已完成 | 驗證 GlobalPulseService 核心協議邏輯。 |

---

## 二、數據持久化與 L2 快取優化方案

### 2.1 數據同步與恢復
| 功能 | 描述 | 優先級 | 複雜度 |
|------|------|--------|----------|
| **localStorage 快照** | 在本地存儲 VillageState，確保頁面重新整理後狀態不丟失。 | 高 | 中 |
| **Supabase 雲端同步** | 將 5T 結晶數據持久化至 Supabase 數據庫，實現跨端一致。 | 高 | 高 |
| **成就系統同步** | 與 GamificationService 異步對接，確保等級與 XP 合法性。 | 中 | 高 |

### 2.2 建築物與資源系統
| 功能 | 描述 | 優先級 | 複雜度 |
|------|------|--------|----------|
| **動態資源生成** | 基於 XP 等級動態生成村莊資源 (Eco Credits)。 | 中 | 中 |
| **建築狀態視覺化** | 使用 3D 模型渲染不同的建築等級。 | 低 | 高 |
| **解鎖機制** | 實作 5T 指標門檻觸發的建物解鎖系統。 | 高 | 中 |

---

## 三、階段性發展里程碑與預計時間

### 3.1 發展階段
| 階段 | 核心目標 | 預計時間 | 衡量指標 |
|------|----------|----------|----------|
| **Phase 1** | 本地數據持久化實作 | 1 週 | 頁面刷新後數據恢復率 100% |
| **Phase 2** | 建築解鎖協議實作 | 1-2 週 | 建物解鎖邏輯驗證通過 |
| **Phase 3** | Supabase 實時同步 | 2 週 | 雲端與本地數據延遲 < 500ms |
| **Phase 4** | 3D 視覺化增強 | 3-4 週 | 實施 Liquid Glass 2.0 渲染 |

---

## 四、技術挑戰與解決方案

### 4.1 潛在問題與對策
| 挑戰 | 描述 | 解決途徑 |
|------|------|----------|
| **Service 整合衝突** | 多個服務同時修改狀態。 | 定義統一的狀態鎖與共鳴優先權。 |
| **ESM 模組相容性** | 部分 `.js` 腳本整合至 TS 項目時報錯。 | 強制執行類型定義與絕對路徑映射。 |
| **5T 驗證效能** | 頻繁執行 SHA-256 簽署導致延遲。 | 採用 Batch Sealing (批量封印) 策略。 |

---

## 五、優先開發矩陣 (P0-P3)

### 5.1 優先級定義
| 優先級 | 功能 | 預計時間 | 開發主體 |
|--------|------|----------|----------|
| **P0** | 5T 批量封印機制 (SHA-256) | 3-5 天 | 核心開發組 |
| **P0** | 多代理由簽章與共識驗證 | 1 週 | AI 代理組 |
| **P1** | localStorage 快照與恢復 | 2 天 | 前端開發組 |
| **P1** | 建築解鎖協議初步對接 | 1 週 | 系統開發組 |

---

## 六、驗證與測試流程

### 6.1 自動化測試
```bash
# 執行永續村莊同步驗證
npx ts-node scripts/test_village_sync.ts

# 執行 5T 遊戲化驗證
npx ts-node scripts/test_village_gamification_5t.ts
```

---

## 七、結語

永續村莊系統已完成初步骨幹建設。下階段將重點聚焦於「數據持久化」與「5T 批量封印」的穩定性。

1. **短期目標**: 確保所有操作皆具備 Traceable (可溯源) 特性。
2. **中期目標**: 建立穩定的雲端同步機制。
3. **長期目標**: 實現全 3D 化、液態玻璃感知的永續生態系統。

---
> **"上善若水，善向永續。"**
> *The ultimate governance is balance. The ultimate balance is eternity.*
