# 永續閱覽室 + ESG 報告範本系統實作計劃

## 策略背景

- 項目名稱：永續閱覽室 (Sustainability Reading Room) + 報告範本系統
- 發起人：策略長 洪鼎竣 (Jun Hong)
- 收件人：CEO 楊博 (Yang Bo)
- 日期：2026-03-08
- 願景：建構「服務即教學，知識即資產」的 ESG 永續情報生態系統

---

## 零、參考UX研究（企業永續資料庫）

本規劃參考 CC-BY-4.0 授權之 UX 文件，確保系統符合真實使用者需求

### 0.1 人物誌 (Personas)

| 角色       | 描述                                             | 需求                         |
| ---------- | ------------------------------------------------ | ---------------------------- |
| 資料總管   | 負責統籌分工、規劃時程、校對資料、發佈給專案使用 | 進度追蹤、驗證、匯出         |
| 專業工人   | 實際找出欄位答案，一次認領幾本報告書             | 快速找到報告書、減少重複操作 |
| 路過的鄉民 | 未經訓練，願意提供 5 分鐘以內的注意力            | 明確目標、任務導向           |

### 0.2 資訊架構

```
0. 登入
1. 首頁 + 任務說明
2. 產業列表 + 年度選擇
3. 個別產業報告書列表
4. 個別報告書資訊
5. 報告書欄位判讀
6. 疑問回報
7. 常見問題
8. 產業資料表
```

### 0.3 關鍵使用者流程

專業工人填答流程： 登入 → 選產業別 & 年份 → 報告書 →
看目前狀況、跳到下一個待做欄位 → 填答界面

資料總管驗證流程： 登入 → 看各產業填答進度 → 匯出 → 填入 Google 試算表

---

## 一、現有系統整合分析

### 1.1 已有的核心模組

| 模組                | 檔案位置                                            | 功能說明         |
| ------------------- | --------------------------------------------------- | ---------------- |
| 商業偵情中心        | src/app/omni/reconnaissance/                        | 5T 協議情資監控  |
| 壽司博士            | src/core/sushi-doctor-reporter.ts                   | 日報/週報生成    |
| UserKnowledgeBase   | src/core/user-knowledge-base.ts                     | 個人智庫存儲     |
| OmniMangaTutorial   | src/components/omni/education/OmniMangaTutorial.tsx | 四格漫畫教學     |
| OmniSprite/JunAiKey | src/components/JunAiKey.tsx                         | AI 精靈助手      |
| 萬能光球            | src/app/cognitive/ai-assistant/page.tsx             | RAG 零幻覺知識庫 |

---

## 二、「萬能永續報告中心」現有頁面整合

### 2.1 需整合的現有頁面

| 檔案位置 | 功能描述 | 整合狀態 |
|---------|---------|---------|
| [src/app/omni/reports/page.tsx](src/app/omni/reports/page.tsx) | 永續資產總控台 | 需整合 |
| [src/app/omni/sustainability-reports/page.tsx](src/app/omni/sustainability-reports/page.tsx) | 永續報告書編製 | 需整合 |
| [src/app/omni/reports/data-forge/page.tsx](src/app/omni/reports/data-forge/page.tsx) | 資料煉製室 | 需整合 |
| [src/app/omni/reports/verification-sanctum/page.tsx](src/app/omni/reports/verification-sanctum/page.tsx) | 永續聖殿 | 需整合 |
| [src/components/omni/reports/DigitalReportViewer.tsx](src/components/omni/reports/DigitalReportViewer.tsx) | 數位報告檢視器 | 需整合 |

### 2.2 整合策略

1. **統一導航結構**：在「萬能永續報告中心」入口頁面建立完整的功能導航
2. **資料流串接**：
   - 永續資產總控台 → 永續報告書編製 → 資料煉製室 → 永續聖殿
   - 數位報告檢視器作為各階段共用元件
3. **狀態共享**：使用 React Context 實現跨頁面狀態管理
4. **四格漫畫教學串接**：每個頁面轉換點嵌入 OmniMangaTutorial 教學流程

