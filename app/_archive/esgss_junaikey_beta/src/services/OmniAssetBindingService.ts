import { IComponentCore, IEvidenceMap } from '../0-domain/contracts/IComponentCore';
import { omniKeyService } from './OmniKeyService';
import { omniLogger, LogCategory } from '../omni/infrastructure/logging/OmniLogger';

/**
 * 🔒 OmniAssetBindingService: Cryptographic Asset Binding
 * --------------------------------------------------
 * Links ESG knowledge assets to player signatures to ensure 5T [Trustworthy]
 * and [4可1不可] (Immutable) property.
 */
export class OmniAssetBindingService {
    private static instance: OmniAssetBindingService;

    private constructor() { }

    public static getInstance(): OmniAssetBindingService {
        if (!OmniAssetBindingService.instance) {
            OmniAssetBindingService.instance = new OmniAssetBindingService();
        }
        return OmniAssetBindingService.instance;
    }

    /**
     * 🖋️ Bind an ESG asset to the player's identity
     * @param data The raw ESG asset data
     * @param sourceOrigin Where the data came from
     * @param formula Optional logic formula for transparency
     */
    public async bindAsset<T>(
        data: T,
        sourceOrigin: string,
        formula: string = '[Omni-Verification-Standard-v1]'
    ): Promise<IComponentCore> {
        const uuid = crypto.randomUUID();
        const timestamp = Date.now();

        const payload = {
            uuid,
            data,
            sourceOrigin,
            timestamp,
            version: '2.0-5T-Bound'
        };

        // 1. Sign the core payload using OmniKeyService
        const { signature, publicKey } = await omniKeyService.signAchievement(uuid, payload);

        // 2. Construct the 5T-compliant Evidence Map
        const evidence: IEvidenceMap = {
            tangible: {
                metric: 'ESG_KNOWLEDGE_CRYSTAL',
                visual_grade: 'PLATINUM',
                glow_intensity: 85,
                timestamp
            },
            traceable: {
                source_origin: sourceOrigin,
                owner: publicKey // Linked to the signer
            },
            trackable: {
                lifecycle_hooks: [{ event: 'CRYSTALLIZATION', timestamp, actor: 'OmniPriest' }],
                pathway: ['RAW', 'VERIFIED', 'BOUND']
            },
            transparent: {
                formula,
                validation_standard: 'TRUTH_GOOD_BEAUTY_5T'
            },
            trustworthy: {
                hash_lock: signature, // The signature serves as the primary hash lock
                is_frozen: true,
                locked_at: timestamp
            },
            verified_at: timestamp,
            hash_lock: signature, // Legacy alias
            source_origin: sourceOrigin // Legacy alias
        };

        // 3. Create the final Component Core
        const component: IComponentCore = {
            uuid,
            version: '2.0-5T',
            timestamp,
            status: 'Trustworthy',
            evidence,
            data,
            sourceType: 'SENTIENT_KNOWLEDGE'
        };

        // 4. Freeze the object to ensure T5-Trustworthy (Immutable)
        Object.freeze(component);
        Object.freeze(component.evidence);

        omniLogger.info(LogCategory.SYSTEM, `[TRUST] 💎 Asset ${uuid} bound and crystallized with signature.`);

        return component;
    }

    /**
     * 🛡️ Verify the binding of a component
     */
    public async verifyBinding(component: IComponentCore): Promise<boolean> {
        if (!component.evidence.trustworthy || !component.evidence.trustworthy.hash_lock) {
            return false;
        }

        const payload = {
            uuid: component.uuid,
            data: component.data,
            sourceOrigin: component.evidence.traceable?.source_origin || component.evidence.source_origin,
            timestamp: component.timestamp,
            version: '2.0-5T-Bound'
        };

        const signature = component.evidence.trustworthy.hash_lock;
        const publicKey = component.evidence.traceable?.owner;

        if (!publicKey) return false;

        return await omniKeyService.verifySignature(payload, signature, publicKey);
    }
}

export const omniAssetBindingService = OmniAssetBindingService.getInstance();
