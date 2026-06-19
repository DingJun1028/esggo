-- Enable the pgvector extension to work with embedding vectors
create extension if not exists vector;

-- Create a table to store your documents
create table if not exists memory_chunks (
  id uuid primary key default uuid_generate_v4(),
  kb_id text not null, -- Knowledge Base ID (e.g. 'user_123', 'global_rules')
  content text, -- The text content of the chunk
  embedding vector(768), -- Vector with 768 dimensions (for Gemini 1.5/2.0 embeddings)
  metadata jsonb, -- Extra metadata
  source text,
  chunk_index integer,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Index for faster search
create index if not exists idx_memory_chunks_embedding on memory_chunks using ivfflat (embedding vector_cosine_ops)
with (lists = 100);

-- Function to match chunks
create or replace function match_knowledge_chunks (
  query_embedding vector(768),
  match_threshold float,
  match_count int,
  filter_kb_id text
)
returns table (
  id uuid,
  content text,
  metadata jsonb,
  similarity float
)
language plpgsql
as $$
begin
  return query
  select
    memory_chunks.id,
    memory_chunks.content,
    memory_chunks.metadata,
    1 - (memory_chunks.embedding <=> query_embedding) as similarity
  from memory_chunks
  where 1 - (memory_chunks.embedding <=> query_embedding) > match_threshold
  and memory_chunks.kb_id = filter_kb_id
  order by memory_chunks.embedding <=> query_embedding
  limit match_count;
end;
$$;

-- Function to match chunks across multiple KBs
create or replace function match_knowledge_chunks_cross_kb (
  query_embedding vector(768),
  match_threshold float,
  match_count int,
  filter_kb_ids text[]
)
returns table (
  id uuid,
  content text,
  metadata jsonb,
  similarity float
)
language plpgsql
as $$
begin
  return query
  select
    memory_chunks.id,
    memory_chunks.content,
    memory_chunks.metadata,
    1 - (memory_chunks.embedding <=> query_embedding) as similarity
  from memory_chunks
  where 1 - (memory_chunks.embedding <=> query_embedding) > match_threshold
  and (filter_kb_ids is null or memory_chunks.kb_id = any(filter_kb_ids))
  order by memory_chunks.embedding <=> query_embedding
  limit match_count;
end;
$$;
