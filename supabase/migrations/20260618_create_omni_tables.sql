-- Create omni_matrix_components table for Universal Component Matrix
create table if not exists public.omni_matrix_components (
    id text primary key,
    name text not null,
    category text not null check (category in ('Perception', 'Command', 'Omniscience', 'Global', 'Hologram', 'Atoms')),
    route text unique,
    registered boolean default false,
    five_t_traceable boolean default false,
    five_t_transparent boolean default false,
    five_t_tangible boolean default false,
    five_t_trustworthy boolean default false,
    five_t_trackable boolean default false,
    deliverables jsonb,
    business_logic text,
    uiux text,
    customer_journey text,
    pain_points_solved text,
    last_updated timestamp with time zone default now()
);

-- Create gri_standards table for GRI 2021 reference
create table if not exists public.gri_standards (
    id text primary key,
    gri_code text not null,
    material_topic text not null,
    esg_category text not null check (esg_category in ('Environmental', 'Social', 'Governance')),
    disclosure_requirements jsonb,
    sub_metrics jsonb,
    guidance_reference text,
    created_at timestamp with time zone default now()
);

-- Create esg_benchmark_enterprises table for yearbook
create table if not exists public.esg_benchmark_enterprises (
    id text primary key,
    name text not null,
    year integer not null,
    category text not null check (category in ('carbon', 'renewable', 'supply_chain', 'diversity', 'governance')),
    esg_score numeric,
    carbon_intensity numeric,
    renewable_percentage numeric,
    diversity_score numeric,
    governance_rating numeric,
    hash_lock text,
    source_url text,
    created_at timestamp with time zone default now()
);

-- Create cbam_emissions_factors table for CBAM calculator
create table if not exists public.cbam_emissions_factors (
    id text primary key,
    product_category text not null,
    hs_code text,
    default_emission_factor numeric not null,
    unit text not null,
    source text,
    updated_at timestamp with time zone default now()
);

-- Create cbam_calculations table for user calculations
create table if not exists public.cbam_calculations (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references auth.users(id),
    product_name text not null,
    product_category text not null,
    import_value_usd numeric,
    quantity numeric not null,
    emission_factor numeric not null,
    calculated_emissions numeric not null,
    currency text,
    country_of_origin text,
    calculation_date timestamp with time zone default now(),
    hash_lock text,
    metadata jsonb
);

-- Create omni_vault table for secure document storage
create table if not exists public.omni_vault (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references auth.users(id),
    file_name text not null,
    file_type text not null,
    file_size integer,
    file_path text,
    encryption_level text default 'L1',
    hash_lock text not null,
    tag text,
    category text check (category in ('evidence', 'report', 'template', 'archive')),
    created_at timestamp with time zone default now(),
    expires_at timestamp with time zone
);

-- Create reading_room_documents table for document library
create table if not exists public.reading_room_documents (
    id text primary key,
    title text not null,
    description text,
    category text check (category in ('standard', 'template', 'case-study', 'regulation', 'industry-report')),
    file_url text,
    gri_reference text,
    esg_category text check (esg_category in ('Environmental', 'Social', 'Governance')),
    tags text[],
    source text,
    published_date date,
    created_at timestamp with time zone default now()
);

-- Create data_sources table for system integration
create table if not exists public.data_sources (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references auth.users(id),
    source_type text check (source_type in ('hr', 'finance', 'erp', 'api', 'scraped', 'ocr')),
    source_name text not null,
    api_endpoint text,
    connection_config jsonb,
    last_sync timestamp with time zone,
    sync_frequency text,
    created_at timestamp with time zone default now()
);

-- Create ocr_documents table for OCR processing
create table if not exists public.ocr_documents (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references auth.users(id),
    file_name text not null,
    file_url text,
    extracted_data jsonb,
    gri_reference text,
    confidence numeric,
    ocr_engine text,
    hash_lock text,
    processed_at timestamp with time zone default now()
);

-- Create omni_tags table for tagging system
create table if not exists public.omni_tags (
    id text primary key,
    name text not null,
    category text check (category in ('environmental', 'social', 'governance', 'compliance', 'benchmark', 'risk')),
    color text,
    description text,
    created_at timestamp with time zone default now()
);

-- Create tagged_items table for item-tag associations
create table if not exists public.tagged_items (
    id uuid primary key default gen_random_uuid(),
    item_id text not null,
    item_type text check (item_type in ('report', 'document', 'evidence', 'note', 'calculation')),
    tags text[] not null,
    created_at timestamp with time zone default now()
);

-- Create brand_themes table for report styling
create table if not exists public.brand_themes (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references auth.users(id),
    brand_name text not null,
    primary_color text default '#003262',
    secondary_color text default '#3B7EA1',
    accent_color text default '#FDB515',
    font_family text default 'Inter, system-ui, sans-serif',
    logo_url text,
    cover_page text,
    created_at timestamp with time zone default now()
);

-- Create report_styles table for report templates
create table if not exists public.report_styles (
    id text primary key,
    user_id uuid references auth.users(id),
    template text check (template in ('classic', 'modern', 'executive', 'technical')),
    page_size text check (page_size in ('A4', 'Letter', 'Legal')) default 'A4',
    orientation text check (orientation in ('portrait', 'landscape')) default 'portrait',
    margins jsonb,
    sections jsonb,
    brand_theme_id uuid references public.brand_themes(id),
    created_at timestamp with time zone default now()
);

-- Create sustain_write_notes table for sustainability writing notes
create table if not exists public.sustain_write_notes (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references auth.users(id),
    gri_code text not null,
    section text not null,
    title text not null,
    content text,
    context jsonb,
    linked_documents uuid[],
    status text check (status in ('draft', 'review', 'final')) default 'draft',
    word_target integer,
    created_at timestamp with time zone default now()
);

-- Create omni_evidence table for Vault evidence storage
create table if not exists public.omni_evidence (
    id uuid primary key default gen_random_uuid(),
    report_id uuid references public.omni_reports(id) on delete cascade,
    file_name text not null,
    file_url text,
    hash_lock text not null,
    data_type text default 'EVIDENCE',
    gri_reference text,
    uploaded_at timestamp with time zone default now()
);

-- Create omni_notes table for OmniNotes workspace
create table if not exists public.omni_notes (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references auth.users(id),
    card_uuid text references public.omni_matrix_components(id),
    content text,
    type text default 'knowledge',
    pinned boolean default false,
    last_edited_time timestamp with time zone default now(),
    created_at timestamp with time zone default now()
);

-- Create sustain_write_documents table for Sustain Write workspace
create table if not exists public.sustain_write_documents (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references auth.users(id),
    title text not null,
    content text,
    document_type text check (document_type in ('sustainability', 'carbon-accounting', 'esg-disclosure', 'transition-plan')),
    gri_mappings text[],
    evidence_ids uuid[],
    version integer default 1,
    status text check (status in ('draft', 'review', 'published', 'archived')) default 'draft',
    collaborators uuid[],
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- Create index for faster route lookups
create index if not exists idx_omni_matrix_route on public.omni_matrix_components(route);
create index if not exists idx_omni_evidence_report on public.omni_evidence(report_id);
create index if not exists idx_omni_notes_user on public.omni_notes(user_id);

-- Create gri_expert_templates table for GRI templates
create table if not exists public.gri_expert_templates (
    id text primary key,
    gri_code text not null references public.gri_standards(gri_code),
    template_name text not null,
    industry text,
    section integer,
    content text,
    placeholders jsonb,
    compliance_checklist jsonb,
    disclosure_hints jsonb,
    created_at timestamp with time zone default now()
);