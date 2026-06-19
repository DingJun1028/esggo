import { IOmniAtom } from './omni-types';
import { omniLogger, LogCategory } from './omniLogger';
import { ESG_REPORT_GUIDE_CONTENT } from '../content/esg_report_guide';
import { SDGS_GUIDE_CONTENT } from '../content/sdgs_guide';

/**
 * 📚 UserKnowledgeBase: The Personal ESG Sanctuary
 * Stores user-specific distillations and verified knowledge assets.
 * 🏗️ v13.0: Now acting as a cached node for OmniUserBiSyncCenter
 */
export class UserKnowledgeBase {
    private static knowledge = new Map<string, IOmniAtom<any>>([
        ['ask-esg-guide-seed-1', {
            uuid: 'ask-esg-guide-seed-1',
            version: '1.0.0',
            timestamp: Date.now(),
            domainRef: 'Gnosis_Sanctuary',
            payload: {
                title: 'ESG 報告書撰寫：3 大國際準則、編製流程與 5T 驗算全域掌握',
                content: ESG_REPORT_GUIDE_CONTENT,
                tags: ['ESG', 'GRI', 'SASB', 'TCFD', '報告書', '5T']
            },
            tags: [{ id: 't1', semantic: 'ESG Reporting', dimension: 'Context', weight: 1 }],
            signature: 'hash-locked-genesis',
            isFrozen: true,
            status: 'Trustworthy'
        } as unknown as IOmniAtom<any>],
        ['ask-sdgs-seed-1', {
            uuid: 'ask-sdgs-seed-1',
            version: '1.0.0',
            timestamp: Date.now(),
            domainRef: 'Gnosis_Sanctuary',
            payload: {
                title: 'ESG Go! SDGs目標懶人包：3大分類、17個指標項目、案例解析',
                content: SDGS_GUIDE_CONTENT,
                tags: ['ESG', 'SDGs', '環境', '社會', '經濟', '治理']
            },
            tags: [{ id: 't2', semantic: 'SDGs Guide', dimension: 'Context', weight: 1 }],
            signature: 'hash-locked-sdgs',
            isFrozen: true,
            status: 'Trustworthy'
        } as unknown as IOmniAtom<any>]
    ]);

    /**
     * 🧠 Distill: Save verified knowledge to the personal base.
     */
    public static distill(atom: IOmniAtom<any>): void {
        this.knowledge.set(atom.uuid, atom);
        omniLogger.info(LogCategory.SYSTEM, `KnowledgeBase: Atom ${atom.uuid} distilled into personal sanctuary.`);

        // 🚀 自動發起同步請求 (若同步中心已載入)
        import('./omni-user-sync-center').then(m => {
            m.omniSyncCenter.persist(atom);
        }).catch(() => {
            // 降級處理：僅保留本地內存
        });
    }

    /**
     * 🔍 Recall: Retrieve distilled knowledge by UUID.
     */
    public static recall(uuid: string): IOmniAtom<any> | undefined {
        return this.knowledge.get(uuid);
    }

    /**
     * 📖 Library: List all personal knowledge assets.
     */
    public static getLibrary(): IOmniAtom<any>[] {
        return Array.from(this.knowledge.values());
    }

    /**
     * 🌐 RecallAllByDomain: Retrieve all knowledge atoms for a specific domain.
     */
    public static async recallAllByDomain(domain: string): Promise<IOmniAtom<any>[]> {
        return Array.from(this.knowledge.values()).filter(atom => atom.domainRef === domain);
    }

    /**
     * 🧹 Clear: Reset local sanctuary (Dev only)
     */
    public static clear(): void {
        this.knowledge.clear();
    }
}
