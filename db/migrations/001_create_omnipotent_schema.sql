-- Enable pgvector extension
create extension if not exists vector;

-- Create ESG Knowledge Storage
create table if not exists esg_knowledge (
  id uuid primary key default gen_random_uuid(),
  content text not null,
  source text not null,
  kb text not null, -- esg_standards, gri_standards, etc.
  metadata jsonb default '{}'::jsonb,
  embedding vector(1536), -- Assuming Gemini embedding-004 dimensions
  created_at timestamp with time zone default now()
);

-- Enable RLS
alter table esg_knowledge enable row level security;

-- Public read access for knowledge bases
create policy "Allow public read access" 
  on esg_knowledge for select 
  using (true);

-- Vector Similarity Search Function
create or replace function match_knowledge (
  query_embedding vector(1536),
  match_threshold float,
  match_count int,
  kb_filter text[] default null
)
returns table (
  id uuid,
  content text,
  source text,
  kb text,
  metadata jsonb,
  similarity float
)
language sql stable
as $$
  select
    esg_knowledge.id,
    esg_knowledge.content,
    esg_knowledge.source,
    esg_knowledge.kb,
    esg_knowledge.metadata,
    1 - (esg_knowledge.embedding <=> query_embedding) as similarity
  from esg_knowledge
  where (kb_filter is null or esg_knowledge.kb = any(kb_filter))
    and 1 - (esg_knowledge.embedding <=> query_embedding) > match_threshold
  order by esg_knowledge.embedding <=> query_embedding asc
  limit match_count;
$$;
