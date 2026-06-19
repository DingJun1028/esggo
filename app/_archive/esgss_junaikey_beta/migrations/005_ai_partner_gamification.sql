-- ============================================================================
-- 永續夥伴遊戲化系統 - 資料庫架構
-- AI Partner Gamification System - Database Schema
-- ============================================================================

-- 創建枚舉類型
CREATE TYPE skill_type AS ENUM ('active', 'passive');
CREATE TYPE rarity AS ENUM ('common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic');
CREATE TYPE card_type AS ENUM ('skill', 'ability', 'equipment', 'item', 'artifact', 'esg');
CREATE TYPE equipment_slot AS ENUM ('weapon', 'armor', 'accessory_1', 'accessory_2', 'artifact');
CREATE TYPE quest_type AS ENUM ('daily', 'weekly', 'epic', 'legendary', 'story');
CREATE TYPE ultimate_tier AS ENUM ('epic', 'legendary');

-- ============================================================================
-- AI 夥伴主表
-- ============================================================================

CREATE TABLE ai_partners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    name VARCHAR(100) NOT NULL,
    
    -- 等級系統
    level INTEGER DEFAULT 1 CHECK (level >= 1 AND level <= 100),
    experience BIGINT DEFAULT 0,
    experience_to_next INTEGER DEFAULT 100,
    
    -- 核心屬性 (1-100)
    intelligence INTEGER DEFAULT 10 CHECK (intelligence >= 1 AND intelligence <= 100),
    wisdom INTEGER DEFAULT 10 CHECK (wisdom >= 1 AND wisdom <= 100),
    creativity INTEGER DEFAULT 10 CHECK (creativity >= 1 AND creativity <= 100),
    precision INTEGER DEFAULT 10 CHECK (precision >= 1 AND precision <= 100),
    empathy INTEGER DEFAULT 10 CHECK (empathy >= 1 AND empathy <= 100),
    efficiency INTEGER DEFAULT 10 CHECK (efficiency >= 1 AND efficiency <= 100),
    
    -- 次要屬性 (1-100)
    luck INTEGER DEFAULT 10 CHECK (luck >= 1 AND luck <= 100),
    charisma INTEGER DEFAULT 10 CHECK (charisma >= 1 AND charisma <= 100),
    
    -- 成長參數
    total_skills_used INTEGER DEFAULT 0,
    quests_completed INTEGER DEFAULT 0,
    cards_collected INTEGER DEFAULT 0,
    epic_abilities_unlocked INTEGER DEFAULT 0,
    legendary_abilities_unlocked INTEGER DEFAULT 0,
    total_play_time INTEGER DEFAULT 0,
    
    -- 天賦點數
    talent_points_available INTEGER DEFAULT 0,
    talent_points_total INTEGER DEFAULT 0,
    talent_points_spent INTEGER DEFAULT 0,
    
    -- 時間戳
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    last_active_at TIMESTAMP DEFAULT NOW(),
    
    CONSTRAINT unique_partner_per_user UNIQUE (user_id)
);

-- 索引
CREATE INDEX idx_ai_partners_user_id ON ai_partners(user_id);
CREATE INDEX idx_ai_partners_level ON ai_partners(level);

-- ============================================================================
-- 技能表
-- ============================================================================

CREATE TABLE partner_skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    partner_id UUID NOT NULL REFERENCES ai_partners(id) ON DELETE CASCADE,
    skill_id VARCHAR(100) NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    type skill_type NOT NULL,
    rarity rarity NOT NULL,
    
    -- 等級
    level INTEGER DEFAULT 1 CHECK (level >= 1 AND level <= 10),
    experience INTEGER DEFAULT 0,
    experience_to_next INTEGER DEFAULT 100,
    
    -- 詞條 (JSON 陣列)
    affixes JSONB DEFAULT '[]'::jsonb,
    
    -- 效果 (JSON 陣列)
    effects JSONB DEFAULT '[]'::jsonb,
    
    -- 需求
    requirements JSONB DEFAULT '{}'::jsonb,
    
    -- 使用統計
    usage_count INTEGER DEFAULT 0,
    last_used_at TIMESTAMP,
    
    -- 解鎖時間
    unlocked_at TIMESTAMP DEFAULT NOW(),
    
    CONSTRAINT unique_skill_per_partner UNIQUE (partner_id, skill_id)
);

-- 索引
CREATE INDEX idx_partner_skills_partner_id ON partner_skills(partner_id);
CREATE INDEX idx_partner_skills_type ON partner_skills(type);
CREATE INDEX idx_partner_skills_rarity ON partner_skills(rarity);

-- ============================================================================
-- 天賦節點表
-- ============================================================================

