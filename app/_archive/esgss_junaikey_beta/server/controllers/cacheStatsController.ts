import { Request, Response } from 'express';
import redisService from '../services/redisService.js';
import pool, { healthCheck as dbHealthCheck } from '../db/index.js';
import omniLogger, { LogCategory } from '../utils/omniLogger.js';

/**
 * GET /api/system/stats
 * 獲取系統核心統計數據 (Redis & Database)
 */
export async function getSystemStats(req: Request, res: Response): Promise<void> {
    try {
        const [dbHealth, redisHealth, memoryStats] = await Promise.all([
            dbHealthCheck(),
            redisService.healthCheck(),
            redisService.getMemoryStats()
        ]);

        res.status(200).json({
            success: true,
            data: {
                database: dbHealth,
                redis: redisHealth,
                memory: memoryStats,
                server: {
                    uptime: process.uptime(),
                    platform: process.platform,
                    nodeVersion: process.version,
                    memoryUsage: process.memoryUsage()
                },
                timestamp: new Date().toISOString()
            }
        });
    } catch (error: any) {
        omniLogger.error(LogCategory.SYSTEM, 'Failed to fetch system stats', { error: error.message });
        res.status(500).json({
            success: false,
            error: {
                message: 'Internal System Statistics Error',
                code: 'STATS_FETCH_FAILED'
            }
        });
    }
}
