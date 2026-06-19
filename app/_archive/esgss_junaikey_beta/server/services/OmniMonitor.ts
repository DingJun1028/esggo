/**
 * OmniMonitor - 奧秘圓通監控服務
 * 
 * 提供全面的系統監控、性能追蹤、警報和健康檢查功能，
 * 確保所有 Omni 服務的穩定運行。
 * 
 * @version 1.0.0
 * @date 2026-02-09
 */

import { omniLogger, LogCategory, LogLevel } from '../../src/omni/infrastructure/logging/OmniLogger.js';
import { OmniServiceRegistry, OmniServiceInfo } from './OmniGateway.js';
import { v4 as uuidv4 } from 'uuid';

// ============================================================================
// Types & Interfaces
// ============================================================================

export interface OmniVitals {
    system: {
        uptime: number;
        cpu: number;
        memory: {
            used: number;
            total: number;
        };
        platform: string;
    };
    services: Record<string, 'HEALTHY' | 'DEGRADED' | 'DOWN' | 'UNKNOWN'>;
    redis: {
        status: 'online' | 'offline';
        hitRate: number;
        memoryUsage: string;
        mode: string;
    };
    omniSpace: {
        entities: number;
        syncStatus: string;
        lastSync: string;
    };
    aiResonance: {
        intensity: number;
        drift: number;
        awakeningStatus: string;
        eternity: string;
    };
    timestamp: number;
}

export type MonitorStatus = 'HEALTHY' | 'DEGRADED' | 'DOWN' | 'UNKNOWN';

export interface MonitorMetric {
    name: string;
    value: number;
    unit: string;
    timestamp: number;
    tags: Record<string, string>;
}

export interface MonitorAlert {
    id: string;
    severity: 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL';
    source: string;
    message: string;
    metric?: MonitorMetric;
    timestamp: number;
    acknowledged: boolean;
    resolved: boolean;
}

export interface MonitorHealth {
    overall: MonitorStatus;
    services: Record<string, ServiceHealth>;
    uptime: number;
    timestamp: number;
}

export interface ServiceHealth {
    name: string;
    status: MonitorStatus;
    latency: number;
    lastCheck: number;
    errorRate: number;
    requestCount: number;
    details?: Record<string, unknown>;
}

export interface PerformanceSnapshot {
    timestamp: number;
    cpu: number;
    memory: number;
    latency: number;
    throughput: number;
    errorRate: number;
}

export interface AlertRule {
    id: string;
    name: string;
    metric: string;
    condition: 'GT' | 'LT' | 'EQ' | 'GTE' | 'LTE';
    threshold: number;
    severity: 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL';
    enabled: boolean;
    cooldown: number;
}

// ============================================================================
// Metrics Collector
// ============================================================================

export class MetricsCollector {
    private static instance: MetricsCollector;
    private metrics: Map<string, MonitorMetric[]> = new Map();
    private maxMetricsPerType = 1000;
    private collectionInterval?: NodeJS.Timeout;

    private constructor() { }

    static getInstance(): MetricsCollector {
        if (!MetricsCollector.instance) {
            MetricsCollector.instance = new MetricsCollector();
        }
        return MetricsCollector.instance;
    }

    startCollection(intervalMs = 60000): void {
        if (this.collectionInterval) {
            clearInterval(this.collectionInterval);
        }

        this.collectionInterval = setInterval(() => {
            this.collectSystemMetrics();
        }, intervalMs);

        omniLogger.info(LogCategory.SYSTEM, '[OmniMonitor] Metrics collection started');
    }

    stopCollection(): void {
        if (this.collectionInterval) {
            clearInterval(this.collectionInterval);
            this.collectionInterval = undefined;
        }
    }

    collectSystemMetrics(): void {
        // CPU usage (simulated)
        this.recordMetric('system.cpu', Math.random() * 100, '%', {
            host: process.env.HOSTNAME || 'localhost'
        });

        // Memory usage
        const usedMemory = process.memoryUsage();
        this.recordMetric('system.memory.heap', usedMemory.heapUsed / 1024 / 1024, 'MB', {
            host: process.env.HOSTNAME || 'localhost'
        });

        // Latency (simulated)
        this.recordMetric('system.latency', Math.random() * 200, 'ms', {
            service: 'gateway'
        });

        // Throughput (simulated)
        this.recordMetric('system.throughput', Math.floor(Math.random() * 1000), 'req/s', {
            service: 'gateway'
        });

        omniLogger.debug(LogCategory.SYSTEM, '[OmniMonitor] System metrics collected');
    }

