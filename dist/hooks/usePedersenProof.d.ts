import { PedersenCommitment } from '@/lib/crypto/pedersen-core';
/**
 * 🔗 usePedersenProof Hook
 * 提供 React 元件使用的 Pedersen 承諾操作介面。
 * 用於實作「深度刻印 (Deep Engraving)」與同態加總驗證。
 */
export declare function usePedersenProof(): {
    sealValue: (value: number) => Promise<PedersenCommitment>;
    verifySeal: (commitment: string, value: number, blindingFactor: string) => boolean;
    verifySum: (childCommitments: string[], totalCommitment: string) => boolean;
    calculateAggregate: (commitments: string[]) => string;
    isProcessing: boolean;
};
//# sourceMappingURL=usePedersenProof.d.ts.map