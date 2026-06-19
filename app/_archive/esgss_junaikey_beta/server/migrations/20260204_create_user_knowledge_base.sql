-- =====================================================
-- Phase 5.3: User Knowledge Base Architecture (Final)
-- 遷移腳本：創建個人數位分身與知識庫資料表
-- =====================================================
-- 創建日期：2026-02-04
-- 目標：實現個人數位分身知識庫系統（最佳實踐）
-- 語言策略：英文檔名/路徑，繁體中文註釋

-- =====================================================
-- 1. 用戶數位分身表
-- =====================================================
CREATE TABLE IF NOT EXISTS user_digital_avatars (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  avatar_name TEXT NOT NULL,
  avatar_type TEXT DEFAULT 'SOVEREIGN' CHECK (avatar_type IN ('SOVEREIGN', 'GUARDIAN', 'SCHOLAR')),
  
  -- 奧秘晶體核心
  omni_crystal JSONB NOT NULL DEFAULT '{
    "version": "1.0",
    "status": "AWAKENING",
    "virtues": {
      "intelligence": 5,
      "benevolence": 5,
      "integrity": 5,
      "courage": 5,
      "temperance": 5,
      "harmony": 5
    }
  }'::jsonb,
  
  -- 知識庫統計
  total_knowledge_items INTEGER DEFAULT 0,
  total_sources_subscribed INTEGER DEFAULT 0,
  last_sync_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id)
);

-- 索引
CREATE INDEX IF NOT EXISTS idx_user_digital_avatars_user_id ON user_digital_avatars(user_id);
CREATE INDEX IF NOT EXISTS idx_user_digital_avatars_avatar_type ON user_digital_avatars(avatar_type);

COMMENT ON TABLE user_digital_avatars IS '用戶數位分身：奧秘晶體核心，存儲個人化設定與統計';
COMMENT ON COLUMN user_digital_avatars.omni_crystal IS '奧秘晶體：包含版本、狀態、六德屬性（智仁勇誠節和）';
COMMENT ON COLUMN user_digital_avatars.avatar_type IS 'SOVEREIGN=主權者(全能型), GUARDIAN=守護者(防護型), SCHOLAR=學者(研究型)';

-- =====================================================
-- 2. 用戶訂閱管理表
-- =====================================================
CREATE TABLE IF NOT EXISTS user_source_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  source_id INTEGER NOT NULL REFERENCES sustainability_sources(source_id),
  
  -- 訂閱狀態
  is_active BOOLEAN DEFAULT true,
  subscription_type TEXT DEFAULT 'AUTO' CHECK (subscription_type IN ('AUTO', 'MANUAL', 'RECOMMENDED')),
  
  -- 個人化設定
  priority_override INTEGER CHECK (priority_override BETWEEN 1 AND 4),
  custom_tags TEXT[],
  
  -- 同步狀態
  last_synced_at TIMESTAMPTZ,
  sync_count INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id, source_id)
);

-- 索引
CREATE INDEX IF NOT EXISTS idx_user_source_subscriptions_user_id ON user_source_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_source_subscriptions_source_id ON user_source_subscriptions(source_id);
CREATE INDEX IF NOT EXISTS idx_user_source_subscriptions_is_active ON user_source_subscriptions(is_active);
CREATE INDEX IF NOT EXISTS idx_user_source_subscriptions_user_source ON user_source_subscriptions(user_id, source_id);

COMMENT ON TABLE user_source_subscriptions IS '用戶訂閱管理：個人化訂閱全球永續資訊來源';
COMMENT ON COLUMN user_source_subscriptions.subscription_type IS 'AUTO=自動推薦, MANUAL=手動訂閱, RECOMMENDED=系統推薦';

