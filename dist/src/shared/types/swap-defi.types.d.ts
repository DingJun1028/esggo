export interface SwapDefiConfig {
    apiKey: string;
    token: string;
    endpoint: string;
}
export interface SwapDefiTransaction {
    id: string;
    fromToken: string;
    toToken: string;
    amount: number;
    userAddress: string;
    recipient?: string;
    slippageTolerance?: number;
    deadline?: number;
}
//# sourceMappingURL=swap-defi.types.d.ts.map