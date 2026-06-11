-- 20260601000000_audit_eternal_immutability.sql
-- 部署 RLS 聖律 (Deploying Immutability Sacred Law for AuditRecord and EternalMemory)
-- 依據 ESGGO 善向永續系統規範 (5T 協議：不可篡改)，對以下資料表實作 Row Level Security (RLS)：
-- 1. "AuditRecord"
-- 2. "EternalMemory"

-- 確保 RLS 被開啟
ALTER TABLE public."AuditRecord" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."EternalMemory" ENABLE ROW LEVEL SECURITY;

-- 移除舊的 Policies (如果有的話)
DROP POLICY IF EXISTS "audit_record_insert" ON public."AuditRecord";
DROP POLICY IF EXISTS "audit_record_select" ON public."AuditRecord";
DROP POLICY IF EXISTS "audit_record_update" ON public."AuditRecord";
DROP POLICY IF EXISTS "audit_record_delete" ON public."AuditRecord";

DROP POLICY IF EXISTS "eternal_memory_insert" ON public."EternalMemory";
DROP POLICY IF EXISTS "eternal_memory_select" ON public."EternalMemory";
DROP POLICY IF EXISTS "eternal_memory_update" ON public."EternalMemory";
DROP POLICY IF EXISTS "eternal_memory_delete" ON public."EternalMemory";

-- 1. "AuditRecord": 允許讀取與新增，絕對禁止修改與刪除
CREATE POLICY "audit_record_select"
ON public."AuditRecord"
FOR SELECT
TO authenticated
USING (true); -- 視需求可改為僅限同 company_id

CREATE POLICY "audit_record_insert"
ON public."AuditRecord"
FOR INSERT
TO authenticated
WITH CHECK (true);

-- 2. "EternalMemory": 允許讀取與新增，絕對禁止修改與刪除
CREATE POLICY "eternal_memory_select"
ON public."EternalMemory"
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "eternal_memory_insert"
ON public."EternalMemory"
FOR INSERT
TO authenticated
WITH CHECK (true);

-- 注意：由於我們沒有為 UPDATE 和 DELETE 建立 Policy，
-- 在開啟 RLS 的情況下，這些操作將預設被阻擋 (Denied by default)，
-- 這徹底確保了哈希鎖定與絕對不可篡改性。
