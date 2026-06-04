import type { SwapDefiConfig, SwapDefiTransaction } from '../../src/shared/types/swap-defi.types';
export declare class SwapDeFiClient {
    private config;
    constructor(config?: Partial<SwapDefiConfig>);
    private isValidAddress;
    private validateTransactionParams;
    getPoolStatus(poolId: string): Promise<any>;
    executeSwap(transaction: SwapDefiTransaction): Promise<any>;
    listPools(): Promise<{
        id: string;
        tokenA: string;
        tokenB: string;
        feeRate: number;
    }[]>;
}
export declare const swapDeFi: SwapDeFiClient;
//# sourceMappingURL=swap-defi-adapter.d.ts.map