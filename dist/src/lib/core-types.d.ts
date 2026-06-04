export interface IComponentCore {
    uuid: string;
    version: string;
    formula: string;
    impact_metric: string;
    status: string;
    hash_lock: string;
    evidence: IEvidence[];
}
export interface IEvidence {
    originCause: string;
    finalEffect: string;
    processTrace: string[];
    hash_lock: string;
    timestamp: number;
}
export type T5CoreComponents = IComponentCore;
export type T5Evidence = IEvidence;
export declare const T5_CORE_CONFIG: {
    requiredComponents: string[];
    validationRules: {
        core: string[];
        evidence: string[];
    };
};
//# sourceMappingURL=core-types.d.ts.map