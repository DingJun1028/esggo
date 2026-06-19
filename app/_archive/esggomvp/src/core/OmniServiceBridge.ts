import { OmniOne } from './omni-one';
import { OmniAssetTag, OMNI_SERVICE_MATRIX } from './constants/OmniMetadata';
import { IOmniAtom } from './omni-types';

/**
 * 🌉 OmniServiceBridge: Universal Unified Gateway (v1.6.0)
 * --------------------------------------------------------
 * Responsibility: Provide a standardized, type-safe interface for all 24 MECE services
 * to manifest 5T atoms and ensure architectural alignment.
 * 
 * 以終為始，始終如一，善向永續。♾️
 */
export class OmniServiceBridge {
    /**
     * 🌀 manifestServiceAsset: Helper to manifest any of the 24 services via its Asset Tag.
     */
    public static async manifestServiceAsset<T>(
        tag: OmniAssetTag,
        payload: T,
        intent?: string,
        impactMetric?: string,
        parentAtom?: string
    ): Promise<IOmniAtom<T>> {
        const metadata = OMNI_SERVICE_MATRIX[tag];

        return await OmniOne.manifest<T>({
            intent: intent || `執行服務: ${metadata.name}`,
            type: this.mapCategoryToType(metadata.category),
            payload,
            domainRef: `SERVICE_${metadata.id}_${metadata.category}`,
            tags: [tag, metadata.category, metadata.gate],
            impactMetric: impactMetric || metadata.definition,
            parentAtom,
            formula: this.getDefaultFormula(tag),
            sourceOrigin: 'OmniServiceBridge_v1.6'
        });
    }

    /** 🧩 Sub-Bridges for easier discovery */

    static get cognitive() {
        return {
            manifestDashboard: (data: any, intent?: string, impactMetric?: string) => this.manifestServiceAsset(OmniAssetTag.IDENTITY_PROFILE, data, intent, impactMetric),
            manifestCore: (data: any, intent?: string, impactMetric?: string) => this.manifestServiceAsset(OmniAssetTag.INTELLIGENCE_CORE, data, intent, impactMetric),
            manifestDaily: (data: any, intent?: string, impactMetric?: string) => this.manifestServiceAsset(OmniAssetTag.NOTE_DAILY, data, intent, impactMetric),
            manifestKnowledge: (data: any, intent?: string, impactMetric?: string) => this.manifestServiceAsset(OmniAssetTag.KNOWLEDGE_ATOM, data, intent, impactMetric),
            manifestPrediction: (data: any, intent?: string, impactMetric?: string) => this.manifestServiceAsset(OmniAssetTag.GNOSIS_PREDICTION, data, intent, impactMetric),
        };
    }

    static get excellence() {
        return {
            manifestAudit: (data: any, intent?: string, impactMetric?: string) => this.manifestServiceAsset(OmniAssetTag.AUDIT_CERTIFICATE, data, intent, impactMetric),
            manifestCarbon: (data: any, intent?: string, impactMetric?: string) => this.manifestServiceAsset(OmniAssetTag.CLIMATE_INVENTORY, data, intent, impactMetric),
            manifestHealing: (data: any, intent?: string, impactMetric?: string) => this.manifestServiceAsset(OmniAssetTag.PROCESS_HEALING, data, intent, impactMetric),
            manifestTransition: (data: any, intent?: string, impactMetric?: string) => this.manifestServiceAsset(OmniAssetTag.CONTRACT_TRANSITION, data, intent, impactMetric),
            manifestFinance: (data: any, intent?: string, impactMetric?: string) => this.manifestServiceAsset(OmniAssetTag.TRANSACTION_ASSET, data, intent, impactMetric),
        };
    }

    static get governance() {
        return {
            manifestReport: (data: any, intent?: string, impactMetric?: string) => this.manifestServiceAsset(OmniAssetTag.REPORT_FORGE, data, intent, impactMetric),
            manifestEvidence: (data: any, intent?: string, impactMetric?: string) => this.manifestServiceAsset(OmniAssetTag.VAULT_EVIDENCE, data, intent, impactMetric),
            manifestPassport: (data: any, intent?: string, impactMetric?: string) => this.manifestServiceAsset(OmniAssetTag.IDENTITY_PASSPORT, data, intent, impactMetric),
            manifestAlert: (data: any, intent?: string, impactMetric?: string) => this.manifestServiceAsset(OmniAssetTag.INTELLIGENCE_ALERT, data, intent, impactMetric),
            manifestDecision: (data: any, intent?: string, impactMetric?: string) => this.manifestServiceAsset(OmniAssetTag.DECISION_CENTER, data, intent, impactMetric),
        };
    }

    static get agency() {
        return {
            manifestForge: (data: any, intent?: string, impactMetric?: string) => this.manifestServiceAsset(OmniAssetTag.SATELLITE_AGENT, data, intent, impactMetric),
            manifestTask: (data: any, intent?: string, impactMetric?: string) => this.manifestServiceAsset(OmniAssetTag.PROCESS_MATRIX, data, intent, impactMetric),
            manifestFlow: (data: any, intent?: string, impactMetric?: string) => this.manifestServiceAsset(OmniAssetTag.PROCESS_FLOW, data, intent, impactMetric),
            manifestNote: (data: any, intent?: string, impactMetric?: string) => this.manifestServiceAsset(OmniAssetTag.NOTE_ALERT, data, intent, impactMetric),
        };
    }

    /** ⚙️ Utility Helpers */

    private static mapCategoryToType(category: string): any {
        switch (category) {
            case 'Cognitive': return 'Intelligence';
            case 'Excellence': return 'Transaction';
            case 'Governance': return 'Contract';
            case 'Agency': return 'Satellite';
            default: return 'Note';
        }
    }

    private static getDefaultFormula(tag: OmniAssetTag): string {
        // Specific formulas based on 5T requirements
        switch (tag) {
            case OmniAssetTag.CLIMATE_INVENTORY: return '$E = \\sum (AD_{scope} \\times EF_{int})$';
            case OmniAssetTag.INTELLIGENCE_CORE: return '$W = \\sum (w_i \\times d_i)$';
            default: return '$E = \\sum (AD \\times EF)$';
        }
    }
}
