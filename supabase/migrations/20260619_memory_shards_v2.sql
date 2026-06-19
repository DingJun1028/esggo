-- ============================================================
-- ESGGO 記憶碎片完整體系 v2.0
-- OmniMemory Shards & Skill Ultimates
-- ============================================================

-- 1. 記憶碎片資料表
CREATE TABLE IF NOT EXISTS public.omni_memory_shards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    tags TEXT[] NOT NULL DEFAULT '{}',
    extracted_code_snippets TEXT[] NOT NULL DEFAULT '{}',
    entropy_level INTEGER CHECK (entropy_level >= 0 AND entropy_level <= 100),
    source_type TEXT NOT NULL DEFAULT 'conversation' CHECK (source_type IN ('conversation', 'error_log', 'code_review', 'web_crawl', 'manual', 'auto_extract')),
    source_id TEXT,
    importance_score NUMERIC(3,2) DEFAULT 0.5 CHECK (importance_score >= 0 AND importance_score <= 1),
    usage_count INTEGER NOT NULL DEFAULT 0,
    last_used_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'::jsonb
);

-- 2. 技能奧義資料表
CREATE TABLE IF NOT EXISTS public.omni_skill_ultimates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    skill_name TEXT NOT NULL,
    mastery_level TEXT NOT NULL DEFAULT 'Novice' CHECK (mastery_level IN ('Novice', 'Adept', 'Expert', 'Master')),
    core_principles TEXT[] NOT NULL DEFAULT '{}',
    synthesis TEXT NOT NULL DEFAULT '',
    source_shards UUID[] NOT NULL DEFAULT '{}',
    void_dimension TEXT CHECK (void_dimension IN ('Structural Void', 'Logical Void', 'Stateful Void', 'Unified')),
    application_count INTEGER NOT NULL DEFAULT 0,
    success_rate NUMERIC(3,2) DEFAULT 0.5 CHECK (success_rate >= 0 AND success_rate <= 1),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'::jsonb
);

-- 3. 碎片關聯表（多對多）
CREATE TABLE IF NOT EXISTS public.omni_shard_relations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_shard_id UUID NOT NULL REFERENCES public.omni_memory_shards(id) ON DELETE CASCADE,
    target_shard_id UUID NOT NULL REFERENCES public.omni_memory_shards(id) ON DELETE CASCADE,
    relation_type TEXT NOT NULL DEFAULT 'related' CHECK (relation_type IN ('related', 'depends_on', 'conflicts_with', 'extends', 'replaces')),
    strength NUMERIC(3,2) DEFAULT 0.5 CHECK (strength >= 0 AND strength <= 1),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(source_shard_id, target_shard_id, relation_type)
);

-- 4. 碎片使用記錄表
CREATE TABLE IF NOT EXISTS public.omni_shard_usage_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    shard_id UUID NOT NULL REFERENCES public.omni_memory_shards(id) ON DELETE CASCADE,
    action TEXT NOT NULL CHECK (action IN ('viewed', 'applied', 'referenced', 'synthesized', 'archived')),
    context TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. 索引
CREATE INDEX IF NOT EXISTS idx_shards_tags ON public.omni_memory_shards USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_shards_source_type ON public.omni_memory_shards(source_type);
CREATE INDEX IF NOT EXISTS idx_shards_importance ON public.omni_memory_shards(importance_score DESC);
CREATE INDEX IF NOT EXISTS idx_shards_created ON public.omni_memory_shards(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ultimates_mastery ON public.omni_skill_ultimates(mastery_level);
CREATE INDEX IF NOT EXISTS idx_ultimates_name ON public.omni_skill_ultimates(skill_name);
CREATE INDEX IF NOT EXISTS idx_relations_source ON public.omni_shard_relations(source_shard_id);
CREATE INDEX IF NOT EXISTS idx_relations_target ON public.omni_shard_relations(target_shard_id);
CREATE INDEX IF NOT EXISTS idx_usage_shard ON public.omni_shard_usage_log(shard_id);
CREATE INDEX IF NOT EXISTS idx_usage_action ON public.omni_shard_usage_log(action);

-- 6. RLS 政策
ALTER TABLE public.omni_memory_shards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.omni_skill_ultimates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.omni_shard_relations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.omni_shard_usage_log ENABLE ROW LEVEL SECURITY;

-- 允許 service_role 完全存取
CREATE POLICY "Service role full access on shards" ON public.omni_memory_shards FOR ALL USING (true);
CREATE POLICY "Service role full access on ultimates" ON public.omni_skill_ultimates FOR ALL USING (true);
CREATE POLICY "Service role full access on relations" ON public.omni_shard_relations FOR ALL USING (true);
CREATE POLICY "Service role full access on usage log" ON public.omni_shard_usage_log FOR ALL USING (true);

-- 7. 自動更新 updated_at 觸發器
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_shards_updated_at ON public.omni_memory_shards;
CREATE TRIGGER update_shards_updated_at
    BEFORE UPDATE ON public.omni_memory_shards
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_ultimates_updated_at ON public.omni_skill_ultimates;
CREATE TRIGGER update_ultimates_updated_at
    BEFORE UPDATE ON public.omni_skill_ultimates
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 8. 碎片使用計數自動更新
CREATE OR REPLACE FUNCTION public.increment_shard_usage()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.omni_memory_shards
    SET usage_count = usage_count + 1, last_used_at = NOW()
    WHERE id = NEW.shard_id;
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS trigger_increment_shard_usage ON public.omni_shard_usage_log;
CREATE TRIGGER trigger_increment_shard_usage
    AFTER INSERT ON public.omni_shard_usage_log
    FOR EACH ROW EXECUTE FUNCTION public.increment_shard_usage();

-- 9. 視圖：碎片統計
CREATE OR REPLACE VIEW public.v_shard_stats AS
SELECT
    source_type,
    COUNT(*) as total_shards,
    AVG(entropy_level) as avg_entropy,
    AVG(importance_score) as avg_importance,
    SUM(usage_count) as total_usage,
    MAX(created_at) as latest_shard
FROM public.omni_memory_shards
GROUP BY source_type;

-- 10. 視圖：奧義統計
CREATE OR REPLACE VIEW public.v_ultimate_stats AS
SELECT
    mastery_level,
    COUNT(*) as total_ultimates,
    AVG(success_rate) as avg_success_rate,
    SUM(application_count) as total_applications,
    MAX(created_at) as latest_ultimate
FROM public.omni_skill_ultimates
GROUP BY mastery_level;
