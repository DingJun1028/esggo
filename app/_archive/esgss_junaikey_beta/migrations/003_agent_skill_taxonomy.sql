-- ============================================================================
-- Agent Skill Taxonomy - Extended Skills Based on Skill Tree Concept
-- 代理技能奧義樹資料庫擴充
-- ============================================================================

-- 清空現有技能（開發環境）
-- TRUNCATE TABLE agent_skills CASCADE;
-- TRUNCATE TABLE skills CASCADE;

-- ============================================================================
-- 第一層：感知層 (Perception Layer)
-- ============================================================================

INSERT INTO skills (name, description, category, requires_hitl, parameters_schema) VALUES
-- 多模態感知
('vision_analyze',
 '視覺感知：分析圖片內容，提取物體、場景、文字等資訊',
 'perception_vision',
 false,
 '{"type": "object", "properties": {"image_url": {"type": "string"}, "analysis_type": {"type": "string", "enum": ["general", "ocr", "object_detection", "scene_understanding"]}}}'
),

('audio_transcribe',
 '語音轉文字：使用 Whisper 將音訊轉換為文字',
 'perception_audio',
 false,
 '{"type": "object", "properties": {"audio_url": {"type": "string"}, "language": {"type": "string", "default": "zh"}}}'
),

('sentiment_analyze',
 '情感分析：分析文本或語音的情感傾向（正面/負面/中性）',
 'perception_emotion',
 false,
 '{"type": "object", "properties": {"text": {"type": "string"}, "granularity": {"type": "string", "enum": ["sentence", "document"]}}}'
),

-- ============================================================================
-- 第二層：記憶與上下文層 (Memory & Context Layer)
-- ============================================================================

('memory_store',
 '記憶儲存：將重要資訊儲存到長期記憶（向量資料庫）',
 'memory_longterm',
 false,
 '{"type": "object", "properties": {"content": {"type": "string"}, "kb_id": {"type": "string"}, "metadata": {"type": "object"}}}'
),

('memory_recall',
 '記憶檢索：從長期記憶中檢索相關資訊（RAG）',
 'memory_longterm',
 false,
 '{"type": "object", "properties": {"query": {"type": "string"}, "kb_id": {"type": "string"}, "top_k": {"type": "integer", "default": 5}}}'
),

('context_summarize',
 '上下文摘要：總結長對話或文檔的核心要點',
 'memory_context',
 false,
 '{"type": "object", "properties": {"text": {"type": "string"}, "max_length": {"type": "integer", "default": 500}}}'
),

-- ============================================================================
-- 第三層：推理與規劃層 (Reasoning & Planning Layer)
-- ============================================================================

('task_decompose',
 '任務分解：將複雜任務拆解為可執行的子任務（Chain-of-Thought）',
 'reasoning_planning',
 false,
 '{"type": "object", "properties": {"task_description": {"type": "string"}, "max_subtasks": {"type": "integer", "default": 10}}}'
),

('logic_reasoning',
 '邏輯推理：進行因果推論、演繹推理或歸納推理',
 'reasoning_logic',
 false,
 '{"type": "object", "properties": {"premises": {"type": "array"}, "reasoning_type": {"type": "string", "enum": ["deductive", "inductive", "abductive"]}}}'
),

('decision_making',
 '決策制定：基於多個選項和標準做出最優決策',
 'reasoning_decision',
 false,
 '{"type": "object", "properties": {"options": {"type": "array"}, "criteria": {"type": "array"}, "weights": {"type": "object"}}}'
),

('self_reflection',
 '自我反思：檢查執行結果，發現錯誤並提出改進建議',
 'reasoning_meta',
 false,
 '{"type": "object", "properties": {"action_history": {"type": "array"}, "goal": {"type": "string"}}}'
),

-- ============================================================================
-- 第四層：行動與執行層 (Action & Execution Layer)
-- ============================================================================

-- 工具使用
('web_search',
 '網路搜尋：在網路上搜尋最新資訊',
 'action_tool',
 false,
 '{"type": "object", "properties": {"query": {"type": "string"}, "max_results": {"type": "integer", "default": 5}, "search_engine": {"type": "string", "enum": ["google", "bing"], "default": "google"}}}'
),

('web_scrape',
 '網頁抓取：提取網頁內容和結構化資料',
 'action_tool',
 false,
 '{"type": "object", "properties": {"url": {"type": "string"}, "selectors": {"type": "array"}}}'
),

('api_call',
 'API 呼叫：呼叫外部 REST API',
 'action_tool',
 true,
 '{"type": "object", "properties": {"endpoint": {"type": "string"}, "method": {"type": "string", "enum": ["GET", "POST", "PUT", "DELETE"]}, "headers": {"type": "object"}, "body": {"type": "object"}}}'
),

('code_execute',
 '代碼執行：執行 Python 代碼片段（沙箱環境）',
 'action_code',
 true,
 '{"type": "object", "properties": {"code": {"type": "string"}, "language": {"type": "string", "default": "python"}, "timeout": {"type": "integer", "default": 30}}}'
),

('database_query',
 '資料庫查詢：執行 SQL 查詢（唯讀）',
 'action_data',
 true,
 '{"type": "object", "properties": {"query": {"type": "string"}, "database": {"type": "string"}}}'
),

-- 內容生成
('text_generate',
 '文本生成：生成文章、報告、郵件等文本內容',
 'action_generate',
 false,
 '{"type": "object", "properties": {"prompt": {"type": "string"}, "style": {"type": "string"}, "length": {"type": "integer"}}}'
),

