-- 1. 啟用 pgvector 擴充功能
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. 建立向量儲存表
CREATE TABLE IF NOT EXISTS public.omni_memory_vectors (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  shard_id uuid REFERENCES public.omni_memory_shards(id) ON DELETE CASCADE,
  embedding vector(1536) NOT NULL, -- OpenAI text-embedding-3-small 維度為 1536
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. 建立 HNSW 索引以加速向量搜尋
CREATE INDEX IF NOT EXISTS omni_memory_vectors_embedding_idx 
ON public.omni_memory_vectors USING hnsw (embedding vector_cosine_ops);

-- 4. 建立 RAG 相似度搜尋函數
CREATE OR REPLACE FUNCTION match_omni_memory(
  query_embedding vector(1536),
  match_threshold float,
  match_count int
)
RETURNS TABLE (
  shard_id uuid,
  title text,
  content jsonb,
  tags text[],
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    omv.shard_id,
    oms.title,
    oms.content,
    oms.tags,
    1 - (omv.embedding <=> query_embedding) AS similarity
  FROM public.omni_memory_vectors omv
  JOIN public.omni_memory_shards oms ON omv.shard_id = oms.id
  WHERE 1 - (omv.embedding <=> query_embedding) > match_threshold
  ORDER BY omv.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;
