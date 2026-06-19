# 奧秘晉級系統技術文檔

## Unified Advancement System Documentation

**創建時間**: 2026-02-04  
**版本**: 1.0.0  
**核心理念**: 觸類旁通，舉一反三，融會貫通

---

## 目錄

1. [系統概述](#系統概述)
2. [核心功能](#核心功能)
3. [架構設計](#架構設計)
4. [API 接口](#api-接口)
5. [等級系統](#等級系統)
6. [跨服務整合](#跨服務整合)
7. [傳承系統](#傳承系統)
8. [智能推薦](#智能推薦)
9. [使用範例](#使用範例)

---

## 系統概述

### 願景

奧秘晉級系統是一個統一的用戶成長與學習管理平台，整合了：

- **永續報告書撰寫中心** - 提供報告書撰寫教學與生成服務
- **商情偵測中心** - 提供商情報告與分析服務

通過統一的晉級系統，讓用戶在兩個中心之間無縫切換，實現知識的觸類旁通。

### 核心理念

```
上善若水 → 萬法歸一 → 觸類旁通 → 舉一反三 → 融會貫通
```

- **上善若水**: 像水一樣靈活，適應各種學習場景
- **萬法歸一**: 統一管理報告書和商情兩大中心
- **觸類旁通**: 跨服務學習連接，發現知識關聯
- **舉一反三**: 智能推薦，觸類旁通
- **融會貫通**: 數據整合，統一分析

---

## 核心功能

### 1. 統一用戶進度管理

```typescript
interface UnifiedUserProgress {
  userId: string;
  combinedLevel: number;      // 統一等級
  combinedXP: number;         // 統一經驗值
  combinedTitle: string;      // 統一稱號
  
  reportProgress: {
    level: number;            // 報告書等級
    xp: number;               // 報告書經驗值
    title: string;            // 報告書稱號
    rank: RankLevel;          // 報告書Rank
  };
  
  marketProgress: {
    level: number;            // 商情等級
    xp: number;               // 商情經驗值
    title: string;            // 商情稱號
  };
  
  unifiedBadges: UnifiedBadge[];   // 統一徽章
  unifiedAchievements: UnifiedAchievement[]; // 統一成就
  statistics: UnifiedStatistics;   // 統計數據
  legacyPoints: number;           // 傳承點數
}
```

### 2. 跨服務經驗值管理

```typescript
// 經驗值加成系統
const XP_BONUS = {
  report: 1.0,      // 報告書基礎經驗
  market: 1.0,      // 商情基礎經驗
  cross: 1.5,       // 跨服務加成 50%
};

// 跨服務連接配置
const CROSS_SERVICE_CONNECTIONS = [
  {
    reportModule: 'src-01',
    marketModule: 'mic-01-01',
    connection: 'ESG 報告與企業情報分析相輔相成',
    xpBonus: 50,
  },
  // ... 更多連接
];
```

### 3. 智能推薦引擎

```typescript
interface SmartRecommendation {
  id: string;
  type: 'tutorial' | 'report' | 'analysis' | 'cross' | 'legacy';
  title: string;
  description: string;
  reason: string;           // 推薦原因
  priority: number;         // 優先級
  xpReward: number;         // 經驗值獎勵
  modules?: string[];       // 相關模組
  estimatedTime: number;    // 預估時間
  relevanceScore: number;   // 相關性分數 (0-1)
}
```

### 4. 學習路徑規劃

```typescript
interface LearningPath {
  id: string;
  name: string;
  description: string;
  steps: LearningStep[];           // 學習步驟
  totalXP: number;                 // 總經驗值
  totalTime: number;              // 總時間（分鐘）
  prerequisites: string[];         // 前置條件
  crossServiceConnections: CrossServiceConnection[]; // 跨服務連接
}
```

---

## 架構設計

### 服務層架構

```
┌─────────────────────────────────────────────────────────────┐
│                    UnifiedAdvancementService                  │
├─────────────────────────────────────────────────────────────┤
│  • getUserProgress()        • addExperience()              │
│  • addLegacyPoints()        • transferLegacyPoints()        │
│  • getSmartRecommendations() • getLearningPath()             │
│  • completeCrossServiceLearning()                            │
│  • analyzeProgressWithAI()   • generateLearningAdvice()      │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     UnifiedAdvancementRoutes                  │
├─────────────────────────────────────────────────────────────┤
│  GET  /progress/:userId     POST /experience                 │
│  GET  /recommendations     POST /cross-learning             │
│  GET  /learning-path        POST /legacy/points              │
│  POST /legacy/transfer      GET  /leaderboard                │
│  GET  /activities           POST /analyze                    │
└─────────────────────────────────────────────────────────────┘
```

### 數據流向

```
用戶請求 → API 路由 → 統一晉級服務 → 數據緩存 → 響應
           ↓
    AI 智能分析 → Gemini API → 個性化建議
```

---

## API 接口

### 用戶進度 API

#### GET /api/uas/progress/:userId

獲取用戶統一進度。

**響應示例**:
```json
{
  "success": true,
  "data": {
    "userId": "user-1",
    "combinedLevel": 5,
    "combinedXP": 650,
    "combinedTitle": "資深顧問",
    "reportProgress": {
      "level": 3,
      "xp": 180,
      "title": "專業作者",
      "rank": "practitioner"
    },
    "marketProgress": {
      "level": 4,
      "xp": 470,
      "title": "趨勢分析師"
    },
    "unifiedBadges": [...],
    "unifiedAchievements": [...],
    "statistics": {...},
    "legacyPoints": 150
  }
}
```

#### POST /api/uas/experience

添加經驗值。

**請求體**:
```json
{
  "userId": "user-1",
  "xp": 100,
  "type": "report",
  "metadata": {
    "moduleId": "src-01",
    "action": "tutorial_complete"
  }
}
```

### 智能推薦 API

#### GET /api/uas/recommendations/:userId

獲取智能推薦。

**響應示例**:
```json
{
  "success": true,
  "data": {
    "recommendations": [
      {
        "id": "rec-123",
        "type": "cross",
        "title": "觸類旁通",
        "description": "ESG 報告與企業情報分析相輔相成",
        "reason": "完成此跨服務學習可獲得額外 50 經驗值",
        "priority": 2,
        "xpReward": 50,
        "modules": ["src-01", "mic-01-01"],
        "estimatedTime": 60,
        "relevanceScore": 0.95
      }
    ],
    "total": 5
  }
}
```

### 學習路徑 API

#### GET /api/uas/learning-path/:userId

獲取學習路徑。

**響應示例**:
```json
{
  "success": true,
  "data": {
    "paths": [
      {
        "id": "path-report-basic",
        "name": "永續報告書撰寫專家",
        "description": "從零開始成為永續報告書撰寫專家",
        "steps": [...],
        "totalXP": 525,
        "totalTime": 230,
        "crossServiceConnections": [...]
      }
    ],
    "total": 3
  }
}
```

### 跨服務學習 API

#### POST /api/uas/cross-learning

完成跨服務學習。

**請求體**:
```json
{
  "userId": "user-1",
  "reportModuleId": "src-01",
  "marketModuleId": "mic-01-01"
}
```

### 傳承系統 API

#### POST /api/uas/legacy/points

添加傳承點數。

**請求體**:
```json
{
  "userId": "user-1",
  "points": 50,
  "reason": "完成跨服務學習獎勵"
}
```

#### POST /api/uas/legacy/transfer

轉移傳承點數（需要等級 9 以上）。

**請求體**:
```json
{
  "fromUserId": "user-1",
  "toUserId": "user-2",
  "points": 100,
  "reason": "知識傳承"
}
```

### 排行榜 API

#### GET /api/uas/leaderboard

獲取排行榜。

**響應示例**:
```json
{
  "success": true,
  "data": {
    "leaderboard": [
      {
        "rank": 1,
        "userId": "user-1",
        "username": "用戶abcd",
        "level": 13,
        "title": "永續之神",
        "xp": 20000,
        "reports": 50,
        "analyses": 100
      }
    ],
    "lastUpdated": "2026-02-04T23:00:00.000Z"
  }
}
```

### AI 分析 API

#### POST /api/uas/analyze

AI 智能分析用戶進度。

**請求體**:
```json
{
  "userId": "user-1"
}
```

**響應示例**:
```json
{
  "success": true,
  "data": {
    "analysis": "根據您的學習進度分析，您在報告書撰寫方面已經達到專業作者等級..."
  }
}
```

---

## 等級系統

### 統一等級 (13 等級)

| 等級 | 稱號 | XP 要求 | 權限 |
|------|------|---------|------|
| 1 | 見習學徒 | 0 | 存取基礎模組 |
| 2 | 初階分析師 | 50 | 存取進階模組 |
| 3 | 中階專家 | 150 | 生成分析報告 |
| 4 | 進階策略師 | 300 | 存取趨勢分析 |
| 5 | 資深顧問 | 500 | 風險評估工具 |
| 6 | 首席分析師 | 800 | 競合分析 |
| 7 | 領域大師 | 1200 | 團隊協作 |
| 8 | 宗師 | 2000 | 進階 AI 分析 |
| 9 | 傳承者 | 3500 | 自訂分析模板、傳承權限 |
| 10 | 導師 | 5000 | API 存取、指導權限 |
| 11 | 宗師 | 8000 | 策略顧問 |
| 12 | 預言家 | 12000 | 優先新功能 |
| 13 | 永續之神 | 20000 | 終身成就、系統顧問 |

### 報告書等級 (7 等級)

| 等級 | 稱號 | Rank | XP 要求 |
|------|------|------|---------|
| 1 | 見習撰寫員 | novice | 0 |
| 2 | 初階作者 | apprentice | 30 |
| 3 | 專業作者 | practitioner | 100 |
| 4 | 資深作者 | specialist | 250 |
| 5 | 報告專家 | master | 500 |
| 6 | 報告大師 | grandmaster | 1000 |
| 7 | 報告書之神 | legend | 2000 |

---

## 跨服務整合

### 跨服務連接表

| 報告書模組 | 商情模組 | 連接說明 | XP 獎勵 |
|------------|----------|----------|---------|
| src-01 | mic-01-01 | ESG 報告與企業情報分析相輔相成 | 50 |
| src-02 | mic-02-01 | 永續趨勢預測需要趨勢分析方法 | 75 |
| src-03 | mic-03-01 | 環境數據分析支撐環境章節撰寫 | 75 |
| src-04 | mic-01-02 | 利害關係人分析與社會責任情報結合 | 50 |
| src-05 | mic-04-01 | 治理揭露與風險評估相互驗證 | 75 |
| src-06 | mic-02-02 | TCFD 氣候財務揭露需要情境分析能力 | 100 |

### 跨服務學習流程

```
1. 用戶完成報告書模組 src-01
2. 系統推薦跨服務學習 mic-01-01
3. 用戶完成商情模組
4. 系統檢測跨服務連接
5. 發放 XP 獎勵 (基礎 XP + 50% 加成)
6. 授予跨服務徽章
7. 更新統一進度
```

---

## 傳承系統

### 傳承點數

傳承點數是用於知識傳承的特殊貨幣。

**獲取方式**:
- 完成教程: +10 點
- 完成成就: +25 點
- 完成跨服務學習: +50 點

**使用方式**:
- 等級 9 以上可用
- 可轉移給其他用戶
- 用於解鎖特殊內容

### 傳承記錄

```typescript
interface LegacyRecord {
  id: string;
  fromUserId: string;      // 轉出用戶
  toUserId?: string;       // 轉入用戶
  type: 'grant' | 'request' | 'inherit';
  points: number;           // 點數
  reason: string;           // 原因
  timestamp: string;        // 時間戳
  status: 'pending' | 'completed' | 'cancelled';
}
```

---

## 智能推薦

### 推薦類型

1. **教程推薦** - 建議完成的教程模組
2. **報告書推薦** - 建議生成的報告書類型
3. **分析推薦** - 建議進行的商情分析
4. **跨服務推薦** - 建議的跨服務學習連接
5. **傳承推薦** - 建議的知識傳承機會

### 推薦算法

```typescript
async getSmartRecommendations(userId: string): SmartRecommendation[] {
  const progress = await this.getUserProgress(userId);
  const recommendations: SmartRecommendation[] = [];
  
  // 1. 基於當前等級推薦
  if (progress.reportProgress.level < 3) {
    recommendations.push(...this.getReportRecommendations(progress));
  }
  
  // 2. 跨服務推薦
  const crossConnection = this.findCrossConnection(progress);
  if (crossConnection) {
    recommendations.push(this.createCrossRecommendation(crossConnection));
  }
  
  // 3. 傳承推薦
  if (progress.legacyPoints >= 50) {
    recommendations.push(this.createLegacyRecommendation(progress));
  }
  
  // 4. 按相關性排序
  return recommendations.sort((a, b) => b.relevanceScore - a.relevanceScore);
}
```

### AI 智能分析

```typescript
async analyzeProgressWithAI(userId: string): string {
  const progress = await this.getUserProgress(userId);
  
  const prompt = `分析以下用戶的學習進度並提供建議：
  - 統一等級: ${progress.combinedLevel}
  - 報告書等級: ${progress.reportProgress.level}
  - 商情等級: ${progress.marketProgress.level}
  - 統計數據: ${JSON.stringify(progress.statistics)}
  
  請提供:
  1. 進度分析
  2. 建議的下一步學習方向
  3. 可以嘗試的跨服務整合機會`;
  
  const result = await this.model.generateContent(prompt);
  return result.response.text();
}
```

---

## 使用範例

### 基本使用

```typescript
import { unifiedAdvancementService } from './services/UnifiedAdvancementService';

// 獲取用戶進度
const progress = await unifiedAdvancementService.getUserProgress('user-1');
console.log(`等級: ${progress.combinedLevel}, 稱號: ${progress.combinedTitle}`);

// 添加經驗值
await unifiedAdvancementService.addExperience('user-1', 100, 'report', {
  moduleId: 'src-01'
});

// 獲取智能推薦
const recommendations = await unifiedAdvancementService.getSmartRecommendations('user-1');
console.log(recommendations);
```

### 跨服務學習

```typescript
// 完成跨服務學習
const progress = await unifiedAdvancementService.completeCrossServiceLearning(
  'user-1',
  'src-01',  // 報告書模組
  'mic-01-01' // 商情模組
);

console.log(`獲得跨服務徽章: ${progress.unifiedBadges[progress.unifiedBadges.length - 1].name}`);
```

### 傳承系統

```typescript
// 添加傳承點數
await unifiedAdvancementService.addLegacyPoints('user-1', 50, '完成跨服務學習');

// 轉移傳承點數
const result = await unifiedAdvancementService.transferLegacyPoints(
  'user-1',  // 轉出用戶
  'user-2',  // 轉入用戶
  100,       // 點數
  '知識傳承'  // 原因
);

console.log(result.message);
```

### AI 分析

```typescript
// AI 智能分析
const analysis = await unifiedAdvancementService.analyzeProgressWithAI('user-1');
console.log(analysis);

// AI 學習建議
const advice = await unifiedAdvancementService.generateLearningAdvice(
  'user-1',
  '如何提升報告書質量'
);
console.log(advice);
```

---

## 版本歷史

| 版本 | 日期 | 變更 |
|------|------|------|
| 1.0.0 | 2026-02-04 | 初始版本 |

---

## 未來規劃

1. **數據持久化** - 將進度數據存儲到數據庫
2. **實時同步** - 多設備實時同步進度
3. **社交功能** - 添加好友、組隊學習功能
4. **更多 AI 特性** - 智能學習計劃生成
5. **移動端支持** - 開發移動應用

---

## 參考資料

- [永續報告書撰寫中心強化文檔](../SUSTAINABILITY_REPORT_CENTER_ENHANCEMENT.md)
- [商情偵測中心強化文檔](./MARKET_INTELLIGENCE_CENTER.md)
- [API 參考文檔](./API_REFERENCE.md)
