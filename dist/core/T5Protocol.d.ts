import { IComponentCore, IEvidence } from '../../lib/core-types';
export declare enum T5Protocol {
    Traceable = "Traceable",// T1: 溯源
    Transparent = "Transparent",// T2: 透明
    Tangible = "Tangible",// T3: 可感知
    Trustworthy = "Trustworthy",// T4: 不可篡改
    Trackable = "Trackable"
}
export declare class HashLock {
    private static readonly ALGORITHM;
    static lock(data: string): Promise<string>;
    static verify(data: string, hash: string): boolean;
}
export declare class ZKPValidator {
    static generateProof(data: string, nonce: number): string;
    static verifyProof(data: string, proof: string, difficulty?: number): boolean;
}
export declare class T5Validator {
    static validate(component: IComponentCore): Promise<boolean>;
}
export declare const DesignTokens: {
    colors: {
        BerkeleyBlue: string;
        CaliforniaGold: string;
        TealAqua: string;
        LiquidPearl: string;
        SunflareCoral: string;
    };
    typography: {
        primary: string;
        mono: string;
    };
    spacing: {
        unit: number;
        borderRadius: {
            sm: number;
            md: number;
            lg: number;
        };
    };
    animation: {
        duration: number;
    };
};
export declare abstract class BerkeleyComponent implements IComponentCore {
    readonly uuid: string;
    readonly version: string;
    readonly timestamp: number;
    evidence: IEvidence[];
    abstract readonly formula: string;
    abstract readonly impact_metric: string;
    abstract readonly status: 'Trustworthy';
    abstract readonly hash_lock: string;
    constructor();
    private generateUUID;
    validate(): Promise<boolean>;
}
//# sourceMappingURL=T5Protocol.d.ts.map