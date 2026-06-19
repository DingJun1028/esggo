-- ============================================================================
-- Omnipotent Think Tank - Database Schema
-- PostgreSQL + pgvector Extension
-- ============================================================================

-- 啟用 pgvector 擴充套件
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- 1. AI 角色原型表 (Agent Manifests)
-- ============================================================================
CREATE TABLE IF NOT EXISTS agents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    system_prompt TEXT NOT NULL,
    base_model VARCHAR(100) DEFAULT 'gemini-1.5-flash',
    temperature DECIMAL(3,2) DEFAULT 0.7,
    max_tokens INTEGER DEFAULT 4096,
    context_strategy VARCHAR(50) DEFAULT 'FIFO',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT valid_temperature CHECK (temperature >= 0 AND temperature <= 2),
    CONSTRAINT valid_context_strategy CHECK (context_strategy IN ('FIFO', 'Summarization', 'Hybrid'))
);

CREATE INDEX IF NOT EXISTS idx_agents_name ON agents(name);
CREATE INDEX IF NOT EXISTS idx_agents_created ON agents(created_at DESC);

-- ============================================================================
-- 2. 技能定義表 (Skills Registry)
-- ============================================================================
CREATE TABLE IF NOT EXISTS skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    category VARCHAR(100),
    requires_hitl BOOLEAN DEFAULT false,
    implementation_code TEXT,
    parameters_schema JSONB DEFAULT '{}',
    enabled BOOLEAN DEFAULT true,
    usage_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_skills_category ON skills(category);
CREATE INDEX IF NOT EXISTS idx_skills_hitl ON skills(requires_hitl);
CREATE INDEX IF NOT EXISTS idx_skills_enabled ON skills(enabled);

-- ============================================================================
-- 3. Agent-Skill 關聯表 (Agent Abilities)
-- ============================================================================
CREATE TABLE IF NOT EXISTS agent_skills (
    agent_id UUID REFERENCES agents(id) ON DELETE CASCADE,
    skill_id UUID REFERENCES skills(id) ON DELETE CASCADE,
    enabled BOOLEAN DEFAULT true,
    custom_config JSONB DEFAULT '{}',
    assigned_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (agent_id, skill_id)
);

CREATE INDEX IF NOT EXISTS idx_agent_skills_agent ON agent_skills(agent_id);
CREATE INDEX IF NOT EXISTS idx_agent_skills_skill ON agent_skills(skill_id);

-- ============================================================================
-- 4. 知識庫索引表 (Knowledge Base Registry)
-- ============================================================================
CREATE TABLE IF NOT EXISTS knowledge_bases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    agent_id UUID REFERENCES agents(id) ON DELETE SET NULL,
    total_chunks INTEGER DEFAULT 0,
    total_size_bytes BIGINT DEFAULT 0,
    embedding_model VARCHAR(100) DEFAULT 'text-embedding-004',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_kb_agent ON knowledge_bases(agent_id);
CREATE INDEX IF NOT EXISTS idx_kb_name ON knowledge_bases(name);

-- ============================================================================
-- 5. 向量記憶切片表 (Vector Memory Chunks) - 核心 RAG
-- ============================================================================
CREATE TABLE IF NOT EXISTS memory_chunks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    kb_id UUID REFERENCES knowledge_bases(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    embedding vector(768),  -- Gemini text-embedding-004 dimensions
    metadata JSONB DEFAULT '{}',
    source VARCHAR(500),
    chunk_index INTEGER,
    parent_document_id UUID,
    created_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT content_not_empty CHECK (length(content) > 0)
);

-- 向量相似度索引 (IVFFlat for faster approximate search)
CREATE INDEX idx_memory_embedding ON memory_chunks 
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

CREATE INDEX idx_memory_kb ON memory_chunks(kb_id);
CREATE INDEX idx_memory_source ON memory_chunks(source);
CREATE INDEX idx_memory_created ON memory_chunks(created_at DESC);

-- ============================================================================
-- 6. 對話歷史表 (Conversation History)
-- ============================================================================
CREATE TABLE IF NOT EXISTS conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id VARCHAR(255) NOT NULL,
    agent_id UUID REFERENCES agents(id) ON DELETE SET NULL,
    user_message TEXT,
    agent_response TEXT,
    thought_process TEXT,
    skill_calls JSONB DEFAULT '[]',
    rag_context JSONB DEFAULT '[]',
    tokens_used INTEGER,
    response_time_ms INTEGER,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_conv_session ON conversations(session_id);
CREATE INDEX idx_conv_agent ON conversations(agent_id);
CREATE INDEX idx_conv_created ON conversations(created_at DESC);

-- ============================================================================
-- 7. 技能進化提案表 (Evolution Proposals - HITL)
-- ============================================================================
CREATE TABLE IF NOT EXISTS evolution_proposals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    skill_id UUID REFERENCES skills(id) ON DELETE CASCADE,
    proposed_by VARCHAR(100),  -- 'ai' or 'user:{user_id}'
    proposal_type VARCHAR(50) NOT NULL,  -- 'new_skill', 'modify_skill', 'parameter_change'
    current_state JSONB,
    proposed_state JSONB NOT NULL,
    justification TEXT,
    status VARCHAR(50) DEFAULT 'pending',  -- 'pending', 'approved', 'rejected', 'implemented'
    reviewed_by VARCHAR(255),
    reviewed_at TIMESTAMP,
    implemented_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT valid_proposal_type CHECK (proposal_type IN ('new_skill', 'modify_skill', 'parameter_change', 'deprecate_skill')),
    CONSTRAINT valid_status CHECK (status IN ('pending', 'approved', 'rejected', 'implemented'))
);

