import {
    IAssessmentRecord,
    IAssessmentEngineConfig,
    IVirtueFingerprint,
    IOmniAtom,
    ESGRecord
} from './omni-types';
import { omniLogger, LogCategory } from './omniLogger';
import { v4 as uuidv4 } from 'uuid';

/**
 * 🏛️ OmniAssessmentEngine
 * 
 * 負責將學習資產 (Atoms) 轉化為職能屬性 (Virtues) 的核心算力。
 * 貫徹「成就即資產」的轉換邏輯。
 */
export class OmniAssessmentEngine {
    private static instance: OmniAssessmentEngine;

    // 預設權重配置：定義不同類型對六德的貢獻
    private config: IAssessmentEngineConfig = {
        domainWeights: {
            'ENVIRONMENT': {
                moderation: 0.6, // 節：環境節制
                harmony: 0.3,    // 和：人與自然和諧
                wisdom: 0.1      // 智：綠色智慧
            },
            'SOCIAL': {
                benevolence: 0.6, // 仁：社會仁愛
                courage: 0.2,     // 勇：社會變革勇氣
                harmony: 0.2      // 和：社會群體和諧
            },
            'GOVERNANCE': {
                integrity: 0.6,   // 誠：誠信治理
                wisdom: 0.3,      // 智：治理決策智慧
                courage: 0.1      // 勇：正直治理的勇氣
            }
        }
    };

    private constructor() { }

    public static getInstance(): OmniAssessmentEngine {
        if (!OmniAssessmentEngine.instance) {
            OmniAssessmentEngine.instance = new OmniAssessmentEngine();
        }
        return OmniAssessmentEngine.instance;
    }

    /**
     * 🔮 assessAtom: 評測單一資產並計算職能收益
     */
    public async assessAtom(atom: IOmniAtom<ESGRecord>): Promise<IAssessmentRecord> {
        omniLogger.info(LogCategory.SYSTEM, `🧠 Assessing Atom: ${atom.uuid} for virtue gains...`);

        const category = this.detectCategory(atom);
        const exp = (atom.payload as any).reward || 10; // 預設給予基礎成長

        const weights = this.config.domainWeights[category] || {};
        const gains: Partial<IVirtueFingerprint> = {};

        // 計算各項點數加成
        Object.entries(weights).forEach(([virtue, weight]) => {
            const key = virtue as keyof IVirtueFingerprint;
            gains[key] = Math.max(1, Math.round(exp * (weight as number)));
        });

        const assessment: IAssessmentRecord = {
            uuid: uuidv4(),
            version: '1.0.0',
            timestamp: Date.now(),
            targetAtomUuid: atom.uuid,
            category,
            virtueGains: gains,
            summary: `透過「${atom.intent}」學習，獲得了 ${JSON.stringify(gains)} 的職能提升。`,
            evidence: [
                {
                    target_hash: atom.hash_lock,
                    logic: 'weighted_domain_distribution'
                }
            ],
            lifecycle_events: [{
                id: 'assessment-init',
                action: 'CREATED',
                source_module: 'OmniAssessmentEngine',
                timestamp: Date.now()
            }],
            isFrozen: false,
            hash_lock: `lock_${uuidv4()}`,
            status: 'Trustworthy'
        };

        omniLogger.info(LogCategory.SYSTEM, `✅ Assessment Complete: ${assessment.summary}`);
        return assessment;
    }

    private detectCategory(atom: IOmniAtom<any>): 'ENVIRONMENT' | 'SOCIAL' | 'GOVERNANCE' {
        // 從 tags 或 intent 中自動識別類別
        const tags = (atom.tags || []).map(t => t.semantic.toUpperCase()) as string[];
        if (tags.includes('ENVIRONMENT') || tags.includes('CARBON')) return 'ENVIRONMENT';
        if (tags.includes('SOCIAL') || tags.includes('COMMUNITY')) return 'SOCIAL';
        if (tags.includes('GOVERNANCE') || tags.includes('COMPLIANCE')) return 'GOVERNANCE';

        // 預設根據 Intent 初步判斷
        const intent = (atom.intent || "").toUpperCase();
        if (intent.includes('ENVIRONMENT')) return 'ENVIRONMENT';
        if (intent.includes('SOCIAL')) return 'SOCIAL';
        return 'GOVERNANCE';
    }
}
