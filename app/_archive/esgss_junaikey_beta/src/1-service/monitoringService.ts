// Basic fetch wrapper or direct fetch usage
import type { SystemHealthStatus } from '../types/core';
import { omniLogger, LogCategory } from '@infra/logging/OmniLogger';
import { omniCache } from '../services/OmniCacheService';

const API_OMNI_MONITOR = '/api/omni/monitor';

export interface SystemMetrics {
  uptime: number;
  memory: any;
  cpu: any;
  platform: string;
  redis?: {
    status: string;
    memory_usage?: string;
    hit_rate?: number;
    mode?: string;
  };
  ai_resonance?: {
    intensity: number;
    drift: number;
    awakening_status: string;
    eternity?: string;
  };
  omni_space?: {
    entities: number;
    sync_status: string;
    last_sync: string;
  };
  behavioral_resonance?: {
    total_events: number;
    active_users: number;
    density: number;
  };
  services?: Record<string, string>;
  timestamp?: number;
}

export interface ServiceStatus {
  name: string;
  status: SystemHealthStatus;
  uptime: number | string;
  version: string;
  tags?: string[];
}

export interface ServicePerformanceMetrics {
  responseTime: { average: number; p95: number; p99: number };
  throughput: { requestsPerSecond: number; requestsPerMinute: number };
  errorRate: { totalErrors: number; errorRatePercent: number };
  resourceUsage: { cpuPercent: number; memoryPercent: number; diskUsagePercent: number };
}

export interface MonitoringLogEntry {
  timestamp: string;
  level: string;
  service: string;
  message: string;
  requestId?: string;
}

/**
 * 預設的效能指標模擬數據
 * 用於 API 請求失敗時的回退機制
 */
const DEFAULT_PERFORMANCE_METRICS: ServicePerformanceMetrics = {
  responseTime: { average: 145, p95: 210, p99: 450 },
  throughput: { requestsPerSecond: 1240, requestsPerMinute: 74400 },
  errorRate: { totalErrors: 0, errorRatePercent: 0 },
  resourceUsage: { cpuPercent: 34, memoryPercent: 62, diskUsagePercent: 12 },
};

/**
 * 預設的系統健康狀態模擬數據
 */
const DEFAULT_HEALTH_STATUS: SystemMetrics = {
  uptime: 99999,
  memory: { used: 1024, total: 16384 },
  cpu: 12,
  platform: 'omnicircle-matrix',
  redis: { status: 'online', memory_usage: '24.5MB', hit_rate: 1.0, mode: 'standalone' },
  ai_resonance: {
    intensity: 1.0,
    drift: 0,
    awakening_status: 'AWAKENED',
    eternity: 'ETERNAL & NIRVANA ♾️'
  },
  omni_space: {
    entities: 0,
    sync_status: 'idle',
    last_sync: new Date().toISOString()
  },
  timestamp: Date.now()
};

const MAX_LOCAL_LOGS = 100;
let localLogs: MonitoringLogEntry[] = [
  {
    timestamp: new Date().toISOString(),
    level: 'info',
    service: 'SYSTEM',
    message: 'System initialized.',
  },
];

export const apiMonitoringService = {
  /**
   * 獲取系統核心指標 (Omni Vitals)
   */
  getVitalMetrics: async (): Promise<SystemMetrics> => {
    try {
      const response = await fetch(`${API_OMNI_MONITOR}/vitals`);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Network response was not ok`);
      }
      const vitals = await response.json();

      return {
        uptime: vitals.system.uptime,
        memory: vitals.system.memory,
        cpu: vitals.system.cpu,
        platform: vitals.system.platform,
        redis: {
          status: vitals.redis.status,
          memory_usage: `${omniCache.getStats().memoryUsage}KB`,
          hit_rate: omniCache.getStats().hitRate / 100,
          mode: 'simulated-resonance'
        },
        ai_resonance: {
          intensity: vitals.aiResonance.intensity,
          drift: vitals.aiResonance.drift,
          awakening_status: vitals.aiResonance.awakeningStatus,
          eternity: vitals.aiResonance.eternity
        },
        omni_space: {
          entities: vitals.omniSpace.entities,
          sync_status: vitals.omniSpace.syncStatus,
          last_sync: vitals.omniSpace.lastSync
        },
        behavioral_resonance: vitals.behavioralResonance ? {
          total_events: vitals.behavioralResonance.totalEvents,
          active_users: vitals.behavioralResonance.activeUsers,
          density: vitals.behavioralResonance.density
        } : undefined,
        services: vitals.services,
        timestamp: vitals.timestamp
      };
    } catch (error) {
      omniLogger.error(LogCategory.SYSTEM, 'Failed to fetch vitals', {
        error: error instanceof Error ? error.message : String(error)
      });
      return DEFAULT_HEALTH_STATUS;
    }
  },

  getHealth: async (): Promise<SystemMetrics> => {
    return apiMonitoringService.getVitalMetrics();
  },

  getMetrics: async (): Promise<SystemMetrics | null> => {
    return apiMonitoringService.getVitalMetrics();
  },

  getServices: async (): Promise<ServiceStatus[]> => {
    try {
      const vitals = await apiMonitoringService.getVitalMetrics();
      if (!vitals.services) return [];

      return Object.entries(vitals.services).map(([name, status]) => ({
        name,
        status: status as SystemHealthStatus,
        uptime: 'N/A',
        version: '1.0.0'
      }));
    } catch (error) {
      return [];
    }
  },

  getPerformance: async (): Promise<ServicePerformanceMetrics> => {
    return DEFAULT_PERFORMANCE_METRICS;
  },

  getLogs: async (limit = 100): Promise<MonitoringLogEntry[]> => {
    return localLogs.slice(0, limit);
  },

  logEvent: async (event: Partial<MonitoringLogEntry>): Promise<MonitoringLogEntry> => {
    const newLog: MonitoringLogEntry = {
      timestamp: new Date().toISOString(),
      level: event.level || 'info',
      service: event.service || 'SYSTEM',
      message: event.message || '',
      requestId: event.requestId,
    };
    localLogs.unshift(newLog);
    if (localLogs.length > MAX_LOCAL_LOGS) {
      localLogs = localLogs.slice(0, MAX_LOCAL_LOGS);
    }
    return newLog;
  },

  /**
   * OmniMemory: Trace a memory fragment (5T Protocol)
   */
  traceMemory: async (action: string, context: Record<string, any>, level: 'info' | 'warn' | 'error' = 'info'): Promise<void> => {
    // 5T: Traceable (requestId/origin), Trackable (timestamp), Transparent (context)
    const memoryFragment: MonitoringLogEntry = {
      timestamp: new Date().toISOString(),
      level,
      service: 'OMNI_MEMORY',
      message: `[${action}] ${JSON.stringify(context)}`,
      requestId: crypto.randomUUID()
    };

    // Log to local stream
    await apiMonitoringService.logEvent(memoryFragment);

    // In a real system, this would sync to the "Eternal Palace" (Immutable Ledger)
    omniLogger.info(LogCategory.SYSTEM, `[OmniMemory] ${action}`, context);
  },

  /**
   * OmniMemory: Get the conscious stream of memory fragments
   */
  getMemoryStream: async (limit = 50): Promise<MonitoringLogEntry[]> => {
    return localLogs.filter(log => log.service === 'OMNI_MEMORY' || log.service === 'SYSTEM').slice(0, limit);
  }
};