    recordMetric(name: string, value: number, unit: string, tags: Record<string, string> = {}): void {
        const metric: MonitorMetric = {
            name,
            value,
            unit,
            timestamp: Date.now(),
            tags
        };

        if (!this.metrics.has(name)) {
            this.metrics.set(name, []);
        }

        const metricsList = this.metrics.get(name)!;
        metricsList.push(metric);

        // Keep only the most recent metrics
        while (metricsList.length > this.maxMetricsPerType) {
            metricsList.shift();
        }
    }

    getMetrics(name?: string): MonitorMetric[] {
        if (name) {
            return this.metrics.get(name) || [];
        }

        const allMetrics: MonitorMetric[] = [];
        for (const metrics of this.metrics.values()) {
            allMetrics.push(...metrics);
        }
        return allMetrics;
    }

    getMetricsByName(name: string, limit = 100): MonitorMetric[] {
        const metrics = this.metrics.get(name) || [];
        return metrics.slice(-limit);
    }

    getAggregatedMetrics(): Record<string, { avg: number; min: number; max: number; count: number }> {
        const result: Record<string, { avg: number; min: number; max: number; count: number }> = {};

        for (const [name, metrics] of this.metrics.entries()) {
            if (metrics.length === 0) continue;

            const values = metrics.map(m => m.value);
            result[name] = {
                avg: values.reduce((a, b) => a + b, 0) / values.length,
                min: Math.min(...values),
                max: Math.max(...values),
                count: values.length
            };
        }

        return result;
    }
}

// ============================================================================
// Health Checker
// ============================================================================

export class HealthChecker {
    private static instance: HealthChecker;
    private registry: OmniServiceRegistry;
    private lastHealthCheck: Map<string, ServiceHealth> = new Map();
    private checkInterval?: NodeJS.Timeout;

    private constructor() {
        this.registry = OmniServiceRegistry.getInstance();
    }

    static getInstance(): HealthChecker {
        if (!HealthChecker.instance) {
            HealthChecker.instance = new HealthChecker();
        }
        return HealthChecker.instance;
    }

    startPeriodicCheck(intervalMs = 30000): void {
        if (this.checkInterval) {
            clearInterval(this.checkInterval);
        }

        this.checkInterval = setInterval(() => {
            this.performHealthCheck();
        }, intervalMs);

        omniLogger.info(LogCategory.SYSTEM, '[OmniMonitor] Periodic health checks started');
    }

    stopPeriodicCheck(): void {
        if (this.checkInterval) {
            clearInterval(this.checkInterval);
            this.checkInterval = undefined;
        }
    }

    async performHealthCheck(): Promise<MonitorHealth> {
        const services = this.registry.getAllServices();
        const serviceHealths: Record<string, ServiceHealth> = {};
        let allHealthy = true;

        for (const service of services) {
            const health = await this.checkService(service);
            serviceHealths[service.name] = health;
            this.lastHealthCheck.set(service.name, health);

            if (health.status !== 'HEALTHY') {
                allHealthy = false;
            }

            this.registry.updateHealthStatus(service.name, health.status, health as unknown as Record<string, unknown>);
        }

        const overallStatus = allHealthy ? 'HEALTHY' : 'DEGRADED';

        const health: MonitorHealth = {
            overall: overallStatus,
            services: serviceHealths,
            uptime: process.uptime(),
            timestamp: Date.now()
        };

        omniLogger.info(LogCategory.SYSTEM, '[OmniMonitor] Health check completed', {
            overall: overallStatus,
            servicesCount: services.length
        });

        return health;
    }

