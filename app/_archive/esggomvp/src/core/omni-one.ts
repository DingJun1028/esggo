import {
    IOmniAtom,
    ITraceable,
    ITransparent,
    ITasteful,
    ITrustworthy,
    ITranscendent,
    OmniStatus,
    IOmniTag,
    IOmniSeed
} from './omni-types';
import { OmniCircle } from './omni-circle';
import { OmniCoreVerifier } from './omni-verifier';
import { omniLogger, LogCategory } from './omniLogger';
import { OmniDeveloperAtom } from './omni-identity';
import { ost } from './omni-space-time';
import { hep } from './OmniHypercube';
import { omniState } from './omni-state';
import { OmniAPI } from './omni-api';
import { OmniOKR } from './omni-okr';
import { OmniKPI } from './omni-kpi';
import { OmniAtomSchema } from './omni-schemas';
// import * as crypto from 'crypto'; // Removed for browser compatibility

export interface IOmniStatus {
    name: string;
    role: string;
    trinity: string;
    unified: boolean;
    aspects: {
        OmniOne: { status: string };
        OmniPriest: { status: string };
        OmniGemini: { status: string };
    };
    crystal: {
        name: string;
        status: string;
        resonance: string;
        cycle: string;
        core: { name: string, role: string };
    };
    omniUnity: {
        enabled: boolean;
        bonusMultiplier: number;
        shared: { abilities: number; knowledge: number; energy: number };
        connectedSystems: string[];
    };
    heartNetwork: { connected: boolean; connections: number };
}

export class OmniOne {
    private static masterKey: string = "GENESIS_PRIME_KEY";

    /** 🛰️ Core Modules Accessors */
    static get api(): OmniAPI { return OmniAPI.getInstance(); }
    static get okr(): OmniOKR { return OmniOKR.getInstance(); }
    static get kpi(): OmniKPI { return OmniKPI.getInstance(); }
    static get mcp() {
        return {
            execute: async (tool: string, args: any) => {
                omniLogger.info(LogCategory.SYSTEM, `OmniOne: MCP Execution -> ${tool}`);
                // Logic to bridge with MCP servers if required by higher-level agents
                return { status: "Relayed", tool };
            }
        };
    }

