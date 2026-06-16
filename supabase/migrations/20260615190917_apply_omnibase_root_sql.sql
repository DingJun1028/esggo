CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS public.vault_omni (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    module_name TEXT NOT NULL,
    payload JSONB NOT NULL,
    hash_lock TEXT NOT NULL,
    created_by UUID REFERENCES auth.users(id)
);

ALTER TABLE public.vault_omni
    ADD COLUMN IF NOT EXISTS id UUID DEFAULT gen_random_uuid(),
    ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    ADD COLUMN IF NOT EXISTS module_name TEXT,
    ADD COLUMN IF NOT EXISTS payload JSONB,
    ADD COLUMN IF NOT EXISTS hash_lock TEXT,
    ADD COLUMN IF NOT EXISTS created_by UUID;

ALTER TABLE public.vault_omni ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own vault data" ON public.vault_omni;
DROP POLICY IF EXISTS "Insert only, no updates" ON public.vault_omni;

CREATE POLICY "Users can read own vault data" ON public.vault_omni
    FOR SELECT
    TO authenticated
    USING (auth.uid() = created_by);

CREATE POLICY "Insert only, no updates" ON public.vault_omni
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = created_by);

CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    user_id UUID REFERENCES auth.users(id),
    action TEXT NOT NULL,
    target_id UUID,
    ip_address TEXT,
    company_id TEXT,
    performed_by TEXT,
    target_resource TEXT,
    resource TEXT,
    details JSONB,
    hash_lock TEXT,
    txn_id TEXT,
    module TEXT,
    actor TEXT,
    data_hash TEXT,
    status TEXT,
    t5_tag TEXT
);

ALTER TABLE public.audit_logs
    ADD COLUMN IF NOT EXISTS id UUID DEFAULT gen_random_uuid(),
    ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW(),
    ADD COLUMN IF NOT EXISTS user_id UUID,
    ADD COLUMN IF NOT EXISTS action TEXT,
    ADD COLUMN IF NOT EXISTS target_id UUID,
    ADD COLUMN IF NOT EXISTS ip_address TEXT,
    ADD COLUMN IF NOT EXISTS company_id TEXT,
    ADD COLUMN IF NOT EXISTS performed_by TEXT,
    ADD COLUMN IF NOT EXISTS target_resource TEXT,
    ADD COLUMN IF NOT EXISTS resource TEXT,
    ADD COLUMN IF NOT EXISTS details JSONB,
    ADD COLUMN IF NOT EXISTS hash_lock TEXT,
    ADD COLUMN IF NOT EXISTS txn_id TEXT,
    ADD COLUMN IF NOT EXISTS module TEXT,
    ADD COLUMN IF NOT EXISTS actor TEXT,
    ADD COLUMN IF NOT EXISTS data_hash TEXT,
    ADD COLUMN IF NOT EXISTS status TEXT,
    ADD COLUMN IF NOT EXISTS t5_tag TEXT;

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.omni_memory_shards (
    id UUID PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    tags JSONB NOT NULL DEFAULT '[]'::jsonb,
    extracted_code_snippets JSONB DEFAULT '[]'::jsonb,
    timestamp BIGINT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.omni_memory_shards
    ADD COLUMN IF NOT EXISTS id UUID,
    ADD COLUMN IF NOT EXISTS title TEXT,
    ADD COLUMN IF NOT EXISTS description TEXT,
    ADD COLUMN IF NOT EXISTS tags JSONB DEFAULT '[]'::jsonb,
    ADD COLUMN IF NOT EXISTS extracted_code_snippets JSONB DEFAULT '[]'::jsonb,
    ADD COLUMN IF NOT EXISTS timestamp BIGINT,
    ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now());

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

ALTER TABLE public.omni_skill_ultimates
    ADD COLUMN IF NOT EXISTS id UUID DEFAULT gen_random_uuid(),
    ADD COLUMN IF NOT EXISTS skill_name TEXT,
    ADD COLUMN IF NOT EXISTS mastery_level TEXT,
    ADD COLUMN IF NOT EXISTS core_principles JSONB DEFAULT '[]'::jsonb,
    ADD COLUMN IF NOT EXISTS synthesis TEXT,
    ADD COLUMN IF NOT EXISTS source_shards JSONB DEFAULT '[]'::jsonb,
    ADD COLUMN IF NOT EXISTS timestamp BIGINT,
    ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now());

ALTER TABLE public.omni_memory_shards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.omni_skill_ultimates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service Role can full access omni_memory_shards" ON public.omni_memory_shards;
DROP POLICY IF EXISTS "Service Role can full access omni_skill_ultimates" ON public.omni_skill_ultimates;
DROP POLICY IF EXISTS "Authenticated users can read omni_memory_shards" ON public.omni_memory_shards;
DROP POLICY IF EXISTS "Authenticated users can read omni_skill_ultimates" ON public.omni_skill_ultimates;

CREATE POLICY "Service Role can full access omni_memory_shards" ON public.omni_memory_shards
    TO service_role
    USING (true);
CREATE POLICY "Service Role can full access omni_skill_ultimates" ON public.omni_skill_ultimates
    TO service_role
    USING (true);
CREATE POLICY "Authenticated users can read omni_memory_shards" ON public.omni_memory_shards
    FOR SELECT
    TO authenticated
    USING (true);
CREATE POLICY "Authenticated users can read omni_skill_ultimates" ON public.omni_skill_ultimates
    FOR SELECT
    TO authenticated
    USING (true);

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

