-- =====================================================
-- Phase 6.1: Game System Database Architecture
-- 遷移腳本：創建善向永續村 RPG 遊戲系統資料表
-- =====================================================
-- 創建日期：2026-02-04
-- 目標：實現 RPG 卡牌戰鬥與 AI 養成系統

-- =====================================================
-- 0. 序列：卡牌編號生成器
-- =====================================================
CREATE SEQUENCE IF NOT EXISTS card_sequence START 1;

-- =====================================================
-- 1. 卡牌主表
-- =====================================================
CREATE TABLE IF NOT EXISTS game_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  card_code TEXT UNIQUE NOT NULL,
  
  -- 基礎屬性
  name_tc TEXT NOT NULL,
  name_en TEXT NOT NULL,
  description TEXT NOT NULL,
  flavor_text TEXT,
  
  -- 卡牌分類
  card_type TEXT NOT NULL CHECK (card_type IN ('KNOWLEDGE', 'ACTION', 'VIRTUE', 'ARTIFACT')),
  rarity TEXT NOT NULL CHECK (rarity IN ('COMMON', 'RARE', 'EPIC', 'LEGENDARY', 'MYTHIC')),
  element TEXT CHECK (element IN ('E', 'S', 'G', 'TECH', 'POLICY', 'FINANCE')),
  
  -- 六德屬性 (1-10)
  virtue_intelligence INTEGER DEFAULT 0 CHECK (virtue_intelligence BETWEEN 0 AND 10),
  virtue_benevolence INTEGER DEFAULT 0 CHECK (virtue_benevolence BETWEEN 0 AND 10),
  virtue_integrity INTEGER DEFAULT 0 CHECK (virtue_integrity BETWEEN 0 AND 10),
  virtue_courage INTEGER DEFAULT 0 CHECK (virtue_courage BETWEEN 0 AND 10),
  virtue_temperance INTEGER DEFAULT 0 CHECK (virtue_temperance BETWEEN 0 AND 10),
  virtue_harmony INTEGER DEFAULT 0 CHECK (virtue_harmony BETWEEN 0 AND 10),
  
  -- 戰鬥屬性
  attack_power INTEGER DEFAULT 0,
  defense_power INTEGER DEFAULT 0,
  energy_cost INTEGER DEFAULT 1,
  
  -- 特殊能力
  abilities JSONB DEFAULT '[]'::jsonb,
  
  -- 來源追溯 (5T: Traceable)
  source_knowledge_id UUID REFERENCES user_knowledge_items(id),
  source_type TEXT,
  
  -- 5T 封印
  crystal_hash TEXT NOT NULL,
  evidence JSONB NOT NULL DEFAULT '{}'::jsonb,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 索引
CREATE INDEX IF NOT EXISTS idx_game_cards_card_type ON game_cards(card_type);
CREATE INDEX IF NOT EXISTS idx_game_cards_rarity ON game_cards(rarity);
CREATE INDEX IF NOT EXISTS idx_game_cards_element ON game_cards(element);
CREATE INDEX IF NOT EXISTS idx_game_cards_source_knowledge_id ON game_cards(source_knowledge_id);

COMMENT ON TABLE game_cards IS '遊戲卡牌主表：所有卡牌的定義與屬性';
COMMENT ON COLUMN game_cards.card_type IS 'KNOWLEDGE=知識卡, ACTION=行動卡, VIRTUE=美德卡, ARTIFACT=神器卡';
COMMENT ON COLUMN game_cards.rarity IS 'COMMON=普通, RARE=稀有, EPIC=史詩, LEGENDARY=傳說, MYTHIC=神話';

-- =====================================================
-- 2. 玩家卡牌收藏表
-- =====================================================
CREATE TABLE IF NOT EXISTS user_card_collection (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  card_id UUID NOT NULL REFERENCES game_cards(id),
  
  -- 卡牌狀態
  quantity INTEGER DEFAULT 1,
  is_favorite BOOLEAN DEFAULT false,
  
  -- 強化系統
  level INTEGER DEFAULT 1 CHECK (level BETWEEN 1 AND 100),
  experience INTEGER DEFAULT 0,
  enhancement_count INTEGER DEFAULT 0,
  
  -- 獲得方式 (5T: Traceable)
  obtained_from TEXT,
  obtained_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- 使用統計
  times_used INTEGER DEFAULT 0,
  win_rate DECIMAL(5,2) DEFAULT 0.00,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id, card_id)
);

-- 索引
CREATE INDEX IF NOT EXISTS idx_user_card_collection_user_id ON user_card_collection(user_id);
CREATE INDEX IF NOT EXISTS idx_user_card_collection_card_id ON user_card_collection(card_id);
CREATE INDEX IF NOT EXISTS idx_user_card_collection_level ON user_card_collection(level DESC);

COMMENT ON TABLE user_card_collection IS '玩家卡牌收藏：玩家擁有的所有卡牌及其狀態';

