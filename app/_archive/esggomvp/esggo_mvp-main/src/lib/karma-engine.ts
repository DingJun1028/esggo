/**
 * 🌀 Karma Engine - Google Jules 9-Step Reparation Protocol
 * 
 * Implements the "觀果 ➜ 立願 ➜ 尋因 ➜ 修因 ➜ 造緣 ➜ 結果 ➜ 驗因 ➜ 證果 ➜ 傳法" logic.
 * Ensures every system fix is an evolutionary step.
 */

export type KarmaStep = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export interface IKarmaEvent {
    id: string;
    timestamp: number;
    step: KarmaStep;
    title: string;
    description: string;
    metadata?: Record<string, any>;
}

export interface IKarmaRecord {
    issue_id: string;
    vision: string;
    root_cause: string;
    remedy: string;
    events: IKarmaEvent[];
    status: "ASCENDING" | "TRANSCENDED" | "NIRVANA";
    final_hash?: string;
}

export class KarmaEngine {
    private static instance: KarmaEngine;
    private records: Map<string, IKarmaRecord> = new Map();

    private constructor() { }

    static getInstance(): KarmaEngine {
        if (!KarmaEngine.instance) {
            KarmaEngine.instance = new KarmaEngine();
        }
        return KarmaEngine.instance;
    }

    /**
     * Starts a new Karma Reparation cycle.
     */
    startCycle(issueId: string, observation: string): IKarmaRecord {
        const record: IKarmaRecord = {
            issue_id: issueId,
            vision: "",
            root_cause: "",
            remedy: "",
            events: [{
                id: crypto.randomUUID(),
                timestamp: Date.now(),
                step: 1,
                title: "觀果 (Observe Effect)",
                description: observation
            }],
            status: "ASCENDING"
        };
        this.records.set(issueId, record);
        return record;
    }

    /**
     * Advances the Karma step with verification logic.
     */
    advance(issueId: string, step: KarmaStep, title: string, description: string): IKarmaRecord | null {
        const record = this.records.get(issueId);
        if (!record) return null;

        record.events.push({
            id: crypto.randomUUID(),
            timestamp: Date.now(),
            step,
            title,
            description
        });

        if (step === 9) record.status = "NIRVANA";
        return record;
    }

    getRecord(issueId: string): IKarmaRecord | undefined {
        return this.records.get(issueId);
    }
}

export const karmaEngine = KarmaEngine.getInstance();
