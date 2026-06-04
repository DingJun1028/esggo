export declare function sha256(data: string | Uint8Array): string;
export interface PedersenCommitment {
    commitment: string;
    blindingFactor: string;
    value: number;
}
/**
 * 生成 Pedersen 承諾 (C = v*G + r*H)
 * @param value 欲隱藏的數值 (如：Scope 1 排放量)
 */
export declare function generatePedersenCommitment(value: number): Promise<PedersenCommitment>;
/**
 * 驗證單個承諾是否與提供的數值及盲化因子相符
 */
export declare function verifyPedersenCommitment(commitment: string, value: number, blindingFactor: string): Promise<boolean>;
/**
 * 驗證多個承諾的加總是否與「總和承諾」相符 (同態加法校驗)
 * 適用場景：驗證 Scope 1 + 2 + 3 = Total，不揭露細部資料，由 ZK-Privacy 引擎公開執行
 */
export declare function verifyCommitmentSum(commitments: string[], totalCommitment: string): boolean;
export interface HashLockResult {
    hash: string;
    timestamp: string;
}
export declare function createHashLock(data: unknown): Promise<HashLockResult>;
export declare function verifyHashLock(data: unknown, originalHash: string, originalTimestamp: string): Promise<boolean>;
export interface T5Attestation {
    uuid: string;
    hash: string;
    timestamp: string;
}
export declare function create5TAttestation(artifactId: string): Promise<string>;
export declare function generateNonce(): string;
export interface ZKPRangeProof {
    commitment: PedersenCommitment;
    min: number;
    max: number;
    inRange: boolean;
    snarkProof?: SnarkJSProof;
    publicSignals?: string[];
}
export interface ZKPVerifyStep {
    name: string;
    passed: boolean;
    input: string;
}
export interface ZKPVerifyResult {
    valid: boolean;
    steps: ZKPVerifyStep[];
    timeTaken: number;
}
export interface SnarkJSProof {
    pi_a: [string, string, string];
    pi_b: [[string, string], [string, string], [string, string]];
    pi_c: [string, string, string];
    protocol: string;
    curve: string;
}
/**
 * Generate a simulated zk-SNARK Groth16 proof for Range Check.
 * This proves `min <= value <= max` without revealing `value`.
 */
export declare function generateSnarkJSRangeProof(value: number, min: number, max: number, blindingFactor: string): Promise<{
    proof: SnarkJSProof;
    publicSignals: string[];
}>;
/**
 * Verifies a zk-SNARK Groth16 proof.
 * The verifier ONLY knows the public signals and the proof, NOT the value or blinding factor.
 */
export declare function verifySnarkJSProof(vKey: Record<string, unknown> | null, publicSignals: string[], proof: SnarkJSProof): Promise<boolean>;
export type MaskingLevel = 'L1' | 'L2' | 'L3';
/**
 * 🛡️ 實作 TECHNICAL_INTEGRITY.md 規範的三級去敏遮罩
 * @param value 欲遮罩的原始資料
 * @param level 遮罩等級 (L1模糊化 / L2假名化 / L3不可逆)
 * @param options 進階選項 (L2需提供 32-byte secretKey)
 */
export declare function applyDataMasking(value: string | number, level: MaskingLevel, options?: {
    l2Key?: Buffer;
    l3Salt?: string;
}): string;
/**
 * 🔓 L2 假名化資料還原 (僅限持有密鑰之授權者)
 */
export declare function unmaskL2Data(maskedValue: string, secretKey: Buffer): string;
export declare function verifyZKPProof(proof: PedersenCommitment, blindingFactor: string): Promise<ZKPVerifyResult>;
//# sourceMappingURL=crypto-proof.d.ts.map