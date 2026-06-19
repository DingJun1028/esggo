-- =====================================================
-- Phase 7.1: Users 表遷移腳本
-- =====================================================
-- 用途：將 User Model 從 Mongoose 遷移到 Supabase
-- 日期：2026-02-04
-- 作者：ESG Sunshine JunAiKey Team
-- =====================================================

-- 1. 創建 users 表
CREATE TABLE IF NOT EXISTS public.users (
  id BIGSERIAL PRIMARY KEY,
  uuid UUID UNIQUE NOT NULL DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'Agent',
  avatar_url TEXT DEFAULT '',
  impact_score INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. 創建索引
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_uuid ON public.users(uuid);
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);
CREATE INDEX IF NOT EXISTS idx_users_impact_score ON public.users(impact_score DESC);

-- 3. 創建 updated_at 觸發器
CREATE OR REPLACE FUNCTION update_users_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION update_users_updated_at();

-- 4. 啟用 Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- 5. RLS 策略：用戶只能查看和更新自己的資料
CREATE POLICY "Users can view own data"
  ON public.users
  FOR SELECT
  USING (auth.uid()::text = uuid::text);

CREATE POLICY "Users can update own data"
  ON public.users
  FOR UPDATE
  USING (auth.uid()::text = uuid::text);

-- 6. RLS 策略：Service Role 可以執行所有操作
CREATE POLICY "Service role has full access"
  ON public.users
  FOR ALL
  USING (auth.role() = 'service_role');

-- 7. 註解
COMMENT ON TABLE public.users IS '用戶資料表 - 從 Mongoose User Model 遷移';
COMMENT ON COLUMN public.users.uuid IS '用戶唯一識別碼（對應前端 auth.uid）';
COMMENT ON COLUMN public.users.email IS '用戶電子郵件（唯一）';
COMMENT ON COLUMN public.users.password_hash IS '密碼雜湊值（bcrypt）';
COMMENT ON COLUMN public.users.name IS '用戶顯示名稱';
COMMENT ON COLUMN public.users.role IS '用戶角色（CSO, Architect, Auditor, Agent）';
COMMENT ON COLUMN public.users.avatar_url IS '用戶頭像 URL';
COMMENT ON COLUMN public.users.impact_score IS '影響力分數（遊戲化指標）';

-- 8. 驗證資料
SELECT 
  'users' AS table_name,
  COUNT(*) AS row_count
FROM public.users;

-- 9. 顯示觸發器
SELECT 
  trigger_name,
  event_manipulation,
  event_object_table
FROM information_schema.triggers
WHERE event_object_table = 'users'
  AND trigger_schema = 'public';

-- 10. 顯示 RLS 策略
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies
WHERE tablename = 'users';