---

## 三、UUID 功能需求追蹤表

### 3.1 UUID 命名空間定義

參照 [OMNI_UUID_MAPPING.md](OMNI_UUID_MAPPING.md)，SRC (永續報告中心) 採用 `mod-src-XXXX` 格式

| Domain | 命名空間前綴 | 狀態 |
|--------|-------------|------|
| SRC (永續報告中心) | `mod-src` | 規劃中 |
| BIC (商業偵情中心) | `mod-bic` | ACTIVE |

### 3.2 功能需求清單與 UUID 映射

| UUID | 功能名稱 | 所屬頁面 | 狀態 | 優先權 |
|------|---------|---------|------|-------|
| mod-src-0001 | 永續資產總控台 | /omni/reports | 現有 | P0 |
| mod-src-0002 | 永續報告書編製 | /omni/sustainability-reports | 現有 | P0 |
| mod-src-0003 | 資料煉製室 | /omni/reports/data-forge | 現有 | P0 |
| mod-src-0004 | 永續聖殿 | /omni/reports/verification-sanctum | 現有 | P0 |
| mod-src-0005 | 數位報告檢視器 | 共用元件 | 現有 | P0 |
| mod-src-0006 | 四格漫畫教學引擎 | /omni/education | 現有 | P0 |
| mod-src-0007 | 產業別篩選 | 永續資產總控台 | 待開發 | P1 |
| mod-src-0008 | 年度趨勢分析 | 永續資產總控台 | 待開發 | P1 |
| mod-src-0009 | 報告書範本選擇 | 永續報告書編製 | 待開發 | P1 |
| mod-src-0010 | GRI 對照表生成 | 永續報告書編製 | 待開發 | P1 |
| mod-src-0011 | 資料品質評分 | 資料煉製室 | 待開發 | P2 |
| mod-src-0012 | 異常值偵測 | 資料煉製室 | 待開發 | P2 |
| mod-src-0013 | 多重驗證流程 | 永續聖殿 | 待開發 | P1 |
| mod-src-0014 | 驗證歷史記錄 | 永續聖殿 | 待開發 | P2 |
| mod-src-0015 | PDF 批次下載 | 數位報告檢視器 | 待開發 | P1 |
| mod-src-0016 | 註解與標記 | 數位報告檢視器 | 待開發 | P2 |

---

## 四、UI/UX 四格漫畫教學設計

### 4.1 設計團隊

- **UI/UX 主設計師**：Stitch、Penicl
- **職責**：
  - 規劃每個頁面的四格漫畫教學流程
  - 設計視覺風格與角色動作
  - 確保教學內容直觀易懂

### 4.2 四格漫畫教學流程設計

#### 4.2.1 永續資產總控台 (mod-src-0001)

| 格子 | 內容描述 | 教學目標 |
|------|---------|---------|
| 第1格 | Stitch 站在儀表板前招手 | 介紹總控台功能 |
| 第2格 | 展示產業別/年度篩選器 | 說明篩選操作 |
| 第3格 | Penicl 指向趨勢圖表 | 解釋數據解讀方式 |
| 第4格 | 顯示「開始探索」按鈕 | 引導進入下一頁 |

**5T 驗算指標**：Truth、Talent、Timing、Trust、Transformation

#### 4.2.2 永續報告書編製 (mod-src-0002)

| 格子 | 內容描述 | 教學目標 |
|------|---------|---------|
| 第1格 | Stitch 手持報告書範本 | 介紹範本選擇功能 |
| 第2格 | 展示 GRI/SASB/TCFD 對照 | 說明框架選擇 |
| 第3格 | Penicl 示範資料填寫 | 解釋欄位對應 |
| 第4格 | 顯示「開始編製」按鈕 | 引導進入編輯器 |

**5T 驗算指標**：Truth、Talent、Timing、Trust、Transformation

#### 4.2.3 資料煉製室 (mod-src-0003)

