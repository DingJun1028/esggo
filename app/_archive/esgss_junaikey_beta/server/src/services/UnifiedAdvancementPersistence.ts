/**
 * UnifiedAdvancementPersistence.ts
 * --------------------------------
 * 奧秘晉級系統 - 數據持久化模組
 * 
 * 核心理念：永續經營，傳承迭代
 * 設計哲學：數據即資產，知識即財富
 */

import pool from '../../db/index.js';

// 用戶進度表名稱
const UNIFIED_PROGRESS_TABLE = 'unified_user_progress';
const LEGACY_RECORDS_TABLE = 'legacy_records';
const ACTIVITY_LOG_TABLE = 'unified_activity_log';
const VERSION_HISTORY_TABLE = 'version_history';

/**
 * 初始化數據庫表
 */
export async function initializeDatabaseTables(): Promise<void> {
  const client = await pool.connect();
  
  try {
    // 創建用戶進度表
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
    
    // 創建徽章表
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
    
    // 創建成就表
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
    
    // 創建傳承記錄表
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
    
    // 創建活動日誌表
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
    
    // 創建版本歷史表
    await client.query(`
      CREATE TABLE IF NOT EXISTS ${VERSION_HISTORY_TABLE} (
        id SERIAL PRIMARY KEY,
        version VARCHAR(50) NOT NULL,
        changes TEXT[],
        released_at TIMESTAMP DEFAULT NOW(),
        is_active BOOLEAN DEFAULT true
      )
    `);
    
    console.log('Unified advancement database tables initialized successfully');
  } catch (error) {
    console.error('Failed to initialize unified advancement database tables:', error);
    throw error;
  } finally {
    client.release();
  }
}

/**
 * 保存用戶進度
 */
export async function saveUserProgress(progress: any): Promise<void> {
  const client = await pool.connect();
  
  try {
    await client.query(`
      INSERT INTO ${UNIFIED_PROGRESS_TABLE} (
        user_id, combined_level, combined_xp, combined_title,
        report_level, report_xp, report_title, report_rank,
        market_level, market_xp, market_title,
        legacy_points, total_reports, total_analyses, total_modules,
        total_xp_earned, total_legacy_points, streak_days,
        cross_service_actions, last_active_date, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, NOW(), NOW())
      ON CONFLICT (user_id) DO UPDATE SET
        combined_level = EXCLUDED.combined_level,
        combined_xp = EXCLUDED.combined_xp,
        combined_title = EXCLUDED.combined_title,
        report_level = EXCLUDED.report_level,
        report_xp = EXCLUDED.report_xp,
        report_title = EXCLUDED.report_title,
        report_rank = EXCLUDED.report_rank,
        market_level = EXCLUDED.market_level,
        market_xp = EXCLUDED.market_xp,
        market_title = EXCLUDED.market_title,
        legacy_points = EXCLUDED.legacy_points,
        total_reports = EXCLUDED.total_reports,
        total_analyses = EXCLUDED.total_analyses,
        total_modules = EXCLUDED.total_modules,
        total_xp_earned = EXCLUDED.total_xp_earned,
        total_legacy_points = EXCLUDED.total_legacy_points,
        streak_days = EXCLUDED.streak_days,
        cross_service_actions = EXCLUDED.cross_service_actions,
        last_active_date = EXCLUDED.last_active_date,
        updated_at = EXCLUDED.updated_at
    `, [
      progress.userId,
      progress.combinedLevel,
      progress.combinedXP,
      progress.combinedTitle,
      progress.reportProgress.level,
      progress.reportProgress.xp,
      progress.reportProgress.title,
      progress.reportProgress.rank,
      progress.marketProgress.level,
      progress.marketProgress.xp,
      progress.marketProgress.title,
      progress.legacyPoints,
      progress.statistics.totalReportsCreated,
      progress.statistics.totalAnalyses,
      progress.statistics.totalModulesCompleted,
      progress.statistics.totalXPEarned,
      progress.statistics.totalLegacyPoints,
      progress.statistics.streakDays,
      progress.statistics.crossServiceActions
    ]);
  } catch (error) {
    console.error('Failed to save user progress:', error);
    throw error;
  } finally {
    client.release();
  }
}

