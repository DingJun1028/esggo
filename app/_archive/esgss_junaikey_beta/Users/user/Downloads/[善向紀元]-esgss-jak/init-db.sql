-- ESG儀表板資料庫初始化腳本
-- 版本: v2.0.0 - Seraphim Edition

-- 創建資料庫（如果不存在）
-- CREATE DATABASE IF NOT EXISTS esg_dashboard;
-- \c esg_dashboard;

-- 啟用必要的擴展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- 用戶表
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE,
    display_name VARCHAR(255),
    avatar_url TEXT,
    role VARCHAR(50) DEFAULT 'user',
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ESG數據表
CREATE TABLE IF NOT EXISTS esg_data (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    company_name VARCHAR(255) NOT NULL,
    reporting_period DATE NOT NULL,
    category VARCHAR(50) NOT NULL, -- 'environmental', 'social', 'governance'

    -- 環境指標
    carbon_emissions DECIMAL(15,2),
    energy_consumption DECIMAL(15,2),
    water_usage DECIMAL(15,2),
    waste_generation DECIMAL(15,2),

    -- 社會指標
    employee_count INTEGER,
    diversity_ratio DECIMAL(5,2),
    training_hours INTEGER,
    community_investment DECIMAL(15,2),

    -- 治理指標
    board_independence DECIMAL(5,2),
    executive_compensation DECIMAL(15,2),
    risk_management_score DECIMAL(5,2),
    transparency_score DECIMAL(5,2),

    -- 元數據
    data_quality_score DECIMAL(5,2),
    verification_status VARCHAR(50) DEFAULT 'pending',
    source VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    UNIQUE(user_id, company_name, reporting_period, category)
);

-- AI分析結果表
CREATE TABLE IF NOT EXISTS ai_analyses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    esg_data_id UUID REFERENCES esg_data(id) ON DELETE CASCADE,
    analysis_type VARCHAR(100) NOT NULL,
    provider VARCHAR(50) NOT NULL, -- 'gemini', 'openai', 'claude'
    prompt TEXT NOT NULL,
    response TEXT NOT NULL,
    confidence_score DECIMAL(5,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 趨勢分析表
CREATE TABLE IF NOT EXISTS trends (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    metric_name VARCHAR(255) NOT NULL,
    time_period VARCHAR(50) NOT NULL, -- 'quarterly', 'yearly'
    trend_direction VARCHAR(20) NOT NULL, -- 'up', 'down', 'stable'
    change_percentage DECIMAL(8,2),
    prediction_value DECIMAL(15,2),
    confidence_interval_lower DECIMAL(15,2),
    confidence_interval_upper DECIMAL(15,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 系統事件日誌
CREATE TABLE IF NOT EXISTS system_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_type VARCHAR(100) NOT NULL,
    severity VARCHAR(20) DEFAULT 'info', -- 'debug', 'info', 'warning', 'error', 'critical'
    message TEXT NOT NULL,
    metadata JSONB,
    user_id UUID REFERENCES users(id),
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 儀表板配置表
CREATE TABLE IF NOT EXISTS dashboard_configs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    config_name VARCHAR(255) NOT NULL,
    layout_config JSONB NOT NULL,
    widget_configs JSONB DEFAULT '[]'::jsonb,
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    UNIQUE(user_id, config_name)
);

-- 報告生成記錄
CREATE TABLE IF NOT EXISTS reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    report_type VARCHAR(100) NOT NULL,
    parameters JSONB NOT NULL,
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed'
    file_path TEXT,
    file_size INTEGER,
    generated_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 索引優化
CREATE INDEX IF NOT EXISTS idx_esg_data_user_period ON esg_data(user_id, reporting_period);
CREATE INDEX IF NOT EXISTS idx_esg_data_category ON esg_data(category);
CREATE INDEX IF NOT EXISTS idx_esg_data_company ON esg_data(company_name);
CREATE INDEX IF NOT EXISTS idx_ai_analyses_esg_data ON ai_analyses(esg_data_id);
CREATE INDEX IF NOT EXISTS idx_system_events_type ON system_events(event_type);
CREATE INDEX IF NOT EXISTS idx_system_events_created ON system_events(created_at);
CREATE INDEX IF NOT EXISTS idx_trends_user_metric ON trends(user_id, metric_name);

-- 全文搜索索引
CREATE INDEX IF NOT EXISTS idx_esg_data_search ON esg_data USING gin(to_tsvector('english', company_name || ' ' || notes));
CREATE INDEX IF NOT EXISTS idx_system_events_search ON system_events USING gin(to_tsvector('english', message));

-- 觸發器函數：自動更新 updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 應用觸發器
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_esg_data_updated_at BEFORE UPDATE ON esg_data FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_dashboard_configs_updated_at BEFORE UPDATE ON dashboard_configs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 預設用戶角色
INSERT INTO users (email, username, display_name, role) VALUES
('admin@esg-dashboard.com', 'admin', '系統管理員', 'admin'),
('demo@esg-dashboard.com', 'demo', '示範用戶', 'user')
ON CONFLICT (email) DO NOTHING;

-- 預設ESG數據（示範數據）
INSERT INTO esg_data (user_id, company_name, reporting_period, category, carbon_emissions, energy_consumption, employee_count, diversity_ratio, board_independence) VALUES
((SELECT id FROM users WHERE email = 'demo@esg-dashboard.com'), 'ESG Sunshine Corp', '2024-01-01', 'environmental', 12500.50, 87500.25, NULL, NULL, NULL),
((SELECT id FROM users WHERE email = 'demo@esg-dashboard.com'), 'ESG Sunshine Corp', '2024-01-01', 'social', NULL, NULL, 1250, 0.42, NULL),
((SELECT id FROM users WHERE email = 'demo@esg-dashboard.com'), 'ESG Sunshine Corp', '2024-01-01', 'governance', NULL, NULL, NULL, NULL, 0.75)
ON CONFLICT DO NOTHING;

-- 權限設定
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO esg_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO esg_user;

-- 記錄初始化完成
INSERT INTO system_events (event_type, severity, message, metadata) VALUES
('database_init', 'info', 'ESG儀表板資料庫初始化完成', '{"version": "2.0.0", "tables_created": 8, "indexes_created": 8}');"