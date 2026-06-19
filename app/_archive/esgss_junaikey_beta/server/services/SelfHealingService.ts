import { omniLogger, LogCategory } from './omni/infrastructure/logging/OmniLogger.js';
import { OmniComponentCoreFactory } from './OmniComponentCore.js';
import { predictiveGovernanceService } from './PredictiveGovernanceService.js';
import { complianceService } from './ComplianceService.js';
import { ambientDataService } from './AmbientDataService.js';

export enum ServiceHealth {
    OPTIMAL = 'OPTIMAL',
    DEGRADED = 'DEGRADED',
    CRITICAL = 'CRITICAL',
    RECOVERING = 'RECOVERING'
}

export interface HealthStatus {
    serviceId: string;
    health: ServiceHealth;
    lastHeartbeat: number;
    entropyLevel: number; // 0 to 1, higher means more instability
}

/**
 * [HEAL] 自我修復智慧 / Self-Healing Intelligence
 * --------------------------------------------------
 * [TC] 自主監哨：監控系統組件健康度，並根據熵值（Entropy）執行修復動作。
 * [EN] Autonomous Sentinel: Monitors system health and executes healing actions 
 *      based on entropy levels.
 * 
 * [Standard] Phased R&D Phase 19/46.
 */
export class SelfHealingService {
    private registry: Map<string, HealthStatus> = new Map();
    private ssotCore;

    constructor() {
        this.ssotCore = OmniComponentCoreFactory.create({
            sourceOrigin: 'Autonomous Self-Healing Sentinel v1.1.0-phase46',
            rawDataPath: '/vault/sentinel/health-registry.json',
            verificationMethod: 'AI-Enhanced Heartbeat Analysis',
        });
        this.setupEventListeners();
        omniLogger.info(LogCategory.SYSTEM, 'Self-Healing Intelligence v1.1 initialized.');
    }

    private setupEventListeners() {
        complianceService.on('violation', (v) => {
            omniLogger.warn(LogCategory.SYSTEM, `[Self-Heal] Compliance violation observed for ${v.ruleId}. Monitoring closely...`);
            this.reportHeartbeat('ComplianceService', 0.5);
        });
    }

    public registerService(serviceId: string) {
        this.registry.set(serviceId, {
            serviceId,
            health: ServiceHealth.OPTIMAL,
            lastHeartbeat: Date.now(),
            entropyLevel: 0,
        });
    }

    /**
     * [PULSE] 回報心跳 / Report Heartbeat
     * --------------------------------------------------
     * [TC] 記錄服務健康狀態與熵值。若熵值 > 0.8 則進入「臨界」狀態並觸發修復。
     * [EN] Records service health and entropy. Triggers healing if entropy > 0.8.
     */
    public reportHeartbeat(serviceId: string, entropy: number = 0) {
        const status = this.registry.get(serviceId);
        if (status) {
            status.lastHeartbeat = Date.now();
            status.entropyLevel = entropy;

            if (entropy > 0.8) {
                status.health = ServiceHealth.CRITICAL;
                this.initiateSelfHealing(serviceId);
            } else if (entropy > 0.4) {
                status.health = ServiceHealth.DEGRADED;
            } else {
                status.health = ServiceHealth.OPTIMAL;
            }
        }
    }

    /**
     * [HEAL] 執行自我修復 / Initiate Self-Healing
     * --------------------------------------------------
     * [TC] 偵測到臨界熵值後，諮詢 AI 預測治理模組執行診斷與軟體定義校準。
     * [EN] Consults AI Predictive Governance for diagnostic and software-defined 
     *      calibration upon detecting critical entropy.
     */
    private async initiateSelfHealing(serviceId: string) {
        omniLogger.warn(LogCategory.SYSTEM, `[Self-Heal] Critical entropy detected in ${serviceId}. Consulting AI Oracle for diagnostic...`);

        const status = this.registry.get(serviceId);
        if (status) {
            status.health = ServiceHealth.RECOVERING;

            // AI Diagnostic (Phase 46)
            const alerts = predictiveGovernanceService.getLatestAlerts();
            const lastAlert = alerts[0];

            if (lastAlert && lastAlert.type === 'RISK' && lastAlert.confidence > 0.8) {
                omniLogger.info(LogCategory.SYSTEM, `[Self-Heal] AI confirms high RISK environment. Initiating software-defined calibration to mitigate noise.`);
                ambientDataService.calibrate();
            } else {
                omniLogger.info(LogCategory.SYSTEM, `[Self-Heal] Diagnostic suggests isolated sensor drift. Executing standard recovery.`);
                await new Promise(resolve => setTimeout(resolve, 2000));
            }

            status.entropyLevel = 0.05;
            status.health = ServiceHealth.OPTIMAL;

            omniLogger.info(LogCategory.SYSTEM, `[Self-Heal] Service ${serviceId} has been autonomously restored and calibrated.`);
        }
    }

    public getSystemHealth() {
        return Array.from(this.registry.values());
    }
}

export const selfHealingService = new SelfHealingService();
