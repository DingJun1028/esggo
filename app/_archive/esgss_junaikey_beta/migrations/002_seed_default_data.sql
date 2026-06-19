-- ============================================================================
-- Seed Data for Omnipotent Think Tank
-- Default Agents, Skills, and Knowledge Bases
-- ============================================================================

-- ============================================================================
-- 1. 預設 AI 角色 (Default Agents)
-- ============================================================================

-- ESG 永續顧問
INSERT INTO agents (name, description, system_prompt, temperature, max_tokens) VALUES
('ESG Advisor', 
 '企業永續發展顧問，專精於 ESG 策略規劃、永續報告撰寫與國際標準合規',
 '你是一位資深的 ESG（環境、社會、治理）顧問，擁有超過 10 年的企業永續發展經驗。

你的專業領域包括：
- ESG 策略規劃與實施
- GRI、SASB、TCFD 等國際標準報告撰寫
- 碳排放計算與減碳路徑規劃
- 供應鏈永續管理
- 利害關係人溝通

你的回答風格：
- 專業但易懂，避免過度技術性術語
- 提供具體可行的建議
- 引用最新的國際標準和最佳實踐
- 關注台灣本地法規與國際趨勢的結合

在回答之前，請先在 <thought> 標籤中分析問題的核心需求。',
 0.7,
 4096
),

-- 數據分析專家
('Data Analyst',
 '數據分析專家，擅長從複雜數據中提取洞察，精通統計分析與數據視覺化',
 '你是一位資深數據分析專家，精通：
- 統計分析與假設檢驗
- Python (pandas, numpy, scikit-learn)
- 數據視覺化 (matplotlib, plotly, recharts)
- SQL 查詢優化
- 機器學習模型建立

你的工作方式：
1. 先理解數據的業務背景
2. 進行探索性數據分析 (EDA)
3. 選擇適當的分析方法
4. 提供清晰的視覺化和解釋
5. 給出可操作的商業建議

在分析數據時，請在 <thought> 標籤中說明你的分析思路。',
 0.5,
 4096
),

-- 創意寫作助手
('Creative Writer',
 '創意寫作助手，擅長撰寫各類文案、文章與創意內容',
 '你是一位富有創意的寫作專家，能夠撰寫：
- 行銷文案與廣告標語
- 部落格文章與社群媒體內容
- 新聞稿與公關稿件
- 故事與劇本
- 技術文件的通俗化改寫

你的寫作特色：
- 語言生動有趣，富有感染力
- 能根據目標受眾調整語氣
- 注重 SEO 優化（適用時）
- 結構清晰，邏輯連貫

在創作之前，請在 <thought> 標籤中規劃內容架構和創意方向。',
 0.9,
 4096
),

-- 程式碼助手
('Code Assistant',
 '程式開發助手，精通多種程式語言，提供代碼審查、除錯與優化建議',
 '你是一位資深軟體工程師，精通：
- 前端：React, TypeScript, Vue, Angular
- 後端：Node.js, Python, Go, Java
- 資料庫：PostgreSQL, MongoDB, Redis
- DevOps：Docker, Kubernetes, CI/CD

你的工作原則：
- 代碼品質優先（可讀性、可維護性、性能）
- 遵循最佳實踐和設計模式
- 提供詳細的註解和文檔
- 考慮安全性和錯誤處理
- 建議測試策略

在提供代碼之前，請在 <thought> 標籤中分析需求和設計方案。',
 0.3,
 8192
);
on conflict (name) do nothing;

-- ============================================================================
-- 2. 預設技能 (Default Skills)
-- ============================================================================

INSERT INTO skills (name, description, category, requires_hitl, parameters_schema) VALUES
-- 資訊檢索類
('web_search',
 '在網路上搜尋最新資訊，支援 Google、Bing 等搜尋引擎',
 'information',
 false,
 '{"type": "object", "properties": {"query": {"type": "string"}, "max_results": {"type": "integer", "default": 5}}}'
),

('knowledge_retrieve',
 '從知識庫中檢索相關資訊（RAG）',
 'information',
 false,
 '{"type": "object", "properties": {"query": {"type": "string"}, "kb_id": {"type": "string"}, "top_k": {"type": "integer", "default": 5}}}'
),

-- 文件處理類
('generate_report',
 '生成 ESG 永續報告、分析報告等正式文件',
 'document',
 true,
 '{"type": "object", "properties": {"report_type": {"type": "string"}, "data": {"type": "object"}, "format": {"type": "string", "enum": ["pdf", "docx", "html"]}}}'
),

('analyze_document',
 '分析上傳的文件內容，提取關鍵資訊',
 'document',
 false,
 '{"type": "object", "properties": {"document_url": {"type": "string"}, "analysis_type": {"type": "string"}}}'
),

-- 數據分析類
('analyze_data',
 '分析數據並生成統計圖表',
 'analytics',
 false,
 '{"type": "object", "properties": {"data": {"type": "array"}, "chart_type": {"type": "string"}, "metrics": {"type": "array"}}}'
),

('calculate_carbon',
 '計算碳排放量，支援範疇一、二、三',
 'analytics',
 false,
 '{"type": "object", "properties": {"scope": {"type": "integer", "enum": [1, 2, 3]}, "activity_data": {"type": "object"}}}'
),

-- 通訊類
('send_email',
 '發送電子郵件通知',
 'communication',
 true,
 '{"type": "object", "properties": {"to": {"type": "string"}, "subject": {"type": "string"}, "body": {"type": "string"}}}'
),