-- =====================================================
-- 3. 牌組系統表
-- =====================================================
CREATE TABLE IF NOT EXISTS user_decks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- 牌組資訊
  deck_name TEXT NOT NULL,
  description TEXT,
  
  -- 牌組類型
  deck_type TEXT CHECK (deck_type IN ('BALANCED', 'AGGRESSIVE', 'DEFENSIVE', 'CONTROL', 'COMBO')),
  primary_element TEXT,
  
  -- 牌組配置 (最多30張卡)
  cards JSONB NOT NULL DEFAULT '[]'::jsonb,
  
  -- 統計
  total_cards INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT false,
  times_used INTEGER DEFAULT 0,
  win_count INTEGER DEFAULT 0,
  loss_count INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 索引
CREATE INDEX IF NOT EXISTS idx_user_decks_user_id ON user_decks(user_id);
CREATE INDEX IF NOT EXISTS idx_user_decks_is_active ON user_decks(is_active);

COMMENT ON TABLE user_decks IS '玩家牌組：玩家構建的戰鬥牌組';

-- =====================================================
-- 4. 戰鬥記錄表
-- =====================================================
CREATE TABLE IF NOT EXISTS battle_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- 對戰雙方
  player1_id UUID NOT NULL REFERENCES auth.users(id),
  player2_id UUID REFERENCES auth.users(id),
  
  -- 牌組
  player1_deck_id UUID REFERENCES user_decks(id),
  player2_deck_id UUID REFERENCES user_decks(id),
  
  -- 戰鬥類型
  battle_type TEXT NOT NULL CHECK (battle_type IN ('PVE', 'PVP', 'RANKED', 'TUTORIAL', 'CHALLENGE')),
  difficulty TEXT CHECK (difficulty IN ('EASY', 'NORMAL', 'HARD', 'EXPERT', 'MASTER')),
  
  -- 戰鬥結果
  winner_id UUID REFERENCES auth.users(id),
  battle_duration_seconds INTEGER,
  total_rounds INTEGER,
  
  -- 戰鬥詳情 (5T: Trackable)
  battle_log JSONB NOT NULL DEFAULT '[]'::jsonb,
  
  -- 獎勵
  rewards JSONB DEFAULT '{}'::jsonb,
  
  -- 六德表現評分
  virtue_scores JSONB DEFAULT '{}'::jsonb,
  
  -- 5T 封印
  crystal_hash TEXT NOT NULL,
  evidence JSONB NOT NULL DEFAULT '{}'::jsonb,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 索引
CREATE INDEX IF NOT EXISTS idx_battle_records_player1_id ON battle_records(player1_id);
CREATE INDEX IF NOT EXISTS idx_battle_records_player2_id ON battle_records(player2_id);
CREATE INDEX IF NOT EXISTS idx_battle_records_battle_type ON battle_records(battle_type);
CREATE INDEX IF NOT EXISTS idx_battle_records_created_at ON battle_records(created_at DESC);

COMMENT ON TABLE battle_records IS '戰鬥記錄：所有戰鬥的完整記錄與5T封印';

-- =====================================================
-- 5. AI 數位分身表
-- =====================================================
CREATE TABLE IF NOT EXISTS ai_companions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- AI 基礎資訊
  ai_name TEXT NOT NULL,
  ai_type TEXT DEFAULT 'GUARDIAN' CHECK (ai_type IN ('GUARDIAN', 'SCHOLAR', 'WARRIOR', 'SAGE')),
  personality TEXT DEFAULT 'BALANCED' CHECK (personality IN ('AGGRESSIVE', 'DEFENSIVE', 'BALANCED', 'ADAPTIVE')),
  
  -- AI 等級與經驗
  level INTEGER DEFAULT 1 CHECK (level BETWEEN 1 AND 100),
  experience INTEGER DEFAULT 0,
  
  -- AI 六德屬性 (隨學習成長)
  virtue_intelligence INTEGER DEFAULT 5 CHECK (virtue_intelligence BETWEEN 1 AND 100),
  virtue_benevolence INTEGER DEFAULT 5 CHECK (virtue_benevolence BETWEEN 1 AND 100),
  virtue_integrity INTEGER DEFAULT 5 CHECK (virtue_integrity BETWEEN 1 AND 100),
  virtue_courage INTEGER DEFAULT 5 CHECK (virtue_courage BETWEEN 1 AND 100),
  virtue_temperance INTEGER DEFAULT 5 CHECK (virtue_temperance BETWEEN 1 AND 100),
  virtue_harmony INTEGER DEFAULT 5 CHECK (virtue_harmony BETWEEN 1 AND 100),
  
  -- AI 學習記錄
  training_data JSONB DEFAULT '{}'::jsonb,
  battle_strategy JSONB DEFAULT '{}'::jsonb,
  
  -- AI 牌組
  preferred_deck_id UUID REFERENCES user_decks(id),
  
  -- 統計
  total_battles INTEGER DEFAULT 0,
  win_count INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id)
);

