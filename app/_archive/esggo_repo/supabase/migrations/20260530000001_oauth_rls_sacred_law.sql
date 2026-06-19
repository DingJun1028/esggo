-- 20260530000001_oauth_rls_sacred_law.sql
-- 部署 RLS 聖律 (Deploying RLS Sacred Law)
-- 依據 ESGGO 善向永續系統規範，對以下資料表實作 Row Level Security (RLS)：
-- 1. evidence_vault (company_id 隔離)
-- 2. audit_logs (company_id 隔離)
-- 3. sustainwrite_sections (user_id 隔離)

-- 確保 sustainwrite_sections 擁有 user_id
ALTER TABLE public.sustainwrite_sections ADD COLUMN IF NOT EXISTS user_id TEXT DEFAULT 'default';

-- 確保 RLS 被開啟
ALTER TABLE public.evidence_vault ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sustainwrite_sections ENABLE ROW LEVEL SECURITY;

-- 移除舊的 Policies (如果有的話)
DROP POLICY IF EXISTS "evidence_vault_isolation_policy" ON public.evidence_vault;
DROP POLICY IF EXISTS "audit_logs_isolation_policy" ON public.audit_logs;
DROP POLICY IF EXISTS "sustainwrite_sections_isolation_policy" ON public.sustainwrite_sections;
DROP POLICY IF EXISTS "evidence_vault_company_isolation" ON public.evidence_vault;
DROP POLICY IF EXISTS "evidence_vault_company_insert" ON public.evidence_vault;
DROP POLICY IF EXISTS "evidence_vault_company_update" ON public.evidence_vault;
DROP POLICY IF EXISTS "audit_logs_company_isolation" ON public.audit_logs;
DROP POLICY IF EXISTS "audit_logs_company_insert" ON public.audit_logs;
DROP POLICY IF EXISTS "audit_logs_company_update" ON public.audit_logs;
DROP POLICY IF EXISTS "sustainwrite_sections_user_select" ON public.sustainwrite_sections;
DROP POLICY IF EXISTS "sustainwrite_sections_user_insert" ON public.sustainwrite_sections;
DROP POLICY IF EXISTS "sustainwrite_sections_user_update" ON public.sustainwrite_sections;

-- 1. evidence_vault: 根據 JWT 內的 company_id 隔離
CREATE POLICY "evidence_vault_company_isolation"
ON public.evidence_vault
FOR SELECT
TO authenticated
USING (
  company_id = coalesce((auth.jwt() -> 'app_metadata' ->> 'company_id'), 'default')
);

CREATE POLICY "evidence_vault_company_insert"
ON public.evidence_vault
FOR INSERT
TO authenticated
WITH CHECK (
  company_id = coalesce((auth.jwt() -> 'app_metadata' ->> 'company_id'), 'default')
);

CREATE POLICY "evidence_vault_company_update"
ON public.evidence_vault
FOR UPDATE
TO authenticated
USING (
  company_id = coalesce((auth.jwt() -> 'app_metadata' ->> 'company_id'), 'default')
)
WITH CHECK (
  company_id = coalesce((auth.jwt() -> 'app_metadata' ->> 'company_id'), 'default')
);

-- 2. audit_logs: 根據 JWT 內的 company_id 隔離
CREATE POLICY "audit_logs_company_isolation"
ON public.audit_logs
FOR SELECT
TO authenticated
USING (
  company_id = coalesce((auth.jwt() -> 'app_metadata' ->> 'company_id'), 'default')
);

CREATE POLICY "audit_logs_company_insert"
ON public.audit_logs
FOR INSERT
TO authenticated
WITH CHECK (
  company_id = coalesce((auth.jwt() -> 'app_metadata' ->> 'company_id'), 'default')
);

CREATE POLICY "audit_logs_company_update"
ON public.audit_logs
FOR UPDATE
TO authenticated
USING (
  company_id = coalesce((auth.jwt() -> 'app_metadata' ->> 'company_id'), 'default')
)
WITH CHECK (
  company_id = coalesce((auth.jwt() -> 'app_metadata' ->> 'company_id'), 'default')
);
-- 若你不允許 agent 刪除 audit，這行應保留「不建立 DELETE policy」
-- 不建 DELETE policy = DELETE 會被 RLS 擋掉

-- 3. sustainwrite_sections: 根據 user_id 隔離
CREATE POLICY "sustainwrite_sections_user_select"
ON public.sustainwrite_sections
FOR SELECT
TO authenticated
USING (
  user_id = auth.uid()::text
);

CREATE POLICY "sustainwrite_sections_user_insert"
ON public.sustainwrite_sections
FOR INSERT
TO authenticated
WITH CHECK (
  user_id = auth.uid()::text
);

CREATE POLICY "sustainwrite_sections_user_update"
ON public.sustainwrite_sections
FOR UPDATE
TO authenticated
USING (
  user_id = auth.uid()::text
)
WITH CHECK (
  user_id = auth.uid()::text
);