ALTER TABLE public.omni_atomic_components
    ADD COLUMN IF NOT EXISTS atom_id TEXT,
    ADD COLUMN IF NOT EXISTS type TEXT,
    ADD COLUMN IF NOT EXISTS version TEXT,
    ADD COLUMN IF NOT EXISTS status TEXT,
    ADD COLUMN IF NOT EXISTS specification TEXT,
    ADD COLUMN IF NOT EXISTS intent TEXT,
    ADD COLUMN IF NOT EXISTS governance_node TEXT,
    ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now());

ALTER TABLE public.omni_atomic_components ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service Role can full access omni_atomic_components" ON public.omni_atomic_components;
DROP POLICY IF EXISTS "Authenticated users can read omni_atomic_components" ON public.omni_atomic_components;

CREATE POLICY "Service Role can full access omni_atomic_components" ON public.omni_atomic_components
    TO service_role
    USING (true);
CREATE POLICY "Authenticated users can read omni_atomic_components" ON public.omni_atomic_components
    FOR SELECT
    TO authenticated
    USING (true);

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_omni_atomic_components_updated_at ON public.omni_atomic_components;

CREATE TRIGGER update_omni_atomic_components_updated_at
    BEFORE UPDATE ON public.omni_atomic_components
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE IF NOT EXISTS public.compliance_records (
    id SERIAL PRIMARY KEY,
    uuid UUID DEFAULT gen_random_uuid() UNIQUE,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    user_email TEXT NOT NULL,
    report_id TEXT NOT NULL,
    standard_version TEXT NOT NULL,
    status TEXT NOT NULL,
    findings JSONB,
    integrity_hash TEXT NOT NULL,
    version INTEGER DEFAULT 1,
    metadata JSONB
);

ALTER TABLE public.compliance_records
    ADD COLUMN IF NOT EXISTS id SERIAL,
    ADD COLUMN IF NOT EXISTS uuid UUID DEFAULT gen_random_uuid(),
    ADD COLUMN IF NOT EXISTS timestamp TIMESTAMPTZ DEFAULT NOW(),
    ADD COLUMN IF NOT EXISTS user_email TEXT,
    ADD COLUMN IF NOT EXISTS report_id TEXT,
    ADD COLUMN IF NOT EXISTS standard_version TEXT,
    ADD COLUMN IF NOT EXISTS status TEXT,
    ADD COLUMN IF NOT EXISTS findings JSONB,
    ADD COLUMN IF NOT EXISTS integrity_hash TEXT,
    ADD COLUMN IF NOT EXISTS version INTEGER DEFAULT 1,
    ADD COLUMN IF NOT EXISTS metadata JSONB;

CREATE INDEX IF NOT EXISTS idx_compliance_uuid ON public.compliance_records(uuid);
CREATE INDEX IF NOT EXISTS idx_compliance_user ON public.compliance_records(user_email);

CREATE TABLE IF NOT EXISTS public.kb_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    source_url TEXT,
    document_type TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.kb_documents
    ADD COLUMN IF NOT EXISTS id UUID DEFAULT gen_random_uuid(),
    ADD COLUMN IF NOT EXISTS title TEXT,
    ADD COLUMN IF NOT EXISTS content TEXT,
    ADD COLUMN IF NOT EXISTS source_url TEXT,
    ADD COLUMN IF NOT EXISTS document_type TEXT,
    ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb,
    ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

CREATE TABLE IF NOT EXISTS public.kb_document_embeddings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID REFERENCES public.kb_documents(id) ON DELETE CASCADE,
    chunk_index INT NOT NULL,
    content TEXT NOT NULL,
    embedding extensions.vector(768),
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.kb_document_embeddings
    ADD COLUMN IF NOT EXISTS id UUID DEFAULT gen_random_uuid(),
    ADD COLUMN IF NOT EXISTS document_id UUID,
    ADD COLUMN IF NOT EXISTS chunk_index INT,
    ADD COLUMN IF NOT EXISTS content TEXT,
    ADD COLUMN IF NOT EXISTS embedding extensions.vector(768),
    ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb,
    ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

CREATE OR REPLACE FUNCTION public.match_kb_documents (
    query_embedding extensions.vector(768),
    match_threshold FLOAT,
    match_count INT
)
RETURNS TABLE (
    id UUID,
    document_id UUID,
    content TEXT,
    metadata JSONB,
    similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        kb_document_embeddings.id,
        kb_document_embeddings.document_id,
        kb_document_embeddings.content,
        kb_document_embeddings.metadata,
        1 - (kb_document_embeddings.embedding <=> query_embedding) AS similarity
    FROM kb_document_embeddings
    WHERE 1 - (kb_document_embeddings.embedding <=> query_embedding) > match_threshold
    ORDER BY kb_document_embeddings.embedding <=> query_embedding
    LIMIT match_count;
END;
$$;

ALTER TABLE public.kb_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kb_document_embeddings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow authenticated users to read kb_documents" ON public.kb_documents;
DROP POLICY IF EXISTS "Allow authenticated users to read kb_document_embeddings" ON public.kb_document_embeddings;

CREATE POLICY "Allow authenticated users to read kb_documents"
    ON public.kb_documents FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Allow authenticated users to read kb_document_embeddings"
    ON public.kb_document_embeddings FOR SELECT
    TO authenticated
    USING (true);

GRANT SELECT ON public.kb_documents TO anon, authenticated;
GRANT SELECT ON public.kb_document_embeddings TO anon, authenticated;