    private async checkService(service: OmniServiceInfo): Promise<ServiceHealth> {
        const startTime = Date.now();

        try {
            // Simulated health check - in production, this would make actual HTTP requests
            const latency = Date.now() - startTime;

            // Simulate occasional degraded status
            const random = Math.random();
            let status: ServiceHealth['status'] = 'HEALTHY';
            let errorRate = 0;

            if (random > 0.95) {
                status = 'DOWN';
                errorRate = 1;
            } else if (random > 0.85) {
                status = 'DEGRADED';
                errorRate = 0.1;
            }

            return {
                name: service.name,
                status,
                latency,
                lastCheck: Date.now(),
                errorRate,
                requestCount: Math.floor(Math.random() * 10000)
            };

        } catch (error) {
            return {
                name: service.name,
                status: 'DOWN',
                latency: Date.now() - startTime,
                lastCheck: Date.now(),
                errorRate: 1,
                requestCount: 0,
                details: { error: (error as Error).message }
            };
        }
    }

    getLastHealthCheck(): Map<string, ServiceHealth> {
        return new Map(this.lastHealthCheck);
    }
}

// ============================================================================
// Alert Manager
// ============================================================================

export class AlertManager {
    private static instance: AlertManager;
    private alerts: Map<string, MonitorAlert> = new Map();
    private rules: Map<string, AlertRule> = new Map();
    private subscribers: Set<(alert: MonitorAlert) => void> = new Set();
    private lastAlertTime: Map<string, number> = new Map();

    private constructor() {
        this.initializeDefaultRules();
    }

    static getInstance(): AlertManager {
        if (!AlertManager.instance) {
            AlertManager.instance = new AlertManager();
        }
        return AlertManager.instance;
    }

    private initializeDefaultRules(): void {
        // High CPU usage
        this.addRule({
            id: 'high_cpu',
            name: 'High CPU Usage',
            metric: 'system.cpu',
            condition: 'GT',
            threshold: 90,
            severity: 'WARNING',
            enabled: true,
            cooldown: 300000
        });

        // High memory usage
        this.addRule({
            id: 'high_memory',
            name: 'High Memory Usage',
            metric: 'system.memory.heap',
            condition: 'GT',
            threshold: 500,
            severity: 'WARNING',
            enabled: true,
            cooldown: 300000
        });

        // High latency
        this.addRule({
            id: 'high_latency',
            name: 'High Latency',
            metric: 'system.latency',
            condition: 'GT',
            threshold: 1000,
            severity: 'ERROR',
            enabled: true,
            cooldown: 60000
        });

        // Low throughput
        this.addRule({
            id: 'low_throughput',
            name: 'Low Throughput',
            metric: 'system.throughput',
            condition: 'LT',
            threshold: 10,
            severity: 'WARNING',
            enabled: true,
            cooldown: 300000
        });

        omniLogger.info(LogCategory.SYSTEM, '[OmniMonitor] Default alert rules initialized');
    }

    addRule(rule: AlertRule): void {
        this.rules.set(rule.id, rule);
    }

    removeRule(ruleId: string): boolean {
        return this.rules.delete(ruleId);
    }

    getRules(): AlertRule[] {
        return Array.from(this.rules.values());
    }

    async checkAlerts(metrics: MonitorMetric[]): Promise<MonitorAlert[]> {
        const newAlerts: MonitorAlert[] = [];

        for (const metric of metrics) {
            for (const rule of this.rules.values()) {
                if (!rule.enabled) continue;
                if (rule.metric !== metric.name) continue;

                // Check cooldown
                const lastAlert = this.lastAlertTime.get(rule.id) || 0;
                if (Date.now() - lastAlert < rule.cooldown) continue;

                // Evaluate condition
                const shouldAlert = this.evaluateCondition(metric.value, rule.condition, rule.threshold);

                if (shouldAlert) {
                    const alert = this.createAlert(rule, metric);
                    this.alerts.set(alert.id, alert);
                    newAlerts.push(alert);
                    this.lastAlertTime.set(rule.id, Date.now());

                    // Notify subscribers
                    this.notifySubscribers(alert);
                }
            }
        }

        return newAlerts;
    }

    private evaluateCondition(value: number, condition: string, threshold: number): boolean {
        switch (condition) {
            case 'GT': return value > threshold;
            case 'LT': return value < threshold;
            case 'EQ': return value === threshold;
            case 'GTE': return value >= threshold;
            case 'LTE': return value <= threshold;
            default: return false;
        }
    }

