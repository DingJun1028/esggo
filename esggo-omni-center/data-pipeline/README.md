# BigQuery Data Pipeline Configuration

## Pipeline Structure
```
data-pipeline/
├── raw/           # 原始資料來源
├── staging/       # 臨時處理資料
├── processed/     # 最終處理後資料
└── validation/    # 資料品質驗證
```

## MECE 驗證規則
1. **Type Safety**: 所有 SQL 使用明確的資料型別
2. **Naming Convention**: 資料表名稱使用 snake_case
3. **Data Quality**: 包含 created_at, updated_at, source_system
4. **Transformation**: 所有 SQL 必須包含 .validate() 函數
5. **UI/UX**: 設計 tokens 必須包含 color-primary, spacing-grid, fontFamily