-- =====================================================
-- 3. 個人知識庫表（支援全文存儲）
-- =====================================================
CREATE TABLE IF NOT EXISTS user_knowledge_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  source_id INTEGER REFERENCES sustainability_sources(source_id),
  
  -- 知識內容（支援全文）
  title TEXT NOT NULL,
  summary TEXT,
  full_content TEXT, -- 完整文章內容
  original_url TEXT,
  
  -- 文章元數據
  author TEXT,
  publisher TEXT,
  word_count INTEGER,
  reading_time_minutes INTEGER,
  language TEXT DEFAULT 'zh-TW',
  
  -- 分類與標籤
  category TEXT CHECK (category IN ('E', 'S', 'G', 'TECH', 'POLICY', 'FINANCE', 'OTHER')),
  tags TEXT[],
  
  -- 5T 協議封印
  evidence JSONB NOT NULL DEFAULT '{
    "tangible": {},
    "traceable": {},
    "trackable": {},
    "transparent": {},
    "trustworthy": {}
  }'::jsonb,
  
  crystal_hash TEXT NOT NULL, -- SHA-256 不可篡改封印
  
  -- 學習狀態
  is_read BOOLEAN DEFAULT false,
  is_bookmarked BOOLEAN DEFAULT false,
  learning_progress INTEGER DEFAULT 0 CHECK (learning_progress BETWEEN 0 AND 100),
  reading_position INTEGER DEFAULT 0, -- 閱讀位置（字數）
  
  -- 永續圖書室整合
  library_category TEXT, -- 圖書室分類
  is_in_library BOOLEAN DEFAULT true, -- 是否收錄到圖書室
  library_shelf TEXT, -- 書架位置
  
  -- 元數據
  published_at TIMESTAMPTZ,
  synced_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 索引
