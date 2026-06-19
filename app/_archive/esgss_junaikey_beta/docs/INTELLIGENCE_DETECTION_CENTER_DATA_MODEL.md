# 商情偵測中心資料模型設計

**文件版本：** v1.0  
**建立日期：** 2026-02-11  
**文件狀態：** 正式版  
**適用範圍：** ESGss JunAiKey 平台商情偵測中心資料模型

---

## 📋 目錄

1. [執行摘要](#1-執行摘要)
2. [資料庫架構](#2-資料庫架構)
3. [資料表設計](#3-資料表設計)
4. [關聯關係](#4-關聯關係)
5. [索引設計](#5-索引設計)
6. [資料遷移](#6-資料遷移)
7. [資料備份與恢復](#7-資料備份與恢復)

---

## 1. 執行摘要

### 1.1 文件目的

本文件定義商情偵測中心的完整資料模型設計，包括資料庫架構、資料表設計、關聯關係、索引設計和資料遷移。

### 1.2 資料庫選擇

| 項目 | 選擇 | 原因 |
|------|------|------|
| **資料庫** | PostgreSQL | 成熟、可靠、支援複雜查詢 |
| **ORM** | Prisma | 型別安全、易於維護 |
| **雲端服務** | Supabase | 提供 PostgreSQL 託管和即時功能 |

### 1.3 資料表概覽

| 資料表 | 描述 | 記錄數預估 |
|--------|------|------------|
| `intelligence_items` | 情報項目 | 10,000+ |
| `intelligence_analysis` | 分析結果 | 50,000+ |
| `intelligence_notifications` | 通知 | 100,000+ |
| `intelligence_user_preferences` | 用戶偏好 | 1,000+ |
| `intelligence_suggested_actions` | 建議行動 | 20,000+ |
| `intelligence_persona_relevance` | 角色關聯性 | 60,000+ |

---

## 2. 資料庫架構

### 2.1 ER 圖

```
┌─────────────────────────────────────────────────────────────────┐
│                    商情偵測中心資料庫架構                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────┐         ┌──────────────────┐              │
│  │ intelligence_    │         │ intelligence_    │              │
│  │ items            │────────▶│ analysis         │              │
│  └──────────────────┘         └──────────────────┘              │
│           │                                                        │
│           │                                                        │
│           ▼                                                        │
│  ┌──────────────────┐         ┌──────────────────┐              │
│  │ intelligence_    │         │ intelligence_    │              │
│  │ suggested_actions│         │ persona_relevance │              │
│  └──────────────────┘         └──────────────────┘              │
│                                                                  │
│  ┌──────────────────┐         ┌──────────────────┐              │
│  │ intelligence_    │         │ intelligence_    │              │
│  │ notifications    │◀────────│ user_preferences │              │
│  └──────────────────┘         └──────────────────┘              │
│           │                                                        │
│           │                                                        │
│           ▼                                                        │
│  ┌──────────────────┐                                            │
│  │ users            │                                            │
│  └──────────────────┘                                            │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 資料庫 Schema

```prisma
// schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ==========================================
// 情報項目
// ==========================================
model IntelligenceItem {
  id                String                        @id @default(uuid())
  title             String
  summary           String
  content           String                        @db.Text
  source            String
  sourceUrl         String?                       @map("source_url")
  category          IntelligenceCategory
  priority          IntelligencePriority
  relevanceScore    Int                           @map("relevance_score") @default(0)
  impactLevel       IntelligenceImpactLevel       @map("impact_level")
  createdAt         DateTime                      @default(now()) @map("created_at")
  updatedAt         DateTime                      @updatedAt @map("updated_at")
  publishedAt       DateTime                      @map("published_at")
  tags              String[]
  relatedStandards  String[]                      @map("related_standards")
  metadata          Json                          @default("{}")
  
  // 關聯
  analysis          IntelligenceAnalysis[]
  suggestedActions  IntelligenceSuggestedAction[]
  personaRelevance  IntelligencePersonaRelevance[]
  notifications     IntelligenceNotification[]
  
  @@map("intelligence_items")
  @@index([category])
  @@index([priority])
  @@index([impactLevel])
  @@index([publishedAt])
  @@index([createdAt])
}

// ==========================================
// 分析結果
// ==========================================
model IntelligenceAnalysis {
  id              String              @id @default(uuid())
  intelligenceId  String              @map("intelligence_id")
  analysisType    AnalysisType        @map("analysis_type")
  result          Json                @default("{}")
  createdAt       DateTime            @default(now()) @map("created_at")
  processedBy     String              @map("processed_by") @default("ai")
  confidence      Float               @default(0.0)
  
  // 關聯
  intelligence    IntelligenceItem    @relation(fields: [intelligenceId], references: [id], onDelete: Cascade)
  
  @@map("intelligence_analysis")
  @@index([intelligenceId])
  @@index([analysisType])
  @@unique([intelligenceId, analysisType])
}

// ==========================================
// 建議行動
// ==========================================
model IntelligenceSuggestedAction {
  id              String              @id @default(uuid())
  intelligenceId  String              @map("intelligence_id")
  title           String
  description     String              @db.Text
  priority        IntelligencePriority
  estimatedCost   Json?               @map("estimated_cost")
  estimatedImpact String?             @map("estimated_impact")
  deadline        DateTime?           @map("deadline")
  assignee        String?             @map("assignee")
  status          ActionStatus        @default(PENDING)
  createdAt       DateTime            @default(now()) @map("created_at")
  updatedAt       DateTime            @updatedAt @map("updated_at")
  
  // 關聯
  intelligence    IntelligenceItem    @relation(fields: [intelligenceId], references: [id], onDelete: Cascade)
  
  @@map("intelligence_suggested_actions")
  @@index([intelligenceId])
  @@index([status])
  @@index([deadline])
}

// ==========================================
// 角色關聯性
// ==========================================
model IntelligencePersonaRelevance {
  id              String              @id @default(uuid())
  intelligenceId  String              @map("intelligence_id")
  persona         PersonaType
  relevanceScore  Int                 @map("relevance_score") @default(0)
  customSummary   String?             @map("custom_summary") @db.Text
  customActions   String[]            @map("custom_actions") @default([])
  createdAt       DateTime            @default(now()) @map("created_at")
  updatedAt       DateTime            @updatedAt @map("updated_at")
  
  // 關聯
  intelligence    IntelligenceItem    @relation(fields: [intelligenceId], references: [id], onDelete: Cascade)
  
  @@map("intelligence_persona_relevance")
  @@index([intelligenceId])
  @@index([persona])
  @@unique([intelligenceId, persona])
}

// ==========================================
// 通知
// ==========================================
model IntelligenceNotification {
  id              String              @id @default(uuid())
  userId          String              @map("user_id")
  intelligenceId  String              @map("intelligence_id")
  type            NotificationType
  title           String
  message         String              @db.Text
  read            Boolean             @default(false)
  createdAt       DateTime            @default(now()) @map("created_at")
  expiresAt       DateTime?           @map("expires_at")
  actionUrl       String?             @map("action_url")
  
  // 關聯
  intelligence    IntelligenceItem    @relation(fields: [intelligenceId], references: [id], onDelete: Cascade)
  user            User                @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@map("intelligence_notifications")
  @@index([userId])
  @@index([intelligenceId])
  @@index([read])
  @@index([createdAt])
}

// ==========================================
// 用戶偏好
// ==========================================
model IntelligenceUserPreferences {
  id                      String                      @id @default(uuid())
  userId                  String                      @map("user_id")
  persona                 PersonaType
  preferredCategories     IntelligenceCategory[]      @map("preferred_categories") @default([])
  preferredPriorities     IntelligencePriority[]      @map("preferred_priorities") @default([])
  preferredIndustries     String[]                    @map("preferred_industries") @default([])
  preferredRegions        String[]                    @map("preferred_regions") @default([])
  notificationSettings    Json                        @map("notification_settings") @default("{}")
  dashboardLayout         Json                        @map("dashboard_layout") @default("{}")
  createdAt               DateTime                    @default(now()) @map("created_at")
  updatedAt               DateTime                    @updatedAt @map("updated_at")
  
  // 關聯
  user                    User                        @relation(fields: [userId], references: [id], onDelete: Cascade)
  notifications           IntelligenceNotification[]
  
  @@map("intelligence_user_preferences")
  @@unique([userId])
  @@index([persona])
}

// ==========================================
// 用戶 (參考現有 users 表)
// ==========================================
model User {
  id                      String                          @id @default(uuid())
  email                   String                          @unique
  name                    String?
  role                    String                          @default("user")
  createdAt               DateTime                        @default(now()) @map("created_at")
  updatedAt               DateTime                        @updatedAt @map("updated_at")
  
  // 關聯
  notifications           IntelligenceNotification[]
  preferences             IntelligenceUserPreferences?
  
  @@map("users")
  @@index([email])
}

// ==========================================
// Enums
// ==========================================
enum IntelligenceCategory {
  MARKET_NEWS
  REGULATORY_UPDATE
  INDUSTRY_TREND
  RISK_ALERT
  OPPORTUNITY
  BEST_PRACTICE
}

enum IntelligencePriority {
  CRITICAL
  HIGH
  MEDIUM
  LOW
}

enum IntelligenceImpactLevel {
  CRITICAL
  HIGH
  MEDIUM
  LOW
}

enum AnalysisType {
  SENTIMENT
  RELEVANCE
  IMPACT
  TREND
  RISK
}

enum ActionStatus {
  PENDING
  IN_PROGRESS
  COMPLETED
  CANCELLED
}

enum PersonaType {
  CEO
  ESG_SPECIALIST
  CFO
  SUPPLY_CHAIN_MANAGER
  CONSULTANT_PM
  BANK_CREDIT_ANALYST
}

enum NotificationType {
  NEW_INTELLIGENCE
  PRIORITY_UPDATE
  DEADLINE_REMINDER
  TREND_ALERT
  RISK_ALERT
}
```

---

## 3. 資料表設計

### 3.1 intelligence_items (情報項目)

| 欄位 | 類型 | 必填 | 描述 | 預設值 |
|------|------|------|------|--------|
| `id` | uuid | 是 | 主鍵 | uuid() |
| `title` | varchar(255) | 是 | 標題 | - |
| `summary` | varchar(500) | 是 | 摘要 | - |
| `content` | text | 是 | 內容 | - |
| `source` | varchar(255) | 是 | 來源 | - |
| `source_url` | varchar(500) | 否 | 來源 URL | NULL |
| `category` | enum | 是 | 類別 | - |
| `priority` | enum | 是 | 優先級 | - |
| `relevance_score` | int | 是 | 關聯分數 (0-100) | 0 |
| `impact_level` | enum | 是 | 影響等級 | - |
| `created_at` | timestamp | 是 | 建立時間 | NOW() |
| `updated_at` | timestamp | 是 | 更新時間 | NOW() |
| `published_at` | timestamp | 是 | 發布時間 | - |
| `tags` | text[] | 是 | 標籤 | {} |
| `related_standards` | text[] | 是 | 相關準則 | {} |
| `metadata` | jsonb | 是 | 元資料 | {} |

### 3.2 intelligence_analysis (分析結果)

| 欄位 | 類型 | 必填 | 描述 | 預設值 |
|------|------|------|------|--------|
| `id` | uuid | 是 | 主鍵 | uuid() |
| `intelligence_id` | uuid | 是 | 情報項目 ID (FK) | - |
| `analysis_type` | enum | 是 | 分析類型 | - |
| `result` | jsonb | 是 | 分析結果 | {} |
| `created_at` | timestamp | 是 | 建立時間 | NOW() |
| `processed_by` | varchar(50) | 是 | 處理者 | 'ai' |
| `confidence` | float | 是 | 信心度 (0-1) | 0.0 |

### 3.3 intelligence_suggested_actions (建議行動)

| 欄位 | 類型 | 必填 | 描述 | 預設值 |
|------|------|------|------|--------|
| `id` | uuid | 是 | 主鍵 | uuid() |
| `intelligence_id` | uuid | 是 | 情報項目 ID (FK) | - |
| `title` | varchar(255) | 是 | 標題 | - |
| `description` | text | 是 | 描述 | - |
| `priority` | enum | 是 | 優先級 | - |
| `estimated_cost` | jsonb | 否 | 預估成本 | NULL |
| `estimated_impact` | varchar(255) | 否 | 預估影響 | NULL |
| `deadline` | timestamp | 否 | 截止日期 | NULL |
| `assignee` | varchar(255) | 否 | 指派人 | NULL |
| `status` | enum | 是 | 狀態 | 'pending' |
| `created_at` | timestamp | 是 | 建立時間 | NOW() |
| `updated_at` | timestamp | 是 | 更新時間 | NOW() |

### 3.4 intelligence_persona_relevance (角色關聯性)

| 欄位 | 類型 | 必填 | 描述 | 預設值 |
|------|------|------|------|--------|
| `id` | uuid | 是 | 主鍵 | uuid() |
| `intelligence_id` | uuid | 是 | 情報項目 ID (FK) | - |
| `persona` | enum | 是 | 角色類型 | - |
| `relevance_score` | int | 是 | 關聯分數 (0-100) | 0 |
| `custom_summary` | text | 否 | 角色化摘要 | NULL |
| `custom_actions` | text[] | 否 | 角色化行動 | {} |
| `created_at` | timestamp | 是 | 建立時間 | NOW() |
| `updated_at` | timestamp | 是 | 更新時間 | NOW() |

### 3.5 intelligence_notifications (通知)

| 欄位 | 類型 | 必填 | 描述 | 預設值 |
|------|------|------|------|--------|
| `id` | uuid | 是 | 主鍵 | uuid() |
| `user_id` | uuid | 是 | 用戶 ID (FK) | - |
| `intelligence_id` | uuid | 是 | 情報項目 ID (FK) | - |
| `type` | enum | 是 | 通知類型 | - |
| `title` | varchar(255) | 是 | 標題 | - |
| `message` | text | 是 | 訊息 | - |
| `read` | boolean | 是 | 已讀 | false |
| `created_at` | timestamp | 是 | 建立時間 | NOW() |
| `expires_at` | timestamp | 否 | 過期時間 | NULL |
| `action_url` | varchar(500) | 否 | 動作 URL | NULL |

### 3.6 intelligence_user_preferences (用戶偏好)

| 欄位 | 類型 | 必填 | 描述 | 預設值 |
|------|------|------|------|--------|
| `id` | uuid | 是 | 主鍵 | uuid() |
| `user_id` | uuid | 是 | 用戶 ID (FK) | - |
| `persona` | enum | 是 | 角色類型 | - |
| `preferred_categories` | enum[] | 是 | 偏好類別 | {} |
| `preferred_priorities` | enum[] | 是 | 偏好優先級 | {} |
| `preferred_industries` | text[] | 是 | 偏好產業 | {} |
| `preferred_regions` | text[] | 是 | 偏好地區 | {} |
| `notification_settings` | jsonb | 是 | 通知設定 | {} |
| `dashboard_layout` | jsonb | 是 | 儀表板佈局 | {} |
| `created_at` | timestamp | 是 | 建立時間 | NOW() |
| `updated_at` | timestamp | 是 | 更新時間 | NOW() |

---

## 4. 關聯關係

### 4.1 一對多關係

| 主表 | 從表 | 關聯欄位 | 描述 |
|------|------|----------|------|
| `intelligence_items` | `intelligence_analysis` | `intelligence_id` | 一個情報項目可以有多個分析結果 |
| `intelligence_items` | `intelligence_suggested_actions` | `intelligence_id` | 一個情報項目可以有多個建議行動 |
| `intelligence_items` | `intelligence_persona_relevance` | `intelligence_id` | 一個情報項目可以有多個角色關聯性 |
| `intelligence_items` | `intelligence_notifications` | `intelligence_id` | 一個情報項目可以有多個通知 |
| `users` | `intelligence_notifications` | `user_id` | 一個用戶可以有多個通知 |
| `users` | `intelligence_user_preferences` | `user_id` | 一個用戶有一個偏好設定 |

### 4.2 多對多關係

目前沒有多對多關係，所有關係都是一對多。

### 4.3 級聯刪除

| 關聯 | 級聯刪除 | 描述 |
|------|----------|------|
| `intelligence_items` → `intelligence_analysis` | CASCADE | 刪除情報項目時，刪除所有相關分析結果 |
| `intelligence_items` → `intelligence_suggested_actions` | CASCADE | 刪除情報項目時，刪除所有相關建議行動 |
| `intelligence_items` → `intelligence_persona_relevance` | CASCADE | 刪除情報項目時，刪除所有相關角色關聯性 |
| `intelligence_items` → `intelligence_notifications` | CASCADE | 刪除情報項目時，刪除所有相關通知 |
| `users` → `intelligence_notifications` | CASCADE | 刪除用戶時，刪除所有相關通知 |
| `users` → `intelligence_user_preferences` | CASCADE | 刪除用戶時，刪除相關偏好設定 |

---

## 5. 索引設計

### 5.1 intelligence_items 索引

```sql
-- 主鍵索引
CREATE INDEX pk_intelligence_items ON intelligence_items(id);

-- 類別索引
CREATE INDEX idx_intelligence_items_category ON intelligence_items(category);

-- 優先級索引
CREATE INDEX idx_intelligence_items_priority ON intelligence_items(priority);

-- 影響等級索引
CREATE INDEX idx_intelligence_items_impact_level ON intelligence_items(impact_level);

-- 發布時間索引
CREATE INDEX idx_intelligence_items_published_at ON intelligence_items(published_at DESC);

-- 建立時間索引
CREATE INDEX idx_intelligence_items_created_at ON intelligence_items(created_at DESC);

-- 複合索引 (類別 + 優先級)
CREATE INDEX idx_intelligence_items_category_priority ON intelligence_items(category, priority);

-- 複合索引 (類別 + 發布時間)
CREATE INDEX idx_intelligence_items_category_published_at ON intelligence_items(category, published_at DESC);

-- 全文搜尋索引
CREATE INDEX idx_intelligence_items_title_search ON intelligence_items USING gin(to_tsvector('english', title));
CREATE INDEX idx_intelligence_items_summary_search ON intelligence_items USING gin(to_tsvector('english', summary));
CREATE INDEX idx_intelligence_items_content_search ON intelligence_items USING gin(to_tsvector('english', content));
```

### 5.2 intelligence_analysis 索引

```sql
-- 主鍵索引
CREATE INDEX pk_intelligence_analysis ON intelligence_analysis(id);

-- 情報項目索引
CREATE INDEX idx_intelligence_analysis_intelligence_id ON intelligence_analysis(intelligence_id);

-- 分析類型索引
CREATE INDEX idx_intelligence_analysis_analysis_type ON intelligence_analysis(analysis_type);

-- 唯一索引 (情報項目 + 分析類型)
CREATE UNIQUE INDEX uk_intelligence_analysis_intelligence_type ON intelligence_analysis(intelligence_id, analysis_type);
```

### 5.3 intelligence_suggested_actions 索引

```sql
-- 主鍵索引
CREATE INDEX pk_intelligence_suggested_actions ON intelligence_suggested_actions(id);

-- 情報項目索引
CREATE INDEX idx_intelligence_suggested_actions_intelligence_id ON intelligence_suggested_actions(intelligence_id);

-- 狀態索引
CREATE INDEX idx_intelligence_suggested_actions_status ON intelligence_suggested_actions(status);

-- 截止日期索引
CREATE INDEX idx_intelligence_suggested_actions_deadline ON intelligence_suggested_actions(deadline);

-- 複合索引 (狀態 + 截止日期)
CREATE INDEX idx_intelligence_suggested_actions_status_deadline ON intelligence_suggested_actions(status, deadline);
```

### 5.4 intelligence_persona_relevance 索引

```sql
-- 主鍵索引
CREATE INDEX pk_intelligence_persona_relevance ON intelligence_persona_relevance(id);

-- 情報項目索引
CREATE INDEX idx_intelligence_persona_relevance_intelligence_id ON intelligence_persona_relevance(intelligence_id);

-- 角色索引
CREATE INDEX idx_intelligence_persona_relevance_persona ON intelligence_persona_relevance(persona);

-- 唯一索引 (情報項目 + 角色)
CREATE UNIQUE INDEX uk_intelligence_persona_relevance_intelligence_persona ON intelligence_persona_relevance(intelligence_id, persona);
```

### 5.5 intelligence_notifications 索引

```sql
-- 主鍵索引
CREATE INDEX pk_intelligence_notifications ON intelligence_notifications(id);

-- 用戶索引
CREATE INDEX idx_intelligence_notifications_user_id ON intelligence_notifications(user_id);

-- 情報項目索引
CREATE INDEX idx_intelligence_notifications_intelligence_id ON intelligence_notifications(intelligence_id);

-- 已讀索引
CREATE INDEX idx_intelligence_notifications_read ON intelligence_notifications(read);

-- 建立時間索引
CREATE INDEX idx_intelligence_notifications_created_at ON intelligence_notifications(created_at DESC);

-- 複合索引 (用戶 + 已讀 + 建立時間)
CREATE INDEX idx_intelligence_notifications_user_read_created ON intelligence_notifications(user_id, read, created_at DESC);
```

### 5.6 intelligence_user_preferences 索引

```sql
-- 主鍵索引
CREATE INDEX pk_intelligence_user_preferences ON intelligence_user_preferences(id);

-- 用戶唯一索引
CREATE UNIQUE INDEX uk_intelligence_user_preferences_user_id ON intelligence_user_preferences(user_id);

-- 角色索引
CREATE INDEX idx_intelligence_user_preferences_persona ON intelligence_user_preferences(persona);
```

---

## 6. 資料遷移

### 6.1 初始遷移

```sql
-- Migration: 20260211000001_create_intelligence_tables
-- Description: Create intelligence detection center tables

-- Create intelligence_items table
CREATE TABLE intelligence_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  summary VARCHAR(500) NOT NULL,
  content TEXT NOT NULL,
  source VARCHAR(255) NOT NULL,
  source_url VARCHAR(500),
  category VARCHAR(50) NOT NULL CHECK (category IN ('market_news', 'regulatory_update', 'industry_trend', 'risk_alert', 'opportunity', 'best_practice')),
  priority VARCHAR(20) NOT NULL CHECK (priority IN ('critical', 'high', 'medium', 'low')),
  relevance_score INTEGER NOT NULL DEFAULT 0 CHECK (relevance_score >= 0 AND relevance_score <= 100),
  impact_level VARCHAR(20) NOT NULL CHECK (impact_level IN ('critical', 'high', 'medium', 'low')),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  published_at TIMESTAMP NOT NULL,
  tags TEXT[] NOT NULL DEFAULT '{}',
  related_standards TEXT[] NOT NULL DEFAULT '{}',
  metadata JSONB NOT NULL DEFAULT '{}'
);

-- Create intelligence_analysis table
CREATE TABLE intelligence_analysis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  intelligence_id UUID NOT NULL REFERENCES intelligence_items(id) ON DELETE CASCADE,
  analysis_type VARCHAR(20) NOT NULL CHECK (analysis_type IN ('sentiment', 'relevance', 'impact', 'trend', 'risk')),
  result JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  processed_by VARCHAR(50) NOT NULL DEFAULT 'ai',
  confidence FLOAT NOT NULL DEFAULT 0.0 CHECK (confidence >= 0 AND confidence <= 1),
  UNIQUE(intelligence_id, analysis_type)
);

-- Create intelligence_suggested_actions table
CREATE TABLE intelligence_suggested_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  intelligence_id UUID NOT NULL REFERENCES intelligence_items(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  priority VARCHAR(20) NOT NULL CHECK (priority IN ('critical', 'high', 'medium', 'low')),
  estimated_cost JSONB,
  estimated_impact VARCHAR(255),
  deadline TIMESTAMP,
  assignee VARCHAR(255),
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create intelligence_persona_relevance table
CREATE TABLE intelligence_persona_relevance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  intelligence_id UUID NOT NULL REFERENCES intelligence_items(id) ON DELETE CASCADE,
  persona VARCHAR(50) NOT NULL CHECK (persona IN ('ceo', 'esg_specialist', 'cfo', 'supply_chain_manager', 'consultant_pm', 'bank_credit_analyst')),
  relevance_score INTEGER NOT NULL DEFAULT 0 CHECK (relevance_score >= 0 AND relevance_score <= 100),
  custom_summary TEXT,
  custom_actions TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE(intelligence_id, persona)
);

-- Create intelligence_notifications table
CREATE TABLE intelligence_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  intelligence_id UUID NOT NULL REFERENCES intelligence_items(id) ON DELETE CASCADE,
  type VARCHAR(30) NOT NULL CHECK (type IN ('new_intelligence', 'priority_update', 'deadline_reminder', 'trend_alert', 'risk_alert')),
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMP,
  action_url VARCHAR(500)
);

-- Create intelligence_user_preferences table
CREATE TABLE intelligence_user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  persona VARCHAR(50) NOT NULL CHECK (persona IN ('ceo', 'esg_specialist', 'cfo', 'supply_chain_manager', 'consultant_pm', 'bank_credit_analyst')),
  preferred_categories VARCHAR(50)[] NOT NULL DEFAULT '{}',
  preferred_priorities VARCHAR(20)[] NOT NULL DEFAULT '{}',
  preferred_industries TEXT[] NOT NULL DEFAULT '{}',
  preferred_regions TEXT[] NOT NULL DEFAULT '{}',
  notification_settings JSONB NOT NULL DEFAULT '{}',
  dashboard_layout JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_intelligence_items_category ON intelligence_items(category);
CREATE INDEX idx_intelligence_items_priority ON intelligence_items(priority);
CREATE INDEX idx_intelligence_items_impact_level ON intelligence_items(impact_level);
CREATE INDEX idx_intelligence_items_published_at ON intelligence_items(published_at DESC);
CREATE INDEX idx_intelligence_items_created_at ON intelligence_items(created_at DESC);

CREATE INDEX idx_intelligence_analysis_intelligence_id ON intelligence_analysis(intelligence_id);
CREATE INDEX idx_intelligence_analysis_analysis_type ON intelligence_analysis(analysis_type);

CREATE INDEX idx_intelligence_suggested_actions_intelligence_id ON intelligence_suggested_actions(intelligence_id);
CREATE INDEX idx_intelligence_suggested_actions_status ON intelligence_suggested_actions(status);
CREATE INDEX idx_intelligence_suggested_actions_deadline ON intelligence_suggested_actions(deadline);

CREATE INDEX idx_intelligence_persona_relevance_intelligence_id ON intelligence_persona_relevance(intelligence_id);
CREATE INDEX idx_intelligence_persona_relevance_persona ON intelligence_persona_relevance(persona);

CREATE INDEX idx_intelligence_notifications_user_id ON intelligence_notifications(user_id);
CREATE INDEX idx_intelligence_notifications_intelligence_id ON intelligence_notifications(intelligence_id);
CREATE INDEX idx_intelligence_notifications_read ON intelligence_notifications(read);
CREATE INDEX idx_intelligence_notifications_created_at ON intelligence_notifications(created_at DESC);

CREATE INDEX idx_intelligence_user_preferences_persona ON intelligence_user_preferences(persona);
```

### 6.2 更新 updated_at 觸發器

```sql
-- Migration: 20260211000002_create_updated_at_trigger
-- Description: Create trigger to auto-update updated_at

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for intelligence_items
CREATE TRIGGER update_intelligence_items_updated_at
  BEFORE UPDATE ON intelligence_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create triggers for intelligence_suggested_actions
CREATE TRIGGER update_intelligence_suggested_actions_updated_at
  BEFORE UPDATE ON intelligence_suggested_actions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create triggers for intelligence_persona_relevance
CREATE TRIGGER update_intelligence_persona_relevance_updated_at
  BEFORE UPDATE ON intelligence_persona_relevance
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create triggers for intelligence_user_preferences
CREATE TRIGGER update_intelligence_user_preferences_updated_at
  BEFORE UPDATE ON intelligence_user_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

---

## 7. 資料備份與恢復

### 7.1 備份策略

| 備份類型 | 頻率 | 保留期間 | 位置 |
|----------|------|----------|------|
| **完整備份** | 每日 | 30 天 | 雲端儲存 |
| **增量備份** | 每小時 | 7 天 | 雲端儲存 |
| **即時備份** | 持續 | 1 天 | 本地儲存 |

### 7.2 備份命令

```bash
# 完整備份
pg_dump -h localhost -U postgres -d esgss_junaikey -F c -f backup_$(date +%Y%m%d).dump

# 僅備份情報相關表格
pg_dump -h localhost -U postgres -d esgss_junaikey -t intelligence_* -F c -f intelligence_backup_$(date +%Y%m%d).dump

# 恢復備份
pg_restore -h localhost -U postgres -d esgss_junaikey -F c backup_20260211.dump
```

### 7.3 資料清理策略

```sql
-- 清理過期通知 (超過 30 天)
DELETE FROM intelligence_notifications
WHERE created_at < NOW() - INTERVAL '30 days';

-- 清理過期分析結果 (超過 90 天)
DELETE FROM intelligence_analysis
WHERE created_at < NOW() - INTERVAL '90 days';

-- 清理已完成且超過 180 天的建議行動
DELETE FROM intelligence_suggested_actions
WHERE status = 'completed' AND updated_at < NOW() - INTERVAL '180 days';
```

---

## 附錄

### A. 相關文件

- [`INTELLIGENCE_DETECTION_CENTER_IMPLEMENTATION_SPEC.md`](INTELLIGENCE_DETECTION_CENTER_IMPLEMENTATION_SPEC.md) - 實作規格文件
- [`INTELLIGENCE_DETECTION_CENTER_API_DESIGN.md`](INTELLIGENCE_DETECTION_CENTER_API_DESIGN.md) - API 設計文件

### B. 版本歷史

| 版本 | 日期 | 變更內容 | 作者 |
|------|------|----------|------|
| v1.0 | 2026-02-11 | 初始版本 | Kilo Code |
