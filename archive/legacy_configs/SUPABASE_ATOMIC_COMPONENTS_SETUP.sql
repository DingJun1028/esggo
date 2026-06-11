-- 萬能元件庫 (Atomic Component Library) 物理層 (Supabase) 建立腳本
-- 實作 5T 協議：Traceable (可追溯) 與 Trustworthy (防護)

-- 1. 建立原子元件登錄資料表 (omni_atomic_components)
CREATE TABLE IF NOT EXISTS public.omni_atomic_components (
    atom_id TEXT PRIMARY KEY,
    type TEXT NOT NULL,
    version TEXT NOT NULL,
    status TEXT NOT NULL,
    specification TEXT,
    intent TEXT,
    governance_node TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. 設定 Row Level Security (RLS)
ALTER TABLE public.omni_atomic_components ENABLE ROW LEVEL SECURITY;

-- 允許 Service Role 無條件存取
CREATE POLICY "Service Role can full access omni_atomic_components" ON public.omni_atomic_components
    USING (auth.jwt() ->> 'role' = 'service_role');

-- 允許已認證使用者讀取
CREATE POLICY "Authenticated users can read omni_atomic_components" ON public.omni_atomic_components
    FOR SELECT USING (auth.role() = 'authenticated');

-- 3. 觸發器：更新 updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_omni_atomic_components_updated_at
    BEFORE UPDATE ON public.omni_atomic_components
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
