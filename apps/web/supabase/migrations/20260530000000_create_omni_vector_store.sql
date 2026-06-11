-- Enable the pgvector extension to work with embedding vectors
CREATE EXTENSION IF NOT EXISTS vector;

-- Create a table to store your documents
CREATE TABLE IF NOT EXISTS omni_vector_store (
  id text PRIMARY KEY,
  source text,
  content text,
  metadata jsonb,
  embedding vector(1536)
);

-- Create a function to search for documents
CREATE OR REPLACE FUNCTION match_omni_documents (
  query_embedding vector(1536),
  match_threshold float,
  match_count int
)
RETURNS TABLE (
  id text,
  source text,
  content text,
  metadata jsonb,
  similarity float
)
LANGUAGE sql STABLE
AS $$
  SELECT
    omni_vector_store.id,
    omni_vector_store.source,
    omni_vector_store.content,
    omni_vector_store.metadata,
    1 - (omni_vector_store.embedding <=> query_embedding) AS similarity
  FROM omni_vector_store
  WHERE 1 - (omni_vector_store.embedding <=> query_embedding) > match_threshold
  ORDER BY omni_vector_store.embedding <=> query_embedding
  LIMIT match_count;
$$;
