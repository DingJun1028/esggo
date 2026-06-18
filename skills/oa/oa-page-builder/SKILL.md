---
name: oa-page-builder
description: "Use when the user provides a design guide table (spec table) and asks to create or rebuild a Next.js page. Generates page components following ESGGO design conventions: light theme only, Berkeley Blue #003262 primary, Gold #FDB515 accent, no dark/glass/liquid effects."
version: 1.0.0
author: ESGGO OmniAgent
license: MIT
metadata:
  hermes:
    tags: [page-builder, nextjs, design, esggo, ui]
    related_skills: [oa-design-fix, oa-deploy]
---

# OA Page Builder — ESGGO 頁面建構器

## Overview

根據用戶提供的設計 guide 表格（spec table），自動生成符合 ESGGO 設計規範的 Next.js 頁面元件。所有頁面必須遵循亮色主題規範，不使用深色、毛玻璃、漸層背景等效果。

## When to Use

- 用戶提供 spec table 要求建立新頁面
- 用戶要求重建/修復現有頁面
- 用戶說「建立 <頁面名稱> 頁面」並附上設計規格
- 用戶要求將設計稿轉換為 Next.js 元件

**Don't use for:** 修復顏色問題（用 `oa-design-fix`）、部署（用 `oa-deploy`）

## ESGGO Design Constraints

### 色彩規範

| 用途 | 色值 | Tailwind 等價 |
|------|------|---------------|
| 主色（Primary） | `#003262` | `text-[#003262]` |
| 強調色（Accent） | `#FDB515` | `text-[#FDB515]` |
| 背景（Background） | `#F8FAFC` | `bg-[#F8FAFC]` |
| 卡片背景 | `#FFFFFF` | `bg-white` |
| 邊框 | `#E2E8F0` | `border-slate-100` |
| 主文字 | `#003262` | `text-[#003262]` |
| 次文字 | `#64748B` | `text-slate-500` |
| 輔助文字 | `#94A3B8` | `text-slate-400` |

### 禁止使用的樣式

- ❌ `dark:` 前綴的任何 class
- ❌ `bg-black`, `bg-slate-900`, `bg-gray-900` 等深色背景
- ❌ `text-white`（除非在深色按鈕內）
- ❌ `backdrop-blur-*`（毛玻璃效果）
- ❌ `bg-white/[0.*]`（半透明白色，用於深色主題）
- ❌ `border-white/*`（半透明白色邊框）
- ❌ `shadow-[0_*_rgba(0,0,0,0.*)]`（深色陰影）
- ❌ `bg-gradient-to-*` 深色漸層

### 允許的樣式

- ✅ `bg-white`, `bg-slate-50`, `bg-cyan-50` 等淡色背景
- ✅ `border-slate-100`, `border-slate-200` 等淡色邊框
- ✅ `shadow-sm`, `shadow-md`, `shadow-lg` 等柔和陰影
- ✅ `rounded-xl`, `rounded-2xl` 等圓角
- ✅ `hover:shadow-md`, `hover:border-slate-200` 等互動效果

## Page Structure Template

```tsx
'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  // lucide icons as needed
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { OmniBaseCard } from '@/components/ui/omni/OmniBaseCard';
import { OmniButton } from '@/components/ui/omni/OmniButton';
import { OmniBadge } from '@/components/ui/omni/OmniBadge';

// Data definitions...

// Sub-components...

export default function PageName() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8">
      <div className="max-w-[1200px] mx-auto space-y-6">
        {/* Header */}
        <header className="bg-white rounded-2xl border border-slate-100 p-6">
          <h1 className="text-2xl font-black text-[#003262]">頁面標題</h1>
          <p className="text-xs text-slate-400">副標題</p>
        </header>

        {/* Content sections... */}
      </div>
    </div>
  );
}
```

## Build Workflow

1. **解析 spec table** — 提取頁面標題、區塊、資料、指標等
2. **建立檔案** — `app/<page-name>/page.tsx`
3. **寫入內容** — 按照 ESGGO 設計規範生成頁面
4. **驗證** — 確認沒有使用禁止的深色樣式
5. **Build 測試** — `pnpm run build` 確認編譯成功
6. **Commit & Deploy** — 詢問用戶是否要部署

## Common Pitfalls

1. **使用深色主題樣式。** 每次寫完頁面，檢查所有 `bg-*`、`text-*`、`border-*` 是否符合亮色規範。
2. **忘記 import lucide-react icons。** 每個用到的 icon 都必須在 import 中列出。
3. **使用 `any` type。** 定義明確的 interface，避免 TypeScript 錯誤。
4. **頁面超過 300 行。** 如果太長，拆分成子元件。
5. **忘記 `'use client'`。** 所有互動式頁面都需要這個 directive。

## Verification Checklist

- [ ] 所有背景色都是亮色（`bg-white`, `bg-[#F8FAFC]`, `bg-slate-50` 等）
- [ ] 沒有 `dark:` 前綴 class
- [ ] 沒有 `backdrop-blur-*`
- [ ] 沒有 `bg-white/[0.*]` 或 `border-white/*`
- [ ] 主文字使用 `text-[#003262]`
- [ ] 所有 lucide-react icons 都有 import
- [ ] 頁面有 `'use client'` directive（如果需要互動）
- [ ] `pnpm run build` 編譯成功
