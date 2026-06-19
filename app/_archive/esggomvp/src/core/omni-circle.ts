/**
 * ⭕ OmniCircle: The 5th Element (Flow / Transcendent)
 * --------------------------------------------------
 * Connecting atoms into a sentient, self-evolving loop.
 * "Everything that goes around, comes around."
 */

import { IOmniAtom, IEvidenceMap, IOmniTag, OmniStatus, IOmniSeed } from './omni-types';
import { omniSyncCenter } from './omni-user-sync-center';
import { omniLogger, LogCategory } from './omniLogger';


export class OmniCircle {
    private static registry: Map<string, IOmniAtom<any>> = new Map();
    private static connections: Map<string, string[]> = new Map();

    /**
     * 🪐 Register an Atom into the Circle (通 - Transcendent)
     * v13.0: Now deeply integrated with OmniUserBiSyncCenter
     */
    static async register(atom: IOmniAtom<any>) {
        this.registry.set(atom.uuid, atom);
        omniLogger.info(LogCategory.SYSTEM, `Circle: Atom ${atom.uuid} registered in the flow [CircleID: ${atom.circleId}].`);

        // 🚀 Deep Integration: Dispatch to Bi-Sync Center
        // This triggers: Smart Tagging -> Bi-directional Sync -> Intelligent Routing
        await omniSyncCenter.dispatch(atom);

        omniLogger.info(LogCategory.SYSTEM, `Circle: Atom ${atom.uuid} successfully synchronized via Bi-Sync Center.`);
    }

    /**
     * 🔗 Connect two Atoms
     */
    static connect(sourceId: string, targetId: string) {
        const targets = this.connections.get(sourceId) || [];
        targets.push(targetId);
        this.connections.set(sourceId, targets);
        omniLogger.info(LogCategory.SYSTEM, `Circle: Connection established ${sourceId} --> ${targetId}`);
    }

    /**
     * 🔄 Transcendent Evolution: Atom -> Seed for next generation
     */
    static evolve<T>(atom: IOmniAtom<T>): IOmniSeed<T> {
        omniLogger.info(LogCategory.SYSTEM, `Circle: Evolving Atom ${atom.uuid} into a new Seed.`);
        return {
            payload: atom.payload,
            type: 'Note', // Defaulting to Note for evolution
            intent: `Evolutionary descendant of ${atom.uuid}`,
            parentAtom: atom.uuid,
            tags: atom.tags.map(t => t.semantic),
            formula: atom.formula,
            impactMetric: atom.impactMetric,
            domainRef: atom.domainRef
        };
    }

    /**
     * 🔍 Trace the Genealogy
     */
    static trace(uuid: string): string[] {
        const atom = this.registry.get(uuid);
        return atom ? [atom.uuid, ...atom.genealogy] : [];
    }
}
