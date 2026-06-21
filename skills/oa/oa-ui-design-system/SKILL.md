---
name: oa-ui-design-system
description: "ESGGO UI 設計系統 — 極簡美學、服務教學、高資訊量、實用高效、操作簡單、正確合規、全域RWD、進步成長、最佳實踐化、以客戶需求為同心圓中心。使用時機：建立新頁面、重構 UI 元件、設計審核、零算力永續報告組裝、Omnipotent Repository 資源庫、VPS 部署除錯、24 萬字範本擴展。"
version: 3.3.0
author: ESGGO OmniAgent
license: MIT
metadata:
  hermes:
    tags: [design, ui, system, rwd, esggo, berkeley-blue, gold]
    related_skills: [oa-page-builder, oa-design-fix, oa-summon]
---

# OA UI Design System v3 — 極簡美學 + 萬能中心

## Overview

ESGGO 的 UI 設計系統定義了色彩、元件、佈局、間距、禁止樣式等規範。所有頁面和元件必須遵循此系統。

## When to Use

- 建立新頁面或新元件
- 重構現有 UI
- 設計審核/修復
- 零算力永續報告組裝
- VPS 部署除錯

**Don't use for:** 功能邏輯實作（用 `oa-page-builder`）、部署流程（用 `oa-deploy`）

## 設計哲學（10項原則）

1. **極簡美學** — 簡約乾淨、大量留白、無裝飾
2. **服務教學** — 引導使用者完成任務
3. **高資訊量** — 每頁提供充足資訊
4. **實用高效** — 功能優先、減少冗餘
5. **操作簡單** — 直覺化操作、減少步驟
6. **正確合規** — 符合法規要求
7. **全域RWD** — 桌面/平板/手機完整支援
8. **進步成長** — 持續迭代優化
9. **最佳實踐化** — 遵循業界標準
10. **以客戶需求為同心圓中心** — 所有設計圍繞客戶需求

## 色彩規範

| Token | Value | Usage |
|-------|-------|-------|
| Primary | `#003262` | 標題、按鈕、連結 (Berkeley Blue) |
| Accent | `#FDB515` | 圖標、徽章、強調 (Gold) |
| Background | `#F8FAFC` | 頁面背景 |
| Surface | `#FFFFFF` | 卡片、面板 |
| Border | `#E2E8F0` | 邊框 |
| Text Primary | `#0F172A` | 主要文字 |
| Text Secondary | `#64748B` | 次要文字 |
| Text Muted | `#94A3B8` | 輔助文字 |
| Success | `#10B981` | 成功狀態 |
| Warning | `#F59E0B` | 警告狀態 |
| Error | `#EF4444` | 錯誤狀態 |
| Info | `#3B82F6` | 資訊狀態 |

## 禁止樣式

- ❌ `dark:` 前綴類別
- ❌ `bg-black`, `bg-slate-900`
- ❌ `text-white`（除非在深色按鈕內）
- ❌ `backdrop-blur-*`（玻璃效果）
- ❌ `bg-white/[0.*]`（半透明白色）
- ❌ `border-white/*`（半透明邊框）
- ❌ 液態玻璃風格

## v2 元件庫

**位置：** `components/ui/v2/`
**統一匯出：** `components/ui/v2/index.tsx`

可用元件：Card, Button, Input, Badge, SectionHeader, NavItem, NavSection, LoginCard, Table, BrandTableCompat, Modal, Tabs, StatusDot, Progress, FiveTStrip, OmniHeader

### Card
```tsx
<Card variant="default" padding="md" hover>
  <CardHeader><CardTitle>標題</CardTitle></CardHeader>
  <CardContent>內容</CardContent>
  <CardFooter>底部操作</CardFooter>
</Card>
```

### Button
```tsx
<Button variant="primary" size="md">主要</Button>
<Button variant="secondary" size="md">次要</Button>
<Button variant="ghost" size="md">幽靈</Button>
<Button variant="ghost" size="sm" icon={<RefreshCw size={14} />}>同步</Button>
```

### FiveTStrip
```tsx
<FiveTStrip status={[true, true, true, true, true]} showLabels size="sm" />
```

### OmniHeader
```tsx
<OmniHeader title="標題" subtitle="副標題" icon={<Icon />} actions={<Button>操作</Button>} />
```

### StatusDot
```tsx
<StatusDot status="active" pulse size="sm" />
```

### Progress
```tsx
<Progress value={75} size="sm" color="auto" />
```

## RWD 斷點

| 斷點 | 寬度 | 佈局 |
|------|------|------|
| Mobile | < 768px | 單欄、卡片堆疊 |
| Tablet | 768-1024px | 雙欄、部分展開 |
| Desktop | > 1024px | 多欄、完整展開 |

## 萬能中心 (OmniHub) 架構

