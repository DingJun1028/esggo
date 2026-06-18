---
name: oa-design-fix
description: "Use when the user reports color issues, dark theme appearing, broken styles, or visual bugs. Diagnoses and fixes light theme violations across the ESGGO project. Checks for dark backgrounds, glass/blur effects, wrong text colors, and ensures Berkeley Blue #003262 + Gold #FDB515 compliance."
version: 1.0.0
author: ESGGO OmniAgent
license: MIT
metadata:
  hermes:
    tags: [design, fix, light-theme, color, ui, debug]
    related_skills: [oa-page-builder, oa-deploy]
---

# OA Design Fix — 設計修復

## Overview

ESGGO 專案只使用亮色主題。當用戶回報「顏色跑掉」、「背景變黑」、「看不到文字」等問題時，此技能自動偵測並修復違反亮色主題規範的樣式。

## Problem Symptoms & Root Causes

| 症狀 | 可能原因 | 修復方向 |
|------|----------|----------|
| 數值黑色背景上看不到字 | `bg-white/[0.03]` 深色半透明背景 | 改為 `bg-white` |
| 整个區域變黑色 | `bg-slate-900` 或 `dark:` class | 移除，改用 `bg-white` |
| 文字看不到 | `text-white` 在亮色背景上 | 改為 `text-[#003262]` |
| 毛玻璃效果 | `backdrop-blur-*` | 移除 |
| 元件有光暈/漸層 | `bg-gradient-to-*` 深色漸層 | 移除或改用淡色 |

## When to Use

- 用戶說「顏色跑掉」、「背景變黑」、「看不到」
- 用戶截圖回報視覺問題
- 用戶說「還是深色主題」
- 任何 UI 視覺異常

**Don't use for:** 建立新頁面（用 `oa-page-builder`）、部署（用 `oa-deploy`）

## Diagnostic Workflow

### 1. 定位問題區域

根據用戶描述，找出對應的頁面/元件檔案：
- 首頁 KPI 卡片 → `components/omni/OmniKpiCard.tsx`
- 首頁 → `app/page.tsx`
- 其他頁面 → `app/<page>/page.tsx`

### 2. 搜尋違規樣式

在問題檔案中搜尋以下 pattern：

```bash
# 深色背景
grep -n "bg-white/\[0\." <file>
grep -n "bg-slate-9" <file>
grep -n "bg-gray-9" <file>
grep -n "bg-black" <file>

# 深色文字在亮色背景
grep -n "text-white" <file>

# 毛玻璃
grep -n "backdrop-blur" <file>

# 半透明邊框
grep -n "border-white/" <file>

# 深色陰影
grep -n "shadow-\[0_.*rgba(0,0,0" <file>

# dark: 前綴
grep -n "dark:" <file>
```

### 3. 修復對照表

| 違規樣式 | 修復為 |
|----------|--------|
| `bg-white/[0.03]` | `bg-white` |
| `bg-white/[0.05]` | `bg-white` |
| `bg-slate-900` | `bg-white` 或 `bg-slate-50` |
| `bg-gray-900` | `bg-white` |
| `bg-black` | `bg-white` |
| `text-white` | `text-[#003262]` |
| `text-slate-300` | `text-slate-500` |
| `text-slate-400` | `text-slate-500` 或 `text-slate-600` |
| `border-white/10` | `border-slate-100` |
| `border-white/20` | `border-slate-200` |
| `border-cyan-500/20` | `border-cyan-100` |
| `backdrop-blur-2xl` | 移除 |
| `backdrop-blur-xl` | 移除 |
| `backdrop-blur-md` | 移除 |
| `shadow-[0_8px_32px_rgba(0,0,0,0.3)]` | `shadow-sm` 或 `shadow-md` |
| `bg-gradient-to-b from-white/5` | 移除 |
| `bg-cyan-500/20` | `bg-cyan-50` |
| `bg-cyan-500/30` | `bg-cyan-100` |
| `text-cyan-400` | `text-cyan-600` |
| `text-emerald-400` | `text-emerald-600` |
| `text-rose-400` | `text-rose-500` |
| `bg-slate-800/50` | `bg-slate-50` |
| `border-slate-800/50` | `border-slate-100` |
| `border-slate-700/30` | `border-slate-100` |

### 4. 驗證修復

```bash
# 本地 build 確認
pnpm run build

# 確認沒有殘餘深色樣式
grep -rn "bg-white/\[0\." app/ components/ --include="*.tsx"
grep -rn "backdrop-blur" app/ components/ --include="*.tsx"
grep -rn "dark:" app/ components/ --include="*.tsx"
```

## Common Component Fixes

### OmniKpiCard
**檔案：** `components/omni/OmniKpiCard.tsx`
**常見問題：** 深色背景、白色文字、毛玻璃效果
**修復重點：** 背景改 `bg-white`、文字改 `text-[#003262]`、移除 backdrop-blur

### Page Headers
**檔案：** 各 `app/<page>/page.tsx`
**常見問題：** `breathing-glow-*` 元件使用深色 glow
**修復重點：** 確認 glow 顏色為淡色（如 `bg-cyan-50`、`bg-amber-50`）

### Protocol5TStrip
**檔案：** `components/omni/Protocol5TStrip.tsx`
**常見：** 通常無問題，但檢查是否有深色變體

## Common Pitfalls

1. **只修復部分元件。** 問題可能分散在多個檔案，需要全面搜尋。
2. **修復後不驗證。** 每次修復後必須 `pnpm run build` 確認編譯成功。
3. **忽略 `dark:` 前綴。** 即使目前沒開深色模式，`dark:` class 也是禁止的。
4. **修復後不部署。** 修復完成後詢問用戶是否需要部署。

## Verification Checklist

- [ ] 已搜尋所有 `bg-white/[0.*]` 並修復
- [ ] 已搜尋所有 `backdrop-blur-*` 並移除
- [ ] 已搜尋所有 `dark:` 並移除
- [ ] 已搜尋所有 `text-white` 並改為 `text-[#003262]`
- [ ] 已搜尋所有 `border-white/*` 並修復
- [ ] 已搜尋所有深色陰影並修復
- [ ] `pnpm run build` 編譯成功
- [ ] 已詢問用戶是否部署
