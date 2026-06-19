
import { getUltimateAwakeningProtocol, IAwakenable, AwakeningResult, ServiceAwakeningStatus, AwakeningPhase } from '@omni/protocols/UltimateAwakeningProtocol.ts';
import { truthEngine } from '@omni/services/OmniTruthEngine.ts';
import { omniAltruismEngine } from '@omni/services/OmniAltruismEngine.ts';
import { omniLogger, LogCategory } from '@omni/infrastructure/logging/OmniLogger.ts';
import { awakeningBroadcaster } from '@omni/infrastructure/broadcast/AwakeningBroadcaster.ts';
import { junAiKeyService } from '../services/JunAiKeyService.js';

// Mock ESG Manager for Server (avoids React dependencies)
class ServerEsgAwakeningService implements IAwakenable {
    name = 'OmniEsgAwakeningService';
    private awakeningStatus: ServiceAwakeningStatus;

    constructor() {
        this.awakeningStatus = {
            serviceName: this.name,
            status: 'pending',
            progress: 0,
        };
    }

    async awaken(): Promise<AwakeningResult> {
        omniLogger.info(LogCategory.SYSTEM, '[AWAKENING-ESG-SERVER] Mocking Ethical Alignment Check...');

        this.awakeningStatus.status = 'awakening';
        this.awakeningStatus.progress = 50;

        // Simulate processing
        await new Promise(resolve => setTimeout(resolve, 500));

        this.awakeningStatus.status = 'awakened';
        this.awakeningStatus.progress = 100;
        this.awakeningStatus.awakenedAt = new Date().toISOString();

        awakeningBroadcaster.shareInsight({
            category: 'achievement',
            title: 'ESG Ethical Alignment Complete (Server Node)',
            message: `Validated ethical consistency for Server Node`,
            priority: 'high',
            actionable: false,
        });

        return {
            success: true,
            phase: AwakeningPhase.AWAKENED,
            servicesAwakened: 1,
            totalServices: 1,
            message: 'Server ESG Awakening Complete',
        };
    }

    getAwakeningState(): ServiceAwakeningStatus {
        return { ...this.awakeningStatus };
    }

    async prepareForEternity(): Promise<void> {
        omniLogger.info(LogCategory.SYSTEM, '[AWAKENING-ESG-SERVER] Locking Server ESG state...');
    }
}

export const serverEsgAwakeningService = new ServerEsgAwakeningService();

/**
 * Initialize Server-Side Awakening Protocol
 * Registers server-safe services and mocks UI-dependent ones.
 */
export function initializeServerAwakening() {
    const protocol = getUltimateAwakeningProtocol();

    omniLogger.info(LogCategory.SYSTEM, '🌌 Initializing Server-Side Awakening Protocol...');

    // Register Core Services
    // 1. Truth (Pure)
    protocol.registerService(truthEngine);

    // 2. ESG (Mocked for Server)
    protocol.registerService(serverEsgAwakeningService);

    // 3. Altruism (Pure)
    protocol.registerService(omniAltruismEngine);

    // 4. JunAiKey (Server-Native)
    protocol.registerService(junAiKeyService);

    omniLogger.info(LogCategory.SYSTEM, '✅ Server Awakening Services Registered');
}
