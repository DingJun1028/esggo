# 數位分身中心 (Digital Avatar Center) 設計規格書

## 1. 服務概觀 (Service Overview)
*   **核心目標**：將用戶在平台上的所有數據實踐（如節能、學習、治理參與）視覺化為一個動態進化的「數位分身」。
*   **5T 實踐**：
    *   **Tangible**：可視化的 3D/2D 分身形態與能力矩陣。
    *   **Traceable**：分身的每一項能力值 (Skills) 均有對應的歷史日誌與活動數據。
    *   **Trackable**：紀錄分身的進化路徑與等級提升歷程。
    *   **Transparent**：公開屬性計算權重（例如：一小時學習 = X 點智慧屬性）。
    *   **Trustworthy**：分身狀態定期快照並執行誠信哈希。

## 2. 功能模組 (Functional Modules)
*   **A1: 分身核心儀表板**：顯示屬性（智、仁、勇、誠、節、和）、等級與當前狀態。
*   **A2: 屬性同步引擎**：自動從 `SovereignVault` 與 `CarbonAccounting` 抓取變動數據。
*   **A3: 裝備與徽章庫**：展示用戶獲得的 5T 數位資產硬體或榮譽。
*   **A4: 行為日誌 (Path-log)**：查看所有對分身屬性產生影響的操作細節。

## 3. 教學引引導 (Onboarding Steps)
1. **覺醒我的分身**：完成個人 ESG 初衷設定，初始化分身屬性。
2. **理解連結**：學習「我的操作」如何轉化為「分身的能量」。
3. **資產裝載**：示範如何將獲得的資產（如碳盤存證照）裝備於分身上。

## 4. 數據結構 (Data Schema)
```typescript
interface DigitalAvatar {
  uuid: string;
  name: string;
  level: number;
  xp: number;
  attributes: {
    wisdom: number;
    benevolence: number;
    courage: number;
    integrity: number;
    temperance: number;
    harmony: number;
  };
  equippedAssets: string[]; // UUIDs of cards/badges
  lastSnapshotHash?: string;
}
```
