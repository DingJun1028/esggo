// server/src/services/SystemHealthService.ts
import omniLogger, { LogCategory } from '../../utils/omniLogger.js';
import { supabase } from '../config/supabase.js';
import { redisService } from './RedisService.js';

interface HealthSnapshot {
    uptime: number;
    api_hits: number;
    error_count: number;
    last_check: string;
    status: 'OPTIMAL' | 'DEGRADED' | 'CRITICAL';
}

interface ReadinessStatus {
    ready: boolean;
    checks: {
        database: { status: 'ok' | 'error'; latency_ms?: number; error?: string };
        redis: { status: 'ok' | 'error' | 'disconnected'; error?: string };
    };
    timestamp: string;
}

export class SystemHealthService {
    private apiHits = 0;
    private errorCount = 0;
    private startTime: number;

    constructor() {
        this.startTime = Date.now();
    }

    public recordRequest() {
        this.apiHits++;
    }

    public recordError() {
        this.errorCount++;
    }

    /**
     * 基本活性檢查 (Liveness)
     */
    public getLivenessStatus(): { status: 'ok'; uptime: number } {
        return {
            status: 'ok',
            uptime: Math.floor((Date.now() - this.startTime) / 1000),
        };
    }

    /**
     * 深度就緒檢查 (Readiness) - 檢查所有外部依賴
     */
    public async getReadinessStatus(): Promise<ReadinessStatus> {
        const checks: ReadinessStatus['checks'] = {
            database: { status: 'error' },
            redis: { status: 'disconnected' },
        };

        // 檢查 Supabase 連線
        const dbStart = Date.now();
        try {
            const { error } = await supabase.from('audit_logs').select('id').limit(1);
            if (error) {
                checks.database = { status: 'error', error: error.message };
            } else {
                checks.database = { status: 'ok', latency_ms: Date.now() - dbStart };
            }
        } catch (err: any) {
            checks.database = { status: 'error', error: err.message };
        }

        // 檢查 Redis 連線
        try {
            if (redisService.status()) {
                checks.redis = { status: 'ok' };
            } else {
                checks.redis = { status: 'disconnected' };
            }
        } catch (err: any) {
            checks.redis = { status: 'error', error: err.message };
        }

        const allOk = checks.database.status === 'ok';

        return {
            ready: allOk,
            checks,
            timestamp: new Date().toISOString(),
        };
    }

    public async getSnapshot(): Promise<HealthSnapshot> {
        const uptime = (Date.now() - this.startTime) / 1000;
        const errorRate = this.errorCount / (this.apiHits || 1);

        let status: HealthSnapshot['status'] = 'OPTIMAL';
        if (errorRate > 0.1) status = 'CRITICAL';
        else if (errorRate > 0.05) status = 'DEGRADED';

        const snapshot: HealthSnapshot = {
            uptime,
            api_hits: this.apiHits,
            error_count: this.errorCount,
            last_check: new Date().toISOString(),
            status,
        };

        omniLogger.info(LogCategory.SYSTEM, `[Health] Snapshot generated: ${snapshot.status} (Hits: ${snapshot.api_hits}, Errors: ${snapshot.error_count})`);

        return snapshot;
    }

    /**
     * Store a recurring health heartbeat in the audit logs
     */
    public async logHeartbeat() {
        const snapshot = await this.getSnapshot();

        try {
            await supabase
                .from('audit_logs')
                .insert({
                    category: 'SYSTEM_HEALTH',
                    action: 'HEARTBEAT',
                    details: snapshot,
                    status: 'Success'
                });
        } catch (error: any) {
            omniLogger.error(LogCategory.SYSTEM, `[Health] Failed to log heartbeat: ${error.message}`);
        }
    }
}

export default new SystemHealthService();
