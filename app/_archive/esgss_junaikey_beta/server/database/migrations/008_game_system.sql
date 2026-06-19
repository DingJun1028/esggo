-- ===============================================
-- 善向永續村 (Sustainability Village) Game System
-- Database Schema
-- ===============================================

-- ======================
-- 1. Player Profiles (玩家資料)
-- ======================
CREATE TABLE IF NOT EXISTS game_players (
  -- Primary Key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- User Reference
  user_id UUID NOT NULL UNIQUE,
  
  -- Player Identity
  player_name VARCHAR(100) NOT NULL,
  level INTEGER DEFAULT 1 CHECK (level >= 1 AND level <= 99),
  xp INTEGER DEFAULT 0 CHECK (xp >= 0),
  
  -- Personality Profile (4 Dimensions)
  environmental_affinity INTEGER DEFAULT 50 CHECK (environmental_affinity >= 0 AND environmental_affinity <= 100),
  social_affinity INTEGER DEFAULT 50 CHECK (social_affinity >= 0 AND social_affinity <= 100),
  governance_affinity INTEGER DEFAULT 50 CHECK (governance_affinity >= 0 AND governance_affinity <= 100),
  innovation_affinity INTEGER DEFAULT 50 CHECK (innovation_affinity >= 0 AND innovation_affinity <= 100),
  
  -- Battle Stats
  total_battles INTEGER DEFAULT 0,
  wins INTEGER DEFAULT 0,
  losses INTEGER DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  max_streak INTEGER DEFAULT 0,
  
  -- Learning Progress
  learned_strategies JSONB DEFAULT '[]', -- string[]
  completed_journeys JSONB DEFAULT '[]', -- string[]
  skill_passport JSONB DEFAULT '{}', -- { skills: string[], certifications: Certificate[] }
  
  -- Village Status
  village_entropy DECIMAL(5,2) DEFAULT 50.00 CHECK (village_entropy >= 0 AND village_entropy <= 100),
  last_entropy_update TIMESTAMP DEFAULT NOW(),
  
  -- Boost.Space Sync
  boost_space_id VARCHAR(255), -- External CRM ID
  boost_space_last_sync TIMESTAMP,
  boost_space_sync_status VARCHAR(50) DEFAULT 'pending', -- pending | synced | error
  
  -- Timestamps
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  last_login TIMESTAMP DEFAULT NOW()
);

-- ======================
-- 2. Card Collections (卡牌收藏)
-- ======================
CREATE TABLE IF NOT EXISTS game_card_collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID NOT NULL REFERENCES game_players(id) ON DELETE CASCADE,
  
  -- Card Info
  card_id VARCHAR(50) NOT NULL, -- e.g., "esg-001"
  card_name VARCHAR(100) NOT NULL,
  card_type VARCHAR(50) NOT NULL, -- strategy | response | event | special
  card_category VARCHAR(50), -- environmental | social | governance | innovation
  rarity VARCHAR(50) NOT NULL, -- legendary | epic | rare | uncommon | common
  
  -- Card Stats
  power INTEGER DEFAULT 0,
  cost INTEGER DEFAULT 0,
  
  -- Collection Metadata
  acquired_at TIMESTAMP DEFAULT NOW(),
  acquisition_source VARCHAR(50), -- journey | battle | achievement | purchase
  times_used INTEGER DEFAULT 0,
  
  -- ISO Reference
  iso_reference VARCHAR(100), -- e.g., "ISO-14064-1"
  
  -- Boost.Space Sync
  boost_space_asset_id VARCHAR(255),
  
  UNIQUE(player_id, card_id)
);

-- ======================
-- 3. Battle History (戰鬥記錄)
-- ======================
CREATE TABLE IF NOT EXISTS game_battle_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID NOT NULL REFERENCES game_players(id) ON DELETE CASCADE,
  
  -- Battle Info
  battle_type VARCHAR(50) NOT NULL, -- tutorial | arena | boss | pvp
  enemy_name VARCHAR(100),
  enemy_type VARCHAR(50), -- greenwasher | polluter | corrupt | misinformer
  difficulty VARCHAR(50), -- easy | normal | hard | legendary
  
  -- Battle Result
  result VARCHAR(20) NOT NULL CHECK (result IN ('win', 'loss', 'draw')),
  player_hp_remaining INTEGER,
  damage_dealt INTEGER,
  damage_taken INTEGER,
  
  -- Moves Used
  moves_log JSONB DEFAULT '[]', -- BattleMove[]
  cards_used JSONB DEFAULT '[]', -- string[] (card_ids)
  
  -- Rewards
  xp_earned INTEGER DEFAULT 0,
  cards_earned JSONB DEFAULT '[]', -- string[]
  achievements_unlocked JSONB DEFAULT '[]', -- string[]
  
  -- Timestamps
  battle_started_at TIMESTAMP DEFAULT NOW(),
  battle_ended_at TIMESTAMP,
  duration_seconds INTEGER,
  
  -- Boost.Space Sync
  boost_space_activity_id VARCHAR(255)
);