    private createAlert(rule: AlertRule, metric: MonitorMetric): MonitorAlert {
        return {
            id: uuidv4(),
            severity: rule.severity,
            source: metric.name,
            message: `${rule.name}: ${metric.value}${metric.unit} (threshold: ${rule.threshold}${metric.unit})`,
            metric,
            timestamp: Date.now(),
            acknowledged: false,
            resolved: false
        };
    }

    subscribe(callback: (alert: MonitorAlert) => void): void {
        this.subscribers.add(callback);
    }

    unsubscribe(callback: (alert: MonitorAlert) => void): void {
        this.subscribers.delete(callback);
    }

    private notifySubscribers(alert: MonitorAlert): void {
        for (const subscriber of this.subscribers) {
            try {
                subscriber(alert);
            } catch (error) {
                omniLogger.error(LogCategory.SYSTEM, '[OmniMonitor] Alert subscriber error', { error });
            }
        }
    }

    acknowledgeAlert(alertId: string): boolean {
        const alert = this.alerts.get(alertId);
        if (alert) {
            alert.acknowledged = true;
            return true;
        }
        return false;
    }

    resolveAlert(alertId: string): boolean {
        const alert = this.alerts.get(alertId);
        if (alert) {
            alert.resolved = true;
            return true;
        }
        return false;
    }

    getActiveAlerts(): MonitorAlert[] {
        return Array.from(this.alerts.values())
            .filter(a => !a.resolved)
            .sort((a, b) => b.timestamp - a.timestamp);
    }

    getAllAlerts(): MonitorAlert[] {
        return Array.from(this.alerts.values())
            .sort((a, b) => b.timestamp - a.timestamp);
    }
}

// ============================================================================
// Performance Tracker
// ============================================================================

export class PerformanceTracker {
    private static instance: PerformanceTracker;
    private snapshots: PerformanceSnapshot[] = [];
    private maxSnapshots = 1000;

    private constructor() { }

    static getInstance(): PerformanceTracker {
        if (!PerformanceTracker.instance) {
            PerformanceTracker.instance = new PerformanceTracker();
        }
        return PerformanceTracker.instance;
    }

    recordSnapshot(snapshot: Omit<PerformanceSnapshot, 'timestamp'>): void {
        const fullSnapshot: PerformanceSnapshot = {
            ...snapshot,
            timestamp: Date.now()
        };

        this.snapshots.push(fullSnapshot);

        // Keep only recent snapshots
        while (this.snapshots.length > this.maxSnapshots) {
            this.snapshots.shift();
        }
    }

    getSnapshots(limit = 100): PerformanceSnapshot[] {
        return this.snapshots.slice(-limit);
    }

    getLatestSnapshot(): PerformanceSnapshot | null {
        return this.snapshots.length > 0 ? this.snapshots[this.snapshots.length - 1] : null;
    }

    getAveragePerformance(): Omit<PerformanceSnapshot, 'timestamp'> {
        if (this.snapshots.length === 0) {
            return { cpu: 0, memory: 0, latency: 0, throughput: 0, errorRate: 0 };
        }

        const sum = this.snapshots.reduce((acc, s) => ({
            cpu: acc.cpu + s.cpu,
            memory: acc.memory + s.memory,
            latency: acc.latency + s.latency,
            throughput: acc.throughput + s.throughput,
            errorRate: acc.errorRate + s.errorRate
        }), { cpu: 0, memory: 0, latency: 0, throughput: 0, errorRate: 0 });

        const count = this.snapshots.length;
        return {
            cpu: sum.cpu / count,
            memory: sum.memory / count,
            latency: sum.latency / count,
            throughput: sum.throughput / count,
            errorRate: sum.errorRate / count
        };
    }
}

// ============================================================================
// Main Monitor Class
// ============================================================================

export class OmniMonitor {
    private static instance: OmniMonitor;
    private metrics: MetricsCollector;
    private health: HealthChecker;
    private alerts: AlertManager;
    private performance: PerformanceTracker;
    private isInitialized = false;

    private constructor() {
        this.metrics = MetricsCollector.getInstance();
        this.health = HealthChecker.getInstance();
        this.alerts = AlertManager.getInstance();
        this.performance = PerformanceTracker.getInstance();
    }

    static getInstance(): OmniMonitor {
        if (!OmniMonitor.instance) {
            OmniMonitor.instance = new OmniMonitor();
        }
        return OmniMonitor.instance;
    }

