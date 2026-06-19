-- ============================================================================
-- 修復 sensor_readings 表的 RLS Policy
-- Fix RLS Policy for sensor_readings table
-- ============================================================================
-- 
-- 問題: RLS Policy 阻擋了 sensor_readings 表的插入操作
-- 錯誤代碼: 42501 (insufficient_privilege)
--
-- 解決方案: 為 service_role 和 authenticated 用戶添加插入權限
-- ============================================================================

-- 1. 確保 RLS 已啟用
ALTER TABLE sensor_readings ENABLE ROW LEVEL SECURITY;

-- 2. 刪除可能衝突的舊政策
DROP POLICY IF EXISTS "sensor_readings_insert_policy" ON sensor_readings;
DROP POLICY IF EXISTS "sensor_readings_select_policy" ON sensor_readings;
DROP POLICY IF EXISTS "sensor_readings_service_role_policy" ON sensor_readings;

-- 3. 創建允許 service_role 插入的政策
CREATE POLICY "sensor_readings_service_role_policy" ON sensor_readings
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- 4. 創建允許 authenticated 用戶插入的政策
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
-- 注意: 生產環境應該謹慎使用
DO $$
BEGIN
    -- 檢查 anon 角色是否存在
    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN
        -- 創建 anon 政策
        DROP POLICY IF EXISTS "sensor_readings_anon_policy" ON sensor_readings;
        CREATE POLICY "sensor_readings_anon_policy" ON sensor_readings
            FOR SELECT
            TO anon
            USING (true);
    END IF;
END $$;

-- ============================================================================
-- 驗證政策已正確設置
-- ============================================================================
-- 執行後可以通過以下查詢驗證:
-- SELECT * FROM pg_policies WHERE tablename = 'sensor_readings';
-- ============================================================================