### 核心檔案
- 型別定義：`lib/omni-hub/types.ts`
- 中心核心：`lib/omni-hub/hub.ts`（單例模式）
- 共享記憶：`lib/omni-hub/memory.ts`
- 設施註冊：`lib/omni-hub/registry.ts`
- 統一匯出：`lib/omni-hub/index.ts`
- API 路由：`app/api/hub/route.ts`
- 前端頁面：`app/omni-hub/page.tsx`

### 設施註冊
```typescript
await OmniHub.registerFacility({
  id: 'omni-agent',
  name: 'OmniAgent',
  displayName: '萬能代理',
  role: 'orchestrator',
  status: 'idle',
  capabilities: [...],
  memoryAccess: ['read', 'write', 'admin'],
  maxConcurrentTasks: 10,
  healthScore: 98,
  fiveTStatus: [true, true, true, true, true],
});
```

### 共享記憶
```typescript
await OmniHub.shareMemory({
  agentId: 'omni-agent',
  agentName: 'OmniAgent',
  type: 'insight',
  title: '發現',
  content: '...',
  tags: ['esg'],
  visibility: 'public',
});
```

### 任務協調
```typescript
const task = await OmniHub.createTask({
  title: '分析 ESG 數據',
  assignedBy: 'omni-agent',
  assignedTo: 'esg-analyst',
  priority: 'high',
});
await OmniHub.completeTask(task.id, { result: '...' });
```

## 驗證清單

- [ ] 無 dark: 前綴
- [ ] 無 backdrop-blur
- [ ] 無 bg-white/[0.*]
- [ ] 無 border-white/*
- [ ] 無液態玻璃效果
- [ ] RWD 正常
- [ ] pnpm run build 通過

## VPS 部署常用指令

```bash
# 重啟 PM2 服務
ssh root@161.118.248.180 "pm2 restart esggo-core"

# 查看日誌
ssh root@161.118.248.180 "pm2 logs esggo-core --lines 50 --nostream"

# 同步程式碼（從 Windows 本地）
scp -r C:\Project\esggo\<file> root@161.118.248.180:/var/www/esggo/

# Git 操作
ssh root@161.118.248.180 "cd /var/www/esggo && git add . && git commit -m 'msg' && git push"

# Redis 操作
ssh root@161.118.248.180 "redis-cli ping && redis-cli hgetall omni:templates"

# 系統狀態
ssh root@161.118.248.180 "pm2 list && uptime && df -h / && free -h"
```

## 進階功能參考

| 主題 | 參考檔案 |
|------|---------|
| 即時同步/記憶搜尋/任務視覺化 | `references/omni-hub-realtime-search-viz.md` |
| 設計原則合規檢查與批量修復 | `references/design-compliance-patterns.md` |
| OpenRouter rate limit 與 VPS key 傳輸 | `references/openrouter-vps-debugging.md` |
| 零算力範本資源庫 | `references/omnipotent-repository.md` |
| 24 段範本擴展策略 | `references/sustain-write-template-expansion.md` |
| VPS 遠端 Shell 傳輸陷阱 | `references/vps-shell-escaping.md` |
| VPS 部署實戰教訓 | `references/vps-deployment-lessons.md` |
| Delegate Task 超時對策 | `references/delegate-task-timeout.md` |
| 永續報告組裝系統 | `references/sustain-write-report-assembly.md` |
| Git 雙軌刻印與 Object.freeze 防篡改 | `references/omn-repository-engrave.md` |
| UI v2 遷移指南 | `references/ui-v2-migration.md` |
| VPS 重建清理陷阱 | `references/vps-cleanup-traps.md` |
| 核心概念 | `references/esggo-core-concepts.md` |
| 閱讀室 | `references/reading-room.md` |

## Common Pitfalls

1. **patch 工具多次修改同一區域** — 可能產生重複 JSX 行或 closing tag，每次 patch 後用 read_file 確認結果
2. **元件 size 屬性差異** — Button 無 `xs`、FiveTStrip 無 `xs`、StatusDot 無 `success/neutral/info`
3. **@/ alias + TypeScript** — bundler 正常但 tsc 可能報 module-not-found，用 `// @ts-ignore` 抑制
4. **Next.js 16 Turbopack 與 node_modules 型別** — 大量預存型別錯誤，`ignoreBuildErrors: true` 是正確解法
5. **重複 import 問題** — 多次 patch 可能導致同一檔案有多個 lucide-react import，需合併為一個
6. **Python f-string** — 不能包含 backslash，先存變數再使用
7. **Windows bash 路徑** — 用 `/c/Project/esggo` 而非 `C:\\Project\\esggo`
8. **Shell 金鑰截斷** — 用 base64 編碼傳輸 API key，避免 shell 解析
