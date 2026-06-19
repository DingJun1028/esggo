# 🤝 代理聯盟分潤管理平台 - 服務流程完整介紹

## 目錄
1. [系統總覽](#系統總覽)
2. [夥伴管理](#夥伴管理)
3. [階梯分潤系統](#階梯分潤系統)
4. [分潤追蹤](#分潤追蹤)
5. [出金管理](#出金管理)
6. [績效分析](#績效分析)
7. [資料模型](#資料模型)
8. [API 介面](#api-介面)
9. [使用情境](#使用情境)

---

## 系統總覽

### 平台定位
代理聯盟分潤管理平台專為 ESG 服務生態系設計，透過分潤機制激勵合作夥伴推廣永續服務，實現共創共贏的商業模式。

### 核心價值
| 價值主張 | 說明 |
|---------|------|
| **階梯獎勵** | 業績越高，分潤比例越高 |
| **透明機制** | 即時查詢分潤明細與歷史記錄 |
| **快速出金** | 線上申請，快速撥款 |
| **績效分析** | 數據驅動的夥伴經營策略 |

### 等級體系
```
┌─────────────────────────────────────────────────────────────┐
│                     夥伴等級金字塔                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│                        👑 鑽石                               │
│                     (50,000+ 點)                            │
│                      15% + 5% 獎勵                          │
│                                                             │
│                    💎 白金                                 │
│                  (20,000+ 點)                              │
│                   12% + 3% 獎勵                            │
│                                                             │
│                     🥇 金牌                                 │
│                  (5,000+ 點)                                │
│                   10% + 2% 獎勵                            │
│                                                             │
│                     🥈 銀牌                                 │
│                  (1,000+ 點)                                │
│                    7% + 1% 獎勵                            │
│                                                             │
│                    🥉 銅牌                                 │
│                    (0+ 點)                                  │
│                     5% 基礎分潤                            │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 夥伴管理

### 1. 夥伴類型
| 類型 | 說明 | 範例 |
|------|------|------|
| **個人 (Individual)** | 獨立從業人員 | 獨立顧問、自由工作者 |
| **代理商 (Agency)** | 專業服務公司 | 永續顧問公司、NGO |
| **企業 (Enterprise)** | 大型合作夥伴 | 協會、聯盟組織 |
| **顧問 (Consultant)** | 專業認證顧問 | 碳交所認證顧問 |

### 2. 夥伴加入流程
```
步驟 1: 線上申請
   ├─ 填寫基本資料
   ├─ 上傳證明文件
   └─ 選擇夥伴類型
   ↓
步驟 2: 資格審核
   ├─ 文件驗證
   ├─ 信用查核
   └─ 專業背景審查
   ↓
步驟 3: 帳號開通
   ├─ 發送認證信
   └─ 設定登入密碼
   ↓
步驟 4: 入階銅牌
   └─ 初始等級：銅牌
```

### 3. 夥伴資料結構
```typescript
interface Partner {
    id: string;
    name: string;              // 姓名/公司名稱
    type: 'individual' | 'agency' | 'enterprise' | 'consultant';
    level: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
    status: 'active' | 'pending' | 'suspended' | 'inactive';
    email: string;
    phone: string;
    company?: string;
    region: string;            // 北部/中部/南部/東部
    joinDate: string;
    
    // 業績資料
    totalReferrals: number;    // 推薦總數
    totalRevenue: number;     // 創造營收
    totalCommission: number; // 累積分潤
    pendingPayout: number;   // 待出金金額
    
    // 等級資料
    tierPoints: number;        // 等級點數
    nextTierThreshold: number; // 晉級門檻
    
    // 組織關係
    upline?: string;          // 上級代理商
    downlines: string[];      // 下級夥伴
    
    // 銀行帳戶
    bankAccount: {
        bankName: string;
        accountNumber: string;
        accountName: string;
    };
}
```

### 4. 夥伴分數計算
```typescript
// 等級點數計算公式
const calculateTierPoints = (orderAmount: number): number => {
    // 每創造 NT$10,000 營收 = 1 點
    return Math.floor(orderAmount / 10000);
};

// 點數有效期限
// 點數有效期為 12 個月，逾期自動扣除
```

---

## 階梯分潤系統

### 1. 分潤比例表
| 等級 | 基本分潤 | 業績獎勵 | 晉級門檻 | 專屬福利 |
|------|---------|---------|---------|----------|
| **銅牌 🥉** | 5% | 0% | 0 點 | 基本分潤、月報表、線上客服 |
| **銀牌 🥈** | 7% | 1% | 1,000 點 | +優先客服、季報、專屬網址 |
| **金牌 🥇** | 10% | 2% | 5,000 點 | +專屬經理、客製化報告、線下活動 |
| **白金 💎** | 12% | 3% | 20,000 點 | +VP對接、策略會議、獨家資源 |
| **鑽石 👑** | 15% | 5% | 50,000 點 | +CEO見面、年度晚宴、全球資源 |

### 2. 分潤計算範例
```typescript
// 範例：金牌夥伴推廣 NT$100 萬專案
const calculateCommission = (orderAmount: number, tier: string): number => {
    const tiers: Record<string, { baseRate: number, bonusRate: number }> = {
        bronze: { baseRate: 0.05, bonusRate: 0 },
        silver: { baseRate: 0.07, bonusRate: 0.01 },
        gold: { baseRate: 0.10, bonusRate: 0.02 },
        platinum: { baseRate: 0.12, bonusRate: 0.03 },
        diamond: { baseRate: 0.15, bonusRate: 0.05 }
    };
    
    const tierConfig = tiers[tier];
    
    // 基本分潤
    const baseCommission = orderAmount * tierConfig.baseRate;
    
    // 業績獎勵（當月業績達標）
    const bonusCommission = orderAmount * tierConfig.bonusRate;
    
    return baseCommission + bonusCommission;
};

// 金牌夥伴：NT$100萬 × 10% + NT$100萬 × 2% = NT$12萬
```

### 3. 多層分潤（組織獎勵）
```
上層推薦獎勵：
├── 一級推薦人：可獲得被推薦人分潤的 5%
├── 二級推薦人：可獲得被推薦人分潤的 2%
└── 三級推薦人：可獲得被推薦人分潤的 1%

範例：
├── 陳建宏（鑽石）推薦 林曉萍（銀牌）
├── 林曉萍成交 NT$100萬專案
├── 林曉萍分潤：NT$8萬（8%）
├── 陳建宏獎勵：NT$8萬 × 5% = NT$4,000
```

---

## 分潤追蹤

### 1. 分潤狀態流程
```
┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐
│  待審核  │ → │  已核准  │ → │  已付款  │ → │  已完成  │
│ Pending  │    │ Approved│    │  Paid   │    │Completed│
└─────────┘    └─────────┘    └─────────┘    └─────────┘
     │              │              │              │
     │              │              │              │
  產生分潤      審核通過       款項撥出       歷史記錄
  自動產生      系統/人工      銀行轉帳       可查詢
```

### 2. 分潤查詢功能
| 查詢條件 | 說明 |
|---------|------|
| **時間區間** | 依月份/季度/年度查詢 |
| **夥伴等級** | 篩選特定等級 |
| **狀態分類** | 待審核/已核准/已付款 |
| **產品類型** | 依服務項目篩選 |
| **關鍵字** | 搜尋客戶名稱/單號 |

### 3. 分潤明細表
```typescript
interface Commission {
    id: string;
    partnerId: string;        // 夥伴 ID
    partnerName: string;       // 夥伴名稱
    referralId: string;       // 推薦客戶 ID
    referralCompany: string;  // 推薦客戶公司
    orderId: string;          // 訂單編號
    orderAmount: number;      // 訂單金額
    commissionRate: number;  // 分潤比例
    commissionAmount: number; // 分潤金額
    status: 'pending' | 'approved' | 'paid' | 'rejected';
    createdAt: string;        // 產生時間
    paidAt?: string;          // 付款時間
    tier: string;             // 等級
    product: string;          // 產品服務
    notes?: string;           // 備註
}
```

---

## 出金管理

### 1. 出金申請流程
```
步驟 1: 申請出金
   ├─ 登入夥伴系統
   ├─ 確認可出金金額
   └─ 提交出金申請
   ↓
步驟 2: 審核處理
   ├─ 系統自動校驗
   └─ 財務人工審核（大額）
   ↓
步驟 3: 款項撥出
   ├─ 銀行轉帳
   ├─ 信用卡退款
   └─ 加密貨幣
   ↓
步驟 4: 確認到帳
   └─ 通知夥伴
```

### 2. 出金方式
| 方式 | 說明 | 時效 | 手續費 |
|------|------|------|--------|
| **銀行轉帳** | 轉至綁定帳戶 | 1-3 工作天 | 免費 |
| **信用卡** | 刷退至原信用卡 | 3-5 工作天 | 2% |
| **加密貨幣** | USDT 穩定幣 | 30 分鐘 | 網路費 |

### 3. 出金限制
```typescript
const PAYOUT_RULES = {
    minPayout: 5000,              // 最低出金 NT$5,000
    maxSinglePayout: 500000,     // 單筆上限 NT$50萬
    monthlyLimit: 2000000,       // 月上限 NT$200萬
    processingDays: 3,            // 處理工作天
    taxRate: 0.05                 // 代扣稅金 5%
};
```

### 4. 出金申請表
```typescript
interface PayoutRequest {
    id: string;
    partnerId: string;
    partnerName: string;
    amount: number;              // 申請金額
    netAmount: number;           // 實付金額（扣稅後）
    status: 'processing' | 'approved' | 'completed' | 'rejected';
    method: 'bank' | 'credit' | 'crypto';
    requestedAt: string;          // 申請時間
    processedAt?: string;         // 處理時間
    reference?: string;           // 交易編號
    notes?: string;              // 備註
}
```

---

## 績效分析

### 1. 夥伴績效儀表板
```
┌─────────────────────────────────────────────────────────────┐
│                    夥伴績效總覽                               │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │   總夥伴數   │  │  活躍夥伴    │  │  總創造營收  │    │
│  │     5        │  │     4        │  │  NT$ 1.8億  │    │
│  └──────────────┘  └──────────────┘  └──────────────┘    │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │  累積分潤    │  │  待出金     │  │  平均分潤率  │    │
│  │  NT$ 3,268萬 │  │  NT$ 225萬  │  │    10.5%    │    │
│  └──────────────┘  └──────────────┘  └──────────────┘    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 2. 等級分布分析
```
銅牌夥伴：20% (1)
銀牌夥伴：20% (1)
金牌夥伴：20% (1)  ████████░░░░░░░░░░
白金夥伴：20% (1)  ████████░░░░░░░░░░
鑽石夥伴：20% (1)  ████████░░░░░░░░░░
```

### 3. 業績趨勢圖
```
月份：  1月   2月   3月   4月   5月   6月   7月   8月   9月   10月  11月  12月
業績： ▓▓▓▓░ ▓▓▓▓▓░ ▓▓▓▓░ ▓▓▓▓▓▓░ ▓▓▓▓░ ▓▓▓▓▓▓░ ▓▓▓▓░ ▓▓▓▓▓▓▓░ ▓▓▓▓▓░ ▓▓▓▓▓▓▓▓░ ▓▓▓▓▓░ ▓▓▓▓▓▓▓▓▓
      NT$35萬 NT$42萬 NT$38萬 NT$55萬 NT$48萬 NT$62萬 NT$58萬 NT$72萬 NT$68萬 NT$85萬 NT$78萬 NT$92萬
```

### 4. TOP 夥伴排行榜
| 排名 | 夥伴名稱 | 等級 | 本月業績 | 年度累計 |
|------|----------|------|---------|---------|
| 🥇 | 陳建宏 | 鑽石 | NT$58萬 | NT$580萬 |
| 🥈 | 綠色企業聯盟協會 | 鑽石 | NT$210萬 | NT$2,100萬 |
| 🥉 | 永續管理顧問有限公司 | 金牌 | NT$35萬 | NT$350萬 |

---

## 資料模型

### 夥伴資料結構
```typescript
interface Partner {
    // 基本資料
    id: string;
    name: string;
    type: 'individual' | 'agency' | 'enterprise' | 'consultant';
    level: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
    status: 'active' | 'pending' | 'suspended' | 'inactive';
    
    // 聯繫資料
    email: string;
    phone: string;
    company?: string;
    region: string;
    
    // 組織關係
    upline?: string;      // 上級 ID
    downlines: string[];   // 下級 ID 清單
    
    // 業績資料
    totalReferrals: number;
    totalRevenue: number;
    totalCommission: number;
    pendingPayout: number;
    
    // 等級資料
    tierPoints: number;
    nextTierThreshold: number | null;
    
    // 銀行帳戶
    bankAccount: {
        bankName: string;
        accountNumber: string;
        accountName: string;
    };
    
    // 績效趨勢
    performance: {
        thisMonth: number;
        lastMonth: number;
        thisQuarter: number;
        lastQuarter: number;
        trend: 'up' | 'down' | 'stable';
    };
}
```

### 等級配置
```typescript
interface TierConfig {
    level: string;
    name: string;
    minPoints: number;
    baseRate: number;    // 基本分潤 %
    bonusRate: number;    // 獎勵分潤 %
    benefits: string[];    // 專屬福利
    color: string;
    icon: string;
}
```

---

## API 介面

### 夥伴管理 API
```typescript
// 夥伴 CRUD
POST   /api/partners                  // 新增夥伴
GET    /api/partners                 // 取得夥伴清單
GET    /api/partners/:id             // 取得單一夥伴
PUT    /api/partners/:id             // 更新夥伴資料
PUT    /api/partners/:id/status      // 更新狀態
DELETE /api/partners/:id             // 刪除夥伴

// 等級管理
GET    /api/partners/:id/tier        // 查詢等級
GET    /api/tiers                    // 取得等級設定

// 組織關係
GET    /api/partners/:id/upline      // 取得上層
GET    /api/partners/:id/downlines    // 取得下層
POST   /api/partners/:id/recommend   // 推薦新夥伴
```

### 分潤 API
```typescript
// 分潤管理
POST   /api/commissions              // 產生分潤（系統自動）
GET    /api/commissions              // 取得分潤清單
GET    /api/commissions/:id          // 取得分潤明細
PUT    /api/commissions/:id/status   // 更新狀態

// 查詢
GET    /api/commissions/partner/:partnerId  // 夥伴分潤
GET    /api/commissions/summary    // 分潤統計
```

### 出金 API
```typescript
// 出金申請
POST   /api/payouts                 // 申請出金
GET    /api/payouts                // 取得申請清單
GET    /api/payouts/:id            // 取得申請詳情
PUT    /api/payouts/:id/status     // 更新處理狀態

// 統計
GET    /api/payouts/pending        // 待處理出金
GET    /api/payouts/summary        // 出金統計
```

---

## 使用情境

### 情境一：銅牌夥伴晉升銀牌
```
1. 新增夥伴
   ├─ 姓名：林曉萍
   ├─ 類型：個人
   └─ 等級：銅牌（初始）
   ↓
2. 推廣專案
   ├─ 成交 NT$120萬 ISO 14064 認證
   └─ 獲得點數：120 點
   ↓
3. 持續推廣
   ├─ 再成交 NT$200萬 碳盤查
   └─ 獲得點數：200 點
   ↓
4. 晉級成功
   ├─ 總點數：320 點
   ├─ 突破 1,000 點門檻
   └─ 自動升等：銀牌 🥈
   ↓
5. 分潤提升
   ├─ 銅牌：NT$16萬 (8% × NT$200萬)
   └─ 銀牌：NT$16萬 (8% × NT$200萬) + 獎勵 NT$2萬 = NT$18萬
```

### 情境二：出金申請流程
```
1. 檢視可出金金額
   └─ 待出金餘額：NT$56,000
   ↓
2. 提交申請
   ├─ 申請金額：NT$50,000
   ├─ 扣稅 NT$2,500
   └─ 實付 NT$47,500
   ↓
3. 系統審核
   └─ 小額自動核准
   ↓
4. 款項撥出
   └─ 銀行轉帳
   ↓
5. 到帳通知
   └─ Email 確認信
```

### 情境三：企業健檢管顧服務
```
// 企業健檢管顧服務流程
// 服務代號：CORP_HEALTH_CHECK
// 服務定價：NT$50,000 - NT$200,000（依企業規模）

1. 夥伴推廣
   ├─ 夥伴類型：代理商（綠色企業聯盟協會）
   ├─ 等級：金牌
   ├─ 服務介紹：企業 ESG 健檢評估
   └─ 目標客戶：製造業、科技業、傳統產業
   ↓
2. 客戶成交
   ├─ 客戶：鼎新電子股份有限公司
   ├─ 產業：半導體製造
   ├─ 員工規模：3,000 人
   ├─ 選擇方案：企業標準健檢方案
   └─ 成交金額：NT$150,000
   ↓
3. 分潤計算（金牌夥伴）
   ├─ 基本分潤：NT$150,000 × 10% = NT$15,000
   ├─ 業績獎勵：NT$150,000 × 2% = NT$3,000
   ├─ 總分潤：NT$18,000
   └─ 實付金額：NT$18,000 - NT$900（扣稅5%）= NT$17,100
   ↓
4. 等級點數
   ├─ 獲得點數：15 點（NT$150,000 ÷ 10,000）
   └─ 累計：金牌 320 點 → 335 點
   ↓
5. 服務交付
   ├─ 初階訪談：2 小時
   ├─ 文件審閱：碳盤查報告、ISO 文件
   ├─ 實地訪查：1 天
   ├─ 健檢報告：50 頁完整評估
   └─ 改善建議：10 項優先行動項目
   ↓
6. 後續商機
   ├─ 潛在需求：ISO 14064 認證（報價 NT$80萬）
   ├─ 潛在需求：碳盤查建置（報價 NT$120萬）
   ├─ 潛在需求：永續報告書編撰（報價 NT$50萬）
   └─ 預估後續分潤：NT$25萬（10%）

// 企業健檢管顧服務 - 分潤配置表
const SERVICE_CONFIG = {
    code: 'CORP_HEALTH_CHECK',
    name: '企業健檢管顧服務',
    priceRange: { min: 50000, max: 200000 },
    commission: {
        bronze: { rate: 0.05, bonus: 0 },
        silver: { rate: 0.07, bonus: 0.01 },
        gold: { rate: 0.10, bonus: 0.02 },
        platinum: { rate: 0.12, bonus: 0.03 },
        diamond: { rate: 0.15, bonus: 0.05 }
    },
    deliverables: [
        '初階訪談報告',
        '文件審閱清單',
        '實地訪查紀錄',
        'ESG 健檢評估書',
        '優先改善建議書'
    ],
    followUpServices: [
        'ISO 14064 溫室氣體查證',
        'ISO 14067 碳足跡認證',
        '碳盤查系統建置',
        '永續報告書編撰',
        'SBTi 目標設定'
    ]
};
```

---

## 總結

代理聯盟分潤平台提供完整的夥伴激勵機制：

| 功能模組 | 核心價值 |
|---------|---------|
| **夥伴管理** | 生命週期管理、等級晉升、組織關係 |
| **階梯分潤** | 5-15% 分潤比例、業績獎勵、組織獎勵 |
| **分潤追蹤** | 即時查詢、狀態更新、歷史記錄 |
| **出金管理** | 線上申請、多元方式、快速到帳 |
| **績效分析** | 儀表板、排行榜、趨勢圖 |

**系統已準備就緒，可立即投入正式使用！** 🚀