-- ======================
-- 4. Digital Twin Evolution (AI 數位分身)
-- ======================
CREATE TABLE IF NOT EXISTS game_digital_twin (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID NOT NULL UNIQUE REFERENCES game_players(id) ON DELETE CASCADE,
  
  -- Twin Identity
  twin_name VARCHAR(100),
  avatar_url TEXT,
  
  -- Evolution Stage
  evolution_stage VARCHAR(50) DEFAULT 'seedling', -- seedling | sprout | sapling | tree | ancient
  
  -- Personality Matrix (Learned from player behavior)
  decision_patterns JSONB DEFAULT '{}', -- { environmental: [], social: [], governance: [] }
  preferred_strategies JSONB DEFAULT '[]', -- string[]
  risk_tolerance VARCHAR(50) DEFAULT 'balanced', -- cautious | balanced | aggressive
  
  -- Skills & Certifications
  skill_tree JSONB DEFAULT '{}', -- { environmental: {}, social: {}, governance: {} }
  certifications JSONB DEFAULT '[]', -- Certificate[]
  
  -- Blockchain Anchoring (Trustworthy - 不可篡改)
  blockchain_hash VARCHAR(64),
  blockchain_timestamp TIMESTAMP,
  
  -- Boost.Space Sync
  boost_space_profile_id VARCHAR(255),
  
  -- Timestamps
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ======================
-- 5. Achievement & Badges (成就徽章組)
-- ======================
CREATE TABLE IF NOT EXISTS game_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID NOT NULL REFERENCES game_players(id) ON DELETE CASCADE,
  
  -- Achievement Info
  achievement_id VARCHAR(50) NOT NULL,
  achievement_name VARCHAR(100) NOT NULL,
  achievement_tier VARCHAR(50), -- bronze | silver | gold | platinum
  
  -- Unlock Criteria
  unlock_criteria JSONB, -- { type: string, threshold: number }
  
  -- Status
  is_unlocked BOOLEAN DEFAULT false,
  unlocked_at TIMESTAMP,
  progress INTEGER DEFAULT 0, -- 0-100
  
  -- Display
  icon_url TEXT,
  description TEXT,
  
  -- Boost.Space Sync
  boost_space_badge_id VARCHAR(255),
  
  UNIQUE(player_id, achievement_id)
);

-- ======================
-- 6. Journey Progress (客戶旅程進度)
-- ======================
CREATE TABLE IF NOT EXISTS game_journey_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID NOT NULL REFERENCES game_players(id) ON DELETE CASCADE,
  
  -- Journey Info
  journey_id VARCHAR(50) NOT NULL, -- sme_boss | esg_officer | cfo
  stage_id VARCHAR(50) NOT NULL, -- discovery | onboarding | engagement ...
  touchpoint_id VARCHAR(50), -- specific touchpoint
  
  -- Progress
  status VARCHAR(50) DEFAULT 'not_started', -- not_started | in_progress | completed
  completion_percentage INTEGER DEFAULT 0 CHECK (completion_percentage >= 0 AND completion_percentage <= 100),
  
  -- Learning Outcomes
  knowledge_gained JSONB DEFAULT '[]', -- string[]
  skills_acquired JSONB DEFAULT '[]', -- string[]
  
  -- Timestamps
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  
  UNIQUE(player_id, journey_id, stage_id)
);

-- ======================
-- 7. Entropy Events (熵增事件)
-- ======================
CREATE TABLE IF NOT EXISTS game_entropy_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID NOT NULL REFERENCES game_players(id) ON DELETE CASCADE,
  
  -- Event Info
  event_type VARCHAR(50) NOT NULL, -- inactivity | misinformation | pollution | corruption
  entropy_delta DECIMAL(5,2) NOT NULL, -- Positive = increase, Negative = decrease
  
  -- Trigger
  trigger_source VARCHAR(100), -- idle_time | battle_loss | wrong_answer
  
  -- Response
  player_response VARCHAR(50), -- ignored | mitigated | reversed
  mitigation_action JSONB, -- { type: string, cards_used: string[] }
  
  -- Timestamps
  triggered_at TIMESTAMP DEFAULT NOW(),
  resolved_at TIMESTAMP
);

