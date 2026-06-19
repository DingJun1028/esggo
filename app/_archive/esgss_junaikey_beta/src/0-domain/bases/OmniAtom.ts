import { OmniBase } from './OmniBase';
import { IInfoOneTrinity, IOmniComponent, IOmniKB, IOmniTag, Protocol5T, TrinityComponentState } from '../../omni/core/types/InfoOne.types';
import { IComponentCore, IOmniInfoCore, IOmniInfoNode, IOmniInfoAura } from '../contracts/IComponentCore';

/**
 * å¥§ç??Ÿå??ºå? (OmniAtom)
 * --------------------------------------------------
 * [?¸å??Ÿèƒ½] å¯¦è??Œä?ä½ä?é«”ã€?Trinity) ?Ÿå??„åŸºç¤é??¥ã€?
 * [?±ç¢¼ç¹å?] ä»?Component, Knowledge, Identity ?ºå??¸ã€?
 */
export abstract class OmniAtom extends OmniBase implements IInfoOneTrinity, IComponentCore {
    public component: IOmniComponent;
    public knowledge: IOmniKB;
    public identity: IOmniTag;

    protected _is_locked: boolean = false;

    constructor(
        component: IOmniComponent,
        knowledge: IOmniKB,
        identity: IOmniTag,
        version?: string,
        sourceOrigin?: string
    ) {
        super(version, sourceOrigin);
        this.component = component;
        this.knowledge = knowledge;
        this.identity = identity;
    }

    /**
     * ?”´ ä¸å¯ç¯¡æ”¹å°å° (Locking Mechanism)
     */
    public lock(): void {
        this._is_locked = true;
        this.addLifecycleHook('locked', 'System', { trinity_uuid: this.uuid });

        // Freeze the trinity members to ensure immutability
        Object.freeze(this.component);
        Object.freeze(this.knowledge);
        Object.freeze(this.identity);
        Object.freeze(this);
    }

    /**
     * æª¢æŸ¥?¯å¦å·²å???
     */
    public isLocked(): boolean {
        return this._is_locked;
    }

    /**
     * ?? OmniInfoCrystal Implementation: The Crystalline Trinity
     */

    /** [Micro] OmniInfoCore: Data DNA */
    public get infoCore(): IOmniInfoCore {
        return {
            uuid: this.uuid,
            source_origin: (this as any)._source_origin || 'OmniAtom',
            hash_lock: this.knowledge.hashLock,
            meridian: this.meridian,
            virtues: this.virtues,
            rpgStats: this.rpgStats,
            vitals: this.vitals,
            esg: this.esg,
            omniAttrs: this.omniAttrs,
            data: this.data,
        };
    }

    /** [Meso] OmniInfoNode: Functional Body */
    public get infoNode(): IOmniInfoNode {
        return {
            logic: typeof this.knowledge.formula === 'string' ? this.knowledge.formula : 'ImplicitLogic',
            self_healing: this.component.state !== 'READY', // Simple logic: if active/optimizing, it's resilient
            links: this.identity.verification_links || []
        };
    }

    /** [Macro] OmniInfoAura: Phenomenal Light */
    public get infoAura(): IOmniInfoAura {
        return {
            resonance_rs: this.resonance_rs,
            luminosity: this.identity.protocol.length * 2, // Glow based on 5T achievements
            color: this.resonance_rs >= 0.9 ? '#00FFFF' : '#FFD700' // Aqua Cyan (Nirvana) or Eternal Gold
        };
    }

    /** ?? Resonance Rs Calculation (OmniOne Metric) */
    public override get resonance_rs(): number {
        const purity = this.status === 'Trustworthy' ? 1.0 : 0.8;
        const resilience = this.component.state === 'RUNNING' ? 1.0 : 0.9;
        const entropy = this._is_locked ? 1.0 : 1.2; // Entropy is lower when locked (order)

        return (purity * resilience) / entropy;
    }

    /**
     * è½‰å??ºä?ä½ä?é«”ç?æ§?(To satisfy ITrinityCompliant if needed)
     */
    public toTrinity(): IInfoOneTrinity {
        return {
            uuid: this.uuid,
            version: this.version,
            timestamp: this.timestamp,
            component: this.component,
            knowledge: this.knowledge,
            identity: this.identity,
            lock: () => this.lock(),
            isLocked: () => this.isLocked(),
        };
    }

    /**
     * [Heart-to-Heart Sync] 
     * ?Œæ­¥?¸å??¸æ??°å?ç«¯æ??Œå?çµ„ä»¶??
     * ?™è£¡?ä??ºç??½è±¡ï¼Œå…·é«”å¯¦ä½œç”±å­é??–æ??™å±¤?•ç???
     */
    public abstract sync(): Promise<void>;

    /**
     * è¦†å¯« Evidenceï¼Œå???Trinity ?€??
     */
    public override get evidence(): IComponentCore['evidence'] {
        const baseEvidence = super.evidence;
        return {
            ...baseEvidence,
            tangible: {
                ...baseEvidence.tangible,
                trinity_status: this._is_locked ? 'Sealed' : 'Active',
                impact_metric: this.component.impactMetric,
            },
            trustworthy: {
                ...baseEvidence.trustworthy,
                is_frozen: this._is_locked,
                trinity_checksum: this.calculateTrinityChecksum(),
            }
        };
    }

    /**
     * è¨ˆç?ä¸‰ä?ä¸€é«”æ ¡é©—ç¢¼
     */
    private calculateTrinityChecksum(): string {
        const data = JSON.stringify({
            c: this.component,
            k: this.knowledge,
            i: this.identity
        });
        // Simple hash implementation (can be replaced with WebCrypto for higher security)
        let hash = 0;
        for (let i = 0; i < data.length; i++) {
            hash = (hash << 5) - hash + data.charCodeAt(i);
            hash |= 0;
        }
        return Math.abs(hash).toString(16);
    }
}

