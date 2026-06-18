# 5T Verification Checklist

## Per-Record Check

```
Record ID: __________
Table: __________
Date: __________
```

### T1 Truth (真) — 可感知/具體化

- [ ] `metric_value` 存在且不为 null
- [ ] `unit` 欄位存在且有效
- [ ] `date` 或 `timestamp` 存在
- [ ] 數值範圍合理（非負數、非極大值）
- [ ] 單位與數值類型匹配

**Status:** ⬜ Pass ⬜ Fail ⬜ N/A

### T2 Goodness (善) — 可溯源

- [ ] `source_origin` 欄位存在
- [ ] 来源类型為已知值：`Auto-Agent` / `Manual` / `System` / `API`
- [ ] 來源時間戳存在
- [ ] 来源可追溯到具体系统或人员

**Status:** ⬜ Pass ⬜ Fail ⬜ N/A

### T3 Beauty (美) — 可追蹤

- [ ] `created_at` 欄位存在
- [ ] `updated_at` 欄位存在
- [ ] 操作記錄存在（如適用）
- [ ] 變更歷史可追溯
- [ ] 資料版本號存在（如適用）

**Status:** ⬜ Pass ⬜ Fail ⬜ N/A

### T4 Trust (信) — 不可篡改

- [ ] `hash_lock` 欄位存在
- [ ] hash 格式正確（`0x` 開頭）
- [ ] hash 長度符合預期
- [ ] 數位簽章存在（如適用）
- [ ] 可通过 API 驗證 hash

**Status:** ⬜ Pass ⬜ Fail ⬜ N/A

### T5 Transferful (通) — 可透明驗算

- [ ] 資料可通過 REST API 查詢
- [ ] 有對應的驗證端點
- [ ] 第三方可以獨立驗證
- [ ] 驗證結果可重現
- [ ] 無黑箱操作

**Status:** ⬜ Pass ⬜ Fail ⬜ N/A

## Summary

| 維度 | 狀態 | 備註 |
|------|------|------|
| T1 Truth | ⬜ | |
| T2 Goodness | ⬜ | |
| T3 Beauty | ⬜ | |
| T4 Trust | ⬜ | |
| T5 Transferful | ⬜ | |

**Overall:** ⬜ Compliant ⬜ Partial ⬜ Non-compliant

## 自動查詢語法

```bash
# T1: 檢查數值完整性
curl -s "<supabase_url>/rest/v1/<table>?metric_value=is.null&limit=5" \
  -H "apikey: <key>"

# T2: 檢查來源覆蓋率
curl -s "<supabase_url>/rest/v1/<table>?source_origin=is.null&select=count" \
  -H "apikey: <key>" \
  -H "Accept: application/vnd.pgrst.object+json"

# T4: 檢查 hash_lock 覆蓋率
curl -s "<supabase_url>/rest/v1/<table>?hash_lock=is.null&select=count" \
  -H "apikey: <key>" \
  -H "Accept: application/vnd.pgrst.object+json"
```
