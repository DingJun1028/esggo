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

-- Create index for faster route lookups
create index if not exists idx_omni_matrix_route on public.omni_matrix_components(route);
create index if not exists idx_omni_evidence_report on public.omni_evidence(report_id);
create index if not exists idx_omni_notes_user on public.omni_notes(user_id);