| 格子 | 內容描述 | 教學目標 |
|------|---------|---------|
| 第1格 | Stitch 在煉製爐前介紹 | 說明資料煉製概念 |
| 第2格 | 展示資料品質評分介面 | 解釋品質指標 |
| 第3格 | Penicl 示範異常值標記 | 教授資料清理 |
| 第4格 | 顯示「開始煉製」按鈕 | 引導執行煉製 |

**5T 驗算指標**：Truth、Talent、Timing、Trust、Transformation

#### 4.2.4 永續聖殿 (mod-src-0004)

| 格子 | 內容描述 | 教學目標 |
|------|---------|---------|
| 第1格 | Stitch 站在聖殿門口 | 介紹驗證聖殿功能 |
| 第2格 | 展示多重驗證流程 | 說明驗證階段 |
| 第3格 | Penicl 示範審核操作 | 解釋審核標準 |
| 第4格 | 顯示「開始驗證」按鈕 | 引導執行驗證 |

**5T 驗算指標**：Truth、Talent、Timing、Trust、Transformation

#### 4.2.5 數位報告檢視器 (mod-src-0005)

| 格子 | 內容描述 | 教學目標 |
|------|---------|---------|
| 第1格 | Stitch 打開 PDF 檢視器 | 介紹檢視器功能 |
| 第2格 | 展示頁面導航操作 | 說明瀏覽方式 |
| 第3格 | Penicl 示範註解功能 | 教授標記重點 |
| 第4格 | 顯示「下載PDF」按鈕 | 引導下載保存 |

**5T 驗算指標**：Truth、Talent、Timing、Trust、Transformation

### 4.3 OmniMangaTutorial 組件整合

- **位置**：[src/components/omni/education/OmniMangaTutorial.tsx](src/components/omni/education/OmniMangaTutorial.tsx)
- **特性**：
  - 支援 4 格漫畫教學流程
  - 內建 5T 驗算指標展示
  - 可配置動畫過渡效果
  - 支援響應式布局

---

## 五、確保無未完成項目

### 5.1 頁面完整性檢查清單

| 頁面 | UUID | 功能完整性 | 四格漫畫教學 | 狀態 |
|------|------|-----------|-------------|------|
| 永續資產總控台 | mod-src-0001 | □ 完整 | □ 已完成 | 待確認 |
| 永續報告書編製 | mod-src-0002 | □ 完整 | □ 已完成 | 待確認 |
| 資料煉製室 | mod-src-0003 | □ 完整 | □ 已完成 | 待確認 |
| 永續聖殿 | mod-src-0004 | □ 完整 | □ 已完成 | 待確認 |
| 數位報告檢視器 | mod-src-0005 | □ 完整 | □ 已完成 | 待確認 |

### 5.2 功能完整性檢查清單

| 功能 | UUID | 需開發 | 四格漫畫教學 | 狀態 |
|------|------|-------|-------------|------|
| 產業別篩選 | mod-src-0007 | 是 | □ 已完成 | 待開發 |
| 年度趨勢分析 | mod-src-0008 | 是 | □ 已完成 | 待開發 |
| 報告書範本選擇 | mod-src-0009 | 是 | □ 已完成 | 待開發 |
| GRI 對照表生成 | mod-src-0010 | 是 | □ 已完成 | 待開發 |
| 資料品質評分 | mod-src-0011 | 是 | □ 已完成 | 待開發 |
| 異常值偵測 | mod-src-0012 | 是 | □ 已完成 | 待開發 |
| 多重驗證流程 | mod-src-0013 | 是 | □ 已完成 | 待開發 |
| 驗證歷史記錄 | mod-src-0014 | 是 | □ 已完成 | 待開發 |
| PDF 批次下載 | mod-src-0015 | 是 | □ 已完成 | 待開發 |
| 註解與標記 | mod-src-0016 | 是 | □ 已完成 | 待開發 |

### 5.3 實作原則

1. **每個頁面都必須有完整功能**：
   - 進入頁面時載入必要數據
   - 所有操作都有適當的回饋
   - 錯誤處理完善

2. **每個功能都必須有四格漫畫教學**：
   - 首次訪問時自動顯示教學
   - 可跳過但可隨時回顧
   - 教學內容與功能同步更新