CREATE TABLE partner_talents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    partner_id UUID NOT NULL REFERENCES ai_partners(id) ON DELETE CASCADE,
    talent_id VARCHAR(100) NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    constellation VARCHAR(50) NOT NULL CHECK (constellation IN ('knowledge', 'action', 'harmony')),
    tier INTEGER CHECK (tier >= 1 AND tier <= 5),
    
    -- 位置
    position_x FLOAT NOT NULL,
    position_y FLOAT NOT NULL,
    
    -- 需求
    requires JSONB DEFAULT '[]'::jsonb,
    cost INTEGER NOT NULL,
    
    -- 效果
    bonuses JSONB DEFAULT '[]'::jsonb,
    unlocked_skills JSONB DEFAULT '[]'::jsonb,
    
    -- 狀態
    unlocked BOOLEAN DEFAULT FALSE,
    unlocked_at TIMESTAMP,
    
    CONSTRAINT unique_talent_per_partner UNIQUE (partner_id, talent_id)
);

-- 索引
CREATE INDEX idx_partner_talents_partner_id ON partner_talents(partner_id);
CREATE INDEX idx_partner_talents_constellation ON partner_talents(constellation);
CREATE INDEX idx_partner_talents_unlocked ON partner_talents(unlocked);

-- ============================================================================
-- 奧義表
-- ============================================================================

CREATE TABLE partner_ultimates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    partner_id UUID NOT NULL REFERENCES ai_partners(id) ON DELETE CASCADE,
    ultimate_id VARCHAR(100) NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    tier ultimate_tier NOT NULL,
    
    -- 解鎖條件
    unlock_conditions JSONB DEFAULT '{}'::jsonb,
    
    -- 效果
    effects JSONB DEFAULT '[]'::jsonb,
    
    -- 冷卻
    cooldown INTEGER NOT NULL,
    last_used_at TIMESTAMP,
    
    -- 狀態
    unlocked BOOLEAN DEFAULT FALSE,
    unlocked_at TIMESTAMP,
    usage_count INTEGER DEFAULT 0,
    
    CONSTRAINT unique_ultimate_per_partner UNIQUE (partner_id, ultimate_id)
);

-- 索引
CREATE INDEX idx_partner_ultimates_partner_id ON partner_ultimates(partner_id);
CREATE INDEX idx_partner_ultimates_tier ON partner_ultimates(tier);
CREATE INDEX idx_partner_ultimates_unlocked ON partner_ultimates(unlocked);

-- ============================================================================
-- 卡牌收藏表
-- ============================================================================

CREATE TABLE card_collection (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    partner_id UUID NOT NULL REFERENCES ai_partners(id) ON DELETE CASCADE,
    card_id VARCHAR(100) NOT NULL,
    name VARCHAR(100) NOT NULL,
    type card_type NOT NULL,
    rarity rarity NOT NULL,
    
    -- 卡面資訊
    artwork VARCHAR(500),
    description TEXT,
    flavor_text TEXT,
    
    -- 效果
    effects JSONB DEFAULT '[]'::jsonb,
    
    -- 稀有度統計
    serial_number INTEGER,
    total_printed INTEGER,
    
    -- 收藏資訊
    collected_at TIMESTAMP DEFAULT NOW(),
    is_equipped BOOLEAN DEFAULT FALSE,
    
    -- ESG 特定欄位 (僅 ESG 卡使用)
    esg_category VARCHAR(50),
    framework VARCHAR(50),
    bonuses JSONB,
    
    CONSTRAINT unique_card_per_partner UNIQUE (partner_id, card_id)
);

-- 索引
CREATE INDEX idx_card_collection_partner_id ON card_collection(partner_id);
CREATE INDEX idx_card_collection_type ON card_collection(type);
CREATE INDEX idx_card_collection_rarity ON card_collection(rarity);
CREATE INDEX idx_card_collection_equipped ON card_collection(is_equipped);

-- ============================================================================
-- 卡牌套組表
-- ============================================================================

CREATE TABLE card_sets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    set_id VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    
    -- 套組卡牌
    cards JSONB NOT NULL,
    
    -- 套組獎勵
    set_bonus JSONB NOT NULL,
    
    created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- 裝備表
-- ============================================================================

CREATE TABLE partner_equipment (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    partner_id UUID NOT NULL REFERENCES ai_partners(id) ON DELETE CASCADE,
    equipment_id VARCHAR(100) NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    slot equipment_slot NOT NULL,
    rarity rarity NOT NULL,
    
    -- 等級
    level INTEGER DEFAULT 1,
    max_level INTEGER DEFAULT 10,
    
    -- 屬性加成
    stats JSONB DEFAULT '[]'::jsonb,
    
    -- 特殊效果
    special_effects JSONB DEFAULT '[]'::jsonb,
    
    -- 升級材料
    upgrade_materials JSONB,
    
    -- 狀態
    equipped BOOLEAN DEFAULT FALSE,
    equipped_at TIMESTAMP,
    obtained_at TIMESTAMP DEFAULT NOW(),
    
    CONSTRAINT unique_equipment_per_partner UNIQUE (partner_id, equipment_id),
    CONSTRAINT unique_slot_per_partner UNIQUE (partner_id, slot) WHERE equipped = TRUE
);

