# OA Skill Index — OmniAgent 技能組索引

## 技能列表

| 技能 | 觸發詞 | 用途 |
|------|--------|------|
| `oa-summon` | OA、召喚、啟動 | 系統啟動、狀態檢查 |
| `oa-page-builder` | 建置、建立頁面、spec | 根據設計規格建立頁面 |
| `oa-5t-enforcer` | 5T、驗證、稽核 | 5T 協議合規驗證 |
| `oa-deploy` | 部署、上線、push | 一鍵部署到 Vercel |
| `oa-design-fix` | 顏色跑掉、看不到、深色 | 修復亮色主題問題 |
| `oa-supabase-query` | 查詢、資料、資料庫 | Supabase 資料查詢 |

## 使用流程

```
用戶輸入 → 匹配技能 → 執行工作流程 → 驗證結果
```

## 技能依賴關係

```
oa-summon (入口)
    ├── oa-page-builder → oa-deploy
    ├── oa-design-fix → oa-deploy
    ├── oa-5t-enforcer → oa-supabase-query
    └── oa-deploy (獨立)
```
