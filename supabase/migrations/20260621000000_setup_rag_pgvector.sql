-- =============================================================================
-- RAG Vector Setup for Reading Room Documents
-- 在 Supabase SQL Editor 中執行此檔案
-- =============================================================================

-- 1. Enable the pgvector extension to work with embedding vectors
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Add an embedding column to the existing reading_room_documents table
-- Using 768 dimensions because jina-embeddings-v2-base-en outputs 768d vectors
ALTER TABLE public.reading_room_documents 
ADD COLUMN IF NOT EXISTS embedding vector(768);

-- 3. Create an index for vector similarity search
-- Utilizing HNSW index for better performance on cosine distance (<=>)
CREATE INDEX IF NOT EXISTS reading_room_documents_embedding_idx 
ON public.reading_room_documents 
USING hnsw (embedding vector_cosine_ops);

-- 4. Create the match_documents function for semantic search
CREATE OR REPLACE FUNCTION match_documents (
  query_embedding vector(768),
  match_threshold float,
  match_count int
)
RETURNS TABLE (
  id TEXT,
  title TEXT,
  description TEXT,
  category TEXT,
  esg_category TEXT,
  tags TEXT[],
  file_url TEXT,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    rd.id,
    rd.title,
    rd.description,
    rd.category,
    rd.esg_category,
    rd.tags,
    rd.file_url,
    1 - (rd.embedding <=> query_embedding) AS similarity
  FROM public.reading_room_documents rd
  WHERE 1 - (rd.embedding <=> query_embedding) > match_threshold
  ORDER BY rd.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;
