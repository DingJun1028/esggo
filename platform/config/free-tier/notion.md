# Notion Free — esggo 接線說明

| 資源 | 免費額度 | 用於 esggo | 備註 |
|---|---|---|---|
| workspace | 免費 | 5T 合規資產同步 | 單一 workspace |
| block | 有限 | 合規摘要/報告 | 注意 block  quota |

Env/金鑰：
- `NOTION_TOKEN`
- `NOTION_DATABASE_ID`
- `NOTION_VERSION` = 2022-06-28

接線：
- `apps/gateway` 內 `notion-sync-service.ts`
