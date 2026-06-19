# Supabase RLS Policy 修復指南

## 問題描述

當系統嘗試向 `sensor_readings` 表插入資料時，出現以下錯誤：

```
error: new row violates row-level security policy
code: 42501 (insufficient_privilege)
```

這是因為 Supabase 的 Row Level Security (RLS) 政策阻擋了插入操作。

---

## 解決方案：在 Supabase 控制台執行 SQL

### 步驟 1：開啟 Supabase 控制台

1. 前往 [Supabase Dashboard](https://supabase.com/dashboard)
2. 選擇您的專案

### 步驟 2：進入 SQL Editor

1. 在左側選單點擊 **SQL Editor** 圖示
2. 點擊 **New Query** 按鈕

![SQL Editor 位置示意](https://supabase.com/docs/_next/image?url=%2Fdocs%2Fimg%2Fsql-editor.png&w=3840&q=75)

### 步驟 3：複製並執行以下 SQL

將以下 SQL 複製到編輯器中，然後點擊 **Run** 按鈕：

```sql
-- ============================================================================
-- 修復 sensor_readings 表的 RLS Policy
-- ============================================================================

-- 1. 確保 RLS 已啟用
ALTER TABLE sensor_readings ENABLE ROW LEVEL SECURITY;

-- 2. 刪除可能衝突的舊政策
DROP POLICY IF EXISTS "sensor_readings_insert_policy" ON sensor_readings;
DROP POLICY IF EXISTS "sensor_readings_select_policy" ON sensor_readings;
DROP POLICY IF EXISTS "sensor_readings_service_role_policy" ON sensor_readings;

-- 3. 創建允許 service_role 插入的政策
-- 這是給後端服務使用的權限
CREATE POLICY "sensor_readings_service_role_policy" ON sensor_readings
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- 4. 創建允許 authenticated 用戶插入的政策
-- 這是給已登入用戶使用的權限
CREATE POLICY "sensor_readings_insert_policy" ON sensor_readings
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- 5. 創建允許 authenticated 用戶查詢的政策
CREATE POLICY "sensor_readings_select_policy" ON sensor_readings
    FOR SELECT
    TO authenticated
    USING (true);

-- 6. 為 anon 用戶添加基本權限（如果需要公開訪問）
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN
        DROP POLICY IF EXISTS "sensor_readings_anon_policy" ON sensor_readings;
        CREATE POLICY "sensor_readings_anon_policy" ON sensor_readings
            FOR SELECT
            TO anon
            USING (true);
    END IF;
END $$;
```

### 步驟 4：驗證政策已正確設置

執行以下查詢來驗證政策：

```sql
-- 查看所有 sensor_readings 表的 RLS 政策
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'sensor_readings';
```

預期結果應該顯示 4 個政策：

| policyname | roles | cmd | 說明 |
|------------|-------|-----|------|
| sensor_readings_service_role_policy | service_role | ALL | 後端服務完整權限 |
| sensor_readings_insert_policy | authenticated | INSERT | 已登入用戶可插入 |
| sensor_readings_select_policy | authenticated | SELECT | 已登入用戶可查詢 |
| sensor_readings_anon_policy | anon | SELECT | 匿名用戶可查詢 |

---

## 替代方案：使用 Supabase CLI

如果您已安裝 Supabase CLI，可以直接執行 migration 文件：

```bash
# 在專案根目錄執行
supabase db push

# 或直接執行特定 migration
supabase db execute --file supabase/migrations/20260220_fix_sensor_readings_rls.sql
```

---

## 安全性說明

### ⚠️ 注意事項

上述 SQL 使用 `USING (true)` 和 `WITH CHECK (true)` 表示**允許所有操作**。

### 生產環境建議

在生產環境中，建議根據實際需求限制權限：

```sql
-- 範例：只允許用戶操作自己的資料
CREATE POLICY "sensor_readings_user_policy" ON sensor_readings
    FOR ALL
    TO authenticated
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());
```

---

## 常見問題

### Q: 為什麼會出現 RLS 錯誤？

A: Supabase 預設啟用 Row Level Security，如果沒有明確的政策允許操作，所有請求都會被拒絕。

### Q: service_role 和 authenticated 有什麼區別？

A: 
- `service_role`: 後端服務使用的角色，擁有完整權限，**繞過 RLS**
- `authenticated`: 已登入用戶的角色，受 RLS 政策限制
- `anon`: 未登入用戶的角色，受 RLS 政策限制

### Q: 如何確認 RLS 是否啟用？

A: 執行以下查詢：

```sql
SELECT 
    tablename,
    rowsecurity
FROM pg_tables
WHERE schemaname = 'public' AND tablename = 'sensor_readings';
```

如果 `rowsecurity` 為 `true`，表示 RLS 已啟用。

---

## 相關文件

- [Supabase RLS 官方文檔](https://supabase.com/docs/guides/auth/row-level-security)
- [PostgreSQL RLS 文檔](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)
