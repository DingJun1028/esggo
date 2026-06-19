-- Enable vector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Create knowledge_vectors table
CREATE TABLE IF NOT EXISTS knowledge_vectors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content TEXT NOT NULL,
    metadata JSONB DEFAULT '{}',
    embedding vector(768),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for vector similarity search
-- Using cosine distance (vector_cosine_ops)
CREATE INDEX IF NOT EXISTS idx_knowledge_vectors_embedding
ON knowledge_vectors USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);
