---
name: oa-5t-enforcer
description: "Use when verifying data compliance with the 5T Integrity Protocol (真善美信通). Checks all five dimensions: Truth (可感知), Goodness (可溯源), Beauty (可追蹤), Trust (不可篡改), Transferful (可透明驗算). Load when user mentions 5T verification, data integrity, or audit checks."
version: 1.0.0
author: ESGGO OmniAgent
license: MIT
metadata:
  hermes:
    tags: [5t, protocol, verification, integrity, audit, esggo]
    related_skills: [oa-summon, oa-supabase-query]
---

# OA 5T Enforcer — 5T 協議驗證

## Overview

5T 誠信協議是 ESGGO 的核心資料治理框架。此技能驗證資料是否符合 5T 協議的五個維度，確保資料從產生到報告的完整信任鏈。

## 5T Protocol Definition

| 編號 | 中文 | 英文 | 定義 | 驗證方式 |
|------|------|------|------|----------|
| T1 | 真 | Truth | 可感知/具體化 | 資料有明確的數值、單位、時間戳 |
| T2 | 善 | Goodness | 可溯源 | 資料有來源標記（source_origin） |
| T3 | 美 | Beauty | 可追蹤 | 資料有稽核軌跡（audit trail） |
| T4 | 信 | Trust | 不可篡改 | 資料有 hash_lock 或數位簽章 |
| T5 | 通 | Transferful | 可透明驗算 | 資料可通過第三方驗證 |

**注意：** 舊版英文命名（Tangible/Traceable/Trackable/Transparent/Trustworthy）已棄用。

## When to Use

- 用戶要求「5T 驗證」、「資料完整性檢查」
- 用戶要求檢查特定資料集是否符合 5T 協議
- 在建立新資料表或 API 時驗證 5T 合規性
- 稽核報告產生前驗證資料品質

**Don't use for:** 頁面建置（用 `oa-page-builder`）、設計修復（用 `oa-design-fix`）

## Verification Workflow

### 1. 資料取樣

```bash
# 從 Supabase 查詢資料
curl -s "https://<project>.supabase.co/rest/v1/<table>?limit=5" \
  -H "apikey: <anon_key>" \
  -H "Content-Type: application/json"
```

### 2. 五維檢查

對每筆資料記錄檢查：

```
T1 Truth (真): 數值是否完整？
  ✅ metric_value 不為 null
  ✅ unit 欄位存在
  ✅ date/timestamp 存在

T2 Goodness (善): 來源是否可追溯？
  ✅ source_origin 欄位存在且不為空
  ✅ 來源類型為已知值（Auto-Agent / Manual / System）

T3 Beauty (美): 稽核軌跡是否存在？
  ✅ 有建立時間（created_at）
  ✅ 有更新時間（updated_at）
  ✅ 有操作記錄（如適用）

T4 Trust (信): 是否不可篡改？
  ✅ hash_lock 欄位存在
  ✅ hash 格式正確（0x...）
  ✅ 或已有數位簽章

T5 Transferful (通): 是否可透明驗算？
  ✅ 資料可通過 API 查詢
  ✅ 有對應的驗證端點
  ✅ 第三方可以獨立驗證
```

### 3. 驗證報告格式

```
🔐 5T 協議驗證報告
━━━━━━━━━━━━━━━━━━━━━━━━━━
資料表: <table>
取樣數: <N> 筆

T1 Truth (真):     ✅ X/Y 通過
T2 Goodness (善):  ✅ X/Y 通過
T3 Beauty (美):    ✅ X/Y 通過
T4 Trust (信):     ⚠️ X/Y 通過 (Y-X 筆缺少 hash_lock)
T5 Transferful (通): ✅ X/Y 通過

整體合規率: XX%
━━━━━━━━━━━━━━━━━━━━━━━━━━
建議: <改善建議>
```

## 5T Status 編碼

在 UI 中顯示 5T 狀態時，使用以下格式：

```typescript
type FiveTStatus = [boolean, boolean, boolean, boolean, boolean];
// [T1, T2, T3, T4, T5]

// 顯示元件
<Protocol5TStrip status={[true, true, true, true, true]} showLabels />
```

## Common Pitfalls

1. **使用舊版 5T 英文命名。** 正確是 Truth/Goodness/Beauty/Trust/Transferful，不是 Tangible/Traceable/Trackable/Transparent/Trustworthy。
2. **忘記檢查 null 值。** 缺少欄位和欄位為 null 都算不合規。
3. **只檢查部分維度。** 必須檢查全部 5 個維度。
4. **驗證後不提供改善建議。** 每次驗證都應該給出可操作的改善方案。

## Verification Checklist

- [ ] 已檢查 T1 Truth（數值完整性）
- [ ] 已檢查 T2 Goodness（來源可追溯）
- [ ] 已檢查 T3 Beauty（稽核軌跡）
- [ ] 已檢查 T4 Trust（不可篡改）
- [ ] 已檢查 T5 Transferful（可透明驗算）
- [ ] 使用正確的 5T 英文命名
- [ ] 已產生驗證報告
- [ ] 已提供改善建議（如有不合規項目）
