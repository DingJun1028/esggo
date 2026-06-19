# 我的儀表板中心 (Personal Dashboard Center) 設計規格書

## 1. 服務概觀 (Service Overview)
*   **核心目標**：作為用戶在 InfoOne 平台的個人主控台，整合資產狀態、學習進度、分身動態與待辦任務。
*   **5T 實踐**：
    *   **Tangible**：可視化的資產總額與里程碑牆。
    *   **Traceable**：所有數據點均可追溯至對應的子系統（如碳排、學院）。
    *   **Trackable**：紀錄用戶的日/週/月度永續貢獻趨勢。
    *   **Transparent**：清晰展現等級提升與積分獲得規則。
    *   **Trustworthy**：個人主修煉場景的最終數據定期進行誠信封存。

## 2. 功能模組 (Functional Modules)
*   **D1: 永恆宮殿總覽**：彙整分身、等級、XP 與數位資產總額。
*   **D2: 任務導航 (Mission Matrix)**：即時顯示正在進行的 ESG 任務與報告進度。
*   **D3: 資產清單**：按 5T 協議分類的知識卡牌、徽章與證照。
*   **D4: 全球排名與社交**：顯示用戶在生態圈中的影響力排名。

## 3. 教學引引導 (Onboarding Steps)
1. **探索主控台**：了解各個區塊的功能與數據關聯。
2. **設定我的北極星**：選擇首要的永續發展目標，優化導覽視圖。
3. **資產變現學習**：理解如何將學習成果轉化為可信資產。

## 4. 數據結構 (Data Schema)
```typescript
interface PersonalDashboard {
  userId: string;
  avatarId: string;
  activeMissionIds: string[];
  recentActivity: ActivityLog[];
  statSummary: {
    totalTco2eSaved: number;
    skillsMastered: number;
    badgesCount: number;
  };
}
```
