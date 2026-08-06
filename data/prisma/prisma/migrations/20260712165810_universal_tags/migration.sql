-- CreateTable
CREATE TABLE "Regulation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sourceId" TEXT NOT NULL,
    "sourceName" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "content" TEXT NOT NULL DEFAULT '',
    "status" TEXT NOT NULL DEFAULT 'active',
    "hash" TEXT NOT NULL,
    "oldHash" TEXT,
    "publishedAt" TEXT,
    "crawledAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "version" INTEGER NOT NULL DEFAULT 1
);

-- CreateTable
CREATE TABLE "CompanyReport" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "companyId" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "reportType" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "pdfUrl" TEXT,
    "content" TEXT NOT NULL DEFAULT '',
    "hash" TEXT NOT NULL,
    "oldHash" TEXT,
    "version" INTEGER NOT NULL DEFAULT 1,
    "status" TEXT NOT NULL DEFAULT 'published',
    "crawledAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "ESGTag" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "pillar" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT ''
);

-- CreateTable
CREATE TABLE "RegulationTag" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "regulationId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,
    CONSTRAINT "RegulationTag_regulationId_fkey" FOREIGN KEY ("regulationId") REFERENCES "Regulation" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "RegulationTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "ESGTag" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ReportTag" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "reportId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,
    CONSTRAINT "ReportTag_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "CompanyReport" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ReportTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "ESGTag" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AlertTag" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "alertId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,
    CONSTRAINT "AlertTag_alertId_fkey" FOREIGN KEY ("alertId") REFERENCES "Alert" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "AlertTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "ESGTag" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "UniversalTag" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "label" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "esgTagId" TEXT,
    "omniType" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "metadata" TEXT NOT NULL DEFAULT '{}',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "TagPair" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "anchorTagId" TEXT NOT NULL,
    "evidenceTagId" TEXT,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "confidence" REAL NOT NULL DEFAULT 1.0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "TagPair_anchorTagId_fkey" FOREIGN KEY ("anchorTagId") REFERENCES "UniversalTag" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "TagPair_evidenceTagId_fkey" FOREIGN KEY ("evidenceTagId") REFERENCES "UniversalTag" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CrawlHistory" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sourceId" TEXT NOT NULL,
    "regulationId" TEXT,
    "companyReportId" TEXT,
    "itemsFound" INTEGER NOT NULL DEFAULT 0,
    "newItems" INTEGER NOT NULL DEFAULT 0,
    "changedItems" INTEGER NOT NULL DEFAULT 0,
    "errorCount" INTEGER NOT NULL DEFAULT 0,
    "duration" INTEGER NOT NULL,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CrawlHistory_regulationId_fkey" FOREIGN KEY ("regulationId") REFERENCES "Regulation" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "CrawlHistory_companyReportId_fkey" FOREIGN KEY ("companyReportId") REFERENCES "CompanyReport" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Alert" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sourceId" TEXT NOT NULL,
    "sourceName" TEXT NOT NULL,
    "alertType" TEXT NOT NULL,
    "severity" TEXT NOT NULL DEFAULT 'medium',
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL DEFAULT '',
    "url" TEXT NOT NULL,
    "hash" TEXT NOT NULL,
    "oldContent" TEXT DEFAULT '',
    "newContent" TEXT DEFAULT '',
    "esgPillar" TEXT NOT NULL DEFAULT '',
    "acknowledged" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "PDFParseResult" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "fileName" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "pageCount" INTEGER NOT NULL,
    "totalWords" INTEGER NOT NULL,
    "esgKeywordDensity" REAL NOT NULL,
    "companies" TEXT NOT NULL DEFAULT '[]',
    "metrics" TEXT NOT NULL DEFAULT '[]',
    "years" TEXT NOT NULL DEFAULT '[]',
    "sections" TEXT NOT NULL DEFAULT '[]',
    "esgCategories" TEXT NOT NULL DEFAULT '{}',
    "textPreview" TEXT NOT NULL DEFAULT '',
    "rawText" TEXT NOT NULL DEFAULT '',
    "parsedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "NotificationLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "alertId" TEXT NOT NULL,
    "channel" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "sentAt" DATETIME,
    "error" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "NotificationLog_alertId_fkey" FOREIGN KEY ("alertId") REFERENCES "Alert" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "UserGrowth" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "email" TEXT,
    "displayName" TEXT NOT NULL DEFAULT '永續觀察者',
    "tier" TEXT NOT NULL DEFAULT 'seed',
    "level" INTEGER NOT NULL DEFAULT 1,
    "xp" INTEGER NOT NULL DEFAULT 0,
    "totalPoints" INTEGER NOT NULL DEFAULT 0,
    "streakDays" INTEGER NOT NULL DEFAULT 0,
    "lastActiveAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "avatarUrl" TEXT,
    "joinedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Achievement" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "tierRequired" TEXT NOT NULL DEFAULT 'seed',
    "xpReward" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "UserAchievement" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "achievementId" TEXT NOT NULL,
    "unlockedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "UserAchievement_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserGrowth" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "UserAchievement_achievementId_fkey" FOREIGN KEY ("achievementId") REFERENCES "Achievement" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "GrowthTask" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "xpReward" INTEGER NOT NULL DEFAULT 10,
    "streakBonus" INTEGER NOT NULL DEFAULT 5,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "UserTask" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "progress" INTEGER NOT NULL DEFAULT 0,
    "completedAt" DATETIME,
    "claimedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "UserTask_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserGrowth" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "UserTask_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "GrowthTask" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "subType" TEXT NOT NULL,
    "targetId" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserGrowth" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DailyReport" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "reportDate" DATETIME NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL DEFAULT '',
    "highlights" TEXT NOT NULL DEFAULT '[]',
    "tagStats" TEXT NOT NULL DEFAULT '{}',
    "sourceCount" INTEGER NOT NULL DEFAULT 0,
    "alertCount" INTEGER NOT NULL DEFAULT 0,
    "topSources" TEXT NOT NULL DEFAULT '[]',
    "status" TEXT NOT NULL DEFAULT 'draft',
    "publishedAt" DATETIME,
    "editorNote" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" TEXT,
    CONSTRAINT "DailyReport_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "UserGrowth" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DailyReportItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "reportId" TEXT NOT NULL,
    "alertId" TEXT,
    "itemType" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL DEFAULT '',
    "sourceName" TEXT,
    "sourceUrl" TEXT,
    "severity" TEXT NOT NULL DEFAULT 'low',
    "esgPillar" TEXT NOT NULL DEFAULT '',
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "DailyReportItem_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "DailyReport" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "DailyReportItem_alertId_fkey" FOREIGN KEY ("alertId") REFERENCES "Alert" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Regulation_url_key" ON "Regulation"("url");

