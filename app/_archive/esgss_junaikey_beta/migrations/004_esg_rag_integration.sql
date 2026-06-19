-- ============================================================================
-- ESG 知識庫架構 - 全面 RAG 整合
-- ESG Knowledge Base Schema - Full RAG Integration
-- ============================================================================

-- 創建 ESG 專用知識庫
INSERT INTO knowledge_bases (name, description, embedding_model) VALUES
('esg_standards', 'ESG 標準與框架知識庫', 'text-embedding-004'),
('gri_standards', 'GRI 全球報告倡議組織標準', 'text-embedding-004'),
('tcfd_framework', 'TCFD 氣候相關財務揭露框架', 'text-embedding-004'),
('sasb_standards', 'SASB 永續會計準則委員會標準', 'text-embedding-004'),
('sdgs_goals', '聯合國永續發展目標 (SDGs)', 'text-embedding-004'),
('carbon_emission', '碳排放計算與管理', 'text-embedding-004'),
('esg_regulations', 'ESG 法規與政策', 'text-embedding-004'),
('best_practices', 'ESG 最佳實踐案例', 'text-embedding-004')
ON CONFLICT (name) DO NOTHING;

-- ============================================================================
-- ESG 核心知識注入
-- ============================================================================

DO $$
DECLARE
    kb_esg_id UUID;
    kb_gri_id UUID;
    kb_tcfd_id UUID;
    kb_sasb_id UUID;
    kb_sdgs_id UUID;
    kb_carbon_id UUID;