-- 索引
CREATE INDEX idx_partner_equipment_partner_id ON partner_equipment(partner_id);
CREATE INDEX idx_partner_equipment_slot ON partner_equipment(slot);
CREATE INDEX idx_partner_equipment_equipped ON partner_equipment(equipped);

-- ============================================================================
-- 任務進度表
-- ============================================================================

CREATE TABLE quest_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    partner_id UUID NOT NULL REFERENCES ai_partners(id) ON DELETE CASCADE,
    quest_id VARCHAR(100) NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    type quest_type NOT NULL,
    
    -- 目標
    objectives JSONB NOT NULL,
    
    -- 獎勵
    rewards JSONB NOT NULL,
    
    -- 進度
    progress INTEGER DEFAULT 0,
    completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP,
    
    -- 時間限制
    expires_at TIMESTAMP,
    
    created_at TIMESTAMP DEFAULT NOW(),
    
    CONSTRAINT unique_quest_per_partner UNIQUE (partner_id, quest_id)
);

-- 索引
CREATE INDEX idx_quest_progress_partner_id ON quest_progress(partner_id);
CREATE INDEX idx_quest_progress_type ON quest_progress(type);
CREATE INDEX idx_quest_progress_completed ON quest_progress(completed);

-- ============================================================================
-- 經驗值獲得記錄表
-- ============================================================================

CREATE TABLE experience_gains (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    partner_id UUID NOT NULL REFERENCES ai_partners(id) ON DELETE CASCADE,
    amount INTEGER NOT NULL,
    source VARCHAR(100) NOT NULL,
    details JSONB,
    gained_at TIMESTAMP DEFAULT NOW()
);

-- 索引
CREATE INDEX idx_experience_gains_partner_id ON experience_gains(partner_id);
CREATE INDEX idx_experience_gains_gained_at ON experience_gains(gained_at);

-- ============================================================================
-- 觸發器：自動更新 updated_at
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_ai_partners_updated_at
    BEFORE UPDATE ON ai_partners
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 視圖：夥伴統計
-- ============================================================================

CREATE OR REPLACE VIEW partner_statistics AS
SELECT 
    p.id,
    p.name,
    p.level,
    p.experience,
    
    -- 技能統計
    COUNT(DISTINCT ps.id) AS total_skills,
    COUNT(DISTINCT ps.id) FILTER (WHERE ps.type = 'active') AS active_skills,
    COUNT(DISTINCT ps.id) FILTER (WHERE ps.type = 'passive') AS passive_skills,
    
    -- 卡牌統計
    COUNT(DISTINCT cc.id) AS total_cards,
    COUNT(DISTINCT cc.id) FILTER (WHERE cc.is_equipped = TRUE) AS equipped_cards,
    
    -- 裝備統計
    COUNT(DISTINCT pe.id) AS total_equipment,
    COUNT(DISTINCT pe.id) FILTER (WHERE pe.equipped = TRUE) AS equipped_items,
    
    -- 任務統計
    p.quests_completed,
    COUNT(DISTINCT qp.id) FILTER (WHERE qp.completed = FALSE) AS active_quests,
    
    -- 天賦統計
    COUNT(DISTINCT pt.id) FILTER (WHERE pt.unlocked = TRUE) AS unlocked_talents,
    p.talent_points_available,
    
    -- 奧義統計
    p.epic_abilities_unlocked,
    p.legendary_abilities_unlocked
    
FROM ai_partners p
LEFT JOIN partner_skills ps ON p.id = ps.partner_id
LEFT JOIN card_collection cc ON p.id = cc.partner_id
LEFT JOIN partner_equipment pe ON p.id = pe.partner_id
LEFT JOIN quest_progress qp ON p.id = qp.partner_id
LEFT JOIN partner_talents pt ON p.id = pt.partner_id
GROUP BY p.id;

-- ============================================================================
-- 註解
-- ============================================================================

COMMENT ON TABLE ai_partners IS 'AI 夥伴主表 - 儲存夥伴基本資訊和屬性';
COMMENT ON TABLE partner_skills IS '夥伴技能表 - 儲存已解鎖的技能';
COMMENT ON TABLE partner_talents IS '夥伴天賦表 - 儲存星盤天賦節點';
COMMENT ON TABLE partner_ultimates IS '夥伴奧義表 - 儲存史詩和傳說奧義';
COMMENT ON TABLE card_collection IS '卡牌收藏表 - 儲存收集的奧秘卡牌';
COMMENT ON TABLE partner_equipment IS '夥伴裝備表 - 儲存裝備和道具';
COMMENT ON TABLE quest_progress IS '任務進度表 - 追蹤任務完成狀態';
COMMENT ON TABLE experience_gains IS '經驗值記錄表 - 記錄所有經驗值獲得';