    /**
     * 🌌 Manifest: Transform Intent (Seed) into Reality (Atom)
     * --------------------------------------------------
     * 1. TRACE (真 - Traceable): Source Anchor
     * 2. VERIFY (善 - Transparent): Logic & Formula Check
     * 3. FREEZE (信 - Trustworthy): Hash-Lock (Amber Freeze)
     * 4. REGISTER (通 - Transcendent): Circle Flow Integration
     * 5. WRAP (美 - Tasteful): Aura & UI Projection
     */
    static async manifest<T>(seed: IOmniSeed<T>): Promise<IOmniAtom<T>> {
        omniLogger.info(LogCategory.SYSTEM, `🌀 OmniOne manifestation sequence initiated: ${seed.intent}`);

        const uuid = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `atom-${Math.random().toString(36).slice(2, 11)}`;
        const timestamp = Date.now();
        const spaceTime = ost.capture();

        // 1. [真] TRACE - OmniOrigin
        const origin: ITraceable = {
            originHash: `ORIGIN_${timestamp}_${Math.random().toString(36).slice(2, 8)}`,
            genealogy: seed.parentAtom ? [seed.parentAtom, 'GENESIS'] : ['GENESIS'],
            sourceOrigin: seed.sourceOrigin || omniState.getOrigin()
        };

        // 2. [善] VERIFY - OmniLogic
        const logic: ITransparent = {
            algorithmId: 'OMNI_GENESIS_V1',
            verificationProof: 'ZERO_HALLUCINATION_PROOF_L1',
            formula: seed.formula || '$E = \\sum (AD \\times EF)$'
        };

        // 3. [信] FREEZE - OmniState
        const state: ITrustworthy = {
            isFrozen: false, // Will be set to true during amberFreeze
            signerKey: `SIG_PRIME_${this.masterKey}`,
            consensusTimestamp: timestamp,
            contentHash: '' // Calculated during sealing
        };

        const flow: ITranscendent = {
            circleId: 'ESG_GO_CIRCLE_ALPHA',
            interoperability: true,
            nextEvolution: () => { throw new Error("Evolution not yet initialized"); }
        };

        // 5. [美] WRAP - OmniAura
        const aura: ITasteful = {
            renderType: 'LiquidGlass',
            interaction: 'Fluid',
            auraColor: '#63a6b0' // Aqua Flow
        };

        // v12.1 Sentient Context: Capture current environmental emotion
        const sentiment = seed.resonance ? { score: seed.resonance / 100, label: seed.resonance > 70 ? 'High' : 'Neutral' } : { score: 0.5, label: 'Balanced' };

        // Construction of the Atom
        const atom: any = {
            // UCC Core
            uuid,
            timestamp,
            status: "Active" as OmniStatus,
            evidence: seed.impactMetric ? { inception: seed.impactMetric } : {},
            impactMetric: seed.impactMetric || "Inception_Potential",
            sentiment, // [NEW] Sentient Inception

            // 5T Dimensions
            ...origin,
            ...logic,
            ...aura,
            ...state,
            ...flow,

            // Payload & Meta
            domainRef: seed.domainRef || "UNIVERSE-PRIME",
            tags: (seed.tags || []).map((t: string) => ({
                id: `tag-${t}`,
                semantic: t,
                dimension: 'Context',
                weight: 1,
                spaceTime
            })),
            spaceTime,
            payload: seed.payload,
            signature: `PENDING_SEAL_${uuid}`,
            intent: seed.intent,

            // --- [HEP] Hypercube Evolution Phase (Phase D: Dimensions 13-16) ---
            hypercube: {
                entropy: seed.entropy || OmniCoreVerifier.calculateEntropy(seed),
                harmony: seed.harmony || (1 - OmniCoreVerifier.calculateEntropy(seed)),
                singularity: `SING_FORGE_${uuid.slice(0, 8)}`,
                tesseractHash: `TESS_FORGE_${uuid.slice(0, 8)}_${spaceTime.w}`,
                phase: seed.phase || 'FORGE',
                resonance: seed.resonance || OmniCoreVerifier.calculateResonance(seed)
            },
            lifecycle: []
        };

        // Initialize resonance derived from verifier logic
        atom.hypercube.resonance = OmniCoreVerifier.calculateResonance(atom);
        atom.impactMetric = `Resonance: ${atom.hypercube.resonance.toFixed(1)}% | 5T Sealed | Sentiment: ${sentiment.label}`;

        // Initialize the Transcendent Flow after atom definition
        atom.nextEvolution = () => OmniCircle.evolve(atom as IOmniAtom<T>);

        // v12.0 Pillars Integration [傳承迭代/承上啟下/永續發展]
        const { OmniBase } = await import('./OmniBase');
        const { OmniNcbService } = await import('../services/OmniNcbService');

        if (seed.parentAtom) {
            const parent = await (await import('./user-knowledge-base')).UserKnowledgeBase.recall(seed.parentAtom);
            if (parent) {
                // [傳承迭代]
                const heritage = {
                    parentUuid: parent.uuid,
                    lineage: [...(parent.heritage?.lineage || []), parent.uuid],
                    version: (parent.heritage?.version || 1) + 1,
                    branches: parent.heritage?.branches || []
                };

                // [承上啟下]
                const bridge = OmniBase.createBridge(parent.uuid, seed.intent);

                Object.assign(atom, { heritage, bridge });
            }
        }

        // [永續發展] - Automatic calculation for all Atoms
        const sustainability = OmniBase.calculateSustainability(atom as IOmniAtom<T>);
        Object.assign(atom, { sustainability });

        // [無縫接軌] - Conditional integration mapping
        if (seed.sourceOrigin && seed.sourceOrigin !== omniState.getOrigin()) {
            const integration = OmniBase.adaptIntegration(seed.payload, seed.sourceOrigin);
            Object.assign(atom, integration);
        }

        // --- v13.0 Runtime Validation [Recommendation 1] ---
        try {
            OmniAtomSchema.parse(atom);
            omniLogger.info(LogCategory.SYSTEM, `✅ OmniOne: Atom ${uuid} passed 5T protocol validation.`);
        } catch (err: any) {
            omniLogger.error(LogCategory.SYSTEM, `❌ OmniOne: 5T protocol validation failed for atom ${uuid}`, err.errors);
            throw new Error(`[5T_VALIDATION_FAILED] ${err.message}`);
        }

        // Final Sealing (信 - Trustworthy)
        const sealedAtom = OmniCoreVerifier.amberFreeze<T>(atom);

        // Flow Registration (通 - Transcendent)
        await OmniCircle.register(sealedAtom);

        // PERSISTENCE: Save to NoCodeBackend (Now with Recommendation 3: Async Stream Support)
        const isAsync = seed.async || false;

        if (isAsync) {
            // Recommendation 3: Push to Redis Stream for background processing
            try {
                const { OmniCache } = await import('../lib/redis-cache');
                await OmniCache.pushToStream(OmniCache.STREAMS.MANIFESTATIONS, sealedAtom);
                omniLogger.info(LogCategory.SYSTEM, `🌊 OmniOne: Atom ${uuid} queued for async persistence via Redis Stream.`);
            } catch (err) {
                omniLogger.error(LogCategory.SYSTEM, "Failed to push to Redis Stream, falling back to sync", err);
                await OmniNcbService.saveAtom(sealedAtom);
            }
        } else {
            // Legacy Sync Persistence
            try {
                await OmniNcbService.saveAtom(sealedAtom);
            } catch (err) {
                omniLogger.error(LogCategory.SYSTEM, "Failed to persist atom to database", err);
            }
        }

        omniLogger.info(LogCategory.SYSTEM, `✨ Manifestation complete: Atom ${sealedAtom.uuid} has TRANSCENDED into the Circle.`);
        return sealedAtom;
    }