3. **5T 驗算指標展示**：
   - 每個教學流程必須包含 5T 指標說明
   - 5T 指標：Truth (真實性)、Talent (才能)、Timing (時機)、Trust (信任)、Transformation (轉型)

---

## 六、用戶需求對照

| #  | 用戶需求                     | 現有功能                 | 差距分析             |
| -- | ---------------------------- | ------------------------ | -------------------- |
| 1  | 每日 ESG 新聞收集 + 來源網址 | 商業偵情中心 (部分)      | 需擴展爬蟲頻率與來源 |
| 2  | 可搜尋的歷史數據             | UserKnowledgeBase        | 需增加全文檢索       |
| 3  | 資料庫存儲                   | Prisma Schema (部分)     | 需擴展儲存模型       |
| 4  | 永續閱覽室 (10年台灣報告書)  | 無                       | 需新建               |
| 5  | 壽司博士每日報告             | sushi-doctor-reporter.ts | 需整合新數據源       |
| 6  | 報告範本                     | 無                       | 需新建               |
| 7  | 萬能模組整合                 | 部分實現                 | 需強化整合           |
| 8  | RAG 零幻覺知識庫             | 萬能光球                 | 需擴展               |
| 9  | 萬能卡牌知識點               | omni/cards               | 需與閱覽室整合       |
| 10 | 四格漫畫教學                 | OmniMangaTutorial        | 需為新服務製作教學   |

---

## 七、系統架構設計

### 7.1 永續閱覽室架構（含UX優化）

數據流：

- 爬蟲系統 → 5T 協議門 → 情資聚合 → UserKnowledgeBase → 壽司博士 → 每日報告
- 永續閱覽室 (10年報告書) → PDF 解析 → RAG 檢索 → 萬能光球
- 全域技術支持 (OmniSprite) → 四格漫畫教學 (OmniMangaTutorial)

### 7.2 核心數據模型（依據UX文件優化）

**整合策略：** 擴展現有 `CompanyReport` 模型（`prisma/schema.prisma:68-114`），而非創建新模型。

prisma Schema 擴展建議：

```prisma
// ============================================
// 擴展現有 CompanyReport 模型
// ============================================

// 在現有 ReportType enum 中增加 CARBON_INVENTORY (已存在於 schema:120)

// 為 CompanyReport 增加永續報告書專用欄位
model CompanyReport {
    // ... 現有欄位 ...

    // ===== 新增：永續報告書專用欄位 =====
    
    // UX: 建置進度追蹤
    assignedTo      String?  // 認領人 (對應 WorkerTask.userId)
    workerStatus    String   @default("unclaimed") // unclaimed/in_progress/verified
    progress        Int      @default(0) // 欄位完成度 %
    
    // PDF 相關
    pdfUrl          String?  // PDF 檔案位置
    fileHash        String?  // SHA-256 雜湊
    totalPages      Int?     // 總頁數
    
    // 驗證時間
    verifiedAt      DateTime? // 驗證完成時間
    
    // 欄位關聯 (一對多)
    fields          ReportField[]
    
    // UX: 工作者任務 (一對多)
    workerTasks     WorkerTask[]
    
    // @@index 已在原模型定義
}

// 報告書欄位（專業工人判讀用）- 新模型
model ReportField {
    id              String   @id @default(uuid())
    reportId        String   // 關聯 CompanyReport
    report          CompanyReport @relation(fields: [reportId], references: [id], onDelete: Cascade)
    fieldName       String   // 欄位名稱 (如: 範疇一排放量)
    fieldKey        String   // 欄位 key (如: ghg_scope1)
    pageNumber      Int?     // 答案頁次
    value           String?  // 填寫的值
    keywordsUsed    String[] // 使用的關鍵字
    notes           String?  // 補充說明
    status          String   @default("pending") // pending/filled/verified
    filledBy        String?  // 填寫人
    filledAt        DateTime?
    verifiedBy      String?  // 驗證人
    verifiedAt      DateTime?
    
    @@index([reportId])
}

// 專業工人任務 - 新模型
model WorkerTask {
    id          String   @id @default(uuid())
    userId      String   // 認領人 ID
    reportId    String   // 關聯 CompanyReport
    report      CompanyReport @relation(fields: [reportId], references: [id], onDelete: Cascade)
    assignedAt  DateTime @default(now())
    completedAt DateTime?
    status      String   @default("active") // active/completed
    
    @@index([userId])
    @@index([status])
}

// ESG 知識點卡牌 - 新模型
model KnowledgeCard {
    id          String   @id @default(uuid())
    cardId      String   @unique // CARD-E-GHG-001
    title       String
    titleZh     String
    esgDimension String  // E/S/G
    rarity      String   // Common/Rare/Epic/Legendary/Transcend
    isUnlocked  Boolean  @default(false)
    unlockedAt  DateTime?
    
    @@index([esgDimension])
}

// 每日情報日誌 - 新模型 (可與現有 CrawlHistory 整合或獨立)
model DailyIntel {
    id          String   @id @default(uuid())
    date        DateTime @default(now())
    source      String
    title       String
    summary     String   @db.Text
    url         String
    entities    String[] // 關鍵企業/人物
    hashLock    String?  // 5T 雜湊
    
    @@index([date])
    @@index([source])
}
```