-- 索引
CREATE INDEX IF NOT EXISTS idx_ai_companions_user_id ON ai_companions(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_companions_level ON ai_companions(level DESC);

COMMENT ON TABLE ai_companions IS 'AI數位分身：玩家的AI夥伴，可訓練與養成';

-- =====================================================
-- 6. 觸發器：自動更新時間戳
-- =====================================================
CREATE TRIGGER update_game_cards_updated_at
  BEFORE UPDATE ON game_cards
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_card_collection_updated_at
  BEFORE UPDATE ON user_card_collection
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_decks_updated_at
  BEFORE UPDATE ON user_decks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ai_companions_updated_at
  BEFORE UPDATE ON ai_companions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 7. 觸發器：知識轉化為卡牌
-- =====================================================
CREATE OR REPLACE FUNCTION generate_card_from_knowledge()
RETURNS TRIGGER AS $$
DECLARE
  new_card_id UUID;
  card_rarity TEXT;
  attack_power INTEGER;
  defense_power INTEGER;
  card_code_text TEXT;
BEGIN
  -- 只有當學習進度達到100%時才生成卡牌
  IF NEW.learning_progress = 100 AND NEW.is_read = true AND OLD.learning_progress < 100 THEN
    
    -- 計算稀有度
    card_rarity := CASE
      WHEN NEW.word_count >= 5000 THEN 'LEGENDARY'
      WHEN NEW.word_count >= 3000 THEN 'EPIC'
      WHEN NEW.word_count >= 1500 THEN 'RARE'
      ELSE 'COMMON'
    END;
    
    -- 計算攻擊力與防禦力
    attack_power := FLOOR(NEW.word_count / 100.0) + FLOOR(RANDOM() * 5);
    defense_power := FLOOR(NEW.word_count / 150.0) + FLOOR(RANDOM() * 5);
    
    -- 生成卡牌編號
    card_code_text := 'ESG-' || COALESCE(NEW.category, 'OTHER') || '-' || LPAD(NEXTVAL('card_sequence')::TEXT, 4, '0');
    
    -- 創建卡牌
    INSERT INTO game_cards (
      card_code,
      name_tc,
      name_en,
      description,
      card_type,
      rarity,
      element,
      attack_power,
      defense_power,
      source_knowledge_id,
      source_type,
      crystal_hash,
      evidence
    ) VALUES (
      card_code_text,
      NEW.title,
      NEW.title,
      SUBSTRING(COALESCE(NEW.summary, NEW.title), 1, 200),
      'KNOWLEDGE',
      card_rarity,
      NEW.category,
      attack_power,
      defense_power,
      NEW.id,
      'LEARNING',
      NEW.crystal_hash,
      NEW.evidence
    ) RETURNING id INTO new_card_id;
    
    -- 自動加入玩家收藏
    INSERT INTO user_card_collection (user_id, card_id, obtained_from)
    VALUES (NEW.user_id, new_card_id, 'LEARNING');
    
    RAISE NOTICE '✨ 恭喜！您獲得了新卡牌：% (稀有度: %)', NEW.title, card_rarity;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_generate_card_on_learning_complete
  AFTER UPDATE OF learning_progress ON user_knowledge_items
  FOR EACH ROW EXECUTE FUNCTION generate_card_from_knowledge();

-- =====================================================
-- 8. RLS 安全策略
-- =====================================================
ALTER TABLE game_cards ENABLE ROW LEVEL SECURITY;
CREATE POLICY game_cards_select_policy ON game_cards FOR SELECT USING (true); -- 所有人可查看卡牌

ALTER TABLE user_card_collection ENABLE ROW LEVEL SECURITY;
CREATE POLICY user_card_collection_select_policy ON user_card_collection FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY user_card_collection_insert_policy ON user_card_collection FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY user_card_collection_update_policy ON user_card_collection FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY user_card_collection_delete_policy ON user_card_collection FOR DELETE USING (auth.uid() = user_id);

ALTER TABLE user_decks ENABLE ROW LEVEL SECURITY;
CREATE POLICY user_decks_select_policy ON user_decks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY user_decks_insert_policy ON user_decks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY user_decks_update_policy ON user_decks FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY user_decks_delete_policy ON user_decks FOR DELETE USING (auth.uid() = user_id);

ALTER TABLE battle_records ENABLE ROW LEVEL SECURITY;
CREATE POLICY battle_records_select_policy ON battle_records 
  FOR SELECT USING (auth.uid() = player1_id OR auth.uid() = player2_id);
CREATE POLICY battle_records_insert_policy ON battle_records 
  FOR INSERT WITH CHECK (auth.uid() = player1_id);

ALTER TABLE ai_companions ENABLE ROW LEVEL SECURITY;
CREATE POLICY ai_companions_select_policy ON ai_companions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY ai_companions_insert_policy ON ai_companions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY ai_companions_update_policy ON ai_companions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY ai_companions_delete_policy ON ai_companions FOR DELETE USING (auth.uid() = user_id);