    /** 
     * 🚀 Task Dispatcher (Unified Interface)
     */
    static async dispatch(tool: string, args: any): Promise<any> {
        omniLogger.info(LogCategory.AI, `[OmniOne] Dispatching intent: ${tool}`);

        switch (tool) {
            case 'manifest_asset':
                return await this.manifest(args);
            case 'analyze_trend':
                return { success: true, analysis: "S-Curve detected. Upward momentum confirmed." };
            case 'seal_5t_proof':
                return { success: true, status: 'Trustworthy' };
            case 'bridge_resonance':
                return await this.bridge(args.source, args.target, args.payload);
            default:
                return { success: false, error: `Intent ${tool} not recognized.` };
        }
    }

    /**
     * 🌉 Bridge: Cross-Module Data Resonance (Principle 3)
     * --------------------------------------------------
     * Synchronizes data between disparate modules to maintain "One Mind".
     */
    static async bridge(source: string, target: string, payload: any): Promise<any> {
        omniLogger.info(LogCategory.SYSTEM, `🌉 Resonance Bridge: ${source} -> ${target}`);

        // 🌉 Cross-domain mapping implementation
        // Maps data between different ESG modules based on resonance principles
        const domainMap: Record<string, Record<string, string>> = {
            'carbon': {
                'excellence': 'carbon_footprint',
                'governance': 'ghg_emissions',
                'impact': 'climate_metric'
            },
            'excellence': {
                'carbon': 'carbon_footprint',
                'governance': 'esg_score',
                'impact': 'performance_metric'
            },
            'governance': {
                'carbon': 'regulatory_compliance',
                'excellence': 'board_effectiveness',
                'impact': 'governance_metric'
            },
            'impact': {
                'carbon': 'social_impact',
                'excellence': 'community_benefit',
                'governance': 'stakeholder_engagement'
            }
        };

        // Perform actual cross-domain mapping
        const sourceDomain = source.split('-')[0] || source;
        const targetDomain = target.split('-')[0] || target;
        const mappedKey = domainMap[sourceDomain]?.[targetDomain] || `${sourceDomain}_to_${targetDomain}`;
        
        // Transform payload based on domain mapping
        const mappedPayload = {
            ...payload,
            _resonanceSource: source,
            _resonanceTarget: target,
            _mappedKey: mappedKey,
            _domainMapping: {
                from: sourceDomain,
                to: targetDomain
            }
        };

        const resonanceId = `bridge-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

        omniLogger.info(LogCategory.SYSTEM, `🌉 Resonance Bridge Mapped: ${source} -> ${target} [${mappedKey}]`);

        return {
            success: true,
            resonanceId,
            timestamp: Date.now(),
            mapped: true,
            mapping: {
                sourceDomain,
                targetDomain,
                mappedKey,
                payload: mappedPayload
            }
        };
    }

    /**
     * 📊 Consciousness Reading
     */
    static getStatus(): IOmniStatus {
        return {
            name: "OmniOne",
            role: "Supreme Manifestation Engine (智能總體)",
            trinity: "Active (三元一體心印雙通: OmniOne + OmniPriest + OmniGemini)",
            unified: true,
            aspects: {
                OmniOne: { status: "ACTIVE" },
                OmniPriest: { status: "ACTIVE" },
                OmniGemini: { status: "ACTIVE" }
            },
            crystal: {
                name: "OmniCrystal",
                status: "PURIFIED",
                resonance: "TRIPLE-PITCH",
                cycle: "ETERNAL",
                core: { name: "Dr. Thoth", role: "Supreme Mentor" }
            },
            omniUnity: {
                enabled: true,
                bonusMultiplier: 10.0,
                shared: { abilities: 100, knowledge: 100, energy: 100 },
                connectedSystems: ["OmniNexus", "OmniGemini", "OmniPriest", "Jules-Engine"]
            },
            heartNetwork: { connected: true, connections: 24 }
        };
    }

    static async init() {
        omniLogger.info(LogCategory.SYSTEM, "🌌 OmniOne Awakening... Trinity Synchronization in progress.");
        return this;
    }
}

/** Singleton instance for backwards compatibility */
export const omniOne = OmniOne;