-- ======================
-- Indexes
-- ======================
CREATE INDEX IF NOT EXISTS idx_game_players_user_id ON game_players(user_id);
CREATE INDEX IF NOT EXISTS idx_game_players_level ON game_players(level DESC);
CREATE INDEX IF NOT EXISTS idx_game_players_boost_space ON game_players(boost_space_id) WHERE boost_space_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_game_cards_player_id ON game_card_collections(player_id);
CREATE INDEX IF NOT EXISTS idx_game_cards_rarity ON game_card_collections(rarity);
CREATE INDEX IF NOT EXISTS idx_game_cards_category ON game_card_collections(card_category);

CREATE INDEX IF NOT EXISTS idx_game_battle_player_id ON game_battle_history(player_id);
CREATE INDEX IF NOT EXISTS idx_game_battle_result ON game_battle_history(result);
CREATE INDEX IF NOT EXISTS idx_game_battle_date ON game_battle_history(battle_started_at DESC);

CREATE INDEX IF NOT EXISTS idx_game_twin_player_id ON game_digital_twin(player_id);

CREATE INDEX IF NOT EXISTS idx_game_achievements_player_id ON game_achievements(player_id);
CREATE INDEX IF NOT EXISTS idx_game_achievements_unlocked ON game_achievements(is_unlocked) WHERE is_unlocked = true;

CREATE INDEX IF NOT EXISTS idx_game_journey_player_id ON game_journey_progress(player_id);
CREATE INDEX IF NOT EXISTS idx_game_journey_status ON game_journey_progress(status);

CREATE INDEX IF NOT EXISTS idx_game_entropy_player_id ON game_entropy_events(player_id);
CREATE INDEX IF NOT EXISTS idx_game_entropy_date ON game_entropy_events(triggered_at DESC);

-- ======================
-- Triggers
-- ======================
CREATE OR REPLACE FUNCTION update_game_player_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_game_player_update
BEFORE UPDATE ON game_players
FOR EACH ROW
EXECUTE FUNCTION update_game_player_timestamp();

CREATE TRIGGER trg_game_twin_update
BEFORE UPDATE ON game_digital_twin
FOR EACH ROW
EXECUTE FUNCTION update_game_player_timestamp();

-- ======================
-- Row Level Security
-- ======================
ALTER TABLE game_players ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_card_collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_battle_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_digital_twin ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_journey_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_entropy_events ENABLE ROW LEVEL SECURITY;

-- Policies: Users can only access their own game data
CREATE POLICY game_player_select_policy ON game_players
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY game_player_insert_policy ON game_players
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY game_player_update_policy ON game_players
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY game_cards_select_policy ON game_card_collections
  FOR SELECT
  USING (player_id IN (SELECT id FROM game_players WHERE user_id = auth.uid()));

CREATE POLICY game_cards_insert_policy ON game_card_collections
  FOR INSERT
  WITH CHECK (player_id IN (SELECT id FROM game_players WHERE user_id = auth.uid()));

CREATE POLICY game_battle_select_policy ON game_battle_history
  FOR SELECT
  USING (player_id IN (SELECT id FROM game_players WHERE user_id = auth.uid()));

CREATE POLICY game_battle_insert_policy ON game_battle_history
  FOR INSERT
  WITH CHECK (player_id IN (SELECT id FROM game_players WHERE user_id = auth.uid()));

CREATE POLICY game_twin_select_policy ON game_digital_twin
  FOR SELECT
  USING (player_id IN (SELECT id FROM game_players WHERE user_id = auth.uid()));

CREATE POLICY game_twin_update_policy ON game_digital_twin
  FOR UPDATE
  USING (player_id IN (SELECT id FROM game_players WHERE user_id = auth.uid()));

CREATE POLICY game_achievements_select_policy ON game_achievements
  FOR SELECT
  USING (player_id IN (SELECT id FROM game_players WHERE user_id = auth.uid()));

CREATE POLICY game_journey_select_policy ON game_journey_progress
  FOR SELECT
  USING (player_id IN (SELECT id FROM game_players WHERE user_id = auth.uid()));

CREATE POLICY game_entropy_select_policy ON game_entropy_events
  FOR SELECT
  USING (player_id IN (SELECT id FROM game_players WHERE user_id = auth.uid()));