CREATE INDEX idx_proposals_status ON evolution_proposals(status);
CREATE INDEX idx_proposals_skill ON evolution_proposals(skill_id);
CREATE INDEX idx_proposals_created ON evolution_proposals(created_at DESC);

-- ============================================================================
-- 8. 會話元數據表 (Session Metadata)
-- ============================================================================
CREATE TABLE IF NOT EXISTS sessions (
    id VARCHAR(255) PRIMARY KEY,
    agent_id UUID REFERENCES agents(id) ON DELETE SET NULL,
    user_id VARCHAR(255),
    kb_id UUID REFERENCES knowledge_bases(id) ON DELETE SET NULL,
    context_window JSONB DEFAULT '[]',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW(),
    last_active_at TIMESTAMP DEFAULT NOW(),
    expires_at TIMESTAMP
);

CREATE INDEX idx_sessions_agent ON sessions(agent_id);
CREATE INDEX idx_sessions_user ON sessions(user_id);
CREATE INDEX idx_sessions_active ON sessions(last_active_at DESC);

-- ============================================================================
-- 9. 審計日誌表 (Audit Trail)
-- ============================================================================
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_type VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100),
    entity_id UUID,
    user_id VARCHAR(255),
    action VARCHAR(50),
    details JSONB DEFAULT '{}',
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_audit_event ON audit_logs(event_type);
CREATE INDEX idx_audit_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_user ON audit_logs(user_id);
CREATE INDEX idx_audit_created ON audit_logs(created_at DESC);

-- ============================================================================
-- 觸發器：自動更新 updated_at 時間戳
-- ============================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_agents_updated_at BEFORE UPDATE ON agents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_skills_updated_at BEFORE UPDATE ON skills
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_knowledge_bases_updated_at BEFORE UPDATE ON knowledge_bases
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 觸發器：自動更新知識庫統計
-- ============================================================================
CREATE OR REPLACE FUNCTION update_kb_stats()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE knowledge_bases 
        SET total_chunks = total_chunks + 1,
            total_size_bytes = total_size_bytes + length(NEW.content)
        WHERE id = NEW.kb_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE knowledge_bases 
        SET total_chunks = total_chunks - 1,
            total_size_bytes = total_size_bytes - length(OLD.content)
        WHERE id = OLD.kb_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_kb_stats_trigger
AFTER INSERT OR DELETE ON memory_chunks
FOR EACH ROW EXECUTE FUNCTION update_kb_stats();

-- ============================================================================
-- 觸發器：自動更新技能使用計數
-- ============================================================================
CREATE OR REPLACE FUNCTION increment_skill_usage()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.skill_calls IS NOT NULL AND jsonb_array_length(NEW.skill_calls) > 0 THEN
        UPDATE skills
        SET usage_count = usage_count + 1
        WHERE name IN (
            SELECT jsonb_array_elements(NEW.skill_calls)->>'name'
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER increment_skill_usage_trigger
AFTER INSERT ON conversations
FOR EACH ROW EXECUTE FUNCTION increment_skill_usage();

-- ============================================================================
-- 視圖：Agent 完整資訊（包含技能）
-- ============================================================================
CREATE OR REPLACE VIEW agent_full_info AS
SELECT 
    a.*,
    COALESCE(
        json_agg(
            json_build_object(
                'skill_id', s.id,
                'skill_name', s.name,
                'skill_category', s.category,
                'requires_hitl', s.requires_hitl,
                'enabled', ags.enabled
            ) ORDER BY s.name
        ) FILTER (WHERE s.id IS NOT NULL),
        '[]'
    ) as skills
FROM agents a
LEFT JOIN agent_skills ags ON a.id = ags.agent_id
LEFT JOIN skills s ON ags.skill_id = s.id
GROUP BY a.id;

-- ============================================================================
-- 視圖：知識庫統計
-- ============================================================================
CREATE OR REPLACE VIEW kb_statistics AS
SELECT 
    kb.id,
    kb.name,
    kb.total_chunks,
    kb.total_size_bytes,
    ROUND(kb.total_size_bytes::numeric / 1024 / 1024, 2) as size_mb,
    a.name as agent_name,
    COUNT(DISTINCT mc.source) as unique_sources,
    MAX(mc.created_at) as last_updated
FROM knowledge_bases kb
LEFT JOIN agents a ON kb.agent_id = a.id
LEFT JOIN memory_chunks mc ON kb.id = mc.kb_id
GROUP BY kb.id, kb.name, kb.total_chunks, kb.total_size_bytes, a.name;

-- ============================================================================
-- 完成訊息
-- ============================================================================
DO $$
BEGIN
    RAISE NOTICE '✅ Omnipotent Think Tank Database Schema Created Successfully!';
    RAISE NOTICE '📊 Tables: agents, skills, knowledge_bases, memory_chunks, conversations';
    RAISE NOTICE '🔍 Indexes: Vector similarity search enabled with IVFFlat';
    RAISE NOTICE '⚡ Triggers: Auto-update timestamps and statistics';
    RAISE NOTICE '👁️ Views: agent_full_info, kb_statistics';
END $$;
