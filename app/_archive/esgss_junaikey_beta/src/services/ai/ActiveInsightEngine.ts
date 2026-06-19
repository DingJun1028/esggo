import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger';
import { OmniEsgManager } from '@/1-service/OmniEsgManager';
import { OmniSpaceService } from '@/services/OmniSpaceService';
import { omniGemini } from '@/services/OmniGeminiService';
import { ITrinityService, IInfoOneTrinity, Protocol5T, IOmniKB } from '@/omni/core/types/InfoOne.types';
import { OmniCrypto } from '@/utils/OmniCrypto';

/**
 * ActiveInsightEngine
 * -------------------
 * Proactively scans the Omni System (EsgManager + OmniSpace) to generate
 * actionable insights. It serves as the "Pre-Cognition" layer.
 */
export class ActiveInsightEngine implements ITrinityService {
    private static instance: ActiveInsightEngine;
    private esgManager: OmniEsgManager; // Injected or Singleton
    private spaceService: OmniSpaceService;
    private insights: Map<string, any> = new Map();

    private constructor(esgManager: OmniEsgManager, spaceService: OmniSpaceService) {
        this.esgManager = esgManager;
        this.spaceService = spaceService;
        this.startScanning();
    }

    public static getInstance(esgManager: OmniEsgManager, spaceService: OmniSpaceService): ActiveInsightEngine {
        if (!ActiveInsightEngine.instance) {
            ActiveInsightEngine.instance = new ActiveInsightEngine(esgManager, spaceService);
        }
        return ActiveInsightEngine.instance;
    }

    private startScanning() {
        setInterval(async () => {
            await this.generateInsight();
        }, 10000); // Scan every 10 seconds
    }

    private async generateInsight() {
        omniLogger.info(LogCategory.AI, '[ActiveInsight] Scanning system state for insights...');

        // Mock data consolidation
        const context = {
            systemRisk: 'LOW', // derived from EsgManager
            spatialRisk: 'LOW', // derived from SpaceService
            activeComponents: 5
        };

        const prompt = `Analyze the system context: ${JSON.stringify(context)}. Generate one proactive insight for system optimization.`;

        try {
            // In a real scenario, we'd use omniGemini.generateText(prompt);
            // For now, we simulate an insight.
            const insightId = `INSIGHT-${Date.now()}`;
            const insightContent = `System operating at nominal efficiency. Suggest running a calibration cycle.`;

            this.insights.set(insightId, {
                id: insightId,
                content: insightContent,
                timestamp: Date.now(),
                verified: false // Needs 5T verification
            });

            omniLogger.info(LogCategory.AI, `[ActiveInsight] Generated: ${insightContent}`);

        } catch (error) {
            omniLogger.error(LogCategory.AI, 'Failed to generate insight', error);
        }
    }

    /**
     * ITrinityService Implementation
     */
    public async getTrinity(id: string): Promise<IInfoOneTrinity> {
        const insight = this.insights.get(id);
        if (!insight) throw new Error(`Insight ${id} not found`);

        const knowledge: IOmniKB = {
            id: `KB-INSIGHT-${insight.id}`,
            content: insight.content,
            sourceOrigin: 'ActiveInsightEngine_Gen1',
            tags: [Protocol5T.TRACEABLE, Protocol5T.TRANSPARENT],
            formula: 'INSIGHT_GEN_V1',
            hashLock: OmniCrypto.hash(`KB-INSIGHT-${insight.id}-${insight.timestamp}`)
        };

        const component: any = { // Cast to any to avoid strict type checks for now, or match IOmniComponent
            id: insight.id,
            name: 'Insight Node',
            state: 'READY',
            impactMetric: 'High',
            lifecyclePath: ['GENERATE'],
            execute: async () => insight,
            cleanup: async () => { }
        };

        const identity: any = {
            id: `TAG-${insight.id}`,
            type: 'KNOWLEDGE', // OmniTagType.KNOWLEDGE
            name: 'Insight',
            value: insight.id,
            createdAt: new Date(),
            protocol: [Protocol5T.TRACEABLE],
            signature: OmniCrypto.hash(insight.id)
        };

        return {
            uuid: insight.id,
            version: '1.0',
            timestamp: Date.now(),
            component,
            knowledge,
            identity,
            lock: () => { },
            isLocked: () => false
        };
    }
}
