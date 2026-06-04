/**
 * ESG GO | 🏛️ 5T 誠信協議門 (The 5T Protocol: Data Governance Framework)
 * v2.1 | Ultimate Minimalist Alignment
 *
 * 英標為骨：Traceable, Transparent, Tangible, Trackable, Trustworthy
 * 繁博為魂：真·善·美·通·信
 */
import { I5TGovernance } from './core.types';
export type ProtocolGateCode = 'T1' | 'T2' | 'T3' | 'T4' | 'T5';
export interface IProtocolGate {
    readonly code: ProtocolGateCode;
    readonly labelZh: string;
    readonly propertyEn: keyof I5TGovernance;
    readonly titleZh: string;
    readonly descriptionEn: string;
    readonly color: string;
}
/**
 * @const SACRED_GATES
 * @description 5T 協議門之創世定義 v2.1 - 極致簡約版。
 */
export declare const SACRED_GATES: Record<ProtocolGateCode, IProtocolGate>;
export interface GateValidationResult {
    readonly gate: ProtocolGateCode;
    readonly passed: boolean;
    readonly timestamp: number;
    readonly evidencePath: string;
    readonly messageZh: string;
    readonly hashLock?: string;
}
//# sourceMappingURL=protocol.types.d.ts.map