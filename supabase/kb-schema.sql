-- Enable pgvector extension
create extension if not exists vector;

-- Documents table: Stores metadata and full content of ingested ESG documents
create table if not exists public.kb_documents (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text not null,
  source_url text,
  document_type text, -- e.g., 'GRI_REPORT', 'POLICY', 'ISO_STANDARD'
  metadata jsonb default '{}'::jsonb,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Document Embeddings table: Stores vector representations for similarity search
create table if not exists public.kb_document_embeddings (
  id uuid primary key default gen_random_uuid(),
  document_id uuid references public.kb_documents(id) on delete cascade,
  chunk_index int not null,
  content text not null,
  embedding vector(768), -- Gemini embedding dimension is 768
  metadata jsonb default '{}'::jsonb,
  created_at timestamp with time zone default now()
);

-- Create a matching function for RAG similarity search
create or replace function public.match_kb_documents (
  query_embedding vector(768),
  match_threshold float,
  match_count int
)
returns table (
  id uuid,
  document_id uuid,
  content text,
  metadata jsonb,
  similarity float
)
language plpgsql
as $$
begin
  return query
  select
    kb_document_embeddings.id,
    kb_document_embeddings.document_id,
    kb_document_embeddings.content,
    kb_document_embeddings.metadata,
    1 - (kb_document_embeddings.embedding <=> query_embedding) as similarity
  from kb_document_embeddings
  where 1 - (kb_document_embeddings.embedding <=> query_embedding) > match_threshold
  order by kb_document_embeddings.embedding <=> query_embedding
  limit match_count;
end;
$$;

-- Enable RLS
alter table public.kb_documents enable row level security;
alter table public.kb_document_embeddings enable row level security;

-- Create basic SELECT policies for authenticated users
create policy "Allow authenticated users to read kb_documents"
  on public.kb_documents for select
  to authenticated
  using (true);

create policy "Allow authenticated users to read kb_document_embeddings"
  on public.kb_document_embeddings for select
  to authenticated
  using (true);

-- Grant access to roles
grant select on public.kb_documents to anon, authenticated;
grant select on public.kb_document_embeddings to anon, authenticated;
