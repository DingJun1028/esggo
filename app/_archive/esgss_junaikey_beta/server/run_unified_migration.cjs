/**
 * run_unified_migration.cjs
 * ---------------------------
 * 奧秘晉級系統 - 數據庫遷移腳本
 * 
 * 核心理念：永續經營，數據遷移
 */

const { Pool } = require('pg');
require('dotenv').config();

// 配置
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'esgss',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
});

const UNIFIED_PROGRESS_TABLE = 'unified_user_progress';
const LEGACY_RECORDS_TABLE = 'legacy_records';
const ACTIVITY_LOG_TABLE = 'unified_activity_log';
const VERSION_HISTORY_TABLE = 'version_history';

async function runMigration() {
  const client = await pool.connect();
  
  console.log('🚀 開始運行奧秘晉級系統數據庫遷移...\n');
  
  try {
    // 創建用戶進度表
    console.log('📦 創建用戶進度表...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS ${UNIFIED_PROGRESS_TABLE} (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) UNIQUE NOT NULL,
        combined_level INTEGER DEFAULT 1,
        combined_xp INTEGER DEFAULT 0,
        combined_title VARCHAR(100) DEFAULT '見習學徒',
        report_level INTEGER DEFAULT 1,
        report_xp INTEGER DEFAULT 0,
        report_title VARCHAR(100) DEFAULT '見習撰寫員',
        report_rank VARCHAR(50) DEFAULT 'novice',
        market_level INTEGER DEFAULT 1,
        market_xp INTEGER DEFAULT 0,
        market_title VARCHAR(100) DEFAULT '見習情報員',
        legacy_points INTEGER DEFAULT 0,
        total_reports INTEGER DEFAULT 0,
        total_analyses INTEGER DEFAULT 0,
        total_modules INTEGER DEFAULT 0,
        total_xp_earned INTEGER DEFAULT 0,
        total_legacy_points INTEGER DEFAULT 0,
        streak_days INTEGER DEFAULT 0,
        cross_service_actions INTEGER DEFAULT 0,
        last_active_date TIMESTAMP DEFAULT NOW(),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);
    console.log('✅ 用戶進度表創建成功\n');

    // 創建徽章表
    console.log('📦 創建徽章表...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS unified_badges (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        badge_id VARCHAR(100) NOT NULL,
        badge_name VARCHAR(100) NOT NULL,
        badge_description TEXT,
        badge_icon VARCHAR(50),
        badge_category VARCHAR(50),
        badge_source VARCHAR(50),
        badge_rarity VARCHAR(50),
        earned_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(user_id, badge_id)
      )
    `);
    console.log('✅ 徽章表創建成功\n');

    // 創建成就表
    console.log('📦 創建成就表...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS unified_achievements (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        achievement_id VARCHAR(100) NOT NULL,
        achievement_name VARCHAR(100) NOT NULL,
        achievement_description TEXT,
        completed_at TIMESTAMP DEFAULT NOW(),
        reward_xp INTEGER DEFAULT 0,
        reward_legacy_points INTEGER DEFAULT 0,
        category VARCHAR(50),
        progress INTEGER DEFAULT 0,
        requirement INTEGER DEFAULT 0,
        UNIQUE(user_id, achievement_id)
      )
    `);
    console.log('✅ 成就表創建成功\n');

    // 創建傳承記錄表
    console.log('📦 創建傳承記錄表...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS ${LEGACY_RECORDS_TABLE} (
        id SERIAL PRIMARY KEY,
        record_id VARCHAR(100) UNIQUE NOT NULL,
        from_user_id VARCHAR(255) NOT NULL,
        to_user_id VARCHAR(255),
        type VARCHAR(50) NOT NULL,
        points INTEGER NOT NULL,
        reason TEXT,
        timestamp TIMESTAMP DEFAULT NOW(),
        status VARCHAR(50) DEFAULT 'completed'
      )
    `);
    console.log('✅ 傳承記錄表創建成功\n');

    // 創建活動日誌表
    console.log('📦 創建活動日誌表...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS ${ACTIVITY_LOG_TABLE} (
        id SERIAL PRIMARY KEY,
        activity_id VARCHAR(100) UNIQUE NOT NULL,
        user_id VARCHAR(255) NOT NULL,
        activity_type VARCHAR(50) NOT NULL,
        description TEXT,
        xp_earned INTEGER DEFAULT 0,
        legacy_points_earned INTEGER DEFAULT 0,
        timestamp TIMESTAMP DEFAULT NOW(),
        metadata JSONB DEFAULT '{}'
      )
    `);
    console.log('✅ 活動日誌表創建成功\n');

    // 創建版本歷史表
    console.log('📦 創建版本歷史表...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS ${VERSION_HISTORY_TABLE} (
        id SERIAL PRIMARY KEY,
        version VARCHAR(50) NOT NULL,
        changes TEXT[],
        released_at TIMESTAMP DEFAULT NOW(),
        is_active BOOLEAN DEFAULT true
      )
    `);
    console.log('✅ 版本歷史表創建成功\n');

    // 創建索引
    console.log('📦 創建索引...');
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_unified_progress_user_id ON ${UNIFIED_PROGRESS_TABLE}(user_id);
      CREATE INDEX IF NOT EXISTS idx_unified_progress_combined_xp ON ${UNIFIED_PROGRESS_TABLE}(combined_xp DESC);
      CREATE INDEX IF NOT EXISTS idx_unified_badges_user_id ON unified_badges(user_id);
      CREATE INDEX IF NOT EXISTS idx_legacy_records_from_user ON ${LEGACY_RECORDS_TABLE}(from_user_id);
      CREATE INDEX IF NOT EXISTS idx_legacy_records_to_user ON ${LEGACY_RECORDS_TABLE}(to_user_id);
      CREATE INDEX IF NOT EXISTS idx_activity_log_user_id ON ${ACTIVITY_LOG_TABLE}(user_id);
      CREATE INDEX IF NOT EXISTS idx_activity_log_timestamp ON ${ACTIVITY_LOG_TABLE}(timestamp DESC);
    `);
    console.log('✅ 索引創建成功\n');

    // 插入初始版本記錄
    console.log('📦 插入版本記錄...');
    await client.query(`
      INSERT INTO ${VERSION_HISTORY_TABLE} (version, changes, is_active)
      VALUES ('2.0.0', ARRAY[
        'Initial release of unified advancement system',
        'Cross-service learning connections',
        'Legacy points system',
        'AI-powered recommendations'
      ], true)
      ON CONFLICT DO NOTHING
    `);
    console.log('✅ 版本記錄插入成功\n');

    console.log('🎉 數據庫遷移完成！\n');

  } catch (error) {
    console.error('❌ 遷移失敗:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

// 運行遷移
runMigration().catch((error) => {
  console.error('遷移過程中發生錯誤:', error);
  process.exit(1);
});
