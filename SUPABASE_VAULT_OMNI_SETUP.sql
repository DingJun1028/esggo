-- 建立 Vault Omni (單一真實來源表)
CREATE TABLE public.vault_omni (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    module_name TEXT NOT NULL,         -- e.g., 'cbam-calculator', 'report-builder'
    payload JSONB NOT NULL,            -- 加密的原始資料與表單內容
    hash_lock TEXT NOT NULL,           -- SHA-256 密碼學封印
    created_by UUID REFERENCES auth.users(id),
    CONSTRAINT vault_omni_immutable CHECK (true) -- 系統級約束，未來可搭配 Trigger 防止修改
);

-- 啟用 RLS (Row Level Security)
ALTER TABLE public.vault_omni ENABLE ROW LEVEL SECURITY;

-- 策略 1：只有資料擁有者可讀取自己的機密資料
CREATE POLICY "Users can read own vault data" ON public.vault_omni
    FOR SELECT USING (auth.uid() = created_by);

-- 策略 2：資料僅能被寫入，嚴禁任何直接 Update 或 Delete 破壞審計軌跡
CREATE POLICY "Insert only, no updates" ON public.vault_omni
    FOR INSERT WITH CHECK (auth.uid() = created_by);

-- 建立 5T 審計日誌 (Audit Logs)
CREATE TABLE public.audit_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    user_id UUID REFERENCES auth.users(id),
    action TEXT NOT NULL,
    target_id UUID,
    ip_address TEXT,
    CONSTRAINT audit_logs_immutable CHECK (true)
);

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own audit logs" ON public.audit_logs
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Insert only audit logs" ON public.audit_logs
    FOR INSERT WITH CHECK (auth.uid() = user_id);
