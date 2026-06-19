// import * as crypto from 'crypto'; // Removed for browser compatibility
import {
    IOmniAtom,
    ITraceable,
    ITransparent,
    ITasteful,
    ITrustworthy,
    ITranscendent,
    OmniStatus,
    IOmniTag,
    IEvidenceMap
} from './omni-types';
import { ost } from './omni-space-time';
import { omniState } from './omni-state';
import { OmniCoreVerifier } from './omni-verifier';
import { OmniCircle } from './omni-circle';

/**
 * 🏛️ OmniCore: The Great Architect of Atoms
 * Responsibility: Enforcement of the 5T Protocol and UCC Standards.
 */
export class OmniCore {
    private static instance: OmniCore;
    private seed: string;

    private constructor() {
        this.seed = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }

    public static getInstance(): OmniCore {
        if (!OmniCore.instance) {
            OmniCore.instance = new OmniCore();
        }
        return OmniCore.instance;
    }

    /**
     * 🛠️ Mint a new OmniAtom (Sentient Learning Object)
     * Performs the first 3 dimensions: Truth, Goodness, Beauty.
     */
    public async mint<T>(
        domainRef: string,
        payload: T,
        evidence: IEvidenceMap = {},
        impactMetric: string = "Direct_Impact",
        intent: string = "Genesis_Intent",
        tags: IOmniTag[] = [],
        sourceOrigin?: string
    ): Promise<IOmniAtom<T>> {
        const { OmniOne } = await import('./omni-one');

        return await OmniOne.manifest<T>({
            intent,
            type: 'Intelligence',
            payload,
            domainRef,
            tags: tags.map(t => t.semantic),
            impactMetric,
            sourceOrigin: sourceOrigin || omniState.getOrigin()
        });
    }

    /**
     * 🔒 Seal an Atom (信 - Trustworthy)
     * Enforces the final Amber Freeze.
     */
    public seal<T>(atom: IOmniAtom<T>): IOmniAtom<T> {
        if (atom.status === "Trustworthy") {
            throw new Error(`[OmniCore] Atom ${atom.uuid} is already sealed in the Eternal Vault.`);
        }

        // Finalize Trust Dimension
        const sealed = OmniCoreVerifier.amberFreeze<T>(atom);

        return sealed;
    }

    /**
     * ✅ Verify an Atom's integrity
     */
    public verify<T>(atom: IOmniAtom<T>): boolean {
        return OmniCoreVerifier.verifyIntegrity(atom);
    }
}

export const omni = OmniCore.getInstance();