CREATE INDEX IF NOT EXISTS idx_user_knowledge_items_user_id ON user_knowledge_items(user_id);
CREATE INDEX IF NOT EXISTS idx_user_knowledge_items_source_id ON user_knowledge_items(source_id);
CREATE INDEX IF NOT EXISTS idx_user_knowledge_items_category ON user_knowledge_items(category);
CREATE INDEX IF NOT EXISTS idx_user_knowledge_items_is_read ON user_knowledge_items(is_read);
CREATE INDEX IF NOT EXISTS idx_user_knowledge_items_is_bookmarked ON user_knowledge_items(is_bookmarked);
CREATE INDEX IF NOT EXISTS idx_user_knowledge_items_published_at ON user_knowledge_items(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_knowledge_items_is_in_library ON user_knowledge_items(is_in_library);
CREATE INDEX IF NOT EXISTS idx_user_knowledge_items_library_category ON user_knowledge_items(library_category);

-- 全文搜索索引（支援中文）
CREATE INDEX IF NOT EXISTS idx_user_knowledge_items_fulltext_search ON user_knowledge_items 
  USING gin(to_tsvector('simple', title || ' ' || COALESCE(summary, '') || ' ' || COALESCE(full_content, '')));

COMMENT ON TABLE user_knowledge_items IS '個人知識庫：經5T協議封印的知識資產，支援全文存儲與永續圖書室整合';
COMMENT ON COLUMN user_knowledge_items.full_content IS '完整文章內容：支援全文查看與搜索';
COMMENT ON COLUMN user_knowledge_items.crystal_hash IS 'SHA-256封印：確保知識不可篡改';
COMMENT ON COLUMN user_knowledge_items.evidence IS '5T證據：Tangible(可感知), Traceable(可溯源), Trackable(可追蹤), Transparent(可驗算), Trustworthy(不可篡改)';
COMMENT ON COLUMN user_knowledge_items.category IS 'E=環境, S=社會, G=治理, TECH=科技, POLICY=政策, FINANCE=金融';
COMMENT ON COLUMN user_knowledge_items.is_in_library IS '是否收錄到永續圖書室';
COMMENT ON COLUMN user_knowledge_items.library_shelf IS '永續圖書室書架位置（例如：氣候變遷、生物多樣性、循環經濟）';

-- =====================================================
-- 4. 永續圖書室視圖（Library View）
-- =====================================================
CREATE OR REPLACE VIEW sustainability_library AS
SELECT 
  id,
  user_id,
  title,
  summary,
  full_content,
  author,
  publisher,
  category,
  library_category,
  library_shelf,
  tags,
  word_count,
  reading_time_minutes,
  is_read,
  is_bookmarked,
  published_at,
  created_at
FROM user_knowledge_items
WHERE is_in_library = true
ORDER BY published_at DESC;

COMMENT ON VIEW sustainability_library IS '永續圖書室：所有收錄到圖書室的知識項目';

-- =====================================================
-- 5. 觸發器：自動更新時間戳
-- =====================================================
CREATE TRIGGER update_user_digital_avatars_updated_at
  BEFORE UPDATE ON user_digital_avatars
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_source_subscriptions_updated_at
  BEFORE UPDATE ON user_source_subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_knowledge_items_updated_at
  BEFORE UPDATE ON user_knowledge_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 6. 觸發器：自動計算閱讀時間
-- =====================================================
CREATE OR REPLACE FUNCTION calculate_reading_time()
RETURNS TRIGGER AS $$
BEGIN
  -- 計算字數
  NEW.word_count := LENGTH(COALESCE(NEW.full_content, ''));
  
  -- 計算閱讀時間（假設中文每分鐘400字，英文每分鐘200字）
  IF NEW.language = 'zh-TW' OR NEW.language = 'zh-CN' THEN
    NEW.reading_time_minutes := CEIL(NEW.word_count / 400.0);
  ELSE
    NEW.reading_time_minutes := CEIL(NEW.word_count / 200.0);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER calculate_reading_time_on_insert
  BEFORE INSERT ON user_knowledge_items
  FOR EACH ROW EXECUTE FUNCTION calculate_reading_time();

CREATE TRIGGER calculate_reading_time_on_update
  BEFORE UPDATE OF full_content ON user_knowledge_items
  FOR EACH ROW EXECUTE FUNCTION calculate_reading_time();

-- =====================================================
-- 7. 觸發器：自動更新統計
-- =====================================================
CREATE OR REPLACE FUNCTION update_avatar_statistics()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE user_digital_avatars
  SET 
    total_knowledge_items = (
      SELECT COUNT(*) FROM user_knowledge_items WHERE user_id = NEW.user_id
    ),
    total_sources_subscribed = (
      SELECT COUNT(*) FROM user_source_subscriptions 
      WHERE user_id = NEW.user_id AND is_active = true
    ),
    last_sync_at = NOW()
  WHERE user_id = NEW.user_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_avatar_stats_on_knowledge_insert
  AFTER INSERT ON user_knowledge_items
  FOR EACH ROW EXECUTE FUNCTION update_avatar_statistics();

CREATE TRIGGER update_avatar_stats_on_subscription_change
  AFTER INSERT OR UPDATE ON user_source_subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_avatar_statistics();

-- =====================================================
-- 8. Row Level Security (RLS) 安全策略
-- =====================================================

-- 用戶只能訪問自己的數位分身
ALTER TABLE user_digital_avatars ENABLE ROW LEVEL SECURITY;

CREATE POLICY user_avatars_select_policy ON user_digital_avatars
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY user_avatars_insert_policy ON user_digital_avatars
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY user_avatars_update_policy ON user_digital_avatars
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY user_avatars_delete_policy ON user_digital_avatars
  FOR DELETE USING (auth.uid() = user_id);

-- 用戶只能訪問自己的訂閱
ALTER TABLE user_source_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY user_subscriptions_select_policy ON user_source_subscriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY user_subscriptions_insert_policy ON user_source_subscriptions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY user_subscriptions_update_policy ON user_source_subscriptions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY user_subscriptions_delete_policy ON user_source_subscriptions
  FOR DELETE USING (auth.uid() = user_id);

-- 用戶只能訪問自己的知識庫
ALTER TABLE user_knowledge_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY user_knowledge_select_policy ON user_knowledge_items
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY user_knowledge_insert_policy ON user_knowledge_items
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY user_knowledge_update_policy ON user_knowledge_items
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY user_knowledge_delete_policy ON user_knowledge_items
  FOR DELETE USING (auth.uid() = user_id);

-- =====================================================
-- 9. 驗證與統計
-- =====================================================

-- 驗證資料表創建
DO $$
DECLARE
  avatars_exists BOOLEAN;
  subscriptions_exists BOOLEAN;
  knowledge_exists BOOLEAN;
  library_view_exists BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_name = 'user_digital_avatars'
  ) INTO avatars_exists;
  
  SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_name = 'user_source_subscriptions'
  ) INTO subscriptions_exists;
  
  SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_name = 'user_knowledge_items'
  ) INTO knowledge_exists;
  
  SELECT EXISTS (
    SELECT FROM information_schema.views 
    WHERE table_name = 'sustainability_library'
  ) INTO library_view_exists;
  
  IF avatars_exists AND subscriptions_exists AND knowledge_exists AND library_view_exists THEN
    RAISE NOTICE '✅ 所有資料表與視圖創建成功！';
    RAISE NOTICE '  - user_digital_avatars: %', avatars_exists;
    RAISE NOTICE '  - user_source_subscriptions: %', subscriptions_exists;
    RAISE NOTICE '  - user_knowledge_items: %', knowledge_exists;
    RAISE NOTICE '  - sustainability_library (視圖): %', library_view_exists;
  ELSE
    RAISE EXCEPTION '❌ 資料表創建失敗！';
  END IF;
END $$;

-- 查詢索引統計
SELECT 
  schemaname,
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE tablename IN ('user_digital_avatars', 'user_source_subscriptions', 'user_knowledge_items')
ORDER BY tablename, indexname;