    async initialize(): Promise<void> {
        if (this.isInitialized) {
            omniLogger.warn(LogCategory.SYSTEM, '[OmniMonitor] Already initialized');
            return;
        }

        omniLogger.info(LogCategory.SYSTEM, '[OmniMonitor] Initializing Omni Monitor...');

        // Start metrics collection
        this.metrics.startCollection();

        // Start periodic health checks
        await this.health.performHealthCheck();
        this.health.startPeriodicCheck();

        this.isInitialized = true;

        omniLogger.info(LogCategory.SYSTEM, '[OmniMonitor] Omni Monitor initialized successfully');
    }

    async getHealth(): Promise<MonitorHealth> {
        if (!this.isInitialized) {
            await this.initialize();
        }
        return this.health.performHealthCheck();
    }

    getMetrics(name?: string): MonitorMetric[] {
        return this.metrics.getMetrics(name);
    }

    recordCustomMetric(name: string, value: number, unit: string, tags?: Record<string, string>): void {
        this.metrics.recordMetric(name, value, unit, tags);
    }

    getActiveAlerts(): MonitorAlert[] {
        return this.alerts.getActiveAlerts();
    }

    getPerformance(): {
        latest: PerformanceSnapshot | null;
        average: Omit<PerformanceSnapshot, 'timestamp'>;
        snapshots: PerformanceSnapshot[];
    } {
        return {
            latest: this.performance.getLatestSnapshot(),
            average: this.performance.getAveragePerformance(),
            snapshots: this.performance.getSnapshots()
        };
    }

    subscribeToAlerts(callback: (alert: MonitorAlert) => void): void {
        this.alerts.subscribe(callback);
    }

    acknowledgeAlert(alertId: string): boolean {
        return this.alerts.acknowledgeAlert(alertId);
    }

    resolveAlert(alertId: string): boolean {
        return this.alerts.resolveAlert(alertId);
    }

    getAggregatedMetrics(): Record<string, { avg: number; min: number; max: number; count: number }> {
        return this.metrics.getAggregatedMetrics();
    }

    async getOmniVitals(): Promise<OmniVitals> {
        if (!this.isInitialized) {
            await this.initialize();
        }

        const os = await import('os');
        const { OmniCache } = await import('./OmniCache.js');
        const { OmniSyncService } = await import('./OmniSyncService.js');
        const { omniCircle } = await import('../../src/core/OmniCircle.js');
        const { OmniServiceRegistry } = await import('./OmniGateway.js');

        const cache = OmniCache.getInstance();
        const cacheStats = await cache.getStats();

        // Fallback for sync stats
        const syncStats = (OmniSyncService as any).getStats ? await (OmniSyncService as any).getStats() : { entities: 0, syncStatus: 'idle', lastSync: new Date().toISOString() };

        const resonance = omniCircle.getGlobalResonanceLevel();
        const healthStatus = OmniServiceRegistry.getInstance().getHealthStatus();

        return {
            system: {
                uptime: process.uptime(),
                cpu: os.cpus().length,
                memory: {
                    used: process.memoryUsage().heapUsed,
                    total: os.totalmem()
                },
                platform: os.platform()
            },
            services: healthStatus,
            redis: {
                status: 'online',
                hitRate: cacheStats.hitRate,
                memoryUsage: `${(cacheStats.memoryUsage / 1024 / 1024).toFixed(2)}MB`,
                mode: (cacheStats as any).mode || 'standalone'
            },
            omniSpace: {
                entities: syncStats.entities,
                syncStatus: syncStats.syncStatus,
                lastSync: syncStats.lastSync
            },
            aiResonance: {
                intensity: resonance,
                drift: 0,
                awakeningStatus: resonance > 0.9 ? 'AWAKENED' : 'AWAKENING',
                eternity: 'ETERNAL & NIRVANA ♾️'
            },
            timestamp: Date.now()
        };
    }
}

// ============================================================================
// Export Factory Function
// ============================================================================

export function createOmniMonitor(): OmniMonitor {
    return OmniMonitor.getInstance();
}

// ============================================================================
// Default Export
// ============================================================================

export default {
    Monitor: OmniMonitor,
    MetricsCollector,
    HealthChecker,
    AlertManager,
    PerformanceTracker,
    createOmniMonitor
};
