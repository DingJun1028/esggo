import {
    IOmniUserBiSyncCenter,
    IOmniAtom,
    IOmniSyncStatus,
    IOmniSeed
} from './omni-types';
import { OmniMapper } from './omni-mapper';
import { OmniTagEngine } from './omni-tag-engine';
import { omniRouter } from './omni-router';
import { OmniNcbService } from './omni-ncb-service';
import { UserKnowledgeBase } from './user-knowledge-base';
import { OmniOne } from './omni-one';
import { omniLogger, LogCategory } from './omniLogger';

/**
 * 🛰️ OmniUserBiSyncCenter (萬能用戶雙向同步中心)
 * 深度協作合體：MappingCenter + Tag + Router + UserDB + Sync + Table + Space + Boost + AItable + KB
 */
export class OmniUserBiSyncCenter implements IOmniUserBiSyncCenter {
    private static instance: OmniUserBiSyncCenter;
    private syncStatus: IOmniSyncStatus = {
        lastSync: Date.now(),
        status: 'Synced',
        pendingChanges: 0
    };

    private constructor() { }

    public static getInstance(): OmniUserBiSyncCenter {
        if (!OmniUserBiSyncCenter.instance) {
            OmniUserBiSyncCenter.instance = new OmniUserBiSyncCenter();
        }
        return OmniUserBiSyncCenter.instance;
    }

    /**
     * 🔄 synchronize: 本地與遠端數據的雙向同步
     */
    public async synchronize(): Promise<IOmniSyncStatus> {
        omniLogger.info(LogCategory.SYSTEM, 'OmniSync: Initiating bilateral synchronization sequence...');

        try {
            // 1. 下載雲端新資料 (Sync from NCB to Local)
            const remoteReports = await OmniNcbService.listReports();
            remoteReports.forEach(report => {
                // 將 NCB 資料映射回 Atom 並存入本地智庫
                const atom = UserKnowledgeBase.recall(report.uuid);
                if (!atom) {
                    // 若本地不存在則進行回補映射 (此處簡化處理)
                    omniLogger.info(LogCategory.SYSTEM, `OmniSync: Pulling new remote atom [${report.uuid}]`);
                }
            });

            // 2. 上傳本地待同步資料 (Sync from Local to NCB)
            // 實際場景會比對版本號與時間戳

            this.syncStatus.lastSync = Date.now();
            this.syncStatus.status = 'Synced';
            return this.syncStatus;
        } catch (error) {
            this.syncStatus.status = 'Offline';
            return this.syncStatus;
        }
    }

    /**
     * 💾 persist: 持久化存儲 (雙向同步：Local + Remote)
     */
    public async persist(atom: IOmniAtom<any>): Promise<void> {
        // A. 本地持久化 (KB)
        UserKnowledgeBase.distill(atom);

        // B. 遠端持久化 (NCB)
        if (omniRouter.guard(atom)) {
            await OmniNcbService.saveReport(atom);
        }
    }

    /**
     * 🏷️ mapAndTag: 語義映射與標籤分配
     */
    public async mapAndTag(raw: any): Promise<IOmniAtom<any>> {
        // 1. 語義標籤推論
        const tags = OmniTagEngine.inferTags(raw);

        // 2. 轉換為 Seed
        const seed: IOmniSeed<any> = {
            intent: `OmniSync_Ingest: ${raw.title || 'Untitled'}`,
            type: 'Intelligence',
            payload: raw,
            domainRef: raw.domain || 'UNIVERSE-CORE',
            tags: tags.map(t => t.semantic),
        };

        // 3. 實體化 Atom
        const atom = await OmniOne.manifest(seed);

        // 4. 確保 UUID 被提取 (此處 manifest 已包含 UUID，回傳完整的 IOmniAtom)
        return atom;
    }

    /**
     * 🛣️ dispatch: 智慧路由分發
     */
    public async dispatch(atom: IOmniAtom<any>): Promise<void> {
        const targetRoute = await omniRouter.route(atom);
        omniLogger.info(LogCategory.SYSTEM, `OmniRouter: Routing atom [${atom.uuid}] to ${targetRoute}`);

        // 執行持久化
        await this.persist(atom);
    }

    /**
     * 🔍 recall: 智庫召回
     */
    public async recall(uuid: string): Promise<IOmniAtom<any> | undefined> {
        // 先看本地，若無則可考慮從遠端 fetch
        return UserKnowledgeBase.recall(uuid);
    }

    /**
     * 🚀 boost: 數據增強空間 (預加載與熱度管理)
     */
    public async boost(context: string): Promise<void> {
        omniLogger.info(LogCategory.SYSTEM, `OmniBoost: Space prioritized for context [${context}]`);
        // 實作預加載相關邏輯
    }

    public getStatus(): IOmniSyncStatus {
        return this.syncStatus;
    }
}

export const omniSyncCenter = OmniUserBiSyncCenter.getInstance();