---

## 八、實作任務清單

### Phase 1: 永續閱覽室基礎建設

- 建立 src/app/omni/sustainability-library/ 目錄
- 設計並實作永續報告書資料庫 Schema（含UX欄位）
- 建立 FSC/TWSE 歷史報告書爬蟲
- 實作 PDF 下載與解析服務
- 建立 SHA-256 檔案雜湊機制

### Phase 2: 報告書判讀系統（依UX文件）

- 實作產業別 + 年度選擇頁面
- 實作個別產業報告書列表
- 實作單一欄位判讀界面
- 實作 PDF 頁次跳轉功能
- 實作關鍵字搜尋功能
- 實作資料總管驗證與匯出

### Phase 3: RAG 檢索引擎

- 整合現有向量嵌入模組
- 實作報告書內容向量化的排程任務
- 建立相似度檢索 API
- 整合萬能光球 RAG 引擎

### Phase 4: 報告範本系統

- 建立 src/core/report-templates/ 目錄
- 設計 GRI/SASB/TCFD 範本結構
- 實作範本填充引擎
- 整合 Typst DSL 生成器

### Phase 5: 壽司博士整合

- 擴展 SushiDoctorReporter 數據源
- 建立每日情報摘要生成
- 實作排程發送 (Slack/Telegram)
- 整合全域技術支持通知

### Phase 6: 四格漫畫教學

- 為永續閱覽室製作四格教學漫畫
- 為報告範本系統製作四格教學漫畫
- 整合 OmniMangaTutorial 組件
- 建立知識點解鎖教學流程
- 為「路過的鄉民」製作快速上手四格漫畫

### Phase 7: 全域技術支持

- 擴展 OmniSprite 對永續閱覽室的理解
- 建立上下文感知的 AI 輔助
- 實作知識點卡牌解鎖追蹤
- 整合萬能模組導航
- 建立 QA 系統（疑問回報）

---

## 九、輸出產出

1. 永續閱覽室頁面: /omni/sustainability-library
2. 報告書資料庫: PostgreSQL Schema 擴展（含建置進度）
3. RAG API: /api/sustainability/search
4. 報告範本引擎: src/core/report-templates/
5. 四格教學組件: 客製化 OmniMangaTutorial
6. 每日報告: 壽司博士增強版

---

## 十、關鍵成功指標

- 涵蓋 2015-2025 年台灣上市櫃公司永續報告書
- RAG 檢索回應時間 < 2 秒
- 知識點卡牌解鎖率追蹤
- 四格教學引導完成率 > 80%
- 每日報告準時率 100%
- UX: 專業工人減少 50% 重複操作時間
- UX: 資料總管可一鍵匯出驗證完成的 CSV

---

_Plan Created: 2026-03-08_ _Status: Ready for Implementation_
