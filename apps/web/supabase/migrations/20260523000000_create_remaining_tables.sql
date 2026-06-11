-- environmental_data
CREATE TABLE IF NOT EXISTS environmental_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id TEXT DEFAULT 'default',
    category TEXT NOT NULL,
    metric_name TEXT NOT NULL,
    metric_value FLOAT,
    unit TEXT,
    year INT NOT NULL,
    gri_standard TEXT,
    source_origin TEXT,
    verified BOOLEAN DEFAULT false,
    hash_lock TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- governance_metrics
CREATE TABLE IF NOT EXISTS governance_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id TEXT DEFAULT 'default',
    category TEXT NOT NULL,
    metric_name TEXT NOT NULL,
    metric_value FLOAT,
    unit TEXT,
    year INT NOT NULL,
    gri_standard TEXT,
    source_origin TEXT,
    verified BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- evidence_vault
CREATE TABLE IF NOT EXISTS evidence_vault (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id TEXT DEFAULT 'default',
    file_name TEXT NOT NULL,
    file_type TEXT,
    category TEXT,
    gri_reference TEXT,
    uploader TEXT,
    status TEXT DEFAULT 'pending',
    zkp_proof BOOLEAN DEFAULT false,
    hash_lock TEXT,
    file_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- vault_omni_core
CREATE TABLE IF NOT EXISTS vault_omni_core (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    uuid UUID NOT NULL,
    dimension TEXT,
    hash_lock TEXT NOT NULL,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- audit_logs
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id TEXT DEFAULT 'default',
    action TEXT NOT NULL,
    resource TEXT,
    user_name TEXT,
    department TEXT,
    gri_reference TEXT,
    t5_tag TEXT,
    hash_lock TEXT,
    details TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- tasks
CREATE TABLE IF NOT EXISTS tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'todo',
    priority TEXT DEFAULT 'medium',
    assignee TEXT,
    department TEXT,
    gri_reference TEXT,
    due_date TEXT,
    company_id TEXT DEFAULT 'default',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- company_profiles
CREATE TABLE IF NOT EXISTS company_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id TEXT UNIQUE DEFAULT 'default',
    company_name TEXT NOT NULL,
    industry TEXT,
    employee_count INT,
    revenue_twd BIGINT,
    capital_twd BIGINT,
    locations JSONB,
    esg_goals JSONB,
    governance_structure JSONB,
    reporting_year INT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- roadmap_milestones
CREATE TABLE IF NOT EXISTS roadmap_milestones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id TEXT DEFAULT 'default',
    title TEXT NOT NULL,
    description TEXT,
    target_year INT NOT NULL,
    category TEXT,
    target_value FLOAT,
    current_value FLOAT,
    unit TEXT,
    status TEXT DEFAULT 'planned',
    sbti_aligned BOOLEAN DEFAULT false,
    gri_reference TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- reading_room
CREATE TABLE IF NOT EXISTS reading_room (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    summary TEXT,
    source TEXT,
    source_url TEXT,
    category TEXT,
    tags JSONB,
    impact_level TEXT,
    published_date TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- health_check_results
CREATE TABLE IF NOT EXISTS health_check_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id TEXT DEFAULT 'default',
    total_score FLOAT NOT NULL,
    category_scores JSONB,
    answers JSONB,
    gaps JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- advisory_sessions
CREATE TABLE IF NOT EXISTS advisory_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT DEFAULT 'default',
    persona TEXT NOT NULL,
    title TEXT,
    messages JSONB,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, persona)
);

-- sustainwrite_sections
CREATE TABLE IF NOT EXISTS sustainwrite_sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chapter_id TEXT NOT NULL,
    content TEXT,
    fields JSONB,
    doc_status JSONB,
    notes TEXT,
    hash_lock TEXT,
    sealed BOOLEAN DEFAULT false,
    user_id TEXT DEFAULT 'default',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(chapter_id, user_id)
);
