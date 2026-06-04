export interface PedersenCommitment {
    commitment: string;
    blindingFactor: string;
    value: number;
}
/**
 * 生成 Pedersen 承諾
 */
export declare function generateCommitment(value: number): Promise<PedersenCommitment>;
/**
 * 驗證單個承諾
 */
export declare function verifyCommitment(commitment: string, value: number, blindingFactor: string): boolean;
/**
 * 驗證多個承諾的同態加總
 * C_total = C1 + C2 + ... + Cn
 */
export declare function verifyHomomorphicSum(commitments: string[], totalCommitment: string): boolean;
/**
 * 輔助函數：對一組承諾進行求和 (僅限橢圓曲線點的加法)
 * 外部驗證者不需要知道 blinding factor 即可執行此操作
 */
export declare function aggregateCommitments(commitments: string[]): string;
//# sourceMappingURL=pedersen-core.d.ts.map