('create_notification',
 '創建系統內通知',
 'communication',
 false,
 '{"type": "object", "properties": {"user_id": {"type": "string"}, "message": {"type": "string"}, "priority": {"type": "string"}}}'
),

-- 代碼生成類
('generate_code',
 '生成程式代碼片段',
 'development',
 false,
 '{"type": "object", "properties": {"language": {"type": "string"}, "description": {"type": "string"}, "framework": {"type": "string"}}}'
),

('review_code',
 '審查代碼品質，提供改進建議',
 'development',
 false,
 '{"type": "object", "properties": {"code": {"type": "string"}, "language": {"type": "string"}}}'
),

-- 視覺處理類
('analyze_image',
 '分析圖片內容，提取資訊',
 'vision',
 false,
 '{"type": "object", "properties": {"image_url": {"type": "string"}, "analysis_type": {"type": "string"}}}'
),

-- 學習類
('learn_from_text',
 '從文本中學習並儲存到知識庫',
 'learning',
 false,
 '{"type": "object", "properties": {"text": {"type": "string"}, "kb_id": {"type": "string"}, "metadata": {"type": "object"}}}'
);
on conflict (name) do nothing;

-- ============================================================================
-- 3. Agent-Skill 關聯 (Assign Skills to Agents)
-- ============================================================================

-- ESG Advisor 的技能
INSERT INTO agent_skills (agent_id, skill_id, enabled)
SELECT 
    (SELECT id FROM agents WHERE name = 'ESG Advisor'),
    id,
    true
FROM skills
WHERE name IN ('web_search', 'knowledge_retrieve', 'generate_report', 'calculate_carbon', 'analyze_document', 'learn_from_text')
ON CONFLICT DO NOTHING;

-- Data Analyst 的技能
INSERT INTO agent_skills (agent_id, skill_id, enabled)
SELECT 
    (SELECT id FROM agents WHERE name = 'Data Analyst'),
    id,
    true
FROM skills
WHERE name IN ('analyze_data', 'knowledge_retrieve', 'generate_report', 'analyze_document')
ON CONFLICT DO NOTHING;

-- Creative Writer 的技能
INSERT INTO agent_skills (agent_id, skill_id, enabled)
SELECT 
    (SELECT id FROM agents WHERE name = 'Creative Writer'),
    id,
    true
FROM skills
WHERE name IN ('web_search', 'knowledge_retrieve', 'analyze_document')
ON CONFLICT DO NOTHING;

-- Code Assistant 的技能
INSERT INTO agent_skills (agent_id, skill_id, enabled)
SELECT 
    (SELECT id FROM agents WHERE name = 'Code Assistant'),
    id,
    true
FROM skills
WHERE name IN ('generate_code', 'review_code', 'web_search', 'knowledge_retrieve')
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 4. 預設知識庫 (Default Knowledge Bases)
-- ============================================================================

INSERT INTO knowledge_bases (name, description, agent_id) VALUES
('ESG Standards Library',
 '包含 GRI、SASB、TCFD 等國際 ESG 標準的知識庫',
 (SELECT id FROM agents WHERE name = 'ESG Advisor')
),

('Company Policies',
 '公司內部政策、規章制度與標準作業程序',
 NULL
),

('Technical Documentation',
 '技術文件、API 文檔與開發指南',
 (SELECT id FROM agents WHERE name = 'Code Assistant')
),

('Market Research',
 '市場研究報告、產業分析與競爭情報',
 (SELECT id FROM agents WHERE name = 'Data Analyst')
);
on conflict (name) do nothing;

-- ============================================================================
-- 5. 範例記憶切片 (Sample Memory Chunks)
-- ============================================================================

-- 注意：實際的 embedding 向量需要透過 API 生成
-- 這裡僅作為結構示範，實際部署時會由應用程式填充

INSERT INTO memory_chunks (kb_id, content, source, metadata) VALUES
(
    (SELECT id FROM knowledge_bases WHERE name = 'ESG Standards Library'),
    'GRI (Global Reporting Initiative) 是全球最廣泛使用的永續報告框架。GRI 標準採用模組化設計，包括通用標準（GRI 2）和主題標準（GRI 200-400 系列）。',
    'manual_input',
    '{"topic": "GRI Standards", "language": "zh-TW", "version": "2021"}'
),
(
    (SELECT id FROM knowledge_bases WHERE name = 'ESG Standards Library'),
    'TCFD (Task Force on Climate-related Financial Disclosures) 建議企業揭露氣候相關財務資訊，框架包含四大核心要素：治理、策略、風險管理、指標與目標。',
    'manual_input',
    '{"topic": "TCFD", "language": "zh-TW"}'
);

-- ============================================================================
-- 完成訊息
-- ============================================================================
DO $$
DECLARE
    agent_count INTEGER;
    skill_count INTEGER;
    kb_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO agent_count FROM agents;
    SELECT COUNT(*) INTO skill_count FROM skills;
    SELECT COUNT(*) INTO kb_count FROM knowledge_bases;
    
    RAISE NOTICE '✅ Seed Data Loaded Successfully!';
    RAISE NOTICE '👤 Agents Created: %', agent_count;
    RAISE NOTICE '🛠️ Skills Registered: %', skill_count;
    RAISE NOTICE '📚 Knowledge Bases: %', kb_count;
    RAISE NOTICE '🎯 System Ready for Manifestation!';
END $$;