-- CreateIndex
CREATE INDEX "Regulation_sourceId_idx" ON "Regulation"("sourceId");

-- CreateIndex
CREATE INDEX "Regulation_crawledAt_idx" ON "Regulation"("crawledAt");

-- CreateIndex
CREATE UNIQUE INDEX "CompanyReport_url_key" ON "CompanyReport"("url");

-- CreateIndex
CREATE INDEX "CompanyReport_companyId_idx" ON "CompanyReport"("companyId");

-- CreateIndex
CREATE INDEX "CompanyReport_reportType_idx" ON "CompanyReport"("reportType");

-- CreateIndex
CREATE UNIQUE INDEX "ESGTag_name_key" ON "ESGTag"("name");

-- CreateIndex
CREATE INDEX "RegulationTag_regulationId_idx" ON "RegulationTag"("regulationId");

-- CreateIndex
CREATE INDEX "RegulationTag_tagId_idx" ON "RegulationTag"("tagId");

-- CreateIndex
CREATE UNIQUE INDEX "RegulationTag_regulationId_tagId_key" ON "RegulationTag"("regulationId", "tagId");

-- CreateIndex
CREATE INDEX "ReportTag_reportId_idx" ON "ReportTag"("reportId");

-- CreateIndex
CREATE INDEX "ReportTag_tagId_idx" ON "ReportTag"("tagId");

-- CreateIndex
CREATE UNIQUE INDEX "ReportTag_reportId_tagId_key" ON "ReportTag"("reportId", "tagId");

-- CreateIndex
CREATE INDEX "AlertTag_alertId_idx" ON "AlertTag"("alertId");

