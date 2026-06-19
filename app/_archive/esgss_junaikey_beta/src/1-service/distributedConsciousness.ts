import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger.js';
import { realTimeDataSync } from './realTimeDataSync.js';
import { sovereignVaultService } from '../services/SovereignVaultService.js';
import { swarmConsensusService } from '../services/SwarmConsensusService.js';

/**
 * 🌀 分佈式意識協調整合服務 (Distributed Consciousness Coordinator)
 * --------------------------------------------------
 * [協議] 🔴 Phase 28: 自我進化與全域主權
 * 
 * 核心職責：
 * 1. 協調整合數據採集、實時同步、群體審計與主權錨定的完整生命週期。
 * 2. 確保「服務即教學」的過程中，每一階段皆符合 5T 協議。
 */

export class DistributedConsciousness {
    private static instance: DistributedConsciousness;

    private constructor() {
        this.initSystemListeners();
    }

    public static getInstance(): DistributedConsciousness {
        if (!DistributedConsciousness.instance) {
            DistributedConsciousness.instance = new DistributedConsciousness();
        }
        return DistributedConsciousness.instance;
    }

    private initSystemListeners() {
        omniLogger.info(LogCategory.SYSTEM, '[DistributedConsciousness] Orchestrator Initialized');

        // T3-Trackable: 自動監聽新數據同步請求
        realTimeDataSync.subscribe('incoming_data_ingestion', async (data: any) => {
            omniLogger.info(LogCategory.BUSINESS, '[T2-Traceable] Ingesting new data for distributed processing', { origin: data.source });
            await this.processLifecycle(data.payload, data.source);
        });
    }

    /**
     * 數據生命週期處理流程 (Lifecycle Process)
     * Ingestion -> Sync -> Audit -> Anchor -> Finalize
     */
    public async processLifecycle(data: any, source: string): Promise<string> {
        const startTime = Date.now();
        omniLogger.info(LogCategory.BUSINESS, 'Starting Distributed Data Lifecycle', { source });

        try {
            // 1. 廣播數據同步 (Sync Phase)
            realTimeDataSync.publish('distributed_sync_init', {
                payload: data,
                source,
                timestamp: startTime
            });

            // 2. 數據錨定與群體審計 (Audit & Anchor Phase)
            // anchorData 內部已整合 swarmConsensusService.performSwarmAudit
            const packet = await sovereignVaultService.anchorData(data, source);

            // 3. 獲取共識狀態 (Consensus Status)
            const report = swarmConsensusService.getConsensusReport(packet.cid);

            // 4. 定向發佈「真實結晶」狀態 (Finalize)
            realTimeDataSync.publish('distributed_lifecycle_complete', {
                cid: packet.cid,
                consensus: report.status,
                harmony: report.averageHarmony,
                duration: Date.now() - startTime
            });

            omniLogger.info(LogCategory.BUSINESS, '[T1-Tangible] Distributed Lifecycle Complete', {
                cid: packet.cid,
                consensus: report.status
            });

            return packet.cid;
        } catch (error) {
            omniLogger.error(LogCategory.SYSTEM, 'Distributed Lifecycle Failed', { error });
            throw error;
        }
    }
}

export const distributedConsciousness = DistributedConsciousness.getInstance();
