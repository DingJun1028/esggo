
CREATE TABLE IF NOT EXISTS public.best_practices (
    id TEXT PRIMARY KEY,
    category TEXT NOT NULL,
    industry TEXT,
    title TEXT NOT NULL,
    strategy TEXT,
    benchmark_source TEXT,
    t5_compliance JSONB, -- Storing the t5_compliance object as JSONB
    impact_score INTEGER,
    tags TEXT[], -- Storing tags as a text array
    last_verified DATE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Optional: Add Row Level Security (RLS) if needed, similar to other tables
ALTER TABLE public.best_practices ENABLE ROW LEVEL SECURITY;

-- Policy example: Allow authenticated users to read best practices
CREATE POLICY "Authenticated users can read best_practices" ON public.best_practices
    FOR SELECT USING (auth.role() = 'authenticated');

-- Policy example: Allow service role to full access
CREATE POLICY "Service Role can full access best_practices" ON public.best_practices
    USING (auth.jwt() ->> 'role' = 'service_role');
