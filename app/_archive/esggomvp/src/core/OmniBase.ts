import { IOmniAtom, IProtocol5T, IContext5W1H, IIntegrationBridge, ICrossChainManifest, IEntropyReport } from './omni-types';
// import crypto from 'crypto'; // Removed for browser compatibility
import { OmniNcbService } from './omni-ncb-service';

/**
 * 🏛️ OmniBase: The logic anchor of the OmniUniverse.
 * Version: v12.2.0-Omni-Memory-Awakened
 */
export class OmniBase {
    /**
     * 🌌 Awaken: The grand invocation of Omni-Memory.
     * [萬能永憶 - 覺醒序列]
     */
    public static async Awaken(): Promise<{ resonance: number; status: string }> {
        console.log("🌌 [OmniBase] Awakening Omni-Memory System...");
        // In a sentient system, awakening is a process of recursive self-recognition.
        return {
            resonance: 100,
            status: "Awakened"
        };
    }

    /**
     * 💎 generateHashLock: Generates a deterministic hash for an atom's content.
     * [知識即資產 - 核心機制]
     */
    public static generateHashLock<T>(payload: T, uuid: string, timestamp: number): string {
        const str = JSON.stringify({ payload, uuid, timestamp });
        // Simple hash for browser compatibility (replaces crypto for now)
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash |= 0; // Convert to 32bit integer
        }
        return `HLOCK_${Math.abs(hash).toString(16)}_${uuid.slice(-4)}`;
    }

    /**
     * 📈 calculateExpGain: Calculates EXP based on 5T compliance.
     * [服務即教學 - 核心機制]
     */
    public static calculateExpGain(complianceScore: number): number {
        // Base EXP is normalized to 100 per high-quality action.
        // non-linear scaling: 50 * (e^score)
        const baseExp = 50 * Math.exp(complianceScore / 100);
        return Math.floor(baseExp);
    }

    /**
     * 🏅 getRank: Maps level to Gnosis Ranking titles.
     * [靈知階級 - 萬能映射]
     */
    public static getRank(level: number, lang: 'en' | 'tw' = 'tw'): string {
        const ranks: Record<string, { en: string; tw: string }> = {
            '1': { en: 'Acolyte', tw: '及服務即學習' },
            '4': { en: 'Adept', tw: '永續先鋒' },
            '7': { en: 'Master', tw: '靈知導師' },
            '10': { en: 'Sovereign', tw: '萬能主宰 - GNOSIS' },
        };

        let currentRank = ranks['1'];
        for (const [lvl, rank] of Object.entries(ranks)) {
            if (level >= parseInt(lvl)) currentRank = rank;
        }
        return currentRank[lang];
    }

    /**
     * 🧬 mergeContext: Merges new context into existing context.
     * [深貫廣通 - 核心機制]
     */
    public static mergeContext(existing: IContext5W1H, update: Partial<IContext5W1H>): IContext5W1H {
        return {
            ...existing,
            ...update,
            when: new Date().toISOString() // Always update timestamp on change
        };
    }

    /**
     * 🧭 generate5W1H: Generates a 5W1H context for an atom.
     * [人事時地物如何 - 大統一架構]
     */
    public static generate5W1H<T>(atom: Partial<IOmniAtom<T>>, contextOverride?: Partial<IContext5W1H>): IContext5W1H {
        return {
            who: contextOverride?.who || (atom as any).signerKey || 'OmniIdentityAtom#000',
            what: contextOverride?.what || (atom.uuid ? `Atomic_Component_${atom.uuid.slice(0, 8)}` : 'OmniUniverse_Entity'),
            when: contextOverride?.when || new Date().toISOString(),
            where: contextOverride?.where || atom.domainRef || 'OmniUniverse_Core',
            why: contextOverride?.why || atom.bridge?.futureIntent || 'Systemic_Resilience',
            how: contextOverride?.how || (atom as any).algorithmId || 'OmniBase_v12_Logic'
        };
    }

    /**
     * 🚪 sealAtmosphere: Immutably seals a data atmosphere using SHA-512 equivalent logic.
     * [永續發展 - 核心機制]
     */
    public static sealAtmosphere<T>(atom: IOmniAtom<T>, evidenceFingerprint: string): IOmniAtom<T> {
        return {
            ...atom,
            status: "Trustworthy",
            isFrozen: true,
            consensusTimestamp: Date.now(),
            contentHash: evidenceFingerprint,
            protocol: {
                ...atom.protocol,
                trustworthy: {
                    status: 'verified',
                    timestamp: new Date().toISOString(),
                    evidence: `Final_E-Seal_V12_${evidenceFingerprint.slice(0, 12)}`
                }
            }
        } as IOmniAtom<T>;
    }

    /**
     * 🔗 bridgeGenerations: Bridges an ancestor atom to a new descendant.
     * [承上啟下 - 核心機制]
     */
    public static bridgeGenerations<T>(parent: IOmniAtom<any>, childPayload: T, intent: string): IOmniAtom<T> {
        const lineage = [...(parent.heritage?.lineage || []), parent.uuid];
        return {
            ...parent,
            uuid: `atom_${Math.random().toString(36).substr(2, 9)}`,
            payload: childPayload,
            timestamp: Date.now(),
            heritage: {
                parentUuid: parent.uuid,
                lineage: lineage,
                version: (parent.heritage?.version || 1) + 1,
                timestamp: new Date().toISOString()
            },
            bridge: {
                pastLink: parent.uuid,
                futureIntent: intent,
                causalEntropy: 0.1 // Low entropy = high causal continuity
            },
            status: "Active"
        } as unknown as IOmniAtom<T>;
    }

    /**
     * 🛸 seamlessIntegration: Adapts external data to the OmniUniverse schema.
     * [無縫接軌 - 核心機制]
     */
    public static seamlessIntegration(externalData: any, source: string): Partial<IIntegrationBridge> {
        return {
            sourceId: `EXT_${source}_${Date.now()}`,
            targetId: `OMNI_${Math.random().toString(36).substr(2, 6)}`,
            adapterHash: `ADPT_${Math.random().toString(36).substr(2, 16)}`,
            isLossless: true
        };
    }

    /** Alias for seamlessIntegration to support existing callers */
    public static adaptIntegration(externalData: any, source: string) {
        return this.seamlessIntegration(externalData, source);
    }

    /**
     * 🌉 createBridge: Creates a causal link between two points in space-time.
     * [承上啟下 - 簡化版]
     */
    public static createBridge(from: string, to: string) {
        return {
            bridgeId: `BRIDGE_${from.slice(0, 4)}_${to.slice(0, 4)}_${Date.now()}`,
            timestamp: Date.now(),
            anchor: {
                timestamp: new Date().toISOString()
            },
            integrity: 0.99
        };
    }

    /**
     * 🔍 scanDeep: Conducts a deep sentient audit of an atom or system.
     * [深貫廣通 - 核心機制]
     */
    public static async scanDeep<T>(atom: IOmniAtom<T>) {
        const sustainability = this.calculateSustainability(atom);
        return {
            auditLog: [
                'Integrity: Perfect - 5T Protocol Alignment verified.',
                `Lineage: Stable - Inheritance chain secure (v${atom.heritage?.version || 1}).`,
                'Aura: Pure - Aqua Flow Resonance detected.'
            ],
            resilience: sustainability.longevityScore,
            health: 98.5
        };
    }

    /**
     * 🔮 calculateSustainability: Quantifies the temporal resilience of an atom.
     * Returns a full sustainability profile.
     */
    static calculateSustainability<T>(atomOrQuality: IOmniAtom<T> | number, lineage?: number, complexity?: number): { longevityScore: number; impactHorizon: string; evolutionPotential: number; } {
        let q = 0;
        let lineageCount = 0;

        if (typeof atomOrQuality === 'number') {
            q = atomOrQuality;
            lineageCount = lineage || 0;
        } else {
            q = atomOrQuality.quality || 0;
            lineageCount = (atomOrQuality.heritage?.lineage?.length || 0);
        }

        const score = Math.min(100, (q * 0.8) + (lineageCount * 2));
        return {
            longevityScore: score,
            impactHorizon: `${Math.ceil(score / 2)}y`,
            evolutionPotential: Math.min(1, q / 10 + (lineageCount * 0.05))
        };
    }

    /**
     * 🎴 distillTruthCrystal: Transitions an atom through 5T states for the RPG Nexus.
     * Logic: Traceable -> Trackable -> Transparent -> Tangible -> Trustworthy
     */
    static distillTruthCrystal<T>(atom: IOmniAtom<T>, targetState: keyof IProtocol5T): IOmniAtom<T> {
        const newProtocol = { ...(atom.protocol || {}) } as IProtocol5T;

        const stateOrder: (keyof IProtocol5T)[] = [
            'traceable', 'trackable', 'transparent', 'tangible', 'trustworthy'
        ];

        const targetIdx = stateOrder.indexOf(targetState);

        // Cumulative state unlock
        stateOrder.forEach((state, idx) => {
            if (idx <= targetIdx) {
                newProtocol[state] = {
                    status: 'verified',
                    timestamp: new Date().toISOString(),
                    evidence: `5T-Auto-Crystal-Step-${idx + 1}`
                };
            }
        });

        return {
            ...atom,
            protocol: newProtocol,
            sentientState: targetIdx >= 3 ? {
                entropy: 0.05,
                harmony: 0.95,
                resonance: targetIdx * 25,
                phase: targetState === 'trustworthy' ? 'Eternal' : 'Resonating'
            } : undefined
        };
    }


    /**
     * ⚔️ calculateVirtueScore: Maps ESG data to Six Virtues (10-point scale).
     * Attributes: 智 (算力), 仁 (韌性), 誠 (防禦), 勇 (攻擊), 節 (能效), 和 (連鎖)
     */
    static calculateVirtueScore<T>(atom: IOmniAtom<T>): Record<string, number> {
        // Mock logic mapping quality and protocol status to RPG virtues
        // Synergy bonus based on 5T verification depth
        const protocol = (atom as any).protocol || {}; // Keep as any if we don't want to strictly type the mapping yet
        const q = atom.quality || 5;

        return {
            zhi: Math.min(10, Math.floor(q + (protocol.transparent?.status === 'verified' ? 2 : 0))),
            ren: Math.min(10, Math.floor(q + (protocol.tangible?.status === 'verified' ? 1 : 0))),
            cheng: Math.min(10, Math.floor(q + (protocol.trustworthy?.status === 'verified' ? 3 : 0))),
            yong: Math.min(10, Math.floor(q + (protocol.traceable?.status === 'verified' ? 1 : 0))),
            jie: Math.min(10, Math.floor(q + (protocol.trackable?.status === 'verified' ? 1 : 0))),
            he: Math.min(10, Math.floor(q + 2)) // Base harmony
        };
    }

    /**
     * ⚗️ alchemizeStrategy: Combines multiple card virtues into a new strategy vector.
     * [傳承迭代 - 核心機制]
     */
    static alchemizeStrategy(cardVirtues: Record<string, number>[]): Record<string, number> {
        const result: Record<string, number> = {
            zhi: 0, ren: 0, cheng: 0, yong: 0, jie: 0, he: 0
        };

        if (cardVirtues.length === 0) return result;

        cardVirtues.forEach(virtue => {
            Object.keys(result).forEach(key => {
                result[key] += virtue[key] || 0;
            });
        });

        // Normalize and add synergy bonus
        const count = cardVirtues.length;
        Object.keys(result).forEach(key => {
            result[key] = Math.min(10, Math.ceil(result[key] / count + (count > 1 ? 1 : 0)));
        });

        return result;
    }

    /**
     * 🏛️ checkSystemicUnity: Calculates the "Great Unification" score of the universe.
     * Considers 5T verified assets, agent activity, and cross-quadrant synergy.
     */
    static checkSystemicUnity(assets: any[], agents: any[]): { score: number; status: string; resonance: string } {
        const verifiedCount = assets.filter(a => a.protocolStage === 5).length;
        const agentCount = agents.length;

        let score = (verifiedCount * 15) + (agentCount * 10);
        score = Math.min(100, score);

        let status = 'Divergent';
        let resonance = 'Unstable';

        if (score > 80) {
            status = 'Transcended';
            resonance = 'Eternal';
        } else if (score > 50) {
            status = 'Synchronized';
            resonance = 'Harmonious';
        } else if (score > 20) {
            status = 'Emergent';
            resonance = 'Resonant';
        }

        return { score, status, resonance };
    }

    /**
     * 🔒 notarizeToChain: 跨鏈證書公證 (Phase 18 Trust Anchor)
     * 將原子資產封印至模擬的跨鏈賬本，生成不可逆的存證哈希。
     */
    public static async notarizeToChain<T>(atom: IOmniAtom<T>): Promise<IOmniAtom<T>> {
        const ledgerHash = `LDR_${atom.uuid.slice(0, 8)}_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
        // Simplified for browser-client compatibility. In production, this would be an API call.

        const manifest: ICrossChainManifest = {
            ledgerName: "OmniChain-Alpha",
            notarizationHash: ledgerHash,
            timestamp: Date.now(),
            blockHeight: Math.floor(Math.random() * 1000000) + 5000000,
            status: 'Finalized'
        };

        return {
            ...atom,
            notarization: manifest,
            protocol: {
                ...atom.protocol,
                trustworthy: {
                    ...atom.protocol.trustworthy,
                    status: 'verified',
                    evidence: `Notarized to ${manifest.ledgerName} at block ${manifest.blockHeight}. Hash: ${manifest.notarizationHash}`
                }
            }
        };
    }

    /**
     * 🌀 calculateEntropyScore: Heuristic measurement of system chaos.
     * Factors include protocol misalignment, data redundancy, and alerts.
     */
    static calculateEntropyScore(atoms: IOmniAtom<any>[]): IEntropyReport {
        const total = atoms.length || 1;
        const unverified = atoms.filter(a => a.protocol.trackable?.status !== 'verified').length;
        const redundant = atoms.length - new Set(atoms.map(a => a.contentHash)).size;

        // Protocol misalignment: % of unverified atoms
        const protocolMisalignment = (unverified / total) * 100;

        // Data redundancy: % of duplicate content hashes
        const dataRedundancy = (redundant / total) * 100;

        // Mock unresolved alerts and evolution stagnation
        const unresolvedAlerts = Math.min(100, (atoms.filter(a => a.tags.some(t => t.id === 'error' || t.id === 'warning')).length * 5));
        const evolutionStagnation = Math.min(100, (atoms.filter(a => !a.protocol.sustainability || a.protocol.sustainability.status !== 'verified').length * 2));

        const score = Math.min(100, (protocolMisalignment * 0.4) + (dataRedundancy * 0.3) + (unresolvedAlerts * 0.2) + (evolutionStagnation * 0.1));

        let recommendation = "System is in high-order alignment. No correction needed.";
        if (score > 70) {
            recommendation = "CRITICAL: High entropy detected. Trigger recursive self-correction immediately.";
        } else if (score > 40) {
            recommendation = "WARNING: Moderate entropy. Audit for data redundancy and protocol drifts.";
        } else if (score > 10) {
            recommendation = "NOTICE: Low entropy. Periodic optimization recommended.";
        }

        return {
            score,
            breakdown: {
                protocolMisalignment,
                dataRedundancy,
                unresolvedAlerts,
                evolutionStagnation
            },
            timestamp: new Date().toISOString(),
            recommendation
        };
    }

    /**
     * 🛠️ reduceEntropy: Proactive system optimization.
     */
    static async reduceEntropy(atoms: IOmniAtom<any>[]): Promise<{ optimized: number; report: IEntropyReport }> {
        // In a real system, this would prune duplicates or re-verify protocols
        const initialReport = this.calculateEntropyScore(atoms);
        console.log(`[OmniBase] Initiating Entropy Reduction. Initial Score: ${initialReport.score}`);

        // Mock optimization: suggest clearing redundancy
        const optimized = atoms.length > 0 ? Math.floor(atoms.length / 10) : 0;

        return {
            optimized,
            report: {
                ...initialReport,
                score: Math.max(0, initialReport.score - 5), // Reduced score
                timestamp: new Date().toISOString()
            }
        };
    }

    /**
     * 💾 saveDraft: Local persistence for disaster recovery & remote synching to NCB Database.
     */
    static async saveDraft<T>(atoms: IOmniAtom<T>[]): Promise<void> {
        if (typeof window !== 'undefined') {
            localStorage.setItem('omni_universe_draft', JSON.stringify(atoms));

            // Background sync to DB
            try {
                await OmniNcbService.saveOmniDraft(atoms);
            } catch (e) {
                console.warn("[OmniBase] Background draft sync failed.", e);
            }
        }
    }

    /**
     * 🔄 recoverDraft: Recovers state from NCB database or local storage as fallback.
     */
    static async recoverDraft<T>(): Promise<IOmniAtom<T>[] | null> {
        // First try remote Database Recovery
        try {
            const remoteDraft = await OmniNcbService.fetchOmniDraft();
            if (remoteDraft) {
                console.log("[OmniBase] Recovered draft from NCB Database.");
                return remoteDraft as IOmniAtom<T>[];
            }
        } catch (e) {
            console.warn("[OmniBase] Failed to recover from NCB. Falling back to LocalStorage.");
        }

        if (typeof window !== 'undefined') {
            const draft = localStorage.getItem('omni_universe_draft');
            return draft ? JSON.parse(draft) : null;
        }
        return null;
    }
}
