-- 記憶碎片與技能奧義的物理層 (Supabase) 建立腳本
-- 實作 5T 協議：Trustworthy (資料庫不可篡改與防護)

-- 1. 建立記憶碎片資料表 (omni_memory_shards)
CREATE TABLE IF NOT EXISTS public.omni_memory_shards (
    id UUID PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    tags JSONB NOT NULL DEFAULT '[]'::jsonb,
    extracted_code_snippets JSONB DEFAULT '[]'::jsonb,
    timestamp BIGINT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. 建立技能奧義資料表 (omni_skill_ultimates)
CREATE TABLE IF NOT EXISTS public.omni_skill_ultimates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    skill_name TEXT NOT NULL,
    mastery_level TEXT NOT NULL,
    core_principles JSONB NOT NULL DEFAULT '[]'::jsonb,
    synthesis TEXT NOT NULL,
    source_shards JSONB NOT NULL DEFAULT '[]'::jsonb,
    timestamp BIGINT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. 設定 Row Level Security (RLS)
ALTER TABLE public.omni_memory_shards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.omni_skill_ultimates ENABLE ROW LEVEL SECURITY;

-- 允許 Service Role 無條件存取
CREATE POLICY "Service Role can full access omni_memory_shards" ON public.omni_memory_shards
    USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "Service Role can full access omni_skill_ultimates" ON public.omni_skill_ultimates
    USING (auth.jwt() ->> 'role' = 'service_role');

-- 允許已認證使用者讀取
CREATE POLICY "Authenticated users can read omni_memory_shards" ON public.omni_memory_shards
    FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can read omni_skill_ultimates" ON public.omni_skill_ultimates
    FOR SELECT USING (auth.role() = 'authenticated');