/**
 * 獲取用戶進度
 */
export async function getUserProgress(userId: string): Promise<any> {
  const client = await pool.connect();
  
  try {
    const result = await client.query(
      `SELECT * FROM ${UNIFIED_PROGRESS_TABLE} WHERE user_id = $1`,
      [userId]
    );
    
    if (result.rows.length === 0) {
      return null;
    }
    
    const row = result.rows[0];
    
    return {
      userId: row.user_id,
      combinedLevel: row.combined_level,
      combinedXP: row.combined_xp,
      combinedTitle: row.combined_title,
      reportProgress: {
        level: row.report_level,
        xp: row.report_xp,
        title: row.report_title,
        rank: row.report_rank,
      },
      marketProgress: {
        level: row.market_level,
        xp: row.market_xp,
        title: row.market_title,
      },
      legacyPoints: row.legacy_points,
      statistics: {
        totalReportsCreated: row.total_reports,
        totalAnalyses: row.total_analyses,
        totalModulesCompleted: row.total_modules,
        totalXPEarned: row.total_xp_earned,
        totalLegacyPoints: row.total_legacy_points,
        streakDays: row.streak_days,
        crossServiceActions: row.cross_service_actions,
        lastActiveDate: row.last_active_date,
      },
      lastActivity: row.last_active_date,
      createdAt: row.created_at,
    };
  } catch (error) {
    console.error('Failed to get user progress:', error);
    throw error;
  } finally {
    client.release();
  }
}

/**
 * 保存徽章
 */
export async function saveBadge(userId: string, badge: any): Promise<void> {
  const client = await pool.connect();
  
  try {
    await client.query(`
      INSERT INTO unified_badges (
        user_id, badge_id, badge_name, badge_description,
        badge_icon, badge_category, badge_source, badge_rarity, earned_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
      ON CONFLICT (user_id, badge_id) DO NOTHING
    `, [
      userId,
      badge.id,
      badge.name,
      badge.description,
      badge.icon,
      badge.category,
      badge.source,
      badge.rarity,
    ]);
  } catch (error) {
    console.error('Failed to save badge:', error);
    throw error;
  } finally {
    client.release();
  }
}

/**
 * 保存傳承記錄
 */
export async function saveLegacyRecord(record: any): Promise<void> {
  const client = await pool.connect();
  
  try {
    await client.query(`
      INSERT INTO ${LEGACY_RECORDS_TABLE} (
        record_id, from_user_id, to_user_id, type, points, reason, timestamp, status
      ) VALUES ($1, $2, $3, $4, $5, $6, NOW(), $7)
    `, [
      record.id,
      record.fromUserId,
      record.toUserId,
      record.type,
      record.points,
      record.reason,
      record.status,
    ]);
  } catch (error) {
    console.error('Failed to save legacy record:', error);
    throw error;
  } finally {
    client.release();
  }
}

/**
 * 保存活動日誌
 */
export async function saveActivityLog(activity: any): Promise<void> {
  const client = await pool.connect();
  
  try {
    await client.query(`
      INSERT INTO ${ACTIVITY_LOG_TABLE} (
        activity_id, user_id, activity_type, description,
        xp_earned, legacy_points_earned, timestamp, metadata
      ) VALUES ($1, $2, $3, $4, $5, $6, NOW(), $7)
    `, [
      activity.id,
      activity.userId,
      activity.type,
      activity.description,
      activity.xpEarned,
      activity.legacyPointsEarned,
      JSON.stringify(activity.metadata || {}),
    ]);
  } catch (error) {
    console.error('Failed to save activity log:', error);
    throw error;
  } finally {
    client.release();
  }
}

/**
 * 獲取用戶活動日誌
 */
