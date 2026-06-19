import { IOmniOKR, IKeyResult, IOmniAtom } from './omni-types';
import { OmniOne } from './omni-one';
import { omniLogger, LogCategory } from './omniLogger';
// import * as crypto from 'crypto'; // Removed for browser compatibility

/**
 * 🎯 OmniOKR: Strategic Objective Management
 * "Where Vision meets Manifestation"
 */
export class OmniOKR {
    private static instance: OmniOKR;
    private okrs: Map<string, IOmniOKR> = new Map();

    private constructor() { }

    public static getInstance(): OmniOKR {
        if (!OmniOKR.instance) {
            OmniOKR.instance = new OmniOKR();
        }
        return OmniOKR.instance;
    }

    /**
     * 🚀 Define: Create a new strategic objective.
     */
    public async defineObjective(
        objective: string,
        owner: string,
        period: string,
        keyResults: Omit<IKeyResult, 'id'>[]
    ): Promise<IOmniOKR> {
        const uuid = `okr-${Math.random().toString(36).slice(2, 11)}`;
        const okr: IOmniOKR = {
            uuid,
            objective,
            description: "",
            owner,
            period,
            status: 'Active',
            keyResults: keyResults.map(kr => ({ ...kr, id: `kr-${Math.random().toString(36).slice(2, 10)}` })),
            lastUpdated: Date.now()
        };

        this.okrs.set(uuid, okr);
        omniLogger.info(LogCategory.SYSTEM, `OmniOKR: Objective defined - ${objective} [${uuid}]`);

        // Manifest as an Accomplishment Atom for 5T traceability
        await OmniOne.manifest({
            intent: `OKR_DEFINITION: ${objective}`,
            type: 'Intelligence',
            payload: okr,
            domainRef: 'Strategic_Governance'
        });

        return okr;
    }

    public getOKR(uuid: string): IOmniOKR | undefined {
        return this.okrs.get(uuid);
    }

    public listOKRs(): IOmniOKR[] {
        return Array.from(this.okrs.values());
    }
}