BEGIN
    -- 獲取知識庫 ID
    SELECT id INTO kb_esg_id FROM knowledge_bases WHERE name = 'esg_standards';
    SELECT id INTO kb_gri_id FROM knowledge_bases WHERE name = 'gri_standards';
    SELECT id INTO kb_tcfd_id FROM knowledge_bases WHERE name = 'tcfd_framework';
    SELECT id INTO kb_sasb_id FROM knowledge_bases WHERE name = 'sasb_standards';
    SELECT id INTO kb_sdgs_id FROM knowledge_bases WHERE name = 'sdgs_goals';
    SELECT id INTO kb_carbon_id FROM knowledge_bases WHERE name = 'carbon_emission';

    -- ========== ESG 基礎知識 ==========
    INSERT INTO memory_chunks (kb_id, content, source, metadata) VALUES
    (kb_esg_id, 
     'ESG 代表環境（Environmental）、社會（Social）和治理（Governance）三大面向。這是評估企業永續發展表現的重要框架，幫助投資者和利害關係人了解企業在非財務面向的表現。',
     'esg_foundation',
     '{"category": "definition", "importance": "high", "topics": ["ESG", "永續發展"]}'::jsonb),
    
    (kb_esg_id,
     '環境面向（E）包括：氣候變遷、碳排放、能源使用、水資源管理、廢棄物處理、生物多樣性保護等議題。企業需要揭露其環境影響並採取減緩措施。',
     'esg_foundation',
     '{"category": "environmental", "importance": "high", "topics": ["環境", "氣候變遷", "碳排放"]}'::jsonb),
    
    (kb_esg_id,
     '社會面向（S）包括：勞工權益、職業安全、人權保障、社區關係、產品責任、供應鏈管理等議題。企業需要確保其營運對社會產生正面影響。',
     'esg_foundation',
     '{"category": "social", "importance": "high", "topics": ["社會", "勞工權益", "人權"]}'::jsonb),
    
    (kb_esg_id,
     '治理面向（G）包括：董事會結構、股東權益、商業道德、反貪腐、風險管理、資訊透明度等議題。良好的公司治理是永續發展的基礎。',
     'esg_foundation',
     '{"category": "governance", "importance": "high", "topics": ["治理", "董事會", "商業道德"]}'::jsonb);

    -- ========== GRI 標準 ==========
    INSERT INTO memory_chunks (kb_id, content, source, metadata) VALUES
    (kb_gri_id,
     'GRI（Global Reporting Initiative）是全球最廣泛使用的永續報告框架。GRI 標準提供了一套完整的指標，幫助組織報告其經濟、環境和社會影響。',
     'gri_official',
     '{"category": "framework", "importance": "high", "topics": ["GRI", "報告框架"]}'::jsonb),
    
    (kb_gri_id,
     'GRI 通用標準包括：GRI 1（基礎）、GRI 2（一般揭露）、GRI 3（重大主題）。這些標準適用於所有組織，無論規模或產業。',
     'gri_official',
     '{"category": "universal_standards", "importance": "high", "topics": ["GRI", "通用標準"]}'::jsonb),
    
    (kb_gri_id,
     'GRI 主題標準分為三大類：經濟（GRI 200系列）、環境（GRI 300系列）、社會（GRI 400系列）。組織根據重大性分析選擇適用的主題標準。',
     'gri_official',
     '{"category": "topic_standards", "importance": "high", "topics": ["GRI", "主題標準", "重大性"]}'::jsonb);

    -- ========== TCFD 框架 ==========
    INSERT INTO memory_chunks (kb_id, content, source, metadata) VALUES
    (kb_tcfd_id,
     'TCFD（Task Force on Climate-related Financial Disclosures）建議企業揭露氣候相關財務資訊，包括四大核心要素：治理、策略、風險管理、指標與目標。',
     'tcfd_official',
     '{"category": "framework", "importance": "high", "topics": ["TCFD", "氣候揭露"]}'::jsonb),
    
    (kb_tcfd_id,
     'TCFD 治理面向要求揭露：董事會對氣候相關風險與機會的監督、管理階層在評估和管理氣候相關風險與機會中的角色。',
     'tcfd_official',
     '{"category": "governance", "importance": "high", "topics": ["TCFD", "治理", "董事會"]}'::jsonb),
    
    (kb_tcfd_id,
     'TCFD 策略面向要求揭露：組織識別的短、中、長期氣候相關風險與機會、氣候相關風險與機會對組織業務、策略和財務規劃的影響、不同氣候情境下組織策略的韌性。',
     'tcfd_official',
     '{"category": "strategy", "importance": "high", "topics": ["TCFD", "策略", "情境分析"]}'::jsonb);

    -- ========== SASB 標準 ==========
    INSERT INTO memory_chunks (kb_id, content, source, metadata) VALUES
    (kb_sasb_id,
     'SASB（Sustainability Accounting Standards Board）提供產業特定的永續會計準則，幫助企業向投資者揭露財務重大的永續資訊。',
     'sasb_official',
     '{"category": "framework", "importance": "high", "topics": ["SASB", "產業標準"]}'::jsonb),
    
    (kb_sasb_id,
     'SASB 標準涵蓋 77 個產業，分為 11 個產業類別。每個產業標準識別 3-8 個財務重大的永續議題，並提供相應的揭露指標。',
     'sasb_official',
     '{"category": "industry_standards", "importance": "high", "topics": ["SASB", "產業分類"]}'::jsonb);

    -- ========== SDGs 目標 ==========
    INSERT INTO memory_chunks (kb_id, content, source, metadata) VALUES
    (kb_sdgs_id,
     '聯合國永續發展目標（SDGs）包含 17 項目標和 169 項具體目標，旨在 2030 年前實現更永續的未來。企業可以將其營運與 SDGs 對齊。',
     'un_official',
     '{"category": "global_goals", "importance": "high", "topics": ["SDGs", "聯合國", "2030議程"]}'::jsonb),
    
    (kb_sdgs_id,
     'SDG 13（氣候行動）要求採取緊急行動應對氣候變遷及其影響。這與企業的碳減排、再生能源使用、氣候韌性建設等行動直接相關。',
     'un_official',
     '{"category": "sdg_13", "importance": "high", "topics": ["SDGs", "氣候行動", "SDG13"]}'::jsonb);

    -- ========== 碳排放知識 ==========
    INSERT INTO memory_chunks (kb_id, content, source, metadata) VALUES
    (kb_carbon_id,
     '溫室氣體盤查分為三個範疇：Scope 1（直接排放）、Scope 2（能源間接排放）、Scope 3（其他間接排放）。完整的碳盤查需要涵蓋所有三個範疇。',
     'ghg_protocol',
     '{"category": "carbon_accounting", "importance": "high", "topics": ["碳排放", "溫室氣體", "盤查"]}'::jsonb),
    
    (kb_carbon_id,
     'Scope 1 排放包括：固定燃燒源（鍋爐、熔爐）、移動燃燒源（公司車輛）、製程排放、逸散排放等企業直接控制的排放源。',
     'ghg_protocol',
     '{"category": "scope_1", "importance": "high", "topics": ["Scope 1", "直接排放"]}'::jsonb),
    
    (kb_carbon_id,
     'Scope 2 排放主要來自外購電力、熱能或蒸汽的使用。企業可以通過購買再生能源憑證（RECs）或直接採購綠電來減少 Scope 2 排放。',
     'ghg_protocol',
     '{"category": "scope_2", "importance": "high", "topics": ["Scope 2", "電力排放", "綠電"]}'::jsonb),
    
    (kb_carbon_id,
     'Scope 3 排放涵蓋價值鏈上下游的所有間接排放，包括：採購商品與服務、運輸配送、員工通勤、產品使用、廢棄物處理等 15 個類別。',
     'ghg_protocol',
     '{"category": "scope_3", "importance": "high", "topics": ["Scope 3", "價值鏈", "供應鏈"]}'::jsonb);

    RAISE NOTICE '✅ ESG 核心知識已注入到 RAG 系統';
    RAISE NOTICE '📚 知識庫數量: 8';
    RAISE NOTICE '📝 知識片段數量: %', (SELECT COUNT(*) FROM memory_chunks WHERE kb_id IN (kb_esg_id, kb_gri_id, kb_tcfd_id, kb_sasb_id, kb_sdgs_id, kb_carbon_id));