export async function getUserActivities(userId: string, limit: number = 20): Promise<any[]> {
  const client = await pool.connect();
  
  try {
    const result = await client.query(
      `SELECT * FROM ${ACTIVITY_LOG_TABLE} 
       WHERE user_id = $1 
       ORDER BY timestamp DESC 
       LIMIT $2`,
      [userId, limit]
    );
    
    return result.rows.map(row => ({
      id: row.activity_id,
      userId: row.user_id,
      type: row.activity_type,
      description: row.description,
      xpEarned: row.xp_earned,
      legacyPointsEarned: row.legacy_points_earned,
      timestamp: row.timestamp,
      metadata: row.metadata,
    }));
  } catch (error) {
    console.error('Failed to get user activities:', error);
    throw error;
  } finally {
    client.release();
  }
}

/**
 * 獲取排行榜
 */
export async function getLeaderboard(limit: number = 10): Promise<any[]> {
  const client = await pool.connect();
  
  try {
    const result = await client.query(
      `SELECT * FROM ${UNIFIED_PROGRESS_TABLE} 
       ORDER BY combined_xp DESC 
       LIMIT $1`,
      [limit]
    );
    
    return result.rows.map((row, index) => ({
      rank: index + 1,
      userId: row.user_id,
      level: row.combined_level,
      title: row.combined_title,
      xp: row.combined_xp,
      reports: row.total_reports,
      analyses: row.total_analyses,
    }));
  } catch (error) {
    console.error('Failed to get leaderboard:', error);
    throw error;
  } finally {
    client.release();
  }
}

/**
 * 記錄版本變更
 */
export async function recordVersionChange(version: string, changes: string[]): Promise<void> {
  const client = await pool.connect();
  
  try {
    // 標記舊版本為非活躍
    await client.query(
      `UPDATE ${VERSION_HISTORY_TABLE} SET is_active = false WHERE is_active = true`
    );
    
    // 插入新版本
    await client.query(`
      INSERT INTO ${VERSION_HISTORY_TABLE} (version, changes, is_active)
      VALUES ($1, $2, true)
    `, [version, changes]);
  } catch (error) {
    console.error('Failed to record version change:', error);
    throw error;
  } finally {
    client.release();
  }
}

/**
 * 獲取當前版本
 */
export async function getCurrentVersion(): Promise<any> {
  const client = await pool.connect();
  
  try {
    const result = await client.query(
      `SELECT * FROM ${VERSION_HISTORY_TABLE} WHERE is_active = true LIMIT 1`
    );
    
    if (result.rows.length === 0) {
      return { version: '1.0.0', changes: [], released_at: null };
    }
    
    const row = result.rows[0];
    return {
      version: row.version,
      changes: row.changes,
      releasedAt: row.released_at,
    };
  } catch (error) {
    console.error('Failed to get current version:', error);
    throw error;
  } finally {
    client.release();
  }
}

/**
 * 獲取用戶徽章
 */
export async function getUserBadges(userId: string): Promise<any[]> {
  const client = await pool.connect();
  
  try {
    const result = await client.query(
      `SELECT * FROM unified_badges WHERE user_id = $1 ORDER BY earned_at DESC`,
      [userId]
    );
    
    return result.rows.map(row => ({
      id: row.badge_id,
      name: row.badge_name,
      description: row.badge_description,
      icon: row.badge_icon,
      earnedAt: row.earned_at,
      category: row.badge_category,
      source: row.badge_source,
      rarity: row.badge_rarity,
    }));
  } catch (error) {
    console.error('Failed to get user badges:', error);
    throw error;
  } finally {
    client.release();
  }
}

/**
 * 獲取用戶成就
 */
export async function getUserAchievements(userId: string): Promise<any[]> {
  const client = await pool.connect();
  
  try {
    const result = await client.query(
      `SELECT * FROM unified_achievements WHERE user_id = $1 ORDER BY completed_at DESC`,
      [userId]
    );
    
    return result.rows.map(row => ({
      id: row.achievement_id,
      name: row.achievement_name,
      description: row.achievement_description,
      completedAt: row.completed_at,
      reward: {
        xp: row.reward_xp,
        legacyPoints: row.reward_legacy_points,
      },
      category: row.category,
      progress: row.progress,
      requirement: row.requirement,
    }));
  } catch (error) {
    console.error('Failed to get user achievements:', error);
    throw error;
  } finally {
    client.release();
  }
}
