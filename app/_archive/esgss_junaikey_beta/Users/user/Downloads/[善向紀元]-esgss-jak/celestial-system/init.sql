CREATE EXTENSION IF NOT EXISTS vector;
CREATE TABLE IF NOT EXISTS agents (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
name VARCHAR(255) NOT NULL,
system_prompt JSONB NOT NULL,
created_at TIMESTAMP DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS knowledge_chunks (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
content TEXT NOT NULL,
embedding VECTOR(768),
metadata JSONB DEFAULT '{}'
);
CREATE TABLE IF NOT EXISTS lessons (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
trigger_keywords TEXT,
lesson_content TEXT
);