-- CreateIndex
CREATE INDEX "AlertTag_tagId_idx" ON "AlertTag"("tagId");

-- CreateIndex
CREATE UNIQUE INDEX "AlertTag_alertId_tagId_key" ON "AlertTag"("alertId", "tagId");

-- CreateIndex
CREATE INDEX "UniversalTag_kind_idx" ON "UniversalTag"("kind");

-- CreateIndex
CREATE UNIQUE INDEX "UniversalTag_label_kind_key" ON "UniversalTag"("label", "kind");

-- CreateIndex
CREATE INDEX "TagPair_entityType_entityId_idx" ON "TagPair"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "TagPair_anchorTagId_idx" ON "TagPair"("anchorTagId");

-- CreateIndex
CREATE UNIQUE INDEX "TagPair_anchorTagId_entityType_entityId_key" ON "TagPair"("anchorTagId", "entityType", "entityId");

-- CreateIndex
CREATE INDEX "CrawlHistory_sourceId_idx" ON "CrawlHistory"("sourceId");

-- CreateIndex
CREATE INDEX "CrawlHistory_timestamp_idx" ON "CrawlHistory"("timestamp");

-- CreateIndex
CREATE INDEX "Alert_sourceId_idx" ON "Alert"("sourceId");

-- CreateIndex
CREATE INDEX "Alert_severity_idx" ON "Alert"("severity");

-- CreateIndex
CREATE INDEX "Alert_acknowledged_idx" ON "Alert"("acknowledged");

-- CreateIndex
CREATE INDEX "Alert_createdAt_idx" ON "Alert"("createdAt");

-- CreateIndex
CREATE INDEX "PDFParseResult_fileName_idx" ON "PDFParseResult"("fileName");

-- CreateIndex
CREATE INDEX "PDFParseResult_parsedAt_idx" ON "PDFParseResult"("parsedAt");

-- CreateIndex
CREATE INDEX "NotificationLog_alertId_idx" ON "NotificationLog"("alertId");

-- CreateIndex
CREATE UNIQUE INDEX "UserGrowth_userId_key" ON "UserGrowth"("userId");

-- CreateIndex
CREATE INDEX "UserGrowth_tier_idx" ON "UserGrowth"("tier");

-- CreateIndex
CREATE INDEX "UserGrowth_totalPoints_idx" ON "UserGrowth"("totalPoints");

-- CreateIndex
CREATE UNIQUE INDEX "Achievement_slug_key" ON "Achievement"("slug");

-- CreateIndex
CREATE INDEX "UserAchievement_userId_idx" ON "UserAchievement"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserAchievement_userId_achievementId_key" ON "UserAchievement"("userId", "achievementId");

-- CreateIndex
CREATE UNIQUE INDEX "GrowthTask_slug_key" ON "GrowthTask"("slug");

-- CreateIndex
CREATE INDEX "UserTask_userId_idx" ON "UserTask"("userId");

-- CreateIndex
CREATE INDEX "UserTask_status_idx" ON "UserTask"("status");

-- CreateIndex
CREATE UNIQUE INDEX "UserTask_userId_taskId_key" ON "UserTask"("userId", "taskId");

-- CreateIndex
CREATE INDEX "Subscription_userId_idx" ON "Subscription"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_userId_subType_targetId_key" ON "Subscription"("userId", "subType", "targetId");

-- CreateIndex
CREATE UNIQUE INDEX "DailyReport_reportDate_key" ON "DailyReport"("reportDate");

-- CreateIndex
CREATE INDEX "DailyReport_reportDate_idx" ON "DailyReport"("reportDate");

-- CreateIndex
CREATE INDEX "DailyReport_status_idx" ON "DailyReport"("status");

-- CreateIndex
CREATE INDEX "DailyReport_createdById_idx" ON "DailyReport"("createdById");

-- CreateIndex
CREATE INDEX "DailyReportItem_reportId_idx" ON "DailyReportItem"("reportId");

-- CreateIndex
CREATE INDEX "DailyReportItem_itemType_idx" ON "DailyReportItem"("itemType");

-- CreateIndex
CREATE INDEX "DailyReportItem_alertId_idx" ON "DailyReportItem"("alertId");
