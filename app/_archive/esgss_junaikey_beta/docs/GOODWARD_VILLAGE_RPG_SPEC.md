# 善向永續村 RPG 與卡牌遊戲 (Goodward Village RPG) 設計規格書

## 1. 服務概觀 (Service Overview)
*   **核心目標**：透過遊戲化 (Gamification) 驅動用戶的永續行為。用戶在平台的每一項數據操作（如減少碳排、完成課程）都會轉化為遊戲中的發展資源、XP 或稀有卡牌。
*   **5T 實踐**：
    *   **Tangible**：可視化的村莊建設與 5T 數位卡牌收集冊。
    *   **Traceable**：每一張「知識卡牌」的屬性（如：太陽能卡 +5 綠能點）均連結回用戶真實的數據鏈。
    *   **Trackable**：紀錄村莊從「荒廢」到「涅槃」的動態發展路徑。
    *   **Transparent**：公開任務獎勵機制與抽卡機率核心。
    *   **Trustworthy**：稀有成就卡牌執行數位簽章與 Hash 鎖定，具備資產價值。

## 2. 功能模組 (Functional Modules)
*   **G1: 村莊發展視圖**：展示村莊現狀（建築、環境、滿意度）。
*   **G2: 任務系統 (Daily Quests)**：與 ESG 活動對接的遊戲化任務。
*   **G3: 卡牌收藏與合成**：將「碎片化」的知識數據組合成完整的「知識資產卡」。
*   **G4: 資源中心**：管理金幣、XP 與 5T 能量晶體。

## 3. 教學引引導 (Onboarding Steps)
1. **進入永續村**：初次抵達荒廢村莊，了解發展願景。
2. **領取第一張卡牌**：導入用戶現有的 ESG 成就作為初始資源。
3. **完成首個任務**：示範數據操作如何瞬間轉化為遊戲進度。

## 4. 數據結構 (Data Schema)
```typescript
interface VillageState {
  level: number;
  unlockedBuildings: string[];
  population: number;
  environmentScore: number;
  happiness: number;
  cardInventory: KnowledgeCard[];
}

interface KnowledgeCard {
  id: string;
  type: 'Environment' | 'Social' | 'Governance';
  rarity: 'Common' | 'Rare' | 'Epic' | 'Trustworthy';
  powerPoints: number;
  dataLink: string; // URL/UUID to source 5T data
}
```