END $$;

-- ============================================================================
-- 創建 ESG RAG 查詢視圖
-- ============================================================================

CREATE OR REPLACE VIEW esg_knowledge_summary AS
SELECT 
    kb.name AS knowledge_base,
    kb.description,
    COUNT(mc.id) AS total_chunks,
    AVG(LENGTH(mc.content)) AS avg_content_length,
    kb.created_at,
    kb.updated_at
FROM knowledge_bases kb
LEFT JOIN memory_chunks mc ON kb.id = mc.kb_id
WHERE kb.name LIKE '%esg%' 
   OR kb.name IN ('gri_standards', 'tcfd_framework', 'sasb_standards', 'sdgs_goals', 'carbon_emission')
GROUP BY kb.id, kb.name, kb.description, kb.created_at, kb.updated_at
ORDER BY total_chunks DESC;

-- ============================================================================
-- ESG RAG 搜尋函數
-- ============================================================================

CREATE OR REPLACE FUNCTION search_esg_knowledge(
    search_query TEXT,
    kb_names TEXT[] DEFAULT NULL,
    top_k INTEGER DEFAULT 5
)
RETURNS TABLE (
    kb_name TEXT,
    content TEXT,
    source TEXT,
    similarity FLOAT,
    metadata JSONB
) AS $$
BEGIN
    -- 如果沒有指定知識庫，則搜尋所有 ESG 相關知識庫
    IF kb_names IS NULL THEN
        kb_names := ARRAY['esg_standards', 'gri_standards', 'tcfd_framework', 
                          'sasb_standards', 'sdgs_goals', 'carbon_emission', 
                          'esg_regulations', 'best_practices'];
    END IF;

    RETURN QUERY
    SELECT 
        kb.name::text AS kb_name,
        mc.content,
        mc.source::text,
        0.85::float AS similarity, -- 實際應使用向量相似度計算
        mc.metadata
    FROM memory_chunks mc
    JOIN knowledge_bases kb ON mc.kb_id = kb.id
    WHERE kb.name = ANY(kb_names)
      AND mc.content ILIKE '%' || search_query || '%'
    ORDER BY mc.created_at DESC
    LIMIT top_k;
END;
$$ LANGUAGE plpgsql;

-- 測試 ESG RAG 搜尋
SELECT * FROM search_esg_knowledge('碳排放', NULL, 3);

COMMENT ON FUNCTION search_esg_knowledge IS 'ESG 知識庫 RAG 搜尋函數';