('image_generate',
 '圖片生成：根據描述生成圖片（DALL-E / Stable Diffusion）',
 'action_generate',
 true,
 '{"type": "object", "properties": {"prompt": {"type": "string"}, "size": {"type": "string", "enum": ["256x256", "512x512", "1024x1024"]}, "style": {"type": "string"}}}'
),

('report_generate',
 '報告生成：生成結構化的 ESG 報告、分析報告',
 'action_generate',
 true,
 '{"type": "object", "properties": {"report_type": {"type": "string"}, "data": {"type": "object"}, "template": {"type": "string"}, "format": {"type": "string", "enum": ["pdf", "docx", "html"]}}}'
),

('chart_generate',
 '圖表生成：根據數據生成視覺化圖表',
 'action_generate',
 false,
 '{"type": "object", "properties": {"data": {"type": "array"}, "chart_type": {"type": "string", "enum": ["line", "bar", "pie", "scatter"]}, "options": {"type": "object"}}}'
),

-- ============================================================================
-- 第五層：通訊與協作層 (Communication & Collaboration Layer)
-- ============================================================================

('email_send',
 '發送郵件：發送電子郵件通知',
 'communication_email',
 true,
 '{"type": "object", "properties": {"to": {"type": "string"}, "subject": {"type": "string"}, "body": {"type": "string"}, "attachments": {"type": "array"}}}'
),

('notification_create',
 '創建通知：在系統內創建通知消息',
 'communication_notification',
 false,
 '{"type": "object", "properties": {"user_id": {"type": "string"}, "message": {"type": "string"}, "priority": {"type": "string", "enum": ["low", "medium", "high"]}}}'
),

('webhook_trigger',
 '觸發 Webhook：向外部系統發送 Webhook 通知',
 'communication_webhook',
 true,
 '{"type": "object", "properties": {"url": {"type": "string"}, "payload": {"type": "object"}, "method": {"type": "string", "default": "POST"}}}'
),

('agent_delegate',
 '代理委派：將子任務委派給其他專門的 AI 代理',
 'collaboration_multiagent',
 false,
 '{"type": "object", "properties": {"target_agent": {"type": "string"}, "task": {"type": "string"}, "context": {"type": "object"}}}'
),

-- ============================================================================
-- 第六層：安全性與對齊層 (Safety & Alignment Layer)
-- ============================================================================

('content_filter',
 '內容過濾：檢測並過濾不當內容（暴力、色情、仇恨言論）',
 'safety_filter',
 false,
 '{"type": "object", "properties": {"text": {"type": "string"}, "threshold": {"type": "number", "default": 0.8}}}'
),

('risk_assess',
 '風險評估：評估操作的潛在風險等級',
 'safety_risk',
 false,
 '{"type": "object", "properties": {"action": {"type": "string"}, "context": {"type": "object"}}}'
),

('compliance_check',
 '合規檢查：檢查操作是否符合法規和政策',
 'safety_compliance',
 true,
 '{"type": "object", "properties": {"action": {"type": "string"}, "regulations": {"type": "array"}}}'
),

-- ============================================================================
-- 第七層：學習與進化層 (Learning & Evolution Layer)
-- ============================================================================

('skill_propose',
 '技能提案：AI 自主提出新技能或改進現有技能',
 'learning_evolution',
 true,
 '{"type": "object", "properties": {"skill_name": {"type": "string"}, "description": {"type": "string"}, "justification": {"type": "string"}, "implementation": {"type": "string"}}}'
),

('feedback_learn',
 '反饋學習：從用戶反饋中學習並調整行為',
 'learning_meta',
 false,
 '{"type": "object", "properties": {"feedback": {"type": "string"}, "context": {"type": "object"}}}'
),

('performance_analyze',
 '性能分析：分析自身執行效率並提出優化建議',
 'learning_optimization',
 false,
 '{"type": "object", "properties": {"task_history": {"type": "array"}, "metrics": {"type": "array"}}}'
);

-- ============================================================================
-- 技能分類統計
-- ============================================================================
DO $$
DECLARE
    total_skills INTEGER;
    perception_count INTEGER;
    reasoning_count INTEGER;
    action_count INTEGER;
    communication_count INTEGER;
    safety_count INTEGER;
    learning_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO total_skills FROM skills;
    SELECT COUNT(*) INTO perception_count FROM skills WHERE category LIKE 'perception%';
    SELECT COUNT(*) INTO reasoning_count FROM skills WHERE category LIKE 'reasoning%';
    SELECT COUNT(*) INTO action_count FROM skills WHERE category LIKE 'action%';
    SELECT COUNT(*) INTO communication_count FROM skills WHERE category LIKE 'communication%' OR category LIKE 'collaboration%';
    SELECT COUNT(*) INTO safety_count FROM skills WHERE category LIKE 'safety%';
    SELECT COUNT(*) INTO learning_count FROM skills WHERE category LIKE 'learning%';
    
    RAISE NOTICE '✅ Agent Skill Taxonomy Loaded!';
    RAISE NOTICE '📊 Total Skills: %', total_skills;
    RAISE NOTICE '👁️ Perception Layer: %', perception_count;
    RAISE NOTICE '🧠 Reasoning Layer: %', reasoning_count;
    RAISE NOTICE '⚡ Action Layer: %', action_count;
    RAISE NOTICE '🤝 Communication Layer: %', communication_count;
    RAISE NOTICE '🛡️ Safety Layer: %', safety_count;
    RAISE NOTICE '📚 Learning Layer: %', learning_count;
END $$;
